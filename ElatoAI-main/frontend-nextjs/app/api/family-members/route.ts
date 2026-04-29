import { NextResponse } from "next/server";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { randomUUID } from "crypto";

interface FamilyMember {
    id: string;
    name: string;
    email: string;
    relation: string;
}

function normalizeFamilyMembers(value: unknown): FamilyMember[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((member) => ({
            id: typeof member?.id === "string" ? member.id : randomUUID(),
            name: typeof member?.name === "string" ? member.name.trim() : "",
            email: typeof member?.email === "string" ? member.email.trim().toLowerCase() : "",
            relation: typeof member?.relation === "string" ? member.relation.trim() : "",
        }))
        .filter((member) => member.name && member.email);
}

async function getCurrentUserInfo(supabase: any, userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("user_info")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return (data?.user_info || {}) as Record<string, unknown>;
}

export async function GET(req: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userInfo = await getCurrentUserInfo(supabase, user.id);
    return NextResponse.json({
        familyMembers: normalizeFamilyMembers(userInfo.family_members),
    });
}

export async function POST(req: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const relation = typeof body?.relation === "string" ? body.relation.trim() : "";

    if (!name || !email || !email.includes("@")) {
        return NextResponse.json(
            { error: "Add a family member name and a valid email." },
            { status: 400 }
        );
    }

    const userInfo = await getCurrentUserInfo(supabase, user.id);
    const existingMembers = normalizeFamilyMembers(userInfo.family_members);
    const nextMembers = [
        ...existingMembers.filter((member) => member.email !== email),
        {
            id: randomUUID(),
            name: name.slice(0, 80),
            email: email.slice(0, 120),
            relation: relation.slice(0, 50),
        },
    ].slice(0, 12);

    const { error } = await supabase
        .from("users")
        .update({
            user_info: {
                ...userInfo,
                family_members: nextMembers,
            },
        })
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ familyMembers: nextMembers });
}

export async function DELETE(req: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
        return NextResponse.json({ error: "Missing family member id." }, { status: 400 });
    }

    const userInfo = await getCurrentUserInfo(supabase, user.id);
    const nextMembers = normalizeFamilyMembers(userInfo.family_members).filter(
        (member) => member.id !== memberId
    );

    const { error } = await supabase
        .from("users")
        .update({
            user_info: {
                ...userInfo,
                family_members: nextMembers,
            },
        })
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ familyMembers: nextMembers });
}

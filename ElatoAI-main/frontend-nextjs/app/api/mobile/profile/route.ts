import { NextResponse } from "next/server";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { ensureMobileUser, getUserMetadata } from "../_lib";

export async function POST(request: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await ensureMobileUser(supabase, user);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const existingMetadata = getUserMetadata(dbUser);
    const nextMetadata = {
        ...existingMetadata,
        birth_place: typeof body.birth_place === "string" ? body.birth_place : existingMetadata.birth_place || "",
        birth_date: typeof body.birth_date === "string" ? body.birth_date : existingMetadata.birth_date || "",
        birth_time: typeof body.birth_time === "string" ? body.birth_time : existingMetadata.birth_time || "",
        rashi: typeof body.rashi === "string" ? body.rashi : existingMetadata.rashi || "",
    };

    const updatePayload: Partial<IUser> = {
        user_info: {
            ...(dbUser.user_info as any),
            user_type: "user",
            user_metadata: nextMetadata,
        },
    };

    if (typeof body.supervisee_name === "string") {
        updatePayload.supervisee_name = body.supervisee_name.trim();
    }

    if (typeof body.supervisee_persona === "string") {
        updatePayload.supervisee_persona = body.supervisee_persona.trim();
    }

    if (typeof body.supervisee_age === "number") {
        updatePayload.supervisee_age = body.supervisee_age;
    }

    if (typeof body.language_code === "string" && body.language_code.trim()) {
        updatePayload.language_code = body.language_code.trim();
    }

    const { error } = await supabase
        .from("users")
        .update(updatePayload)
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { createLivePujaInviteToken } from "../_room-token";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { resolveUserDisplayName } from "@/app/lib/userProfileName";

const INVITE_TTL_MS = 1000 * 60 * 60 * 6;

function safeRoomSegment(value: string) {
    return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}

export async function POST(req: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Sign in to start a live puja room." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const roomId = `pandit-${safeRoomSegment(user.id)}-${Date.now().toString(36)}`;
    const inviteToken = createLivePujaInviteToken({
        roomId,
        hostUserId: user.id,
        expiresAt: Date.now() + INVITE_TTL_MS,
    });

    const { data: dbUser } = await supabase
        .from("users")
        .select("supervisee_name,supervisor_name,user_info")
        .eq("user_id", user.id)
        .maybeSingle();
    const displayName =
        typeof body?.participantName === "string" && body.participantName.trim()
            ? body.participantName.trim().slice(0, 80)
            : resolveUserDisplayName({ dbUser, authUser: user });

    const userInfo = (dbUser?.user_info || {}) as Record<string, unknown>;
    const familyMembers = Array.isArray(userInfo.family_members) ? userInfo.family_members : [];

    return NextResponse.json({
        roomId,
        inviteToken,
        inviteUrl: `/pandit?room=${encodeURIComponent(roomId)}&invite=${encodeURIComponent(inviteToken)}`,
        hostName: displayName,
        notifiedFamilyMembers: familyMembers.length,
    });
}

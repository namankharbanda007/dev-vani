import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { verifyLivePujaInviteToken } from "../live-puja/_room-token";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function GET(req: NextRequest) {
    const roomName = req.nextUrl.searchParams.get("room");
    const participantName = req.nextUrl.searchParams.get("name");
    const inviteToken = req.nextUrl.searchParams.get("invite");

    if (!roomName || !participantName) {
        return NextResponse.json(
            { error: "Missing 'room' or 'name' query parameter" },
            { status: 400 }
        );
    }

    const { user } = await getSupabaseForRouteAuth(req);
    if (!user) {
        return NextResponse.json(
            { error: "Sign in to join the live puja room." },
            { status: 401 }
        );
    }

    const invitePayload = verifyLivePujaInviteToken(inviteToken, roomName);
    const isHostOwnedRoom = roomName.startsWith(`pandit-${user.id}-`);
    const isAuthenticatedAstrologerRoom = roomName.startsWith("astrologer-");

    if (!isHostOwnedRoom && !invitePayload && !isAuthenticatedAstrologerRoom) {
        return NextResponse.json(
            { error: "This live puja invite is invalid or expired." },
            { status: 403 }
        );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
        return NextResponse.json(
            { error: "LiveKit API credentials not configured" },
            { status: 500 }
        );
    }

    const token = new AccessToken(apiKey, apiSecret, {
        identity: user.id,
        name: participantName,
        metadata: JSON.stringify({
            role: isHostOwnedRoom ? "host" : "family",
            hostUserId: invitePayload?.hostUserId || user.id,
        }),
    });

    token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({ token: jwt });
}

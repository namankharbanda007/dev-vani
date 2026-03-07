import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
    const roomName = req.nextUrl.searchParams.get("room");
    const participantName = req.nextUrl.searchParams.get("name");

    if (!roomName || !participantName) {
        return NextResponse.json(
            { error: "Missing 'room' or 'name' query parameter" },
            { status: 400 }
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
        identity: participantName + "_" + Math.random().toString(36).slice(2, 6),
        name: participantName,
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

import { createHmac, timingSafeEqual } from "crypto";

export interface LivePujaInvitePayload {
    roomId: string;
    hostUserId: string;
    expiresAt: number;
}

function getSigningSecret() {
    const secret =
        process.env.LIVE_PUJA_INVITE_SECRET ||
        process.env.LIVEKIT_API_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret) {
        throw new Error("Live puja invite signing secret is not configured");
    }

    return secret;
}

function toBase64Url(value: string) {
    return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
    return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
    return createHmac("sha256", getSigningSecret())
        .update(encodedPayload)
        .digest("base64url");
}

export function createLivePujaInviteToken(payload: LivePujaInvitePayload) {
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifyLivePujaInviteToken(token: string | null, expectedRoomId: string) {
    if (!token) {
        return null;
    }

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = signPayload(encodedPayload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        return null;
    }

    let payload: LivePujaInvitePayload;
    try {
        payload = JSON.parse(fromBase64Url(encodedPayload)) as LivePujaInvitePayload;
    } catch {
        return null;
    }

    if (payload.roomId !== expectedRoomId || payload.expiresAt < Date.now()) {
        return null;
    }

    return payload;
}

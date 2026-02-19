import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient as createSupabaseDirectClient } from "@supabase/supabase-js";

// ========== SERVER-SIDE RATE LIMITING ==========
// Track usage per IP: total messages and first-seen timestamp
// Budget: max 15 messages OR 2 minutes from first message, whichever comes first
// Resets after 24 hours

const DEMO_TIME_LIMIT_MS = 2 * 60 * 1000; // 2 minutes
const DEMO_MAX_MESSAGES = 15; // Max messages per session
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24-hour cooldown

interface GuestUsage {
    firstMessageAt: number;
    messageCount: number;
}

// In-memory store (persists across requests in the same serverless instance)
const guestUsageMap = new Map<string, GuestUsage>();

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;
    return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds: number; remainingMessages: number } {
    const now = Date.now();
    const usage = guestUsageMap.get(ip);

    if (!usage) {
        // First message from this IP
        guestUsageMap.set(ip, { firstMessageAt: now, messageCount: 1 });
        return { allowed: true, remainingSeconds: Math.floor(DEMO_TIME_LIMIT_MS / 1000), remainingMessages: DEMO_MAX_MESSAGES - 1 };
    }

    const elapsed = now - usage.firstMessageAt;

    // Check if 24-hour cooldown has passed — reset
    if (elapsed > RATE_LIMIT_WINDOW_MS) {
        guestUsageMap.set(ip, { firstMessageAt: now, messageCount: 1 });
        return { allowed: true, remainingSeconds: Math.floor(DEMO_TIME_LIMIT_MS / 1000), remainingMessages: DEMO_MAX_MESSAGES - 1 };
    }

    // Check if 2-minute demo window has expired
    if (elapsed > DEMO_TIME_LIMIT_MS) {
        return { allowed: false, remainingSeconds: 0, remainingMessages: 0 };
    }

    // Check message count
    if (usage.messageCount >= DEMO_MAX_MESSAGES) {
        return { allowed: false, remainingSeconds: 0, remainingMessages: 0 };
    }

    // Allowed — increment and return remaining
    usage.messageCount += 1;
    const remainingSeconds = Math.max(0, Math.floor((DEMO_TIME_LIMIT_MS - elapsed) / 1000));
    const remainingMessages = Math.max(0, DEMO_MAX_MESSAGES - usage.messageCount);

    return { allowed: true, remainingSeconds, remainingMessages };
}

// Cleanup stale entries periodically (prevent memory leak)
setInterval(() => {
    const now = Date.now();
    for (const [ip, usage] of guestUsageMap.entries()) {
        if (now - usage.firstMessageAt > RATE_LIMIT_WINDOW_MS) {
            guestUsageMap.delete(ip);
        }
    }
}, 60 * 60 * 1000); // Cleanup every hour

// ========== API ROUTE ==========

export async function POST(request: NextRequest) {
    try {
        const { message, messages, personalityId, guestName, guestDob } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // --- Rate limit check ---
        const clientIP = getClientIP(request);
        const { allowed, remainingSeconds, remainingMessages } = checkRateLimit(clientIP);

        if (!allowed) {
            return NextResponse.json(
                {
                    error: "Demo time limit reached. Please sign up for unlimited access!",
                    timeUp: true,
                    remainingSeconds: 0,
                    remainingMessages: 0,
                },
                { status: 429 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("[Guest Chat API] No API key found!");
            return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
        }

        // Fetch personality
        const directSupabase = createSupabaseDirectClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        let personalityPrompt = "";
        if (personalityId) {
            const { data: personality } = await directSupabase
                .from("personalities")
                .select("character_prompt, voice_prompt, title")
                .eq("personality_id", personalityId)
                .single();

            if (personality) {
                personalityPrompt = personality.character_prompt || "";
            }
        }

        // Build system prompt
        const userName = guestName || "Guest";
        const dobInfo = guestDob
            ? `Their date of birth is ${guestDob}. Use this to provide personalized astrological and spiritual guidance.`
            : "";

        const systemInstruction = `
${personalityPrompt}

YOU ARE TALKING TO: ${userName}. This is a live demo chat session.
${dobInfo}

Greet ${userName} warmly by name.
${guestDob ? `Since you know their date of birth (${guestDob}), offer personalized insights, predictions, or spiritual guidance based on their birth details.` : ""}

Keep responses concise but insightful. Use emojis sparingly for warmth.
This is a 2-minute demo session.

LANGUAGE:
You may respond in any language the user writes in, but default to Hindi with English mixed in (Hinglish).
`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const chat = model.startChat({
            history:
                messages?.map((m: any) => ({
                    role: m.role === "user" ? "user" : "model",
                    parts: [{ text: m.content }],
                })) || [],
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return NextResponse.json({
            response: text,
            remainingSeconds,
            remainingMessages,
        });
    } catch (error: any) {
        console.error("[Guest Chat API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

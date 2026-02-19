import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient as createSupabaseDirectClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const { message, messages, personalityId, guestName, guestDob } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        console.log("[Guest Chat API] GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY, "| GOOGLE_API_KEY present:", !!process.env.GOOGLE_API_KEY);
        if (!apiKey) {
            console.error("[Guest Chat API] No API key found! Check GEMINI_API_KEY or GOOGLE_API_KEY in .env");
            return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
        }

        // Fetch personality using direct client (no cookies needed for guest)
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

        // Build personalized system prompt
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
            model: "gemini-2.0-flash",
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

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error("[Guest Chat API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

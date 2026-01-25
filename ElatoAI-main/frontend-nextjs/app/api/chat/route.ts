import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/db/users";
import { createSystemPrompt } from "@/app/lib/prompt-utils";

export async function POST(request: NextRequest) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserById(supabase, user.id);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { message, messages } = await request.json();

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
    }

    try {
        // Generate the system prompt using the shared logic
        const systemInstruction = await createSystemPrompt({
            user: dbUser,
            supabase,
            timestamp: new Date().toISOString(),
        });

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use the requested model or fallback
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview", systemInstruction });

        // Convert previous messages to Gemini format if provided, or start fresh
        // Note: createSystemPrompt already includes recent chat history from DB in the instructions,
        // so passing only the current user message might be duplicate context if we blindly pass history.
        // However, for a chat session, we usually want the immediate context.
        // Since 'createSystemPrompt' injects history into the SYSTEM PROMPT, we can treat this as a single-turn or use the provided history for immediate context.
        // Let's rely on the client passing the current session history for immediate continuity,
        // and the system prompt for long-term / personality context.

        const chat = model.startChat({
            history: messages?.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            })) || [],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        // Save the user message and the assistant response to the database
        // This ensures continuity for future sessions and matches the behavior of existing tools
        const { error: userMsgError } = await supabase.from("conversations").insert({
            user_id: user.id,
            content: message,
            role: "user",
            personality_key: dbUser.personality?.key || "default", // Assuming we track this
            personality_id: dbUser.personality_id // Fallback
        });

        const { error: aiMsgError } = await supabase.from("conversations").insert({
            user_id: user.id,
            content: text,
            role: "assistant",
            personality_key: dbUser.personality?.key || "default",
            personality_id: dbUser.personality_id
        });

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("Error in /chat:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

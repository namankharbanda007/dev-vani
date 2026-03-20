import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseDirectClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/db/users";
import { createSystemPrompt } from "@/app/lib/prompt-utils";

async function readUpstreamError(response: Response) {
  try {
    const payload = await response.json();
    return (
      payload?.error?.message ||
      payload?.error ||
      payload?.message ||
      `${response.status} ${response.statusText}`
    );
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const isGuest = searchParams.get("guest") === "true";
  const personalityId = searchParams.get("personalityId");
  const guestName = searchParams.get("guestName") || undefined;
  const guestDob = searchParams.get("guestDob") || undefined;

  try {
    if (isGuest && personalityId) {
      return await handleGuestSession(personalityId, guestName, guestDob);
    } else {
      return await handleAuthenticatedSession();
    }
  } catch (error: any) {
    console.error("[Session API] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}

// ======== GUEST SESSION (no cookies needed) ========
async function handleGuestSession(personalityId: string, guestName?: string, guestDob?: string) {
  // Use a direct Supabase client (NOT the server cookie-based one)
  // This avoids any issues with cookies() for unauthenticated requests
  const directSupabase = createSupabaseDirectClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("[Session API] Guest mode. personalityId:", personalityId, "guestName:", guestName, "guestDob:", guestDob);

  const { data: personality, error } = await directSupabase
    .from("personalities")
    .select("*")
    .eq("personality_id", personalityId)
    .single();

  console.log("[Session API] Personality fetch result:", {
    title: personality?.title,
    provider: personality?.provider,
    error: error?.message,
  });

  if (error || !personality) {
    console.error("[Session API] Personality not found:", error);
    return NextResponse.json(
      { error: "Personality not found", details: error?.message },
      { status: 404 }
    );
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Build personalized system prompt for guest
  const userName = guestName || "Guest";
  const dobInfo = guestDob
    ? `Their date of birth is ${guestDob}. Use this information to provide personalized astrological and spiritual guidance.`
    : "";

  const systemPrompt = `
YOUR VOICE IS: ${personality.voice_prompt}

YOUR CHARACTER PROMPT IS: ${personality.character_prompt}

YOU ARE TALKING TO: ${userName}. This is a live session.
${dobInfo}

Greet ${userName} warmly by name at the start of the conversation.
${guestDob ? `Since you know their date of birth (${guestDob}), you can offer personalized insights, predictions, or spiritual guidance based on their birth details.` : ""}

LANGUAGE:
You may talk in any language the user would like, but the default language is Hindi.

RESPONSE STYLE:
- Keep your responses short and conversational — 1 to 3 sentences at a time.
- Do NOT give long monologues. Speak naturally, pause, and wait for the user to respond.
- Ask follow-up questions to keep the conversation flowing.
`;

  console.log("[Session API] Provider:", personality.provider);

  if (personality.provider === "gemini") {
    console.log("[Session API] Returning gemini session data for guest");
    return NextResponse.json({
      provider: "gemini",
      system_prompt: systemPrompt,
      voice: personality.oai_voice,
    });
  }

  if (personality.provider === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API Key not configured" },
        { status: 500 }
      );
    }
    const agentId = personality.oai_voice;
    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID not found in personality" },
        { status: 400 }
      );
    }
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } }
    );
    if (!signedUrlResponse.ok) {
      throw new Error(
        `Failed to get signed URL: ${signedUrlResponse.statusText}`
      );
    }
    const { signed_url } = await signedUrlResponse.json();
    return NextResponse.json({ provider: "elevenlabs", signed_url });
  }

  // Fallback: OpenAI
  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return NextResponse.json(
      { error: "OpenAI API Key not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      instructions: systemPrompt,
      voice: personality.oai_voice ?? "ballad",
    }),
  });
  if (!response.ok) {
    const details = await readUpstreamError(response);
    return NextResponse.json(
      { error: "Failed to create OpenAI realtime session", details },
      { status: response.status }
    );
  }
  const data = await response.json();
  return NextResponse.json({ ...data, provider: "openai" });
}

// ======== AUTHENTICATED SESSION (uses cookies) ========
async function handleAuthenticatedSession() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(supabase, user.id);
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = await createSystemPrompt({
    user: dbUser,
    supabase,
    timestamp: new Date().toISOString(),
  });

  if (dbUser.personality?.provider === "gemini") {
    return NextResponse.json({
      provider: "gemini",
      system_prompt: systemPrompt,
      voice: dbUser.personality.oai_voice,
    });
  }

  if (dbUser.personality?.provider === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API Key not configured" },
        { status: 500 }
      );
    }

    const agentId = dbUser.personality.oai_voice;
    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID not found in personality" },
        { status: 400 }
      );
    }

    try {
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        { headers: { "xi-api-key": apiKey } }
      );

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        console.error("ElevenLabs Signed URL Error:", errorText);
        throw new Error(
          `Failed to get signed URL: ${signedUrlResponse.statusText}`
        );
      }

      const { signed_url } = await signedUrlResponse.json();
      return NextResponse.json({ provider: "elevenlabs", signed_url });
    } catch (error: any) {
      console.error("Error fetching ElevenLabs signed URL:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  try {
    if (!openAiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          instructions: systemPrompt,
          voice: dbUser.personality?.oai_voice ?? "ballad",
        }),
      }
    );
    if (!response.ok) {
      const details = await readUpstreamError(response);
      return NextResponse.json(
        { error: "Failed to create OpenAI realtime session", details },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json({ ...data, provider: "openai" });
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

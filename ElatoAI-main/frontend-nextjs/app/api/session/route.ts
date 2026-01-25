import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/db/users";
import { createSystemPrompt } from "@/app/lib/prompt-utils";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  // If the user's personality provider is Gemini, we simply return the key and the system prompt.
  // The client will handle the WebSocket connection.
  if (dbUser.personality?.provider === 'gemini') {
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
    }
    return NextResponse.json({
      gemini_api_key: geminiApiKey,
      system_prompt: systemPrompt,
      voice: dbUser.personality.oai_voice // Assuming we map this to a Gemini voice config client-side or here
    });
  }

  // ElevenLabs Logic
  if (dbUser.personality?.provider === 'elevenlabs') {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API Key not configured" }, { status: 500 });
    }

    const agentId = dbUser.personality.oai_voice;
    if (!agentId) {
      return NextResponse.json({ error: "Agent ID not found in personality" }, { status: 400 });
    }

    try {
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        {
          headers: {
            'xi-api-key': apiKey,
          },
        }
      );

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        console.error("ElevenLabs Signed URL Error:", errorText);
        throw new Error(`Failed to get signed URL: ${signedUrlResponse.statusText}`);
      }

      const { signed_url } = await signedUrlResponse.json();
      return NextResponse.json({ signed_url });

    } catch (error: any) {
      console.error("Error fetching ElevenLabs signed URL:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  try {
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
      },
    );
    console.log(response);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

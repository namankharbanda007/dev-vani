
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as Blob;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!audioFile || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            console.error("ELEVENLABS_API_KEY is not set");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Add Voice to ElevenLabs
        const voiceFormData = new FormData();
        voiceFormData.append('name', name);
        voiceFormData.append('files', audioFile, 'recording.wav');
        voiceFormData.append('description', description || 'Cloned voice from ElatoAI');
        // voiceFormData.append('labels', '{"type": "cloned"}'); // Optional

        console.log("Cloning voice...");
        const voiceResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: voiceFormData,
        });

        if (!voiceResponse.ok) {
            const errorText = await voiceResponse.text();
            console.error("ElevenLabs Voice API Error:", errorText);
            return NextResponse.json({ error: `Failed to clone voice: ${voiceResponse.statusText}`, details: errorText }, { status: voiceResponse.status });
        }

        const voiceData = await voiceResponse.json();
        const voiceId = voiceData.voice_id;
        console.log("Voice cloned successfully. Voice ID:", voiceId);

        // 2. Create Conversational Agent with this voice
        console.log("Creating agent...");
        const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                conversation_config: {
                    agent: {
                        prompt: {
                            prompt: "You are a helpful AI assistant." // Default prompt, will be overridden by personality prompt logic likely, or checking if we need to set it dynamic here
                        },
                        first_message: "Hello! I am your cloned voice.",
                        language: "en"
                    },
                    tts: {
                        voice_id: voiceId
                    }
                }
            })
        });

        if (!agentResponse.ok) {
            const errorText = await agentResponse.text();
            console.error("ElevenLabs Agent API Error:", errorText);
            // If agent creation fails, we might want to return the voice ID anyway so the user can retry or use just the voice? 
            // But for now, let's fail.
            return NextResponse.json({ error: `Failed to create agent: ${agentResponse.statusText}`, details: errorText }, { status: agentResponse.status });
        }

        const agentData = await agentResponse.json();
        const agentId = agentData.agent_id;
        console.log("Agent created successfully. Agent ID:", agentId);

        return NextResponse.json({
            success: true,
            voice_id: voiceId,
            agent_id: agentId,
            name: name
        });

    } catch (error) {
        console.error('Error in voice clone route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

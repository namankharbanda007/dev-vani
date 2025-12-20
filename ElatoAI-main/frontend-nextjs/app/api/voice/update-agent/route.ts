
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { agent_id, prompt, first_message } = await req.json();

        if (!agent_id) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        console.log(`Updating agent ${agent_id}...`);

        // Construct the update payload. Only include fields that are provided.
        const conversationConfig: any = {
            agent: {}
        };

        if (prompt) {
            conversationConfig.agent.prompt = { prompt: prompt };
        }

        if (first_message) {
            conversationConfig.agent.first_message = first_message;
        }

        // Optimize: If nothing to update, return early
        if (Object.keys(conversationConfig.agent).length === 0) {
            return NextResponse.json({ success: true, message: 'No updates required' });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agent_id}`, {
            method: 'PATCH',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversation_config: conversationConfig
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs Agent Update API Error:", errorText);
            return NextResponse.json({ error: `Failed to update agent: ${response.statusText}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        console.log("Agent updated successfully:", data);

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Error in agent update route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

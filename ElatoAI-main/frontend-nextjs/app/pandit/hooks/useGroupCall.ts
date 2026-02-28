import { useState, useEffect, useRef, useCallback } from "react";
import { createGeminiConnection } from "@/app/components/Realtime/lib/geminiConnection";
import { toast } from "@/components/ui/use-toast";

interface UseGroupCallProps {
    participants: string[];
    personalityId: string;
}

export function useGroupCall({ participants, personalityId }: UseGroupCallProps) {
    const [sessionStatus, setSessionStatus] = useState<"DISCONNECTED" | "CONNECTING" | "CONNECTED">("DISCONNECTED");
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [agentActivity, setAgentActivity] = useState<'speaking' | 'listening' | 'thinking'>('thinking');

    const disconnectRef = useRef<(() => void) | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const connect = useCallback(async () => {
        if (sessionStatus !== "DISCONNECTED") return;

        // Create AudioContext synchronously on user interaction
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        void audioContext.resume();
        audioContextRef.current = audioContext;

        setSessionStatus("CONNECTING");

        try {
            // Fetch session token for the specific personality as a 'guest' to bypass the user's own DB personality preferences.
            const response = await fetch(`/api/session?personalityId=${personalityId}&guest=true`);
            const sessionData = await response.json();

            if (sessionData.error) {
                throw new Error(sessionData.error);
            }

            // We focus purely on Gemini for this implementation as it's the primary provider
            const keyResponse = await fetch('/api/voice/get-gemini-key', { method: 'POST' });
            const keyData = await keyResponse.json();

            if (!keyResponse.ok || !keyData.gemini_api_key) {
                throw new Error("Missing Gemini API Key");
            }

            // Group Call System Prompt Injection
            const basePrompt = sessionData.system_prompt || "You are a spiritual guide.";
            const participantList = participants.join(", ");

            const groupContextPrompt = `
        ${basePrompt}
        
        CRITICAL INSTRUCTION - GROUP CALL CONTEXT:
        You are currently on a multi-person video call. The participants in this room sharing the microphone are: ${participantList}.
        Multiple people might speak to you. Address them as a group when appropriate, but if you hear a distinct voice, you can ask "Who is speaking?" or address them specifically by name if they identify themselves. Keep your responses warm, engaging, and aware of this group context!
      `;

            // Initial greeting
            const firstMsg = `Namaste Pandit ji, we are joining you today. The people here are: ${participantList}. Please welcome us.`;

            const connection = await createGeminiConnection(
                audioContext,
                keyData.gemini_api_key,
                groupContextPrompt,
                sessionData.voice,
                firstMsg,
                (event) => console.log("Gemini Event:", event),
                (speaking) => {
                    setIsAgentSpeaking(speaking);
                    setAgentActivity(speaking ? 'speaking' : 'thinking');
                },
                () => {
                    setSessionStatus("DISCONNECTED");
                    audioContext.close();
                },
                () => {
                    setAgentActivity('listening');
                }
            );

            disconnectRef.current = connection.disconnect;

            setIsAgentSpeaking(true);
            setAgentActivity('speaking');
            setSessionStatus("CONNECTED");
            toast({ description: "Connected to Ashram" });

        } catch (err: any) {
            console.error("Group Call Connection Error:", err);
            setSessionStatus("DISCONNECTED");
            if (audioContextRef.current) audioContextRef.current.close();
            toast({ description: "Failed to connect to Ashram.", variant: "destructive" });
        }
    }, [participants, personalityId, sessionStatus]);

    const disconnect = useCallback(() => {
        if (disconnectRef.current) {
            disconnectRef.current();
            disconnectRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setSessionStatus("DISCONNECTED");
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        sessionStatus,
        isAgentSpeaking,
        agentActivity,
        connect,
        disconnect
    };
}

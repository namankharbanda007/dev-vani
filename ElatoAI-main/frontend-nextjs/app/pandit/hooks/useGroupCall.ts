import { useState, useEffect, useRef, useCallback } from "react";
import { createGeminiConnection } from "@/app/components/Realtime/lib/geminiConnection";
import { toast } from "@/components/ui/use-toast";

interface UseGroupCallProps {
    participants: string[];
    personalityId: string;
    contextType: 'pandit' | 'astrologer';
}

export function useGroupCall({ participants, personalityId, contextType }: UseGroupCallProps) {
    const [sessionStatus, setSessionStatus] = useState<"DISCONNECTED" | "CONNECTING" | "CONNECTED">("DISCONNECTED");
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [agentActivity, setAgentActivity] = useState<'speaking' | 'listening' | 'thinking'>('thinking');
    // Expose AI output stream as STATE so React re-renders when it becomes available
    const [aiOutputStream, setAiOutputStream] = useState<MediaStream | null>(null);

    const disconnectRef = useRef<(() => void) | null>(null);
    const sendTextMessageRef = useRef<((text: string) => void) | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    /**
     * Connect to the AI. 
     * @param mixedAudioStream - The LIVE mixed audio stream of all room participants. 
     *   Passed at call-time so it's guaranteed to be non-null (the ref will have been populated by then).
     */
    const connect = useCallback(async (mixedAudioStream?: MediaStream | null) => {
        if (sessionStatus !== "DISCONNECTED") return;

        // Create AudioContext synchronously on user interaction
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        void audioContext.resume();
        audioContextRef.current = audioContext;

        // Create a MediaStreamDestination to capture the AI's output audio
        const aiDestination = audioContext.createMediaStreamDestination();
        // Set state so React triggers re-render and CallScreen can react
        setAiOutputStream(aiDestination.stream);

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

            // Group Call System Prompt Injection — context-aware per persona
            const basePrompt = sessionData.system_prompt || "You are a spiritual guide.";
            const participantList = participants.join(", ");

            const isPandit = contextType === 'pandit';
            const roleName = isPandit ? "Pandit ji" : "Astrologer ji";
            const sessionType = isPandit ? "a live Puja" : "a live Astrology Reading session";
            const exampleGreeting = isPandit
                ? `"Namaste ${participantList}, aaj hum sab milke puja karenge..."`
                : `"Namaste ${participantList}, aaj hum aapke sitaaron ki sthiti dekhte hain..."`;
            const personalStyle = isPandit
                ? "like a real Pandit ji who knows his devotees"
                : "like a wise Astrologer who reads the stars for his clients";

            const groupContextPrompt = `
        ${basePrompt}
        
        CRITICAL INSTRUCTION - GROUP CALL CONTEXT:
        You are currently on a live multi-person video call conducting ${sessionType}. The participants in this room are: ${participantList}.
        
        SPEAKER IDENTIFICATION RULES (MUST FOLLOW):
        1. The system will send you alerts like "[Speaker: Naman] is now speaking" BEFORE their audio reaches you.
        2. When you receive such an alert, you MUST address that person BY NAME in your response. Example: "Naman beta, ...", "Haan Priya ji, ..."
        3. ALWAYS use the speaker's name at the start of your response to show you know who is talking.
        4. If you hear a voice WITHOUT a speaker alert, ask "Kaun bol raha hai? Please apna naam bataiye" (Who is speaking? Please tell me your name).
        5. Keep responses warm, personal, and use the person's name naturally throughout — ${personalStyle}.
        6. When greeting the group, address everyone by name: ${exampleGreeting}
        
        RESPONSE RULES:
        - Keep responses to 1-3 SHORT sentences. Do NOT give long monologues.
        - Speak naturally, pause, and wait for the user to respond before continuing.
        - Be conversational, not lecture-like.
      `;

            // Initial greeting — context-aware
            const firstMsg = isPandit
                ? `Namaste Pandit ji, we are joining you today. The people here are: ${participantList}. Please welcome each of us by name and ask how we are doing.`
                : `Namaste Astrologer ji, we are joining you today. The people here are: ${participantList}. Please welcome each of us by name and ask about our zodiac signs or birth details.`;

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
                    setAiOutputStream(null);
                    audioContext.close();
                },
                () => {
                    setAgentActivity('listening');
                },
                mixedAudioStream || undefined,
                aiDestination
            );

            disconnectRef.current = connection.disconnect;
            sendTextMessageRef.current = connection.sendTextMessage;

            setIsAgentSpeaking(true);
            setAgentActivity('speaking');
            setSessionStatus("CONNECTED");
            toast({ description: "Connected to Ashram" });

        } catch (err: any) {
            console.error("Group Call Connection Error:", err);
            setSessionStatus("DISCONNECTED");
            if (audioContextRef.current) audioContextRef.current.close();
            setAiOutputStream(null);
            toast({ description: "Failed to connect to Ashram.", variant: "destructive" });
        }
    }, [participants, personalityId, sessionStatus]);

    const disconnect = useCallback(() => {
        if (disconnectRef.current) {
            disconnectRef.current();
            disconnectRef.current = null;
        }
        sendTextMessageRef.current = null;
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setAiOutputStream(null);
        setSessionStatus("DISCONNECTED");
    }, []);

    const sendMessageToAI = useCallback((text: string) => {
        if (sendTextMessageRef.current) {
            sendTextMessageRef.current(text);
        }
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
        disconnect,
        aiOutputStream,
        sendMessageToAI
    };
}

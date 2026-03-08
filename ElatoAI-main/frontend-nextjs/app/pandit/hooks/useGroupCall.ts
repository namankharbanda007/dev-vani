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
            // Parallelized: fetch session data AND Gemini key simultaneously (saves ~200-400ms)
            const [sessionResponse, keyResponse] = await Promise.all([
                fetch(`/api/session?personalityId=${personalityId}&guest=true`),
                fetch('/api/voice/get-gemini-key', { method: 'POST' })
            ]);

            const [sessionData, keyData] = await Promise.all([
                sessionResponse.json(),
                keyResponse.json()
            ]);

            if (sessionData.error) {
                throw new Error(sessionData.error);
            }
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

            // Compact prompt — smaller = faster first-token latency
            const groupContextPrompt = `${basePrompt}

GROUP CALL: You are on a live video call conducting ${sessionType}. Participants: ${participantList}.
When "[Speaker: Name]" alerts appear, address that person by name. Greet everyone by name: ${exampleGreeting}
RESPONSE STYLE: 1-2 short sentences max. Be ${personalStyle}. Be conversational, never lecture.`;

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
                () => { },  // No-op: removed verbose per-chunk event logging (was ~40-60x/sec)
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

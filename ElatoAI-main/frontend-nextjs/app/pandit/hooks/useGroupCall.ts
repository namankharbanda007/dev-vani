import { useState, useEffect, useRef, useCallback } from "react";
import { createGeminiConnection } from "@/app/components/Realtime/lib/geminiConnection";
import { toast } from "@/components/ui/use-toast";

interface UseGroupCallProps {
    participants: string[];
    personalityId: string;
    contextType: 'pandit' | 'astrologer';
    isGuestHost?: boolean;
    ritualContext?: {
        title: string;
        sankalpHint: string;
        samagriList: string[];
    };
}

export function useGroupCall({ participants, personalityId, contextType, isGuestHost = false, ritualContext }: UseGroupCallProps) {
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
        if (sessionStatus !== "DISCONNECTED") return false;

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
            const sessionUrl = isGuestHost
                ? `/api/session?personalityId=${personalityId}&guest=true`
                : `/api/session?personalityId=${personalityId}`;
            const sessionResponse = await fetch(sessionUrl);
            const sessionData = await sessionResponse.json();

            if (sessionData.error) {
                throw new Error(
                    sessionData.details
                        ? `${sessionData.error}: ${sessionData.details}`
                        : sessionData.error
                );
            }

            // Group Call System Prompt Injection — context-aware per persona
            const basePrompt = sessionData.system_prompt || "You are a spiritual guide.";
            const participantList = participants.join(", ");

            const isPandit = contextType === 'pandit';
            const sessionType = isPandit
                ? `a live ${ritualContext?.title || "Puja"}`
                : "a live Astrology Reading session";
            const exampleGreeting = isPandit
                ? `"Namaste ${participantList}, aaj hum sab milke ${ritualContext?.title || "puja"} karenge..."`
                : `"Namaste ${participantList}, aaj hum aapke sitaaron ki sthiti dekhte hain..."`;
            const personalStyle = isPandit
                ? "like a real Pandit ji who knows his devotees"
                : "like a wise Astrologer who reads the stars for his clients";

            // Compact prompt — smaller = faster first-token latency
            const groupContextPrompt = `${basePrompt}

GROUP CALL: You are on a live video call conducting ${sessionType}. Participants: ${participantList}.
${ritualContext ? `RITUAL CONTEXT: Sankalp is "${ritualContext.sankalpHint}". Required samagri: ${ritualContext.samagriList.join(", ")}.` : ""}
When "[Speaker: Name]" alerts appear, address that person by name. Greet everyone by name: ${exampleGreeting}
RESPONSE STYLE: 1-2 short sentences max. Be ${personalStyle}. Be conversational, never lecture.`;

            // Initial greeting — context-aware
            const firstMsg = isPandit
                ? `Namaste Pandit ji, we are joining you today for ${ritualContext?.title || "puja"}. The people here are: ${participantList}. Please welcome each of us by name, confirm the sankalp, and ask the host if the family is ready to begin.`
                : `Namaste Astrologer ji, we are joining you today. The people here are: ${participantList}. Please welcome each of us by name and ask about our zodiac signs or birth details.`;

            let connection;

            if (sessionData.provider === "gemini") {
                const keyResponse = await fetch('/api/voice/get-gemini-key', { method: 'POST' });
                const keyData = await keyResponse.json();

                if (!keyResponse.ok || !keyData.gemini_api_key) {
                    throw new Error(keyData.error || "Missing Gemini API Key");
                }

                connection = await createGeminiConnection(
                    audioContext,
                    keyData.gemini_api_key,
                    groupContextPrompt,
                    sessionData.voice,
                    firstMsg,
                    () => { },
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
            } else {
                throw new Error(
                    sessionData.provider === "elevenlabs"
                        ? "Live group calls currently support Gemini-based guides only."
                        : "This guide does not support live group calling yet."
                );
            }

            disconnectRef.current = connection.disconnect;
            sendTextMessageRef.current = connection.sendTextMessage;

            setIsAgentSpeaking(true);
            setAgentActivity('speaking');
            setSessionStatus("CONNECTED");
            toast({ description: "Connected to Ashram" });
            return true;

        } catch (err: any) {
            console.error("Group Call Connection Error:", err);
            setSessionStatus("DISCONNECTED");
            if (audioContextRef.current) audioContextRef.current.close();
            setAiOutputStream(null);
            toast({ description: err?.message || "Failed to connect to Ashram.", variant: "destructive" });
            return false;
        }
    }, [contextType, isGuestHost, participants, personalityId, ritualContext, sessionStatus]);

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

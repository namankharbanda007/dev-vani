"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import App from "@/app/components/Realtime/App";
import { TranscriptProvider } from "@/app/components/Realtime/contexts/TranscriptContext";
import { EventProvider } from "@/app/components/Realtime/contexts/EventContext";
import { PhoneOff, Mic, MicOff } from "lucide-react";
import AartiPlayer from "./AartiPlayer";
import SamagriChecklist from "./SamagriChecklist";

interface SamagriItem {
    id: string;
    name: string;
    icon: "flame" | "flower" | "water" | "box";
}

interface PujaSessionProps {
    guestData: any;
    personalityId: string;
    pujaTitle: string;
    aartiSrc?: string;
    samagriList?: SamagriItem[];
    onClose: () => void;
}

export default function PujaSession({
    guestData,
    personalityId,
    pujaTitle,
    aartiSrc,
    samagriList,
    onClose,
}: PujaSessionProps) {
    const disconnectRef = useRef<(() => void) | null>(null);
    const microphoneControlRef = useRef<((muted: boolean) => void) | null>(null);
    const [realtimeState, setRealtimeState] = useState<{
        sessionStatus: string;
        isAgentSpeaking: boolean;
        agentActivity: "speaking" | "listening" | "thinking";
    }>({
        sessionStatus: "CONNECTING",
        isAgentSpeaking: false,
        agentActivity: "thinking",
    });

    return (
        <TranscriptProvider>
            <EventProvider>
                <App
                    personalityIdState={personalityId}
                    isDoctor={false}
                    userData={{
                        firstName: guestData.firstName,
                        gender: guestData.gender,
                    }}
                    autoConnect
                    disconnectRef={disconnectRef}
                    microphoneControlRef={microphoneControlRef}
                    onStateChange={setRealtimeState}
                >
                    <PujaCallUI
                        pujaTitle={pujaTitle}
                        aartiSrc={aartiSrc}
                        samagriList={samagriList}
                        realtimeState={realtimeState}
                        disconnectRef={disconnectRef}
                        microphoneControlRef={microphoneControlRef}
                        onClose={onClose}
                    />
                </App>
            </EventProvider>
        </TranscriptProvider>
    );
}

function PujaCallUI({
    pujaTitle,
    aartiSrc,
    samagriList,
    realtimeState,
    disconnectRef,
    microphoneControlRef,
    onClose,
}: {
    pujaTitle: string;
    aartiSrc?: string;
    samagriList?: SamagriItem[];
    realtimeState: {
        sessionStatus: string;
        isAgentSpeaking: boolean;
        agentActivity: "speaking" | "listening" | "thinking";
    };
    disconnectRef: React.MutableRefObject<(() => void) | null>;
    microphoneControlRef: React.MutableRefObject<((muted: boolean) => void) | null>;
    onClose: () => void;
}) {
    const [isMuted, setIsMuted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const connectedAtRef = useRef<number | null>(null);
    const callState = realtimeState.sessionStatus === "CONNECTED" ? "connected" : "connecting";
    const agentActivity = realtimeState.agentActivity;

    // Elapsed call time
    useEffect(() => {
        if (callState !== "connected") return;
        if (!connectedAtRef.current) connectedAtRef.current = Date.now();
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - (connectedAtRef.current || 0)) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [callState]);

    const handleEndCall = useCallback(() => {
        if (disconnectRef.current) {
            disconnectRef.current();
        }
        onClose();
    }, [onClose]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const statusText =
        callState === "connecting"
            ? "Connecting to Pandit Ji..."
            : agentActivity === 'speaking'
                ? "Pandit Ji is Speaking"
                : agentActivity === 'listening'
                    ? "Listening to You..."
                    : "Thinking...";

    const statusColor =
        callState !== "connected"
            ? "text-stone-400"
            : agentActivity === 'speaking'
                ? "text-orange-400"
                : agentActivity === 'listening'
                    ? "text-stone-300"
                    : "text-orange-300";

    const pulseRing = agentActivity === 'speaking' || agentActivity === 'listening' || callState === 'connecting';

    return (
        <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#111] overflow-hidden">
            {/* MAIN AREA - Puja Visuals & Voice Status */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#1a110a] to-[#0a0604]">

                {/* Center Connection Visualization */}
                <div className="relative flex flex-col items-center justify-center -mt-10">
                    {/* Ring Animations */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8">
                        <div className={`absolute inset-0 border-2 rounded-full transition-all duration-1000 ${pulseRing ? "border-orange-500/30 scale-110 animate-ping" : "border-stone-800 scale-100"}`} />
                        <div className={`absolute inset-4 border rounded-full transition-all duration-700 ${agentActivity === 'speaking' ? "border-orange-400/50 scale-105" : "border-stone-800 scale-100"}`} />

                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-orange-900/40 border border-orange-500/40 flex items-center justify-center overflow-hidden z-10 shadow-[0_0_40px_rgba(234,88,12,0.15)]">
                            <img
                                src="/products/pandit-hand.webp"
                                alt="Pandit Ji"
                                className={`w-full h-full object-cover transition-transform duration-700 ${agentActivity === 'speaking' ? 'scale-110' : 'scale-100'}`}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{pujaTitle}</h2>
                    <div className="flex flex-col items-center gap-2">
                        <span className={`text-base md:text-lg tracking-wide ${statusColor} transition-colors duration-300 font-medium`}>
                            {statusText}
                        </span>
                        {callState === "connected" && (
                            <span className="text-stone-400 font-mono text-sm">
                                {formatTime(elapsed)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Call Controls positioned at bottom center of the main area */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
                    <button
                        onClick={() => {
                            const nextMuted = !isMuted;
                            setIsMuted(nextMuted);
                            microphoneControlRef.current?.(nextMuted);
                        }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted
                            ? "bg-stone-800 text-stone-400 hover:bg-stone-700"
                            : "bg-stone-800/80 backdrop-blur-md text-white border border-stone-700 hover:bg-stone-700 hover:border-stone-500"
                            }`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="w-16 h-16 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
                    >
                        <PhoneOff size={28} />
                    </button>
                </div>
            </div>

            {/* SIDEBAR - Tools & Widgets */}
            <div className="w-full md:w-[400px] bg-[#161616] border-t md:border-t-0 md:border-l border-stone-800 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                {/* Ritual status */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full absolute inset-0 animate-ping"></div>
                        </div>
                        <div>
                            <span className="text-orange-500 font-semibold text-sm tracking-widest uppercase">Ritual status</span>
                            <p className="text-stone-300 text-sm mt-0.5">
                                {callState === "connected" ? "Live guidance active" : "Connecting to Pandit Ji"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Samagri Checklist */}
                {samagriList && samagriList.length > 0 && (
                    <SamagriChecklist items={samagriList} />
                )}

                {/* Aarti Player */}
                {aartiSrc && (
                    <div className="mt-auto">
                        <h3 className="text-stone-400 text-xs font-semibold tracking-wider uppercase mb-3 px-1">Audio Controls</h3>
                        <AartiPlayer audioSrc={aartiSrc} title="Aarti" />
                    </div>
                )}
            </div>
        </div>
    );
}

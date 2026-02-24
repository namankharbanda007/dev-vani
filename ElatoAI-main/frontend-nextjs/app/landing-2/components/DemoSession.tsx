"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import App from "@/app/components/Realtime/App";
import { TranscriptProvider } from "@/app/components/Realtime/contexts/TranscriptContext";
import { EventProvider } from "@/app/components/Realtime/contexts/EventContext";
import {
    PhoneOff,
    Mic,
    MicOff,
    Volume2,
    Video,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DemoChatSession from "./DemoChatSession";

interface DemoSessionProps {
    guestData: any;
    mode: "call" | "chat";
    onClose: () => void;
}

const PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";
const PANDIT_AVATAR = "/products/pandit-hand.webp";

export default function DemoSession({
    guestData,
    mode,
    onClose,
}: DemoSessionProps) {
    // Chat mode
    if (mode === "chat") {
        return (
            <DemoChatSession
                guestData={guestData}
                onClose={onClose}
                personalityId={PANDIT_PERSONALITY_ID}
            />
        );
    }

    // ===== CALL MODE (WhatsApp Video Call Style) =====
    return <WhatsAppCallUI guestData={guestData} onClose={onClose} />;
}

function WhatsAppCallUI({
    guestData,
    onClose,
}: {
    guestData: any;
    onClose: () => void;
}) {
    const [timeLeft, setTimeLeft] = useState(120);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [callState, setCallState] = useState<
        "connecting" | "connected"
    >("connecting");
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [agentActivity, setAgentActivity] = useState<'speaking' | 'listening' | 'thinking'>('thinking');
    const [isMuted, setIsMuted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const connectedAtRef = useRef<number | null>(null);
    const disconnectRef = useRef<(() => void) | null>(null);
    const speakingVideoRef = useRef<HTMLVideoElement>(null);
    const listeningVideoRef = useRef<HTMLVideoElement>(null);

    // Video playback control based on agent activity
    useEffect(() => {
        if (!speakingVideoRef.current || !listeningVideoRef.current) return;

        if (callState === "connected" && (agentActivity === "speaking" || agentActivity === "thinking")) {
            speakingVideoRef.current.play().catch(e => console.error("Speaking Video play error:", e));
            listeningVideoRef.current.pause();
        } else {
            listeningVideoRef.current.play().catch(e => console.error("Listening Video play error:", e));
            speakingVideoRef.current.pause();
        }
    }, [callState, agentActivity]);

    // Timer — only start when connected
    useEffect(() => {
        if (callState !== "connected") return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [callState]);

    // Force disconnect audio when time is up
    useEffect(() => {
        if (isTimeUp) {
            if (disconnectRef.current) {
                disconnectRef.current();
            }
        }
    }, [isTimeUp]);

    // Elapsed call time
    useEffect(() => {
        if (callState !== "connected") return;
        if (!connectedAtRef.current) connectedAtRef.current = Date.now();
        const interval = setInterval(() => {
            setElapsed(
                Math.floor((Date.now() - (connectedAtRef.current || 0)) / 1000)
            );
        }, 1000);
        return () => clearInterval(interval);
    }, [callState]);

    const handleStateChange = useCallback(
        (state: { sessionStatus: string; isAgentSpeaking: boolean; agentActivity: 'speaking' | 'listening' | 'thinking' }) => {
            if (state.sessionStatus === "CONNECTING") {
                setCallState("connecting");
            } else if (state.sessionStatus === "CONNECTED") {
                setCallState("connected");
            }
            setIsAgentSpeaking(state.isAgentSpeaking);
            setAgentActivity(state.agentActivity);
        },
        []
    );

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

    // Derive call status text from agentActivity
    const statusText =
        callState === "connecting"
            ? "Connecting..."
            : agentActivity === 'speaking'
                ? "Speaking..."
                : agentActivity === 'listening'
                    ? "Listening..."
                    : "Checking Kundali... 🔮";

    const statusColor =
        callState !== "connected"
            ? "#8696a0"
            : agentActivity === 'speaking'
                ? "#25D366"
                : agentActivity === 'listening'
                    ? "#53bdeb"
                    : "#f0b429";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            {/* WhatsApp Call Container — full-screen on mobile, phone-sim on desktop */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="relative w-full h-full md:max-w-[412px] md:h-[92vh] md:max-h-[780px] flex flex-col overflow-hidden md:rounded-[1.8rem]"
                style={{
                    background: "#0b141a",
                    boxShadow:
                        "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
                }}
            >
                {/* ===== VIDEO BACKGROUND ===== */}
                <div className="absolute inset-0 bg-black">
                    {/* Speaking Video */}
                    <video
                        ref={speakingVideoRef}
                        src="/assets/Video_Project_2_optimized.mp4"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(callState === "connected" && (agentActivity === "speaking" || agentActivity === "thinking")) ? "opacity-90" : "opacity-0"
                            }`}
                        loop
                        muted
                        playsInline
                        preload="auto"
                    />
                    {/* Listening/Idle Video */}
                    <video
                        ref={listeningVideoRef}
                        src="/assets/Silently_paying_attention_optimized.mp4"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(callState !== "connected" || agentActivity === "listening") ? "opacity-90 z-0" : "opacity-0 -z-10"
                            }`}
                        loop
                        muted
                        playsInline
                        preload="auto"
                    />

                    {/* Gradient overlays to make text readable over the video */}
                    <div className="absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-64 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                </div>

                {/* ===== TOP BAR ===== */}
                <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
                    {/* Timer pill */}
                    <div
                        className="flex items-center gap-1.5 rounded-full px-3 py-1"
                        style={{
                            background: "rgba(37,211,102,0.12)",
                            border: "1px solid rgba(37,211,102,0.2)",
                        }}
                    >
                        <Clock
                            className="w-3 h-3"
                            style={{ color: "#25D366" }}
                        />
                        <span
                            className="text-[12px] font-mono font-semibold"
                            style={{ color: "#25D366" }}
                        >
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Encryption badge */}
                    <div
                        className="flex items-center gap-1 rounded-full px-2.5 py-1"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <span className="text-[10px]" style={{ color: "#8696a0" }}>
                            🔒 End-to-end encrypted
                        </span>
                    </div>
                </div>

                {/* ===== CENTER CONTENT (Connecting Spinner Only) ===== */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pointer-events-none">
                    {callState !== "connected" && (
                        <div className="flex flex-col items-center justify-center space-y-5 bg-black/40 p-6 rounded-2xl backdrop-blur-md">
                            <motion.div
                                className="w-16 h-16 rounded-full"
                                style={{
                                    border: "3px solid transparent",
                                    borderTopColor: "#25D366",
                                    borderRightColor: "#25D366",
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                            <p className="text-white/90 font-medium text-lg tracking-wide drop-shadow-md">
                                Connecting to Ashram...
                            </p>
                        </div>
                    )}
                </div>

                {/* ===== BOTTOM CONTROLS & CALL INFO ===== */}
                <div className="relative z-10 shrink-0 pb-10 pt-4 px-6 flex flex-col w-full">
                    {/* Status & Name floating above controls */}
                    <div className="mb-6 flex flex-col items-center justify-center w-full">
                        <h2
                            className="text-[26px] font-semibold mb-1 tracking-tight"
                            style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                        >
                            Pandit Ji 🙏
                        </h2>

                        <div className="flex items-center gap-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                            <motion.span
                                key={statusText}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[15px] font-medium"
                                style={{ color: statusColor }}
                            >
                                {statusText}
                            </motion.span>

                            {callState === "connected" && (
                                <span
                                    className="text-[14px] font-mono font-medium"
                                    style={{ color: "#e9edef" }}
                                >
                                    · {formatTime(elapsed)}
                                </span>
                            )}
                        </div>

                        {/* Speaking/Listening indicator bar */}
                        {callState === "connected" && (
                            <div className="mt-4 flex items-center gap-[4px] drop-shadow-md">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="rounded-full"
                                        style={{
                                            width: "4px",
                                            background: isAgentSpeaking
                                                ? "#25D366"
                                                : "#53bdeb",
                                        }}
                                        animate={{
                                            height: isAgentSpeaking
                                                ? [
                                                    `${6 + Math.random() * 10}px`,
                                                    `${16 + Math.random() * 20}px`,
                                                    `${6 + Math.random() * 10}px`,
                                                ]
                                                : [
                                                    `${4 + Math.random() * 4}px`,
                                                    `${8 + Math.random() * 6}px`,
                                                    `${4 + Math.random() * 4}px`,
                                                ],
                                        }}
                                        transition={{
                                            duration: isAgentSpeaking
                                                ? 0.3 + Math.random() * 0.3
                                                : 1 + Math.random() * 0.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.05,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-8">
                        {/* Mute */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div
                                className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                                style={{
                                    background: isMuted
                                        ? "#e9edef"
                                        : "rgba(255,255,255,0.1)",
                                }}
                            >
                                {isMuted ? (
                                    <MicOff
                                        className="w-[22px] h-[22px]"
                                        style={{ color: "#111b21" }}
                                    />
                                ) : (
                                    <Mic
                                        className="w-[22px] h-[22px]"
                                        style={{ color: "#e9edef" }}
                                    />
                                )}
                            </div>
                            <span
                                className="text-[11px]"
                                style={{ color: "#8696a0" }}
                            >
                                {isMuted ? "Unmute" : "Mute"}
                            </span>
                        </button>

                        {/* End Call */}
                        <button onClick={handleEndCall} className="flex flex-col items-center gap-1.5">
                            <div
                                className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
                                style={{ background: "#ea0038" }}
                            >
                                <PhoneOff
                                    className="w-[26px] h-[26px]"
                                    style={{
                                        color: "white",
                                        transform: "rotate(135deg)",
                                    }}
                                />
                            </div>
                            <span
                                className="text-[11px]"
                                style={{ color: "#8696a0" }}
                            >
                                End
                            </span>
                        </button>

                        {/* Speaker */}
                        <button className="flex flex-col items-center gap-1.5">
                            <div
                                className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                }}
                            >
                                <Volume2
                                    className="w-[22px] h-[22px]"
                                    style={{ color: "#e9edef" }}
                                />
                            </div>
                            <span
                                className="text-[11px]"
                                style={{ color: "#8696a0" }}
                            >
                                Speaker
                            </span>
                        </button>
                    </div>
                </div>

                {/* Hidden App component — handles voice connection */}
                <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                    <TranscriptProvider>
                        <EventProvider>
                            <App
                                personalityIdState={PANDIT_PERSONALITY_ID}
                                isDoctor={false}
                                userData={{ id: `guest-${guestData.whatsapp || Date.now()}` }}
                                isGuest={true}
                                guestName={guestData.name}
                                guestDob={guestData.dob}
                                onStateChange={handleStateChange}
                                autoConnect={true}
                                disconnectRef={disconnectRef}
                            />
                        </EventProvider>
                    </TranscriptProvider>
                </div>

                {/* ===== TIME UP OVERLAY ===== */}
                <AnimatePresence>
                    {isTimeUp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                            style={{
                                background: "rgba(11,20,26,0.97)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <div
                                className="w-[90%] max-w-[320px] p-7 text-center space-y-5"
                                style={{
                                    background: "#1f2c34",
                                    border: "1px solid #2a3942",
                                    borderRadius: "16px",
                                }}
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
                                    style={{
                                        background: "rgba(37,211,102,0.12)",
                                    }}
                                >
                                    🕉️
                                </div>
                                <div>
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: "#e9edef" }}
                                    >
                                        Call Ended
                                    </h3>
                                    <p
                                        className="text-[13.5px] leading-[18px]"
                                        style={{ color: "#8696a0" }}
                                    >
                                        Your 2-minute call with Pandit Ji has
                                        ended. Sign up to continue your
                                        spiritual journey.
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        (window.location.href = "/login")
                                    }
                                    className="w-full py-2.5 font-medium text-[15px]"
                                    style={{
                                        background: "#00a884",
                                        color: "#111b21",
                                        borderRadius: "10px",
                                    }}
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-[13px]"
                                    style={{ color: "#8696a0" }}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

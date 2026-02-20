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
const PANDIT_AVATAR = "/products/pandit-hand.jpg";

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
                {/* ===== BACKGROUND ===== */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, #1a2930 0%, #0b141a 40%, #0b141a 100%)",
                    }}
                />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />

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

                {/* ===== CENTER CONTENT ===== */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
                    {/* Avatar with pulse ring */}
                    <div className="relative mb-6">
                        {/* Animated rings */}
                        <AnimatePresence>
                            {callState === "connected" && (
                                <>
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{
                                            scale: agentActivity === 'speaking'
                                                ? [1, 1.4, 1]
                                                : agentActivity === 'listening'
                                                    ? [1, 1.2, 1]
                                                    : [1, 1.15, 1],
                                            opacity: agentActivity === 'speaking'
                                                ? [0, 0.3, 0]
                                                : agentActivity === 'listening'
                                                    ? [0, 0.15, 0]
                                                    : [0, 0.1, 0],
                                        }}
                                        transition={{
                                            duration: agentActivity === 'speaking'
                                                ? 0.8
                                                : agentActivity === 'listening'
                                                    ? 1.5
                                                    : 2.5,
                                            repeat: Infinity,
                                            ease: "easeOut",
                                        }}
                                        style={{
                                            border: `2px solid ${statusColor}`,
                                        }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{
                                            scale: agentActivity === 'speaking'
                                                ? [1, 1.6, 1]
                                                : agentActivity === 'listening'
                                                    ? [1, 1.35, 1]
                                                    : [1, 1.25, 1],
                                            opacity: agentActivity === 'speaking'
                                                ? [0, 0.15, 0]
                                                : [0, 0.08, 0],
                                        }}
                                        transition={{
                                            duration: agentActivity === 'speaking'
                                                ? 0.8
                                                : agentActivity === 'listening'
                                                    ? 1.5
                                                    : 2.5,
                                            repeat: Infinity,
                                            ease: "easeOut",
                                            delay: 0.2,
                                        }}
                                        style={{
                                            border: `2px solid ${statusColor}`,
                                        }}
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        {/* Connecting spinner */}
                        {callState !== "connected" && (
                            <motion.div
                                className="absolute -inset-3 rounded-full"
                                style={{
                                    border: "2px solid transparent",
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
                        )}

                        {/* Avatar circle */}
                        <div
                            className="w-[140px] h-[140px] rounded-full overflow-hidden"
                            style={{
                                border: `3px solid ${callState === "connected" ? (isAgentSpeaking ? "#25D366" : "#53bdeb") : "#8696a0"}`,
                                boxShadow:
                                    callState === "connected" && isAgentSpeaking
                                        ? "0 0 30px rgba(37,211,102,0.3)"
                                        : "0 0 20px rgba(0,0,0,0.3)",
                                transition: "border-color 0.3s, box-shadow 0.3s",
                            }}
                        >
                            <img
                                src={PANDIT_AVATAR}
                                alt="Pandit Ji"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <h2
                        className="text-[22px] font-normal mb-1"
                        style={{ color: "#e9edef" }}
                    >
                        Pandit Ji 🙏
                    </h2>

                    {/* Status / Timer */}
                    <div className="flex items-center gap-2">
                        <motion.span
                            key={statusText}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[14px]"
                            style={{ color: statusColor }}
                        >
                            {statusText}
                        </motion.span>

                        {callState === "connected" && (
                            <span
                                className="text-[13px] font-mono"
                                style={{ color: "#8696a0" }}
                            >
                                · {formatTime(elapsed)}
                            </span>
                        )}
                    </div>

                    {/* Speaking/Listening indicator bar */}
                    {callState === "connected" && (
                        <div className="mt-6 flex items-center gap-[3px]">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="rounded-full"
                                    style={{
                                        width: "3px",
                                        background: isAgentSpeaking
                                            ? "#25D366"
                                            : "#53bdeb",
                                    }}
                                    animate={{
                                        height: isAgentSpeaking
                                            ? [
                                                `${6 + Math.random() * 8}px`,
                                                `${14 + Math.random() * 18}px`,
                                                `${6 + Math.random() * 8}px`,
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

                {/* ===== BOTTOM CONTROLS ===== */}
                <div className="relative z-10 shrink-0 pb-10 pt-4 px-6">
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

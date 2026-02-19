"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ArrowLeft,
    Phone,
    Video,
    MoreVertical,
    Check,
    CheckCheck,
    Clock,
    Smile,
    Paperclip,
    Camera,
    Mic,
} from "lucide-react";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
    status?: "sending" | "sent" | "delivered" | "read";
}

interface DemoChatSessionProps {
    guestData: {
        name: string;
        dob: string;
        location: string;
        whatsapp: string;
    };
    onClose: () => void;
    personalityId: string;
}

const PANDIT_AVATAR = "/products/pandit-hand.jpg";

// WhatsApp doodle wallpaper pattern (dark mode)
const WA_WALLPAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cstyle%3E.c%7Bfill:%23131d25;opacity:0.25%7D%3C/style%3E%3C/defs%3E%3Cpath class='c' d='M20 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3Cpath class='c' d='M50 30l-4-4-4 4 4 4zm0 8l4-4-4-4-4 4z'/%3E%3Ccircle class='c' cx='90' cy='15' r='3'/%3E%3Ccircle class='c' cx='90' cy='35' r='2'/%3E%3Cpath class='c' d='M130 20h8v2h-8zm0 8h6v2h-6z'/%3E%3Cpath class='c' d='M170 10l3 6h-6zm0 20l-3-6h6z'/%3E%3Cpath class='c' d='M25 60c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z'/%3E%3Cpath class='c' d='M60 55h10v2H60z'/%3E%3Cpath class='c' d='M100 50l5 8H95z'/%3E%3Ccircle class='c' cx='140' cy='55' r='4'/%3E%3Cpath class='c' d='M175 50l-3 5h6z'/%3E%3Cpath class='c' d='M30 95l6-3-6-3v6z'/%3E%3Ccircle class='c' cx='65' cy='90' r='2.5'/%3E%3Cpath class='c' d='M100 85h8v8h-8z' rx='1'/%3E%3Cpath class='c' d='M140 90l4 4-4 4-4-4z'/%3E%3Ccircle class='c' cx='175' cy='92' r='3'/%3E%3Cpath class='c' d='M20 130l5 3-5 3v-6z'/%3E%3Cpath class='c' d='M55 125c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5z'/%3E%3Cpath class='c' d='M105 128h6v2h-6z'/%3E%3Cpath class='c' d='M145 120l4 8h-8z'/%3E%3Ccircle class='c' cx='180' cy='130' r='2'/%3E%3Cpath class='c' d='M25 165l3-5h-6z'/%3E%3Cpath class='c' d='M60 160h6v6h-6z'/%3E%3Ccircle class='c' cx='100' cy='165' r='3.5'/%3E%3Cpath class='c' d='M140 162l5-3-5-3v6z'/%3E%3Cpath class='c' d='M175 158c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z'/%3E%3C/svg%3E")`;

export default function DemoChatSession({
    guestData,
    onClose,
    personalityId,
}: DemoChatSessionProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const initializedRef = useRef(false);

    // Timer
    useEffect(() => {
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
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const sendInitialGreeting = async () => {
            setIsTyping(true);
            try {
                const res = await fetch("/api/guest-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: `My name is ${guestData.name} and my date of birth is ${guestData.dob}. Please greet me warmly and introduce yourself. This is the start of our conversation.`,
                        messages: [],
                        personalityId,
                        guestName: guestData.name,
                        guestDob: guestData.dob,
                    }),
                });
                const data = await res.json();
                if (data.response) {
                    const triggerMsg = `My name is ${guestData.name} and my date of birth is ${guestData.dob}. Please greet me warmly and introduce yourself.`;
                    setMessages([
                        {
                            id: "trigger-1",
                            content: triggerMsg,
                            role: "user",
                            timestamp: new Date(),
                            status: "read",
                        },
                        {
                            id: "greeting-1",
                            content: data.response,
                            role: "assistant",
                            timestamp: new Date(),
                            status: "read",
                        },
                    ]);
                } else if (data.error) {
                    setMessages([
                        {
                            id: "error-1",
                            content: `🙏 Kshama karein, there was an issue connecting. (${data.error})`,
                            role: "assistant",
                            timestamp: new Date(),
                            status: "read",
                        },
                    ]);
                }
            } catch (err) {
                console.error("[DemoChat] Failed to get initial greeting:", err);
                setMessages([
                    {
                        id: "error-1",
                        content: "🙏 Connection failed. Please try again later.",
                        role: "assistant",
                        timestamp: new Date(),
                        status: "read",
                    },
                ]);
            } finally {
                setIsTyping(false);
            }
        };

        sendInitialGreeting();
    }, []);

    const sendMessage = async () => {
        const text = inputText.trim();
        if (!text || isTyping || isTimeUp) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            content: text,
            role: "user",
            timestamp: new Date(),
            status: "sent",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        const history = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        try {
            const res = await fetch("/api/guest-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    messages: history,
                    personalityId,
                    guestName: guestData.name,
                    guestDob: guestData.dob,
                }),
            });
            const data = await res.json();

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === userMsg.id
                        ? { ...m, status: "delivered" as const }
                        : m
                )
            );

            if (data.response) {
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: `assistant-${Date.now()}`,
                            content: data.response,
                            role: "assistant",
                            timestamp: new Date(),
                            status: "read",
                        },
                    ]);
                    setIsTyping(false);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === userMsg.id
                                ? { ...m, status: "read" as const }
                                : m
                        )
                    );
                }, 300);
            } else if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `error-${Date.now()}`,
                        content: `🙏 Sorry, something went wrong. (${data.error})`,
                        role: "assistant",
                        timestamp: new Date(),
                        status: "read",
                    },
                ]);
                setIsTyping(false);
            } else {
                setIsTyping(false);
            }
        } catch (err) {
            console.error("[DemoChat] Chat error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    content: "🙏 Connection error. Please try again.",
                    role: "assistant",
                    timestamp: new Date(),
                    status: "read",
                },
            ]);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const StatusIcon = ({ status }: { status?: string }) => {
        switch (status) {
            case "sending":
                return <Clock className="w-[14px] h-[14px] text-[#667781]" />;
            case "sent":
                return <Check className="w-[14px] h-[14px] text-[#667781]" />;
            case "delivered":
                return (
                    <CheckCheck className="w-[14px] h-[14px] text-[#667781]" />
                );
            case "read":
                return (
                    <CheckCheck className="w-[14px] h-[14px] text-[#53bdeb]" />
                );
            default:
                return null;
        }
    };

    const visibleMessages = messages.filter((msg) => msg.id !== "trigger-1");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            {/* WhatsApp Phone Container */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="relative w-full max-w-[412px] h-[92vh] max-h-[780px] flex flex-col overflow-hidden"
                style={{
                    borderRadius: "1.8rem",
                    border: "2px solid #313d45",
                    boxShadow:
                        "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
                }}
            >
                {/* ========== HEADER ========== */}
                <div
                    className="flex items-center shrink-0"
                    style={{
                        background: "#1f2c34",
                        padding: "8px 6px 8px 4px",
                    }}
                >
                    {/* Back */}
                    <button
                        onClick={onClose}
                        className="p-1.5 -mr-1 flex-shrink-0"
                        style={{ color: "#aebac1" }}
                    >
                        <ArrowLeft className="w-[22px] h-[22px]" />
                    </button>

                    {/* Avatar */}
                    <div
                        className="w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 ml-1"
                        style={{ background: "#6b7b8d" }}
                    >
                        <img
                            src={PANDIT_AVATAR}
                            alt="Pandit Ji"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name & Status */}
                    <div className="flex-1 min-w-0 ml-3">
                        <p
                            className="text-[16.5px] font-normal leading-tight truncate"
                            style={{ color: "#e9edef" }}
                        >
                            Pandit Ji 🙏
                        </p>
                        <p
                            className="text-[13px] leading-tight mt-[1px]"
                            style={{ color: "#8696a0" }}
                        >
                            {isTyping ? (
                                <span style={{ color: "#25D366" }}>
                                    typing...
                                </span>
                            ) : (
                                "online"
                            )}
                        </p>
                    </div>

                    {/* Timer pill */}
                    <div
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 mr-1"
                        style={{
                            background: "rgba(37,211,102,0.1)",
                            border: "1px solid rgba(37,211,102,0.25)",
                        }}
                    >
                        <Clock className="w-3 h-3" style={{ color: "#25D366" }} />
                        <span
                            className="text-[11px] font-mono font-semibold"
                            style={{ color: "#25D366" }}
                        >
                            {formatTimer(timeLeft)}
                        </span>
                    </div>

                    {/* Action icons */}
                    <button className="p-2" style={{ color: "#aebac1" }}>
                        <Video className="w-[20px] h-[20px]" />
                    </button>
                    <button className="p-2" style={{ color: "#aebac1" }}>
                        <Phone className="w-[20px] h-[20px]" />
                    </button>
                    <button className="p-1.5" style={{ color: "#aebac1" }}>
                        <MoreVertical className="w-[18px] h-[18px]" />
                    </button>
                </div>

                {/* ========== MESSAGES ========== */}
                <div
                    className="flex-1 overflow-y-auto px-[12px] py-[6px]"
                    style={{
                        backgroundColor: "#0b141a",
                        backgroundImage: WA_WALLPAPER,
                        backgroundSize: "200px 200px",
                    }}
                >
                    {/* Date chip */}
                    <div className="flex justify-center my-3">
                        <span
                            className="text-[12px] px-3 py-[5px] rounded-[8px]"
                            style={{
                                background: "#182229",
                                color: "#8696a0",
                                boxShadow: "0 1px 1px rgba(0,0,0,0.13)",
                            }}
                        >
                            TODAY
                        </span>
                    </div>

                    {/* System notice */}
                    <div className="flex justify-center mb-3">
                        <div
                            className="text-[12.5px] px-[14px] py-[6px] rounded-[8px] text-center leading-[17px]"
                            style={{
                                background: "#182229",
                                color: "#8696a0",
                                maxWidth: "300px",
                                boxShadow: "0 1px 1px rgba(0,0,0,0.13)",
                            }}
                        >
                            🔒 2-min demo session. Messages are end-to-end
                            encrypted. Not stored on our servers.
                        </div>
                    </div>

                    {/* Messages */}
                    {visibleMessages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        const isFirst =
                            i === 0 ||
                            visibleMessages[i - 1]?.role !== msg.role;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isUser ? "justify-end" : "justify-start"} mb-[2px] ${isFirst ? "mt-[6px]" : ""}`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="relative"
                                    style={{
                                        maxWidth: "78%",
                                        minWidth: "80px",
                                        background: isUser
                                            ? "#005c4b"
                                            : "#1f2c34",
                                        borderRadius: isFirst
                                            ? isUser
                                                ? "10px 3px 10px 10px"
                                                : "3px 10px 10px 10px"
                                            : "10px",
                                        padding: "5px 7px 3px 9px",
                                        boxShadow:
                                            "0 1px 0.5px rgba(11,20,26,0.13)",
                                    }}
                                >
                                    {/* Bubble tail */}
                                    {isFirst && (
                                        <span
                                            className="absolute top-0"
                                            style={{
                                                [isUser ? "right" : "left"]:
                                                    "-8px",
                                                width: 0,
                                                height: 0,
                                                borderTop: `6px solid ${isUser ? "#005c4b" : "#1f2c34"}`,
                                                borderRight: isUser
                                                    ? "none"
                                                    : "8px solid transparent",
                                                borderLeft: isUser
                                                    ? "8px solid transparent"
                                                    : "none",
                                            }}
                                        />
                                    )}

                                    {/* Text */}
                                    <p
                                        className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words"
                                        style={{
                                            color: "#e9edef",
                                            marginBottom: "2px",
                                        }}
                                    >
                                        {msg.content}
                                    </p>

                                    {/* Time + Status row */}
                                    <div
                                        className="flex items-center justify-end gap-[3px]"
                                        style={{ marginTop: "-2px" }}
                                    >
                                        <span
                                            className="text-[11px]"
                                            style={{ color: "rgba(255,255,255,0.55)" }}
                                        >
                                            {formatTime(msg.timestamp)}
                                        </span>
                                        {isUser && (
                                            <StatusIcon status={msg.status} />
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-start mt-[6px] mb-[2px]"
                            >
                                <div
                                    className="relative"
                                    style={{
                                        background: "#1f2c34",
                                        borderRadius: "3px 10px 10px 10px",
                                        padding: "10px 14px",
                                        boxShadow:
                                            "0 1px 0.5px rgba(11,20,26,0.13)",
                                    }}
                                >
                                    {/* Tail */}
                                    <span
                                        className="absolute top-0"
                                        style={{
                                            left: "-8px",
                                            width: 0,
                                            height: 0,
                                            borderTop: "6px solid #1f2c34",
                                            borderRight:
                                                "8px solid transparent",
                                        }}
                                    />
                                    <div className="flex gap-[4px] items-center h-[14px]">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className="block rounded-full"
                                                style={{
                                                    width: "7px",
                                                    height: "7px",
                                                    background: "#8696a0",
                                                    animation: `waTyping 1.2s ease-in-out ${i * 0.2}s infinite`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* ========== INPUT BAR ========== */}
                <div
                    className="flex items-end gap-[6px] shrink-0"
                    style={{
                        background: "#1f2c34",
                        padding: "5px 6px 5px 5px",
                    }}
                >
                    {/* Input row */}
                    <div
                        className="flex-1 flex items-center gap-1"
                        style={{
                            background: "#2a3942",
                            borderRadius: "24px",
                            padding: "4px 6px 4px 10px",
                            minHeight: "42px",
                        }}
                    >
                        <button
                            className="flex-shrink-0 p-1"
                            style={{ color: "#8696a0" }}
                        >
                            <Smile className="w-[24px] h-[24px]" />
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message"
                            disabled={isTimeUp}
                            className="flex-1 bg-transparent outline-none"
                            style={{
                                color: "#e9edef",
                                fontSize: "15px",
                                lineHeight: "20px",
                                padding: "2px 4px",
                            }}
                        />

                        <button
                            className="flex-shrink-0 p-1"
                            style={{ color: "#8696a0" }}
                        >
                            <Paperclip
                                className="w-[22px] h-[22px]"
                                style={{ transform: "rotate(-45deg)" }}
                            />
                        </button>

                        {!inputText.trim() && (
                            <button
                                className="flex-shrink-0 p-1"
                                style={{ color: "#8696a0" }}
                            >
                                <Camera className="w-[22px] h-[22px]" />
                            </button>
                        )}
                    </div>

                    {/* Send / Mic button */}
                    <button
                        onClick={inputText.trim() ? sendMessage : undefined}
                        disabled={isTimeUp}
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "#00a884",
                        }}
                    >
                        {inputText.trim() ? (
                            <Send
                                className="w-[18px] h-[18px]"
                                style={{
                                    color: "#111b21",
                                    marginLeft: "-2px",
                                }}
                            />
                        ) : (
                            <Mic
                                className="w-[20px] h-[20px]"
                                style={{ color: "#111b21" }}
                            />
                        )}
                    </button>
                </div>

                {/* ========== TIME UP OVERLAY ========== */}
                <AnimatePresence>
                    {isTimeUp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                            style={{
                                background: "rgba(11,20,26,0.95)",
                                backdropFilter: "blur(6px)",
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
                                        background:
                                            "rgba(37,211,102,0.12)",
                                    }}
                                >
                                    🕉️
                                </div>
                                <div>
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: "#e9edef" }}
                                    >
                                        Demo Complete
                                    </h3>
                                    <p
                                        className="text-[13.5px] leading-[18px]"
                                        style={{ color: "#8696a0" }}
                                    >
                                        Your 2-minute chat with Pandit Ji has
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
                                    Close Demo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Keyframe for typing dots */}
            <style jsx global>{`
                @keyframes waTyping {
                    0%,
                    60%,
                    100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-4px);
                        opacity: 1;
                    }
                }
                input::placeholder {
                    color: #8696a0 !important;
                }
            `}</style>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, Video, MoreVertical, Check, CheckCheck, Clock, X } from "lucide-react";

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

export default function DemoChatSession({ guestData, onClose, personalityId }: DemoChatSessionProps) {
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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Send initial greeting on mount
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const sendInitialGreeting = async () => {
            setIsTyping(true);
            try {
                console.log("[DemoChat] Sending initial greeting request...");
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
                console.log("[DemoChat] Initial greeting response status:", res.status);
                const data = await res.json();
                console.log("[DemoChat] Initial greeting data:", data);
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
                    console.error("[DemoChat] API error:", data.error);
                    setMessages([
                        {
                            id: "error-1",
                            content: `🙏 Kshama karein, there was an issue connecting. Please try again. (${data.error})`,
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

        // Build history for API
        const history = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        try {
            console.log("[DemoChat] Sending message:", text);
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
            console.log("[DemoChat] Response status:", res.status);
            const data = await res.json();
            console.log("[DemoChat] Response data:", data);

            // Mark user message as delivered
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === userMsg.id ? { ...m, status: "delivered" as const } : m
                )
            );

            if (data.response) {
                setTimeout(() => {
                    const assistantMsg: Message = {
                        id: `assistant-${Date.now()}`,
                        content: data.response,
                        role: "assistant",
                        timestamp: new Date(),
                        status: "read",
                    };
                    setMessages((prev) => [...prev, assistantMsg]);
                    setIsTyping(false);

                    // Mark user msg as read
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === userMsg.id ? { ...m, status: "read" as const } : m
                        )
                    );
                }, 300);
            } else if (data.error) {
                const errorMsg: Message = {
                    id: `error-${Date.now()}`,
                    content: `🙏 Sorry, something went wrong. (${data.error})`,
                    role: "assistant",
                    timestamp: new Date(),
                    status: "read",
                };
                setMessages((prev) => [...prev, errorMsg]);
                setIsTyping(false);
            } else {
                setIsTyping(false);
            }
        } catch (err) {
            console.error("[DemoChat] Chat error:", err);
            const errorMsg: Message = {
                id: `error-${Date.now()}`,
                content: "🙏 Connection error. Please try again.",
                role: "assistant",
                timestamp: new Date(),
                status: "read",
            };
            setMessages((prev) => [...prev, errorMsg]);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const MessageStatus = ({ status }: { status?: string }) => {
        if (status === "sending") return <Clock className="w-3.5 h-3.5 text-white/40" />;
        if (status === "sent") return <Check className="w-3.5 h-3.5 text-white/40" />;
        if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-white/40" />;
        if (status === "read") return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
        return null;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* Phone frame / Chat container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[420px] h-[90vh] max-h-[750px] bg-[#0b141a] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
                style={{
                    border: "3px solid #2a2a2a",
                }}
            >
                {/* ===== HEADER ===== */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1f2c34] border-b border-[#2a3942] shrink-0">
                    <button
                        onClick={onClose}
                        className="p-1 text-[#aebac1] hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a3942] shrink-0">
                        <img
                            src={PANDIT_AVATAR}
                            alt="Smart Pandit"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-[#e9edef] text-base font-medium leading-tight truncate">
                            Smart Pandit 🙏
                        </h3>
                        <p className="text-[#8696a0] text-xs leading-tight">
                            {isTyping ? (
                                <span className="text-[#00a884]">typing...</span>
                            ) : (
                                "online"
                            )}
                        </p>
                    </div>

                    {/* Timer badge */}
                    <div className="flex items-center gap-1 bg-[#00a884]/10 border border-[#00a884]/30 rounded-full px-2.5 py-1">
                        <Clock className="w-3 h-3 text-[#00a884]" />
                        <span className="text-[#00a884] text-xs font-mono font-bold">
                            {formatTimer(timeLeft)}
                        </span>
                    </div>

                    <button className="p-1 text-[#aebac1]">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* ===== MESSAGES AREA ===== */}
                <div
                    className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111b21' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundColor: "#0b141a",
                    }}
                >
                    {/* Day indicator */}
                    <div className="flex justify-center mb-3">
                        <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-lg shadow-sm">
                            Today
                        </span>
                    </div>

                    {/* End-to-end encryption notice */}
                    <div className="flex justify-center mb-3">
                        <div className="bg-[#1d282f] text-[#8696a0] text-[11px] px-4 py-1.5 rounded-lg text-center max-w-[280px] leading-relaxed">
                            🔒 This is a 2-min demo session with Smart Pandit. Messages are not stored.
                        </div>
                    </div>

                    {messages.filter((msg) => msg.id !== "trigger-1").map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`relative max-w-[80%] px-2.5 pt-1.5 pb-1 rounded-lg shadow-sm ${msg.role === "user"
                                    ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                                    : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                                    }`}
                            >
                                {/* Bubble tail */}
                                <div
                                    className={`absolute top-0 w-2 h-3 ${msg.role === "user"
                                        ? "-right-1.5 text-[#005c4b]"
                                        : "-left-1.5 text-[#202c33]"
                                        }`}
                                >
                                    <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                                        {msg.role === "user" ? (
                                            <path d="M1 0L8 0L8 6C8 6 4 6 1 13C1 7 1 0 1 0Z" />
                                        ) : (
                                            <path d="M7 0L0 0L0 6C0 6 4 6 7 13C7 7 7 0 7 0Z" />
                                        )}
                                    </svg>
                                </div>

                                {/* Message text */}
                                <p className="text-[13.5px] leading-[19px] whitespace-pre-wrap break-words">
                                    {msg.content}
                                </p>

                                {/* Timestamp + status */}
                                <div className={`flex items-center gap-1 mt-0.5 ${msg.role === "user" ? "justify-end" : "justify-end"}`}>
                                    <span className="text-[11px] text-[#ffffff99]">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                    {msg.role === "user" && <MessageStatus status={msg.status} />}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex justify-start"
                            >
                                <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* ===== INPUT BAR ===== */}
                <div className="flex items-end gap-2 px-2 py-2 bg-[#1f2c34] border-t border-[#2a3942] shrink-0">
                    <div className="flex-1 flex items-end bg-[#2a3942] rounded-3xl px-4 py-2 min-h-[44px]">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message"
                            disabled={isTimeUp}
                            className="flex-1 bg-transparent text-[#e9edef] text-[15px] placeholder:text-[#8696a0] outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={sendMessage}
                        disabled={!inputText.trim() || isTyping || isTimeUp}
                        className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#06cf9c] disabled:bg-[#2a3942] disabled:text-[#8696a0] text-white flex items-center justify-center transition-colors shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* ===== TIME UP OVERLAY ===== */}
                <AnimatePresence>
                    {isTimeUp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="bg-[#1f2c34] border border-[#2a3942] p-8 rounded-2xl max-w-sm w-full space-y-5">
                                <div className="w-16 h-16 bg-[#00a884]/20 rounded-full flex items-center justify-center mx-auto text-3xl">
                                    🕉️
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#e9edef] mb-2">Demo Completed</h3>
                                    <p className="text-[#8696a0] text-sm">
                                        Your 2-minute chat with Pandit Ji has ended.
                                        Sign up to continue your spiritual journey.
                                    </p>
                                </div>
                                <button
                                    onClick={() => (window.location.href = "/login")}
                                    className="w-full py-3 bg-[#00a884] hover:bg-[#06cf9c] text-white font-bold rounded-xl transition-colors"
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-sm text-[#8696a0] hover:text-[#e9edef] transition-colors"
                                >
                                    Close Demo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

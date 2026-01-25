"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "model" | "assistant";
    content: string;
}

interface ChatInterfaceProps {
    personality: IPersonality;
    onClose: () => void;
}

export default function ChatInterface({ personality, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: inputValue.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    messages: messages, // Send history for context
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.error("Chat error:", data.error);
                // Optionally show error in UI
            } else {
                const botMessage: Message = { role: "model", content: data.response };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold font-lora text-white/90">{personality.title} Chat</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                    Close
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 text-center">
                        <p>Start a conversation with {personality.title}...</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-white/90 text-black font-medium"
                                    : "bg-white/10 text-white/90 font-light backdrop-blur-sm border border-white/5"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 rounded-2xl px-4 py-3 flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                            <span className="text-xs text-white/50">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/30"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className={`absolute right-2 top-2 p-2 rounded-full transition-all ${inputValue.trim() && !isLoading
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-transparent text-white/20 cursor-not-allowed"
                        }`}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

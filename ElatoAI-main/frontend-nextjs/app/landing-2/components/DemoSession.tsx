"use client";

import { useEffect, useState, useRef } from "react";
import App from "@/app/components/Realtime/App"; // Adjust import path
import { TranscriptProvider } from "@/app/components/Realtime/contexts/TranscriptContext";
import { EventProvider } from "@/app/components/Realtime/contexts/EventContext";
import { X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoSessionProps {
    guestData: any;
    mode: "call" | "chat";
    onClose: () => void;
}

// Pandit Ji Personality ID
const PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";

export default function DemoSession({ guestData, mode, onClose }: DemoSessionProps) {
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [isTimeUp, setIsTimeUp] = useState(false);

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            {/* Top Bar with Timer */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                    <span className="font-mono font-bold text-[#FFD700]">{formatTime(timeLeft)}</span>
                    <span className="text-xs text-white/60 ml-1">Demo Limit</span>
                </div>

                <div className="pointer-events-auto">
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Realtime App Wrapper */}
            <div className="flex-1 w-full h-full relative">
                <TranscriptProvider>
                    <EventProvider>
                        {/* 
                            We pass a dummy ID for guest.
                            Note: Ensure App.tsx handles guest userId gracefully or supply a uuid.
                        */}
                        <App
                            personalityIdState={PANDIT_PERSONALITY_ID}
                            isDoctor={false}
                            userId={`guest-${guestData.whatsapp || Date.now()}`}
                        />
                    </EventProvider>
                </TranscriptProvider>

                {/* Cover for timer expiration */}
                <AnimatePresence>
                    {isTimeUp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl max-w-sm w-full space-y-6">
                                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto text-3xl">
                                    🕉️
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Demo Completed</h3>
                                    <p className="text-gray-400">
                                        Your 2-minute conversation with Pandit Ji has ended.
                                        Sign up to continue your spiritual journey.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = "/login"}
                                    className="w-full py-3 bg-[#FFD700] hover:bg-[#FFC000] text-black font-bold rounded-xl transition-colors"
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-sm text-gray-500 hover:text-gray-300"
                                >
                                    Close Demo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

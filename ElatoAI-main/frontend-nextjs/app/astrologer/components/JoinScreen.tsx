"use client";

import { useState } from "react";
import { Users, Mic, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

interface JoinScreenProps {
    onJoin: (names: string[]) => void;
    initialName?: string | null;
}

export default function JoinScreen({ onJoin, initialName }: JoinScreenProps) {
    const [namesInput, setNamesInput] = useState(initialName || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const names = namesInput
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (names.length === 0) {
            names.push("Guest");
        }

        onJoin(names);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4 border border-amber-500/30">
                        <Star className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-lora mb-2 tracking-tight">Join Live Astrology Session</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Enter the names of everyone joining today. The Astrologer will address you all by name and read the stars for you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 ml-1">
                            Participant Names
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={namesInput}
                                onChange={(e) => setNamesInput(e.target.value)}
                                placeholder="e.g. Rohan, Priya, Sharma Family"
                                className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 ml-1">Separate multiple names with commas.</p>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Mic className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-200/80 leading-relaxed">
                            <strong>Group Audio Active:</strong> Everyone in the room can speak freely. The AI Astrologer will listen and respond to the group.
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Join Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

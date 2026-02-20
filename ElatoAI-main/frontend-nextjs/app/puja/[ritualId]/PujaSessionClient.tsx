"use client";

import { useState } from "react";
import PujaSession from "@/app/components/Puja/PujaSession";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";

export default function PujaSessionClient({ metadata }: { metadata: any }) {
    const [hasJoined, setHasJoined] = useState(false);
    const [guestData, setGuestData] = useState({ firstName: "", gender: "male" });
    const [isLeaving, setIsLeaving] = useState(false);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (guestData.firstName.trim().length < 2) return;
        setHasJoined(true);
    };

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    };

    if (hasJoined) {
        return (
            <AnimatePresence>
                {!isLeaving && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#111]"
                    >
                        <PujaSession
                            guestData={guestData}
                            pujaTitle={metadata.title}
                            personalityId={metadata.personalityId}
                            samagriList={metadata.samagriList}
                            aartiSrc={metadata.aartiSrc}
                            onClose={handleClose}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Joining Screen (similar to DemoForm but styled for Pujas)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2a170e] to-black p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-stone-900/50 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 relative z-10 shadow-2xl shadow-orange-950/50"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                        <Flame className="text-white" size={32} />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2 font-serif">
                        {metadata.title}
                    </h1>
                    <p className="text-orange-200/60 text-sm">
                        Enter your details to begin the sacred ritual with Acharya Veda.
                    </p>
                </div>

                <form onSubmit={handleJoin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1.5 ml-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your first name"
                            className="w-full bg-stone-950/50 border border-stone-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-stone-600"
                            value={guestData.firstName}
                            onChange={(e) => setGuestData({ ...guestData, firstName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1.5 ml-1">
                            Gender <span className="text-stone-500 text-xs">(For proper mantras)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {['male', 'female'].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGuestData({ ...guestData, gender: g })}
                                    className={`py-3 rounded-xl border transition-all capitalize font-medium ${guestData.gender === g
                                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                        : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:bg-stone-800'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={guestData.firstName.trim().length === 0}
                        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-orange-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:shadow-none"
                    >
                        <span>Begin Ritual</span>
                        <Sparkles size={18} />
                    </button>

                    <p className="text-center text-xs text-stone-500 mt-4">
                        Please ensure you are in a quiet environment.
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

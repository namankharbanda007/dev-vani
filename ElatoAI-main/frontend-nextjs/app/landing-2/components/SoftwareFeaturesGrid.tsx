"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Flame, Sparkles } from "lucide-react";
import clsx from "clsx";

export default function SoftwareFeaturesGrid() {
    return (
        <section className="py-24 px-6 md:px-10 bg-soft-paper">
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-murti-stone mb-4">
                    Divine Connection, Anytime
                </h2>
                <p className="text-lg text-murti-stone/70 max-w-2xl mx-auto">
                    Experience personalized spiritual guidance, rituals, and astrology through advanced AI.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[400px]">

                {/* Main Feature: Live Interaction */}
                <BentoCard
                    title="Live AI Pandit & Astrologer"
                    description="Real-time voice calls and chat with our highly advanced spiritual AI personas."
                    className="md:col-span-2 bg-gradient-to-br from-orange-50 to-white"
                    icon={<Phone className="w-8 h-8 text-divine-saffron" />}
                >
                    <div className="absolute inset-x-8 bottom-0 top-32 overflow-hidden rounded-t-3xl border border-b-0 border-white/40 bg-white/50 backdrop-blur-sm shadow-xl flex items-center justify-center">
                        {/* Abstract representation of connection */}
                        <div className="flex items-center gap-6 opacity-30">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 blur-2xl"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                className="w-32 h-1 bg-gradient-to-r from-orange-400 to-transparent"
                            />
                        </div>
                    </div>
                </BentoCard>

                {/* WhatsApp Integration */}
                <BentoCard
                    title="WhatsApp Integration"
                    description="Carry your spiritual guide in your pocket. Daily horoscope updates and habit building."
                    className="row-span-2 bg-[#075E54] text-white overflow-hidden relative"
                    icon={<MessageCircle className="w-8 h-8 text-[#25D366]" />}
                    dark
                >
                    <div className="absolute inset-x-4 bottom-0 top-32 overflow-hidden rounded-t-3xl bg-[#128C7E]/20 backdrop-blur-md border border-[#25D366]/30 border-b-0 shadow-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="text-[#25D366] opacity-50 flex flex-col items-center gap-4">
                            <MessageCircle className="w-16 h-16" />
                            <span className="font-medium text-sm text-center px-4">Daily Horoscope<br />Habit Building</span>
                        </div>
                    </div>
                </BentoCard>

                {/* Virtual Rituals */}
                <a href="/puja/ganpati-havan" className="block transition-transform hover:scale-[1.02]">
                    <BentoCard
                        title="Live AI Hawans & Pujas"
                        description="Perform virtual rituals guided perfectly by your personal AI Pandit. (Click to try Ganpati Havan)"
                        className="bg-zinc-100 h-full"
                        icon={<Flame className="w-8 h-8 text-orange-500" />}
                    >
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                            <Flame className="w-48 h-48" />
                        </div>
                    </BentoCard>
                </a>

                {/* Divine Matchmaking */}
                <BentoCard
                    title="Smart Match Maker"
                    description="Find cosmic alignment with AI-powered Kundali matching."
                    className="bg-rose-50 border-rose-100/50"
                    icon={<Sparkles className="w-8 h-8 text-rose-500" />}
                >
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                        <Sparkles className="w-40 h-40 text-rose-600" />
                    </div>
                </BentoCard>

            </div>
        </section>
    );
}

interface BentoCardProps {
    title: string;
    description: string;
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    dark?: boolean;
}

function BentoCard({ title, description, className, icon, children, dark }: BentoCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={clsx(
                "relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between group border hover:border-divine-saffron/30 transition-all shadow-sm hover:shadow-xl hover:shadow-divine-saffron/10",
                dark ? "border-transparent" : "border-black/5 bg-white",
                className
            )}
        >
            <div className="relative z-10 flex justify-between items-start">
                <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm border border-white/20">
                    {icon}
                </div>
            </div>

            <div className="relative z-10 mt-auto pt-8">
                <h3 className={clsx("text-2xl font-serif font-bold mb-3", dark ? "text-white" : "text-murti-stone")}>
                    {title}
                </h3>
                <p className={clsx("text-base font-medium leading-relaxed", dark ? "text-white/70" : "text-murti-stone/70")}>
                    {description}
                </p>
            </div>

            {/* Subtle glow effect */}
            <div className={clsx(
                "absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
                dark ? "from-white" : "from-black"
            )} />

            {children}
        </motion.div>
    );
}

"use client";

import { motion } from "framer-motion";
import { Hand, Layers, ScanFace, HeartPulse } from "lucide-react";

const services = [
    {
        title: "Palm Reading",
        description: "Upload a picture of your palm and let our AI decipher your life line, fate, and destiny.",
        icon: <Hand className="w-8 h-8 text-amber-500" />,
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    {
        title: "Tarot Card Reading",
        description: "Draw your daily spiritual cards. Get personalized readings for career, love, and life answers.",
        icon: <Layers className="w-8 h-8 text-purple-500" />,
        bg: "bg-purple-50",
        border: "border-purple-100",
    },
    {
        title: "Face Reading",
        description: "Discover hidden personality traits and future possibilities through advanced facial astrology.",
        icon: <ScanFace className="w-8 h-8 text-blue-500" />,
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    {
        title: "Love Compatibility",
        description: "Check your cosmic alignment. Compare Kundalis instantly to find your perfect spiritual match.",
        icon: <HeartPulse className="w-8 h-8 text-rose-500" />,
        bg: "bg-rose-50",
        border: "border-rose-100",
    },
];

export default function DivinationServices() {
    return (
        <section className="py-24 px-6 md:px-10 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-murti-stone mb-6">
                        Unlock Your Destiny
                    </h2>
                    <p className="text-lg text-murti-stone/70">
                        Beyond conversations, Smart Murti provides a full suite of Vedic and mystical readings powered by divine intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${service.bg} ${service.border}`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-serif font-bold text-murti-stone mb-3">
                                {service.title}
                            </h3>
                            <p className="text-sm text-murti-stone/70 leading-relaxed font-medium">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

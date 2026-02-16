"use client";

import { motion } from "framer-motion";

export default function Marquee() {
    return (
        <div className="relative w-full overflow-hidden py-10 bg-soft-paper border-y border-murti-stone/10">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 30, // Adjust speed here
                        ease: "linear",
                    }}
                    className="flex space-x-12"
                >
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span
                            key={i}
                            className="text-6xl md:text-8xl font-serif font-bold text-murti-stone opacity-10 tracking-widest uppercase"
                        >
                            Connect • Pray • Experience • Dharma • Technology •
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

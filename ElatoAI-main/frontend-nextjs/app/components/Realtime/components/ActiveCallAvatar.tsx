import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPersonalityImageSrc } from "@/lib/utils"; // Assuming this utility exists or similar logic

interface ActiveCallAvatarProps {
    personality: any; // Using any for now to avoid strict type issues, but should match IPersonality
    state: "listening" | "speaking" | "idle" | "connecting";
}

const ActiveCallAvatar: React.FC<ActiveCallAvatarProps> = ({ personality, state }) => {
    const imageSrc =
        personality.subtitle && personality.subtitle.startsWith("http")
            ? personality.subtitle
            : null; // Fallback handled inside? Or we use Emoji if null

    // Aura configurations
    const auraVariants = {
        idle: {
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
            boxShadow: "0 0 20px 0px rgba(255, 255, 255, 0.3)",
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        },
        listening: {
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
            boxShadow: "0 0 40px 10px rgba(0, 255, 255, 0.4)", // Cyan/Blue glow
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        },
        speaking: {
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
            boxShadow: "0 0 50px 20px rgba(255, 0, 255, 0.5)", // Pink/Purple glow
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        },
        connecting: {
            rotate: 360,
            scale: 1,
            opacity: 0.5,
            boxShadow: "0 0 30px 5px rgba(255, 255, 0, 0.4)", // Yellow
            transition: { duration: 2, repeat: Infinity, ease: "linear" },
        }
    };

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
            {/* Animated Aura Background */}
            <motion.div
                className="absolute rounded-full w-full h-full bg-blend-screen"
                variants={auraVariants}
                animate={state}
                style={{
                    background: state === 'speaking'
                        ? 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, rgba(0,0,0,0) 70%)'
                        : state === 'listening'
                            ? 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(0,0,0,0) 70%)'
                            : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)'
                }}
            />

            {/* Character Image */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={personality.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">
                        {/* Placeholder logic if needed, currently just gray */}
                        🤖
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveCallAvatar;

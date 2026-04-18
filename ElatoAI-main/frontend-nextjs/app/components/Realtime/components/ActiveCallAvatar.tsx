import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getPersonalityImageSrc } from "@/lib/utils";

interface ActiveCallAvatarProps {
    personality: any;
    state: "listening" | "speaking" | "idle" | "connecting";
}

const ActiveCallAvatar: React.FC<ActiveCallAvatarProps> = ({ personality, state }) => {
    const imageSrc =
        personality.subtitle && (personality.subtitle.startsWith("http") || personality.subtitle.startsWith("/"))
            ? personality.subtitle
            : getPersonalityImageSrc(personality.key || personality.title);

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
            boxShadow: "0 0 40px 10px rgba(0, 255, 255, 0.4)",
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        },
        speaking: {
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
            boxShadow: "0 0 50px 20px rgba(255, 0, 255, 0.5)",
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        },
        connecting: {
            rotate: 360,
            scale: 1,
            opacity: 0.5,
            boxShadow: "0 0 30px 5px rgba(255, 255, 0, 0.4)",
            transition: { duration: 2, repeat: Infinity, ease: "linear" },
        },
    };

    return (
        <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[400px] sm:w-[400px]">
            <motion.div
                className="absolute h-full w-full rounded-full bg-blend-screen"
                variants={auraVariants}
                animate={state}
                style={{
                    background:
                        state === "speaking"
                            ? "radial-gradient(circle, rgba(255,0,255,0.2) 0%, rgba(0,0,0,0) 70%)"
                            : state === "listening"
                                ? "radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(0,0,0,0) 70%)"
                                : "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)",
                }}
            />

            <div className="relative z-10 h-48 w-48 overflow-hidden rounded-full border-4 border-white/10 shadow-2xl sm:h-64 sm:w-64">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={personality.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-6xl">
                        {"🤖"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveCallAvatar;

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { resolveGuideImageSrc } from "@/lib/guideImages";

interface ActiveCallAvatarProps {
    personality: any;
    state: "listening" | "speaking" | "idle" | "connecting";
}

const ActiveCallAvatar: React.FC<ActiveCallAvatarProps> = ({ personality, state }) => {
    const imageSrc = resolveGuideImageSrc(personality);

    const auraVariants = {
        idle: {
            scale: [1, 1.03, 1],
            opacity: [0.24, 0.38, 0.24],
            boxShadow: "0 0 28px 0px rgba(242, 197, 108, 0.24)",
            transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        },
        listening: {
            scale: [1, 1.06, 1],
            opacity: [0.34, 0.56, 0.34],
            boxShadow: "0 0 44px 10px rgba(32, 189, 92, 0.22)",
            transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        },
        speaking: {
            scale: [1, 1.08, 1],
            opacity: [0.42, 0.68, 0.42],
            boxShadow: "0 0 54px 16px rgba(242, 197, 108, 0.28)",
            transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
        },
        connecting: {
            rotate: 360,
            scale: 1,
            opacity: 0.46,
            boxShadow: "0 0 34px 5px rgba(242, 197, 108, 0.22)",
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
                            ? "radial-gradient(circle, rgba(242,197,108,0.20) 0%, rgba(0,0,0,0) 70%)"
                            : state === "listening"
                                ? "radial-gradient(circle, rgba(32,189,92,0.16) 0%, rgba(0,0,0,0) 70%)"
                                : "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 70%)",
                }}
            />

            <div className="relative z-10 h-40 w-40 overflow-hidden rounded-[38px] border border-white/45 bg-white/20 shadow-[0_24px_60px_rgba(72,45,16,0.18)] sm:h-52 sm:w-52">
                <Image
                    src={imageSrc}
                    alt={personality.title}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    );
};

export default ActiveCallAvatar;

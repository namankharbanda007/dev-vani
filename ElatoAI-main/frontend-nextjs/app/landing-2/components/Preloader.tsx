"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    progress: number;
    isLoaded: boolean;
}

export default function Preloader({ progress, isLoaded }: PreloaderProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (isLoaded && progress >= 100) {
            const timer = setTimeout(() => setShow(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, progress]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-divine-saffron"
                >
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 text-4xl font-serif font-bold tracking-widest uppercase md:text-6xl"
                    >
                        SMART मूर्ति
                    </motion.h1>

                    <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-divine-saffron"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    <motion.div className="mt-4 font-sans text-sm tracking-widest opacity-80">
                        {Math.round(progress)}%
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

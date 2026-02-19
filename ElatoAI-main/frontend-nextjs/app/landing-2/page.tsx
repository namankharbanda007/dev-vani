"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Header from "./components/Header";
import HeroPandit from "./components/HeroPandit";
import Preloader from "./components/Preloader";
import Marquee from "./components/Marquee";
import BentoGrid from "./components/BentoGrid";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import DemoForm, { GuestData } from "./components/DemoForm";
import DemoSession from "./components/DemoSession";

export default function LandingPage() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Demo State
    const [showDemoForm, setShowDemoForm] = useState(false);
    const [showDemoSession, setShowDemoSession] = useState(false);
    const [demoMode, setDemoMode] = useState<"call" | "chat">("call");
    const [guestData, setGuestData] = useState<GuestData | null>(null);

    const handleStartDemo = (mode: "call" | "chat") => {
        setDemoMode(mode);
        setShowDemoForm(true);
    };

    const handleFormSubmit = (data: GuestData) => {
        setGuestData(data);
        setShowDemoForm(false);
        setShowDemoSession(true);
    };

    // Smooth scroll configuration
    const lenisOptions = {
        lerp: 0.1,
        duration: 1.5,
        smoothTouch: false,
        smoothWheel: true,
    };

    return (
        <ReactLenis root options={lenisOptions}>
            {/* Demo Components */}
            <DemoForm
                isOpen={showDemoForm}
                onClose={() => setShowDemoForm(false)}
                onSubmit={handleFormSubmit}
                mode={demoMode}
            />

            {showDemoSession && guestData && (
                <DemoSession
                    guestData={guestData}
                    mode={demoMode}
                    onClose={() => setShowDemoSession(false)}
                />
            )}

            <main className="relative min-h-screen bg-soft-paper">

                {/* Preloader - Blocks interaction until loaded */}
                <Preloader progress={loadingProgress} isLoaded={isLoaded} />

                {/* Header - Fixed & Glassmorphic */}
                <Header />

                {/* Hero Section - The Pandit Sequence */}
                {/* Passes loading state up so Preloader can use it */}
                <HeroPandit
                    setLoadingProgress={setLoadingProgress}
                    setIsLoaded={setIsLoaded}
                />

                {/* Content Wrapper with background */}
                <div className="relative z-10 bg-white">
                    {/* Marquee Separator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <Marquee />
                    </motion.div>

                    {/* Bento Grid - Features & Collection */}
                    <div id="collection">
                        <BentoGrid />
                    </div>

                    {/* Demo Section */}
                    <section className="w-full min-h-[60vh] md:h-screen relative flex items-end md:items-center justify-center bg-black">
                        <img
                            src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.png"
                            alt="Smart Murti Demo"
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />

                        {/* Dark gradient overlay for readability on mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/40 md:via-transparent" />

                        {/* Overlay Buttons */}
                        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 md:gap-0 pb-10 md:pb-0 pt-40 md:pt-0">

                            {/* Left Button: Live Call */}
                            <motion.button
                                onClick={() => handleStartDemo("call")}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                            >
                                <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                                    <Phone className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                                </div>
                                <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">Live Call</span>
                            </motion.button>

                            {/* Right Button: Live Chat */}
                            <motion.button
                                onClick={() => handleStartDemo("chat")}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                            >
                                <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">Live Chat</span>
                                <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                                    <MessageCircle className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                                </div>
                            </motion.button>

                        </div>
                    </section>

                    {/* Story Section Placeholder (Could be expanded later) */}
                    <section id="story" className="py-24 px-6 md:px-10 bg-white">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-murti-stone">
                                The Divine Algorithm
                            </h2>
                            <p className="text-xl md:text-2xl text-murti-stone/60 leading-relaxed font-light">
                                We asked ourselves: Can technology have a soul? <br />
                                Smart Murti is the answer. <br />
                                <span className="text-divine-saffron">A bridge between the Vedas and the Verse.</span>
                            </p>
                        </div>
                    </section>

                    {/* Technology Marquee */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <Marquee />
                    </motion.div>

                    {/* Footer */}
                    <div id="contact">
                        <Footer />
                    </div>
                </div>

            </main>
        </ReactLenis>
    );
}

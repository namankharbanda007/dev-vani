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

                    {/* ===== DEMO SECTION ===== */}
                    <section id="demo" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
                        {/* Background Image */}
                        <img
                            src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.png"
                            alt="Smart Murti Demo"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
                        <div className="absolute inset-0" style={{
                            background: "radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.08) 0%, transparent 60%)"
                        }} />

                        {/* Floating Om Symbol */}
                        <motion.div
                            className="absolute top-[15%] left-1/2 -translate-x-1/2 select-none pointer-events-none"
                            animate={{ y: [0, -12, 0], opacity: [0.06, 0.12, 0.06] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="text-[120px] md:text-[180px] font-serif text-white/10">ॐ</span>
                        </motion.div>

                        {/* Content */}
                        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-6"
                            >
                                <span
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))",
                                        border: "1px solid rgba(255,215,0,0.25)",
                                        color: "#FFD700",
                                    }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    Live Demo Available
                                </span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white text-center leading-tight mb-4"
                            >
                                Experience{" "}
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, #FFD700, #FF8C00, #FFD700)",
                                    }}
                                >
                                    Pandit Ji
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-base md:text-lg text-white/50 text-center max-w-xl mb-14 font-light leading-relaxed"
                            >
                                Get personalized astrological guidance in a 2-minute live session.
                                <br className="hidden md:block" />
                                Choose your preferred way to connect.
                            </motion.p>

                            {/* Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                                {/* Live Call Card */}
                                <motion.button
                                    onClick={() => handleStartDemo("call")}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group relative overflow-hidden rounded-2xl p-[1px] cursor-pointer"
                                >
                                    {/* Animated border gradient */}
                                    <div className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: "linear-gradient(135deg, #25D366, rgba(255,215,0,0.5), #25D366)",
                                        }}
                                    />
                                    <div className="relative rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4"
                                        style={{
                                            background: "linear-gradient(165deg, rgba(20,30,25,0.95), rgba(10,15,12,0.98))",
                                        }}
                                    >
                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-1 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.05))",
                                                border: "1px solid rgba(37,211,102,0.3)",
                                            }}
                                        >
                                            <Phone className="w-7 h-7 text-[#25D366]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-wide">Live Call</h3>
                                        <p className="text-sm text-white/40 leading-relaxed">
                                            Talk directly with Pandit Ji in real-time voice. Ask your questions and get instant spiritual guidance.
                                        </p>
                                        {/* CTA hints */}
                                        <div className="mt-2 flex items-center gap-2 text-[#25D366] text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span>Start Call</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Live Chat Card */}
                                <motion.button
                                    onClick={() => handleStartDemo("chat")}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group relative overflow-hidden rounded-2xl p-[1px] cursor-pointer"
                                >
                                    {/* Animated border gradient */}
                                    <div className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: "linear-gradient(135deg, #53bdeb, rgba(255,215,0,0.5), #53bdeb)",
                                        }}
                                    />
                                    <div className="relative rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4"
                                        style={{
                                            background: "linear-gradient(165deg, rgba(15,25,35,0.95), rgba(8,15,22,0.98))",
                                        }}
                                    >
                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-1 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(83,189,235,0.3)]"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(83,189,235,0.15), rgba(83,189,235,0.05))",
                                                border: "1px solid rgba(83,189,235,0.3)",
                                            }}
                                        >
                                            <MessageCircle className="w-7 h-7 text-[#53bdeb]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-wide">Live Chat</h3>
                                        <p className="text-sm text-white/40 leading-relaxed">
                                            Chat with Pandit Ji via text in a WhatsApp-style interface. Perfect for detailed kundali readings.
                                        </p>
                                        {/* CTA hint */}
                                        <div className="mt-2 flex items-center gap-2 text-[#53bdeb] text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span>Start Chat</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Bottom trust strip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="mt-14 flex flex-wrap items-center justify-center gap-6 text-white/25 text-xs tracking-wider"
                            >
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                    End-to-end Encrypted
                                </span>
                                <span>•</span>
                                <span>2-Minute Free Demo</span>
                                <span>•</span>
                                <span>No Login Required</span>
                            </motion.div>
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

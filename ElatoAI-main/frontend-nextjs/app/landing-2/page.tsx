"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Header from "./components/Header";
import HeroPandit from "./components/HeroPandit";
import Preloader from "./components/Preloader";
import Marquee from "./components/Marquee";
import BentoGrid from "./components/BentoGrid";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Smooth scroll configuration
    const lenisOptions = {
        lerp: 0.1,
        duration: 1.5,
        smoothTouch: false,
        smoothWheel: true,
    };

    return (
        <ReactLenis root options={lenisOptions}>
            <main className="relative min-h-screen bg-soft-paper overflow-hidden">

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

"use client";

import { useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Header from "@/app/landing-2/components/Header";
import HeroPandit from "@/app/landing-2/components/HeroPandit";
import Preloader from "@/app/landing-2/components/Preloader";

export default function HomeHeroWrapper() {
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
            {/* Preloader - Blocks interaction until loaded */}
            <Preloader progress={loadingProgress} isLoaded={isLoaded} />

            {/* Header - Fixed & Glassmorphic */}
            <Header />

            {/* Hero Section - The Pandit Sequence */}
            <HeroPandit
                setLoadingProgress={setLoadingProgress}
                setIsLoaded={setIsLoaded}
            />
        </ReactLenis>
    );
}

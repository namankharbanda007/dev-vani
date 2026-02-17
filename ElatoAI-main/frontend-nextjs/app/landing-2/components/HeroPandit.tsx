"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePanditSequence } from "@/hooks/usePanditSequence";

gsap.registerPlugin(ScrollTrigger);

interface HeroPanditProps {
    setLoadingProgress: (progress: number) => void;
    setIsLoaded: (loaded: boolean) => void;
}

export default function HeroPandit({ setLoadingProgress, setIsLoaded }: HeroPanditProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLDivElement>(null);

    // 240 frames provided by user
    const frameCount = 240;

    const { progress, isLoaded, drawFrame } = usePanditSequence({
        canvasRef,
        frameCount,
        path: "/pandit-hero/", // Location in public folder
        triggerRef: sectionRef,
    });

    // Sync internal loading state with parent (Preloader)
    useEffect(() => {
        setLoadingProgress(progress);
        setIsLoaded(isLoaded);
    }, [progress, isLoaded, setLoadingProgress, setIsLoaded]);

    // GSAP ScrollTrigger Setup
    useEffect(() => {
        if (!isLoaded || !sectionRef.current || !canvasRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrubbing
                },
            });

            // 1. Frame Scrubbing Logic
            const playhead = { frame: 0 };
            tl.to(playhead, {
                frame: frameCount - 1,
                ease: "none",
                duration: 4, // Takes up 80% of the timeline
                onUpdate: () => {
                    drawFrame(Math.floor(playhead.frame));
                },
            });

            // 2. Text Animations
            // "TRADITION REIMAGINED" fades out as Namaste happens
            tl.to(textRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            }, 0); // Start at beginning

            // "SMART MURTI" fades in when Namaste is complete (approx 80% scroll)
            tl.fromTo(subTextRef.current,
                { opacity: 0, scale: 0.9, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
                3 // Start later in the timeline
            );

            // 3. Camera Push-in Effect (Simulated via Canvas Scale)
            // Only apply on desktop (landscape) or reduce intensity on mobile
            const isMobile = window.innerWidth < 768; // Simple check

            if (!isMobile) {
                tl.to(canvasRef.current, {
                    scale: 1.1,
                    duration: 2,
                    ease: "power1.inOut"
                }, 2);
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [isLoaded, drawFrame, frameCount]);

    // Handle Resize for Canvas
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Redraw current frame on resize would be ideal, but for now simple resize
                // drawFrame(currentFrameIndex) - (Handling this would require tracking current frame ref)
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Init

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={sectionRef} className="relative w-full h-[175vh] md:h-[250vh] bg-[#cecece]">
            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">

                {/* The Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 w-full h-full object-contain"
                />

                {/* Text Layer 1: Start */}
                <div
                    ref={textRef}
                    className="relative z-20 text-center pointer-events-none"
                >
                    <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tight text-[#2A2A2A] opacity-50">
                        TRADITION <br /> REIMAGINED
                    </h1>
                </div>

                {/* Text Layer 2: End */}
                <div
                    ref={subTextRef}
                    className="absolute z-20 text-center pointer-events-none opacity-0"
                >
                    <h1 className="text-6xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-divine-saffron to-orange-600 drop-shadow-2xl">
                        SMART MURTI
                    </h1>
                    <p className="text-murti-stone text-xl tracking-[0.2em] mt-4 font-sans uppercase">
                        Design • Devotion • Dharma
                    </p>
                </div>

            </div>
        </div>
    );
}

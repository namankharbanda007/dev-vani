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

export default function HeroPandit({
    setLoadingProgress,
    setIsLoaded,
}: HeroPanditProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const frameCount = 240;

    const { progress, isLoaded, drawFrame } = usePanditSequence({
        canvasRef,
        frameCount,
        path: "/pandit-hero/",
        triggerRef: sectionRef,
    });

    useEffect(() => {
        setLoadingProgress(progress);
        setIsLoaded(isLoaded);
    }, [progress, isLoaded, setLoadingProgress, setIsLoaded]);

    useEffect(() => {
        if (!isLoaded || !sectionRef.current || !canvasRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                },
            });

            const playhead = { frame: 0 };
            tl.to(playhead, {
                frame: frameCount - 1,
                ease: "none",
                duration: 4,
                onUpdate: () => {
                    drawFrame(Math.floor(playhead.frame));
                },
            });

            tl.to(
                textRef.current,
                {
                    opacity: 0,
                    y: -50,
                    duration: 1,
                    ease: "power2.out",
                },
                0
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [isLoaded, drawFrame, frameCount]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={sectionRef} className="relative h-[175vh] w-full bg-[#cecece] md:h-[250vh]">
            <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 h-full w-full object-contain"
                />

                <div
                    ref={textRef}
                    className="relative z-20 text-center pointer-events-none"
                >
                    <h1 className="text-5xl font-serif font-bold tracking-tight text-[#241A14] opacity-55 md:text-8xl">
                        TALK TO YOUR <br /> SMART PANDIT
                    </h1>
                </div>
            </div>
        </div>
    );
}

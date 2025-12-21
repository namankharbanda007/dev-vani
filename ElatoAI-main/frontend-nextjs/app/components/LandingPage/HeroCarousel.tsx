"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Character images with their display names extracted from filenames
const characters = [
    { src: "/personality/CharacterS/Astrologer.png", name: "Astrologer" },
    { src: "/personality/CharacterS/Career Counsoler.png", name: "Career Counselor" },
    { src: "/personality/CharacterS/Chef.jpg", name: "Chef" },
    { src: "/personality/CharacterS/Fitness Coach.png", name: "Fitness Coach" },
    { src: "/personality/CharacterS/Gift guru.png", name: "Gift Guru" },
    { src: "/personality/CharacterS/Spiritual Guide.png", name: "Spiritual Guide" },
    { src: "/personality/CharacterS/Sports comentator.png", name: "Sports Commentator" },
    { src: "/personality/CharacterS/The Debate Partner.png", name: "Debate Partner" },
    { src: "/personality/CharacterS/The Interviwer.png", name: "Interviewer" },
    { src: "/personality/CharacterS/Travel Guide.png", name: "Travel Guide" },
    { src: "/personality/CharacterS/advocate.png", name: "Advocate" },
    { src: "/personality/CharacterS/dadimaa (storyteller).png", name: "Dadimaa" },
    { src: "/personality/CharacterS/exam coach.png", name: "Exam Coach" },
    { src: "/personality/CharacterS/old days friend.png", name: "Old Days Friend" },
    { src: "/personality/CharacterS/tech translator.png", name: "Tech Translator" },
    { src: "/personality/CharacterS/the Phonotics Parrot.png", name: "Phonetics Parrot" },
    { src: "/personality/CharacterS/time traveler.png", name: "Time Traveler" },
    { src: "/personality/CharacterS/Dino Historian (Dinosaur).png", name: "Dino Historian" },
];

interface HeroCarouselSlotProps {
    position: "left" | "right";
}

export function HeroCarouselSlot({ position }: HeroCarouselSlotProps) {
    const startIndex = position === "left" ? 0 : Math.floor(characters.length / 2);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % characters.length);
                setIsTransitioning(false);
            }, 300);
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const character = characters[currentIndex];
    const gradientColors = position === "left"
        ? "from-purple-200 to-pink-200"
        : "from-amber-200 to-orange-200";
    const textColor = position === "left" ? "text-purple-700" : "text-amber-700";

    return (
        <div className="flex flex-col items-center">
            <div
                className={`relative transition-all duration-300 ease-in-out transform hover:scale-105 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
            >
                <div className={`absolute inset-0 bg-gradient-to-b ${gradientColors} rounded-full blur-2xl opacity-40`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/50">
                    <Image
                        src={character.src}
                        alt={character.name}
                        width={260}
                        height={260}
                        className="relative z-10 rounded-2xl object-cover"
                        style={{ width: 260, height: 260 }}
                    />
                </div>
            </div>
            <p
                className={`mt-4 text-lg font-semibold ${textColor} transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
            >
                {character.name}
            </p>
        </div>
    );
}

export default function HeroCarousel() {
    return null; // Not used anymore, keeping for backwards compatibility
}

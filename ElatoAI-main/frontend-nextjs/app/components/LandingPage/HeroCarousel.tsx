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

export default function HeroCarousel() {
    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(Math.floor(characters.length / 2));
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);

            setTimeout(() => {
                setLeftIndex((prev) => (prev + 1) % characters.length);
                setRightIndex((prev) => (prev + 1) % characters.length);
                setIsTransitioning(false);
            }, 300);
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const leftCharacter = characters[leftIndex];
    const rightCharacter = characters[rightIndex];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-4xl mt-12">
            {/* Left Carousel */}
            <div className="flex flex-col items-center">
                <div
                    className={`relative transition-all duration-300 ease-in-out transform hover:scale-105 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-200 to-pink-200 rounded-full blur-2xl opacity-40"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/50">
                        <Image
                            src={leftCharacter.src}
                            alt={leftCharacter.name}
                            width={260}
                            height={260}
                            className="relative z-10 rounded-2xl object-cover"
                            style={{ width: 260, height: 260 }}
                        />
                    </div>
                </div>
                <p
                    className={`mt-4 text-lg font-semibold text-purple-700 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    {leftCharacter.name}
                </p>

                {/* Carousel Dots */}
                <div className="flex gap-1.5 mt-3">
                    {characters.slice(0, 6).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === leftIndex % 6 ? 'bg-purple-600 w-4' : 'bg-purple-300'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Carousel */}
            <div className="flex flex-col items-center">
                <div
                    className={`relative transition-all duration-300 ease-in-out transform hover:scale-105 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-orange-200 rounded-full blur-2xl opacity-40"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/50">
                        <Image
                            src={rightCharacter.src}
                            alt={rightCharacter.name}
                            width={260}
                            height={260}
                            className="relative z-10 rounded-2xl object-cover"
                            style={{ width: 260, height: 260 }}
                        />
                    </div>
                </div>
                <p
                    className={`mt-4 text-lg font-semibold text-amber-700 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    {rightCharacter.name}
                </p>

                {/* Carousel Dots */}
                <div className="flex gap-1.5 mt-3">
                    {characters.slice(0, 6).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === rightIndex % 6 ? 'bg-amber-600 w-4' : 'bg-amber-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

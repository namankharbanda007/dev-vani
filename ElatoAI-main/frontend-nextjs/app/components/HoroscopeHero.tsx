"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { getSunSign } from "@/lib/astrology";

interface HoroscopeHeroProps {
    currentUser?: IUser;
}

const HoroscopeHero: React.FC<HoroscopeHeroProps> = ({ currentUser }) => {
    const [loading, setLoading] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState<any>(null);

    // Calculate Zodiac Data using shared library
    const { name: sign, symbol, index } = useMemo(() => {
        const metadata = currentUser?.user_info?.user_metadata as IUserMetadata | undefined;
        let birthDateString = metadata?.birth_date;
        // Default to Aries date if missing
        const date = birthDateString ? new Date(birthDateString) : new Date("2000-03-21");
        const sunSign = getSunSign(date);

        // Map library sign name to index for assets (Aries -> 01, etc.)
        const indices: { [key: string]: string } = {
            'Aries': '01', 'Taurus': '02', 'Gemini': '03', 'Cancer': '04',
            'Leo': '05', 'Virgo': '06', 'Libra': '07', 'Scorpio': '08',
            'Sagittarius': '09', 'Capricorn': '10', 'Aquarius': '11', 'Pisces': '12'
        };

        return {
            name: sunSign.name,
            symbol: sunSign.symbol,
            index: indices[sunSign.name] || '01'
        };
    }, [currentUser]);

    // Fetch Horoscope Data
    useEffect(() => {
        const fetchHoroscope = async () => {
            const metadata = currentUser?.user_info?.user_metadata as IUserMetadata | undefined;
            const cached = metadata?.daily_horoscope;
            // Check cache logic here... (simplified for brevity, reuse existing if valid)
            // But we should also send timezone now if we want to be accurate, 
            // though for the "Hero" we might just want to show *something*.

            // For now, let's just respect the existing cache if it exists for "today" (local)
            // We can add more robust check later.

            if (cached && cached.sign === sign) {
                // Simple check: is it "today"? 
                // We will just use it to avoid flickering.
                setHoroscopeData(cached);
                return;
            }

            setLoading(true);
            try {
                // Pass timezone
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const res = await fetch(`/api/horoscope/daily?sign=${sign}&timezone=${tz}`);
                if (res.ok) {
                    const data = await res.json();
                    setHoroscopeData(data);
                }
            } catch (error) {
                console.error("Failed to fetch horoscope", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && sign) {
            fetchHoroscope();
        }
    }, [currentUser, sign]);

    const luckyNumber = horoscopeData?.lucky_number || "3";
    const luckyTime = horoscopeData?.lucky_time || "04:26 PM";
    const mood = horoscopeData?.mood || "😍";
    const colorName = horoscopeData?.lucky_color || "Coral";

    return (
        <div className="w-full relative overflow-hidden rounded-[30px] p-[1px] shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] group">
            {/* Animated Glow Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-[30px] opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"></div>

            {/* Inner Content Container */}
            <div className="relative z-10 bg-[#0F111A] rounded-[29px] w-full h-full overflow-hidden">

                {/* Nebula Background Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[100%] bg-purple-900/30 blur-[100px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[80%] bg-blue-900/20 blur-[80px] rounded-full mix-blend-screen"></div>
                    <div className="absolute top-[20%] right-[30%] w-[40px] h-[2px] bg-white opacity-20 rotate-45 transform"></div>
                    {/* Static Stars */}
                    <div className="absolute top-[10%] left-[10%] w-[2px] h-[2px] bg-white opacity-80 rounded-full animate-pulse"></div>
                    <div className="absolute top-[25%] right-[15%] w-[3px] h-[3px] bg-white opacity-60 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute bottom-[20%] left-[30%] w-[2px] h-[2px] bg-white opacity-70 rounded-full animate-pulse delay-150"></div>
                </div>

                <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between p-6 md:p-8 lg:p-10 gap-8 min-h-[300px]">

                    {/* LEFT COLUMN: Data & Text */}
                    <div className="flex-1 w-full flex flex-col justify-between h-full space-y-8">

                        {/* Heading */}
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans text-white font-medium tracking-wide flex items-center gap-2">
                                Your Daily horoscope is ready!
                                {loading && <Loader2 className="h-6 w-6 animate-spin text-purple-400" />}
                            </h2>
                            <p className="text-purple-300/80 text-sm font-light uppercase tracking-widest">{sign} • {(currentUser?.user_info?.user_metadata as IUserMetadata)?.rashi || "Daily Insights"}</p>

                            {horoscopeData?.content && (
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mt-2 italic border-l-2 border-purple-500/50 pl-4 py-1">
                                    "{horoscopeData.content}"
                                </p>
                            )}
                        </div>

                        {/* Data Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">

                            {/* Lucky Colours */}
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-300 text-sm md:text-base font-light tracking-wider">Lucky Colour</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FF7F50] shadow-[0_0_15px_rgba(255,127,80,0.4)] border border-white/10"></div>
                                    <span className="text-white font-light">{colorName}</span>
                                </div>
                            </div>

                            {/* Mood */}
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-300 text-sm md:text-base font-light tracking-wider">Mood of day</span>
                                <div className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(255,200,0,0.3)] animate-pulse">
                                    {mood}
                                </div>
                            </div>

                            {/* Lucky Number */}
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-300 text-sm md:text-base font-light tracking-wider">Lucky Number</span>
                                <span className="text-3xl md:text-5xl font-sans text-white font-light">
                                    {luckyNumber}
                                </span>
                            </div>

                            {/* Lucky Time */}
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-300 text-sm md:text-base font-light tracking-wider">Lucky Time</span>
                                <span className="text-2xl md:text-4xl font-sans text-white font-light whitespace-nowrap">
                                    {luckyTime}
                                </span>
                            </div>
                        </div>

                        {/* Desktop CTA Button (Hidden on Mobile, shown on Large) */}
                        <div className="hidden lg:block pt-4">
                            {/* Link Persistence: Pass the current sign */}
                            <Link href={`/horoscope?sign=${sign}`}>
                                <button className="flex items-center justify-between w-full max-w-lg bg-[#FFD700] hover:bg-[#FFC000] text-black font-medium text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:-translate-y-1">
                                    <span>View your Detailed Horoscope</span>
                                    <ChevronRight className="w-6 h-6 text-black" strokeWidth={2.5} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visual & Avatar */}
                    <div className="w-full lg:w-auto flex flex-col items-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">

                            {/* Glowing Orbit Rings */}
                            <div className="absolute inset-0 rounded-full border border-yellow-400/30 animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 rounded-full border border-purple-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>

                            {/* Zodiac Sign Bubble */}
                            <div className="absolute top-[10%] left-[-10%] z-20 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.5)] border-2 border-white animate-bounce-slow">
                                <span className="text-3xl md:text-4xl text-black">{symbol}</span>
                            </div>

                            {/* Avatar Container */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-[0_0_50px_rgba(255,215,0,0.2)] bg-black">
                                <Image
                                    src={`/assets/horoscope-${index}.webp`}
                                    alt={`Horoscope Avatar for ${sign}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Mobile CTA Button (Shown on Mobile/Tablet, hidden on Desktop) */}
                        <div className="block lg:hidden w-full mt-8">
                            <Link href={`/horoscope?sign=${sign}`}>
                                <button className="flex items-center justify-between w-full bg-[#FFD700] hover:bg-[#FFC000] text-black font-medium text-lg px-6 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                    <span>View Detailed Horoscope</span>
                                    <ChevronRight className="w-6 h-6 text-black" strokeWidth={2.5} />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default HoroscopeHero;


"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { ChevronLeft, Share2, Briefcase, Heart, MessageCircle, Phone, Loader2, DollarSign, Activity, Plane, Home, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getSunSign } from "@/lib/astrology";

// Zodiac Data Helper (Centralized)
// We could move this to a shared constant file too
const zodiacSigns = [
    { name: "Aries", index: "01", symbol: "♈" },
    { name: "Taurus", index: "02", symbol: "♉" },
    { name: "Gemini", index: "03", symbol: "♊" },
    { name: "Cancer", index: "04", symbol: "♋" },
    { name: "Leo", index: "05", symbol: "♌" },
    { name: "Virgo", index: "06", symbol: "♍" },
    { name: "Libra", index: "07", symbol: "♎" },
    { name: "Scorpio", index: "08", symbol: "♏" },
    { name: "Sagittarius", index: "09", symbol: "♐" },
    { name: "Capricorn", index: "10", symbol: "♑" },
    { name: "Aquarius", index: "11", symbol: "♒" },
    { name: "Pisces", index: "12", symbol: "♓" },
];

function HoroscopeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    // URL State
    const signParam = searchParams.get('sign');
    const dateParam = searchParams.get('date') || 'Today';

    const [activeSign, setActiveSign] = useState(zodiacSigns[0]);

    const [horoscopeData, setHoroscopeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userSign, setUserSign] = useState<string | null>(null);

    // Sync State with URL
    useEffect(() => {
        if (signParam) {
            const found = zodiacSigns.find(z => z.name === signParam);
            if (found) setActiveSign(found);
        }
    }, [signParam]);

    // Initial User Fetch (to set default sign if URL is empty)
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbUser } = await supabase
                    .from("users")
                    .select("user_info")
                    .eq("user_id", user.id)
                    .single();

                if (dbUser) {
                    const metadata = (dbUser.user_info as any)?.user_metadata || {};
                    const birthDate = metadata.birth_date ? new Date(metadata.birth_date) : new Date("2000-03-21");
                    const mySign = getSunSign(birthDate).name;
                    setUserSign(mySign);

                    // If no sign in URL, set it to user's sign
                    if (!signParam) {
                        router.replace(`/horoscope?sign=${mySign}&date=${dateParam}`);
                    }
                }
            }
        };
        fetchUser();
    }, [supabase, router, signParam, dateParam]);

    // Fetch Horoscope
    useEffect(() => {
        const fetchHoroscope = async () => {
            setLoading(true);
            setError(null);
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const params = new URLSearchParams();
                params.append('sign', activeSign.name);
                params.append('date', dateParam);
                params.append('timezone', tz);

                const res = await fetch(`/api/horoscope/daily?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setHoroscopeData(data);
                } else {
                    const errorText = await res.text();
                    let errorMessage = "Failed to fetch horoscope";
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.error || errorJson.details || errorMessage;
                    } catch (e) {
                        // erratic response
                    }
                    throw new Error(errorMessage);
                }
            } catch (error: any) {
                console.error(error);
                setError(error.message || "Unable to connect to the stars. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have a valid active sign
        if (activeSign) {
            fetchHoroscope();
        }
    }, [activeSign, dateParam]);

    const handleSignChange = (sign: typeof zodiacSigns[0]) => {
        setActiveSign(sign);
        router.push(`/horoscope?sign=${sign.name}&date=${dateParam}`);
    };

    const handleTabChange = (tab: string) => {
        router.push(`/horoscope?sign=${activeSign.name}&date=${tab}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Daily Horoscope for ${activeSign.name}`,
                    text: `My Lucky Number today is ${horoscopeData?.lucky_number}! ✨ Check yours on Smart Murti.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback
            const text = `Check out my daily horoscope! ✨\nSign: ${activeSign.name}\nLucky Number: ${horoscopeData?.lucky_number}`;
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        }
    };

    const handleBack = () => {
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push('/home');
        }
    };

    const displayDate = new Date().toLocaleDateString("en-GB", {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <Activity className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Cosmic Connection Interrupted</h2>
                <p className="text-gray-500 max-w-xs">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-28">
            {/* 1. Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full" aria-label="Go Back">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button onClick={() => router.push('/home')} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Go Home">
                            <Home className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>

                    <h1 className="text-lg font-semibold text-gray-900">Daily Horoscope</h1>

                    <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors" aria-label="Share Horoscope">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-8 space-y-8 pt-6">

                {/* 2. Zodiac Selector (Grid on Desktop, Scroll on Mobile) */}
                <div className="relative">
                    {/* Mobile Scroll */}
                    <div className="flex md:hidden overflow-x-auto gap-4 pb-4 no-scrollbar items-center">
                        {zodiacSigns.map((sign) => {
                            const isActive = activeSign.name === sign.name;
                            return (
                                <button
                                    key={sign.name}
                                    onClick={() => handleSignChange(sign)}
                                    className="flex flex-col items-center gap-2 min-w-[64px] group"
                                    aria-selected={isActive}
                                    aria-label={`Select ${sign.name}`}
                                >
                                    <div className={`
                                        relative w-16 h-16 rounded-full p-1 transition-all duration-300
                                        ${isActive ? 'bg-[#FFD700] scale-110 shadow-lg' : 'bg-transparent group-active:scale-95'}
                                    `}>
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative border border-gray-100">
                                            <Image
                                                src={`/assets/horoscope-${sign.index}.webp`}
                                                alt={sign.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                                        {sign.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-6 lg:grid-cols-12 gap-4">
                        {zodiacSigns.map((sign) => {
                            const isActive = activeSign.name === sign.name;
                            return (
                                <button
                                    key={sign.name}
                                    onClick={() => handleSignChange(sign)}
                                    className={`
                                        flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200
                                        ${isActive ? 'bg-white shadow-md ring-2 ring-[#FFD700]' : 'hover:bg-gray-100'}
                                    `}
                                    aria-selected={isActive}
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={`/assets/horoscope-${sign.index}.webp`}
                                            alt={sign.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                                        {sign.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Date Toggle */}
                <div className="max-w-md mx-auto bg-gray-200/50 p-1.5 rounded-xl flex items-center justify-between text-sm font-medium">
                    {['Yesterday', 'Today', 'Tomorrow'].map((tab) => {
                        const isActive = dateParam === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`
                                    flex-1 py-2.5 text-center rounded-lg transition-all duration-300
                                    ${isActive ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* 4. Daily Summary Card */}
                <div className="w-full relative overflow-hidden rounded-[32px] bg-[#0F111A] text-white p-8 shadow-2xl min-h-[380px]">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-black pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] opacity-10 blur-[100px] rounded-full"></div>

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mb-4" />
                            <p className="text-gray-300 text-sm font-light tracking-widest uppercase">Consulting the Stars...</p>
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">

                            {/* Left Content */}
                            <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                                <div>
                                    <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
                                        <span className="text-xs font-medium tracking-widest text-gray-200 uppercase">
                                            {activeSign.name} • {horoscopeData?.date || displayDate}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-sans font-medium leading-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your Cosmic</span> <br />
                                        <span className="text-[#FFD700]">Insight</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full max-w-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Colour</p>
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-[#FF7F50] shadow-[0_0_10px_#FF7F50]"></div>
                                            <span className="text-lg font-light">{horoscopeData?.lucky_color || "--"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Mood</p>
                                        <p className="text-3xl">{horoscopeData?.mood || "✨"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Number</p>
                                        <p className="text-4xl font-light text-[#FFD700]">{horoscopeData?.lucky_number || "--"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Time</p>
                                        <p className="text-xl font-light whitespace-nowrap">{horoscopeData?.lucky_time || "--"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Avatar */}
                            <div className="relative w-56 h-56 md:w-80 md:h-80 flex-shrink-0">
                                {/* Orbits */}
                                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]"></div>
                                <div className="absolute -inset-4 rounded-full border border-white/5 animate-[spin_30s_linear_infinite_reverse]"></div>

                                {/* Zodiac Badge */}
                                <div className="absolute top-0 right-0 z-20 w-16 h-16 bg-[#FFD700] text-black rounded-full flex items-center justify-center border-4 border-[#0F111A] shadow-lg transform -rotate-12">
                                    <span className="font-bold text-2xl">{activeSign.symbol}</span>
                                </div>

                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 relative bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                    <Image
                                        src={`/assets/horoscope-${activeSign.index}.webp`}
                                        alt={activeSign.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Detailed Insight Cards (Responsive Grid) */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Horoscope Readings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-red-500"><Heart className="w-5 h-5 fill-current" /></div>
                                    <span className="font-bold text-gray-900">Love</span>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {horoscopeData?.love?.percentage ?? "--"}%
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {horoscopeData?.love?.text || "No specific insight for this aspect today."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><Briefcase className="w-5 h-5 fill-current" /></div>
                                    <span className="font-bold text-gray-900">Career</span>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {horoscopeData?.career?.percentage ?? "--"}%
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {horoscopeData?.career?.text || "No specific insight for this aspect today."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500"><DollarSign className="w-5 h-5" /></div>
                                    <span className="font-bold text-gray-900">Money</span>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {horoscopeData?.money?.percentage ?? "--"}%
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {horoscopeData?.money?.text || "No specific insight for this aspect today."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-50 rounded-lg text-teal-500"><Activity className="w-5 h-5" /></div>
                                    <span className="font-bold text-gray-900">Health</span>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {horoscopeData?.health?.percentage ?? "--"}%
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {horoscopeData?.health?.text || "No specific insight for this aspect today."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Plane className="w-5 h-5" /></div>
                                    <span className="font-bold text-gray-900">Travel</span>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {horoscopeData?.travel?.percentage ?? "--"}%
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {horoscopeData?.travel?.text || "No specific insight for this aspect today."}
                            </p>
                        </div>
                    </div>
                </div>

            </main>

            {/* 6. Sticky Bottom Action Bar */}
            <div className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-md mx-auto">
                <div className="flex gap-4">
                    <button className="flex-1 bg-[#FFD700] hover:bg-[#FFC000] text-black py-3.5 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 transition-transform active:scale-95 border-2 border-white/10">
                        <MessageCircle className="w-5 h-5" />
                        Chat with Astrologer
                    </button>
                    <button className="flex-1 bg-[#0F111A] text-white hover:bg-black py-3.5 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/20 transition-transform active:scale-95 border-2 border-white/10">
                        <Phone className="w-5 h-5" />
                        Call with Astrologer
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

// Wrap in Suspense for SearchParams
export default function DetailedHoroscopePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
            <HoroscopeContent />
        </Suspense>
    );
}

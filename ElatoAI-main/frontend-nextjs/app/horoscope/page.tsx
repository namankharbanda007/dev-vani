"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Share2, Briefcase, Heart, MessageCircle, Phone, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Zodiac Data Helper (Centralized logic)
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

const getZodiacFromDate = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date("2000-03-21");
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0];
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1];
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2];
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3];
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4];
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5];
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6];
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7];
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8];
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9];
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10];
    return zodiacSigns[11];
};

export default function DetailedHoroscopePage() {
    const router = useRouter();
    const supabase = createClient();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeSign, setActiveSign] = useState(zodiacSigns[0]);
    const [activeTab, setActiveTab] = useState("Today");
    const [horoscopeData, setHoroscopeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Current Date Formatted (e.g., 06-02-2026)
    const formattedDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbUser } = await supabase
                    .from("users")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (dbUser) {
                    setCurrentUser(dbUser);
                    // Determine initial sign from user metadata
                    const metadata = dbUser.user_info?.user_metadata || {};
                    const birthDate = metadata.birth_date;
                    const signData = getZodiacFromDate(birthDate);
                    setActiveSign(signData);

                    // Use cached horoscope if available and for today
                    // Note: In a real app we might fetch specific history for "Yesterday"
                    const cached = metadata.daily_horoscope;
                    const today = new Date().toISOString().split('T')[0];
                    if (cached && cached.date === today && activeTab === 'Today') {
                        setHoroscopeData(cached);
                        setLoading(false);
                    } else {
                        // If no cache or tab change, fetch (mock fetch for yesterday/tomorrow for now)
                        fetchNewHoroscope();
                    }
                }
            } else {
                setLoading(false);
            }
        };
        fetchUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchNewHoroscope = async () => {
        setLoading(true);
        // In a real implementation, we would pass the date/sign to the API
        // For now, we reuse the daily API which defaults to "Today" for the user
        try {
            const res = await fetch('/api/horoscope/daily');
            if (res.ok) {
                const data = await res.json();
                setHoroscopeData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch if tab changes (simulating yesterday/tomorrow)
    useEffect(() => {
        if (currentUser) {
            // For MVP: We only fully support "Today" via API. 
            // Yesterday/Tomorrow could be mocked or implemented later.
            // We just trigger a reload to show interactivity.
            fetchNewHoroscope();
        }
    }, [activeTab]);

    const handleShare = () => {
        const text = `Check out my daily horoscope on Smart Murti! ✨\nSign: ${activeSign.name}\nLucky Number: ${horoscopeData?.lucky_number}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* 1. Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Daily Horoscope</h1>
                    <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pb-8 space-y-6">

                {/* 2. Zodiac Selector */}
                <div className="relative pt-4">
                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar items-center">
                        {zodiacSigns.map((sign) => {
                            const isActive = activeSign.name === sign.name;
                            return (
                                <button
                                    key={sign.name}
                                    onClick={() => setActiveSign(sign)}
                                    className="flex flex-col items-center gap-2 min-w-[64px] transition-all"
                                >
                                    <div className={`
                                        relative w-16 h-16 rounded-full p-1 transition-all duration-300
                                        ${isActive ? 'bg-[#FFD700] scale-110 shadow-lg' : 'bg-transparent hover:bg-gray-100'}
                                    `}>
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
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
                </div>

                {/* 3. Date Toggle */}
                <div className="bg-gray-100 p-1 rounded-xl flex items-center justify-between text-sm font-medium">
                    {['Yesterday', 'Today', 'Tomorrow'].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    flex-1 py-2 text-center rounded-lg transition-all duration-300
                                    ${isActive ? 'bg-white shadow-sm text-black border-b-2 border-[#FFD700]' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* 4. Daily Summary Card */}
                <div className="w-full relative overflow-hidden rounded-[24px] bg-[#0F111A] text-white p-6 shadow-xl">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 pointer-events-none"></div>
                    <div className="absolute top-[10%] left-[10%] w-[2px] h-[2px] bg-white opacity-80 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-[3px] h-[3px] bg-white opacity-60 rounded-full animate-pulse delay-75"></div>

                    <div className="relative z-10">
                        {/* Date Header */}
                        <div className="flex justify-center mb-6">
                            <span className="text-xs font-medium tracking-widest text-purple-300 bg-white/5 py-1 px-4 rounded-full border border-white/10 uppercase">
                                {formattedDate}
                            </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-sans font-medium mb-6 text-center">
                            Your Daily horoscope is ready!
                        </h2>

                        <div className="flex gap-6">
                            {/* Left Data Grid */}
                            <div className="flex-1 grid grid-cols-2 gap-y-6">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Colours</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#FF7F50] border border-white/20"></div>
                                        <div className="w-6 h-6 rounded-full bg-[#008080] border border-white/20"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Mood of day</p>
                                    <p className="text-2xl">{horoscopeData?.mood || "😍"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Number</p>
                                    <p className="text-2xl font-light">{horoscopeData?.lucky_number || "3"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Time</p>
                                    <p className="text-lg font-light whitespace-nowrap">{horoscopeData?.lucky_time || "04:26 PM"}</p>
                                </div>
                            </div>

                            {/* Right Avatar */}
                            <div className="relative w-28 h-28 flex-shrink-0">
                                {/* Glow Ring */}
                                <div className="absolute -inset-1 rounded-full border border-yellow-400/50 animate-[spin_10s_linear_infinite]"></div>
                                {/* Zodiac Bubble */}
                                <div className="absolute -top-2 -left-2 z-20 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-[#0F111A]">
                                    <span className="text-black font-bold text-sm">{activeSign.symbol}</span>
                                </div>
                                {/* Image */}
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 relative">
                                    <Image
                                        src={`/assets/horoscope-${activeSign.index}.webp`}
                                        alt={activeSign.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Detailed Insight Cards */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Daily Horoscope</h3>

                    {/* Love Card */}
                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-red-600">
                                <Heart className="w-5 h-5 fill-current" />
                                <span className="font-semibold text-lg">Love</span>
                            </div>
                            <span className="text-red-800 font-bold text-sm bg-red-100 px-2 py-1 rounded">
                                {horoscopeData?.love?.percentage ?? 100}%
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {horoscopeData?.love?.text || "Existing relationships benefit from quiet intimacy and meaningful conversations. Single Taureans might reconnect with someone from the past unexpectedly."}
                        </p>
                    </div>

                    {/* Career Card */}
                    <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-orange-600">
                                <Briefcase className="w-5 h-5 fill-current" />
                                <span className="font-semibold text-lg">Career</span>
                            </div>
                            <span className="text-orange-800 font-bold text-sm bg-orange-100 px-2 py-1 rounded">
                                {horoscopeData?.career?.percentage ?? 60}%
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {horoscopeData?.career?.text || "Collaborative projects gain momentum through patient diplomatic efforts. Your steady approach reassures anxious colleagues. Focus on perfecting details."}
                        </p>
                    </div>
                </div>

            </main>

            {/* 6. Sticky Bottom Action Bar */}
            <div className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-md mx-auto">
                <div className="flex gap-4">
                    <button className="flex-1 bg-[#FFD700] hover:bg-[#FFC000] text-black py-3 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                        <MessageCircle className="w-5 h-5" />
                        Chat with Astrologer
                    </button>
                    <button className="flex-1 bg-[#FFD700] hover:bg-[#FFC000] text-black py-3 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
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

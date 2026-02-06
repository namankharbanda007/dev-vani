"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, Share2, Briefcase, Heart, MessageCircle, Phone, Loader2, DollarSign, Activity, Plane } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Zodiac Data Helper
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
    const [activeSign, setActiveSign] = useState(zodiacSigns[0]);
    const [activeTab, setActiveTab] = useState("Today");
    const [horoscopeData, setHoroscopeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Display Date
    const getDisplayDate = (tab: string) => {
        const d = new Date();
        if (tab === "Yesterday") d.setDate(d.getDate() - 1);
        if (tab === "Tomorrow") d.setDate(d.getDate() + 1);
        return d.toLocaleDateString("en-GB").replace(/\//g, "-");
    };

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
                    // Determine initial sign from user metadata
                    const metadata = dbUser.user_info?.user_metadata || {};
                    const birthDate = metadata.birth_date;
                    const signData = getZodiacFromDate(birthDate);

                    // Only set active sign if it hasn't been set by interaction yet
                    setActiveSign(signData);
                }
            }
        };
        fetchUser();
    }, []);

    // Fetch Horoscope whenever Sign or Tab changes
    useEffect(() => {
        const fetchHoroscope = async () => {
            setLoading(true);
            try {
                // Construct URL params
                const params = new URLSearchParams();
                params.append('sign', activeSign.name);
                params.append('date', activeTab); // "Yesterday", "Today", "Tomorrow"

                const res = await fetch(`/api/horoscope/daily?${params.toString()}`);
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

        fetchHoroscope();
    }, [activeSign, activeTab]);

    const handleShare = () => {
        const text = `Check out my daily horoscope on Smart Murti! ✨\nSign: ${activeSign.name}\nLucky Number: ${horoscopeData?.lucky_number}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* 1. Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
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

            <main className="max-w-7xl mx-auto px-4 pb-8 space-y-6">

                {/* 2. Zodiac Selector */}
                <div className="relative pt-4">
                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar items-center md:justify-center">
                        {zodiacSigns.map((sign) => {
                            const isActive = activeSign.name === sign.name;
                            return (
                                <button
                                    key={sign.name}
                                    onClick={() => setActiveSign(sign)}
                                    className="flex flex-col items-center gap-2 min-w-[64px] transition-all group"
                                >
                                    <div className={`
                                        relative w-16 h-16 rounded-full p-1 transition-all duration-300
                                        ${isActive ? 'bg-[#FFD700] scale-110 shadow-lg' : 'bg-transparent group-hover:bg-gray-100'}
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
                <div className="max-w-md mx-auto bg-gray-100 p-1 rounded-xl flex items-center justify-between text-sm font-medium">
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
                <div className="w-full relative overflow-hidden rounded-[24px] bg-[#0F111A] text-white p-6 shadow-xl min-h-[320px]">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 pointer-events-none"></div>
                    <div className="absolute top-[10%] left-[10%] w-[2px] h-[2px] bg-white opacity-80 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-[3px] h-[3px] bg-white opacity-60 rounded-full animate-pulse delay-75"></div>

                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                            <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin" />
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

                            {/* Left Content */}
                            <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
                                {/* Date Header */}
                                <div className="mb-6">
                                    <span className="text-xs font-medium tracking-widest text-purple-300 bg-white/5 py-1 px-4 rounded-full border border-white/10 uppercase">
                                        {getDisplayDate(activeTab)}
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-3xl font-sans font-medium mb-6">
                                    Your Daily horoscope is ready!
                                </h2>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-12 w-full max-w-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Lucky Colours</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#FF7F50] border border-white/20"></div>
                                            <span className="text-sm font-light">{horoscopeData?.lucky_color}</span>
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
                            </div>

                            {/* Right Avatar */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                                {/* Glow Ring */}
                                <div className="absolute -inset-2 rounded-full border-2 border-yellow-400/50 animate-[spin_10s_linear_infinite]"></div>
                                {/* Zodiac Bubble */}
                                <div className="absolute top-0 left-0 z-20 w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-[#0F111A]">
                                    <span className="text-black font-bold text-lg">{activeSign.symbol}</span>
                                </div>
                                {/* Image */}
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 relative bg-black">
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
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 px-1">Daily Insights</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Love Card */}
                        <div className="bg-red-50 rounded-2xl p-5 border border-red-100 relative overflow-hidden transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-red-600">
                                    <Heart className="w-5 h-5 fill-current" />
                                    <span className="font-semibold text-lg">Love</span>
                                </div>
                                <span className="text-red-800 font-bold text-sm bg-red-100 px-2 py-1 rounded">
                                    {horoscopeData?.love?.percentage ?? 0}%
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                                {horoscopeData?.love?.text || "Generating insights..."}
                            </p>
                        </div>

                        {/* Career Card */}
                        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 relative overflow-hidden transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-orange-600">
                                    <Briefcase className="w-5 h-5 fill-current" />
                                    <span className="font-semibold text-lg">Career</span>
                                </div>
                                <span className="text-orange-800 font-bold text-sm bg-orange-100 px-2 py-1 rounded">
                                    {horoscopeData?.career?.percentage ?? 0}%
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                                {horoscopeData?.career?.text || "Generating insights..."}
                            </p>
                        </div>

                        {/* Money Card */}
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <DollarSign className="w-5 h-5" />
                                    <span className="font-semibold text-lg">Money</span>
                                </div>
                                <span className="text-emerald-800 font-bold text-sm bg-emerald-100 px-2 py-1 rounded">
                                    {horoscopeData?.money?.percentage ?? 0}%
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                                {horoscopeData?.money?.text || "Generating insights..."}
                            </p>
                        </div>

                        {/* Health Card */}
                        <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100 relative overflow-hidden transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-teal-600">
                                    <Activity className="w-5 h-5" />
                                    <span className="font-semibold text-lg">Health</span>
                                </div>
                                <span className="text-teal-800 font-bold text-sm bg-teal-100 px-2 py-1 rounded">
                                    {horoscopeData?.health?.percentage ?? 0}%
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                                {horoscopeData?.health?.text || "Generating insights..."}
                            </p>
                        </div>

                        {/* Travel Card */}
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Plane className="w-5 h-5" />
                                    <span className="font-semibold text-lg">Travel</span>
                                </div>
                                <span className="text-blue-800 font-bold text-sm bg-blue-100 px-2 py-1 rounded">
                                    {horoscopeData?.travel?.percentage ?? 0}%
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                                {horoscopeData?.travel?.text || "Generating insights..."}
                            </p>
                        </div>
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

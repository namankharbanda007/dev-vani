"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Activity,
    Briefcase,
    ChevronLeft,
    DollarSign,
    Heart,
    Home,
    Loader2,
    MessageCircle,
    Phone,
    Plane,
    RefreshCw,
    Share2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getSunSign } from "@/lib/astrology";

const zodiacSigns = [
    { name: "Aries", index: "01", symbol: "Ar" },
    { name: "Taurus", index: "02", symbol: "Ta" },
    { name: "Gemini", index: "03", symbol: "Ge" },
    { name: "Cancer", index: "04", symbol: "Ca" },
    { name: "Leo", index: "05", symbol: "Le" },
    { name: "Virgo", index: "06", symbol: "Vi" },
    { name: "Libra", index: "07", symbol: "Li" },
    { name: "Scorpio", index: "08", symbol: "Sc" },
    { name: "Sagittarius", index: "09", symbol: "Sa" },
    { name: "Capricorn", index: "10", symbol: "Cp" },
    { name: "Aquarius", index: "11", symbol: "Aq" },
    { name: "Pisces", index: "12", symbol: "Pi" },
] as const;

const aspectCards = [
    { key: "love", label: "Family Harmony", icon: Heart, tone: "bg-rose-50 text-rose-600" },
    { key: "career", label: "Work Direction", icon: Briefcase, tone: "bg-orange-50 text-orange-600" },
    { key: "money", label: "Prosperity", icon: DollarSign, tone: "bg-emerald-50 text-emerald-600" },
    { key: "health", label: "Wellbeing", icon: Activity, tone: "bg-teal-50 text-teal-600" },
    { key: "travel", label: "Travel", icon: Plane, tone: "bg-blue-50 text-blue-600" },
] as const;

type ZodiacSign = (typeof zodiacSigns)[number];

function fallbackText(signName: string) {
    return `Select a sign to see guidance for ${signName}. For deeper questions, continue with the Astrologer or Smart Pandit.`;
}

function scoreLabel(value: unknown) {
    return typeof value === "number" ? `${value}%` : "Guidance";
}

function HoroscopeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = useMemo(() => createClient(), []);

    const signParam = searchParams.get("sign");
    const dateParam = searchParams.get("date") || "Today";

    const [activeSign, setActiveSign] = useState<ZodiacSign>(zodiacSigns[0]);
    const [horoscopeData, setHoroscopeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (signParam) {
            const found = zodiacSigns.find((zodiac) => zodiac.name === signParam);
            if (found) setActiveSign(found);
            return;
        }

        const fetchUserSign = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data: dbUser } = await supabase
                .from("users")
                .select("user_info")
                .eq("user_id", user.id)
                .single();

            const metadata = (dbUser?.user_info as any)?.user_metadata || {};
            if (!metadata.birth_date) return;

            const mySign = getSunSign(new Date(metadata.birth_date)).name;
            router.replace(`/horoscope?sign=${encodeURIComponent(mySign)}&date=${encodeURIComponent(dateParam)}`);
        };

        fetchUserSign();
    }, [dateParam, router, signParam, supabase]);

    useEffect(() => {
        const fetchHoroscope = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    sign: activeSign.name,
                    date: dateParam,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });

                const res = await fetch(`/api/horoscope/daily?${params.toString()}`);
                if (!res.ok) {
                    const payload = await res.json().catch(() => null);
                    throw new Error(payload?.error || payload?.details || "Unable to load horoscope.");
                }

                setHoroscopeData(await res.json());
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Unable to load horoscope.");
            } finally {
                setLoading(false);
            }
        };

        fetchHoroscope();
    }, [activeSign.name, dateParam]);

    const handleSignChange = (sign: ZodiacSign) => {
        setActiveSign(sign);
        router.push(`/horoscope?sign=${encodeURIComponent(sign.name)}&date=${encodeURIComponent(dateParam)}`);
    };

    const handleTabChange = (tab: string) => {
        router.push(`/horoscope?sign=${encodeURIComponent(activeSign.name)}&date=${encodeURIComponent(tab)}`);
    };

    const handleShare = async () => {
        const text = `Daily Horoscope on Smart Murti\nSign: ${activeSign.name}\nLucky Number: ${horoscopeData?.lucky_number || "pending"}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Daily Horoscope for ${activeSign.name}`,
                    text,
                    url: window.location.href,
                });
            } catch {
                return;
            }
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }
    };

    const handleBack = () => {
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push("/home");
        }
    };

    const displayDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#fffaf2] p-6 text-center">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100">
                    <Activity className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Horoscope could not load</h2>
                <p className="max-w-xs text-gray-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 rounded-lg bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffaf2] pb-28">
            <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button onClick={handleBack} className="-ml-2 rounded-lg p-2 hover:bg-amber-50" aria-label="Go back">
                            <ChevronLeft className="h-6 w-6 text-gray-800" />
                        </button>
                        <button onClick={() => router.push("/home")} className="rounded-lg p-2 hover:bg-amber-50" aria-label="Go home">
                            <Home className="h-5 w-5 text-gray-800" />
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-lg font-semibold text-gray-900">Daily Horoscope</h1>
                        <p className="text-xs text-gray-500">Select a sign to see guidance</p>
                    </div>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                        aria-label="Share horoscope"
                    >
                        <Share2 className="h-4 w-4" />
                        Share
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-4 pb-8 pt-6">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12">
                    {zodiacSigns.map((sign) => {
                        const isActive = activeSign.name === sign.name;
                        return (
                            <button
                                key={sign.name}
                                onClick={() => handleSignChange(sign)}
                                className={`flex flex-col items-center gap-2 rounded-lg p-2 transition ${
                                    isActive ? "bg-white shadow-sm ring-2 ring-[#d59c31]" : "hover:bg-white"
                                }`}
                                aria-pressed={isActive}
                            >
                                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-amber-100 bg-white">
                                    <Image
                                        src={`/assets/horoscope-${sign.index}.webp`}
                                        alt={sign.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${isActive ? "text-black" : "text-gray-500"}`}>
                                    {sign.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mx-auto flex max-w-md items-center justify-between rounded-lg bg-amber-100/70 p-1.5 text-sm font-medium">
                    {["Yesterday", "Today", "Tomorrow"].map((tab) => {
                        const isActive = dateParam === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`flex-1 rounded-md py-2.5 text-center transition ${
                                    isActive ? "bg-white font-semibold text-black shadow-sm" : "text-[#7a6651] hover:text-[#20130b]"
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <section className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#20130b] p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4d2a12] via-[#20130b] to-black" />

                    {loading ? (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                            <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#FFD700]" />
                            <p className="text-sm font-light uppercase tracking-widest text-gray-300">Preparing guidance...</p>
                        </div>
                    ) : (
                        <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1fr_320px]">
                            <div className="space-y-8">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md">
                                        <span className="h-2 w-2 rounded-full bg-[#FFD700]" />
                                        <span className="text-xs font-medium uppercase tracking-widest text-gray-200">
                                            {activeSign.name} | {horoscopeData?.date || displayDate}
                                        </span>
                                    </div>
                                    <h2 className="font-lora text-4xl font-bold leading-tight md:text-6xl">
                                        Guidance for today
                                    </h2>
                                </div>

                                <div className="grid max-w-md grid-cols-2 gap-6">
                                    <Fact label="Lucky Color" value={horoscopeData?.lucky_color || "Pending"} />
                                    <Fact label="Mood" value={horoscopeData?.mood || "Calm"} />
                                    <Fact label="Lucky Number" value={horoscopeData?.lucky_number || "..."} highlight />
                                    <Fact label="Lucky Time" value={horoscopeData?.lucky_time || "Pending"} />
                                </div>
                            </div>

                            <div className="relative mx-auto h-64 w-64">
                                <div className="absolute right-0 top-0 z-20 flex h-16 w-16 -rotate-6 items-center justify-center rounded-lg border-4 border-[#20130b] bg-[#FFD700] text-black shadow-lg">
                                    <span className="text-lg font-bold">{activeSign.symbol}</span>
                                </div>
                                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
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
                </section>

                <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Horoscope Readings</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {aspectCards.map((aspect) => {
                            const Icon = aspect.icon;
                            const data = horoscopeData?.[aspect.key];
                            return (
                                <article key={aspect.key} className="rounded-lg border border-amber-100 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-lg p-2 ${aspect.tone}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-gray-900">{aspect.label}</span>
                                        </div>
                                        <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                                            {scoreLabel(data?.percentage)}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {data?.text || fallbackText(activeSign.name)}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </main>

            <div className="fixed bottom-6 left-0 right-0 z-40 mx-auto max-w-md px-4">
                <div className="flex gap-3 rounded-lg border border-amber-100 bg-white/90 p-2 shadow-xl backdrop-blur">
                    <button
                        onClick={() => router.push("/astrologer")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-4 py-3 text-sm font-bold text-black transition active:scale-95"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Chat Astrologer
                    </button>
                    <button
                        onClick={() => router.push("/astrologer")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#20130b] px-4 py-3 text-sm font-bold text-white transition active:scale-95"
                    >
                        <Phone className="h-5 w-5" />
                        Call Astrologer
                    </button>
                </div>
            </div>
        </div>
    );
}

function Fact({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
            <p className={highlight ? "text-4xl font-light text-[#FFD700]" : "text-xl font-light"}>{value}</p>
        </div>
    );
}

export default function DetailedHoroscopePage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            }
        >
            <HoroscopeContent />
        </Suspense>
    );
}

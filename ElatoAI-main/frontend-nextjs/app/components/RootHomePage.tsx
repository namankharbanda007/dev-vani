"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Flame,
    Globe2,
    HeartHandshake,
    Menu,
    MessageCircle,
    Phone,
    Shield,
    Sparkles,
    Star,
    Users,
    X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import HeroPandit from "@/app/landing-2/components/HeroPandit";
import Preloader from "@/app/landing-2/components/Preloader";
import DemoForm, { GuestData } from "@/app/landing-2/components/DemoForm";
import DemoSession from "@/app/landing-2/components/DemoSession";
import WhatsappIntegration from "@/app/components/LandingPage/WhatsappIntegration";
import Footer from "@/app/components/Footer";
import { homeFaqs } from "@/app/lib/seo";

const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: false,
    smoothWheel: true,
};

const urgencyCards = [
    {
        title: "Families Across Countries",
        description:
            "Bring relatives from India, the US, Canada, Dubai, or anywhere else into the same spiritual moment.",
        icon: Globe2,
        accent: "from-[#F7E9D0] to-[#FFF8EF] border-[#E3C18D] text-[#8B5A2B]",
    },
    {
        title: "Urgent Guidance",
        description:
            "Talk to Smart Pandit for health, protection, peace, family stress, and important life decisions.",
        icon: Clock3,
        accent: "from-[#EFE3F7] to-[#FBF7FF] border-[#C6B0DD] text-[#5D3A83]",
    },
    {
        title: "Your Language",
        description:
            "Get spiritual guidance in Hindi, English, Hinglish, and other languages without awkward translation.",
        icon: Users,
        accent: "from-[#F5E4DE] to-[#FFF7F3] border-[#DBB0A7] text-[#9B5D55]",
    },
];

const comparisonPoints = [
    "Instant access, without waiting for local pandit availability or timezone coordination.",
    "Clear NRI launch packages instead of confusing paid-call math.",
    "Interactive and personal, unlike passive YouTube streams or temple recordings.",
    "Built for family participation, so one devotee can start and everyone can join later.",
];

const specialistCards = [
    {
        title: "Health & Protection",
        description:
            "For sickness, protection rituals, stress, and spiritual calm during difficult family moments.",
        icon: Shield,
        accent: "bg-amber-100 text-amber-700",
    },
    {
        title: "Family Rituals",
        description:
            "Move from one-to-one spiritual guidance into full live puja when the whole family needs to join.",
        icon: Users,
        accent: "bg-purple-100 text-purple-700",
    },
    {
        title: "Family Harmony",
        description:
            "Ask for calm spiritual guidance around marriage, love, compatibility, and family tension.",
        icon: HeartHandshake,
        accent: "bg-rose-100 text-rose-700",
    },
    {
        title: "Prosperity & Direction",
        description:
            "Get grounded guidance for money stress, work confusion, and major personal decisions.",
        icon: Sparkles,
        accent: "bg-emerald-100 text-emerald-700",
    },
];

const trustPillars = [
    {
        title: "Structured Guidance",
        description:
            "Smart Pandit responds with a calm, respectful devotional tone designed for serious family moments.",
        icon: CheckCircle2,
    },
    {
        title: "Quiet Memory",
        description:
            "The experience gets more personal over time, without feeling intrusive or gimmicky.",
        icon: Star,
    },
    {
        title: "Private By Default",
        description:
            "Designed for sacred use, family continuity, and repeat spiritual guidance when needed.",
        icon: Shield,
    },
];

export default function RootHomePage() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDemoForm, setShowDemoForm] = useState(false);
    const [showDemoSession, setShowDemoSession] = useState(false);
    const [demoMode, setDemoMode] = useState<"call" | "chat">("call");
    const [guestData, setGuestData] = useState<GuestData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    const handleStartDemo = (mode: "call" | "chat") => {
        setDemoMode(mode);
        setShowDemoForm(true);
    };

    const handleFormSubmit = (data: GuestData) => {
        setGuestData(data);
        setShowDemoForm(false);
        setShowDemoSession(true);
    };

    return (
        <ReactLenis root options={lenisOptions}>
            <DemoForm
                isOpen={showDemoForm}
                onClose={() => setShowDemoForm(false)}
                onSubmit={handleFormSubmit}
                mode={demoMode}
            />

            {showDemoSession && guestData ? (
                <DemoSession
                    guestData={guestData}
                    mode={demoMode}
                    onClose={() => setShowDemoSession(false)}
                />
            ) : null}

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FBF5EA] via-[#FFFDF8] to-[#F7EFE4]">
                <main className="flex-1">
                    <Preloader progress={loadingProgress} isLoaded={isLoaded} />
                    <RootHeader isLoggedIn={isLoggedIn} />
                    <HeroPandit
                        setLoadingProgress={setLoadingProgress}
                        setIsLoaded={setIsLoaded}
                    />
                    <ConversionStorySection isLoggedIn={isLoggedIn} />
                    <DemoSection onStartDemo={handleStartDemo} />
                    <UseCasesSection />
                    <WhatsappIntegration />
                    <TrustSection />
                    <FaqSection />
                    <FinalCtaSection isLoggedIn={isLoggedIn} />
                </main>
                <Footer />
            </div>
        </ReactLenis>
    );
}

function RootHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
                <motion.header
                    layout
                    initial={{
                        width: "95%",
                        borderRadius: "0px",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        backdropFilter: "blur(0px)",
                        borderWidth: "0px",
                    }}
                    animate={{
                        width: isScrolled ? "80%" : "95%",
                        maxWidth: isScrolled ? "56rem" : "80rem",
                        borderRadius: isScrolled ? "9999px" : "0px",
                        backgroundColor: isScrolled
                            ? "rgba(255,255,255,0.78)"
                            : "rgba(255,255,255,0)",
                        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
                        borderWidth: isScrolled ? "1px" : "0px",
                        borderColor: isScrolled ? "rgba(255,255,255,0.5)" : "transparent",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-auto flex items-center justify-between px-6 py-3 shadow-sm"
                    style={{
                        boxShadow: isScrolled
                            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            : "none",
                    }}
                >
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-10 w-auto">
                            <img
                                src="/assets/landing/logo.png"
                                alt="Smart Murti"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <HeaderLink href="#why-smartmurti" label="Why Smart Murti" />
                        <HeaderLink href="#use-cases" label="Use Cases" />
                        <HeaderLink href="#trust" label="Trust" />
                        <HeaderLink href="#faq" label="FAQ" />
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={isLoggedIn ? "/pandit?ritual=ganpati-havan" : "/login"}
                            className="hidden rounded-full bg-[#8f5d23] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#7b4f1e] md:inline-flex md:items-center md:justify-center"
                        >
                            Start Live Puja
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden text-murti-stone p-2"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </motion.header>
            </div>

            <motion.div
                initial={{ opacity: 0, pointerEvents: "none" }}
                animate={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? "auto" : "none",
                }}
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-8 bg-[#FFF8EF]/95 backdrop-blur-xl"
            >
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-6 right-6 p-2 text-murti-stone"
                >
                    <X className="w-8 h-8" />
                </button>

                <nav className="flex flex-col items-center space-y-6 text-2xl font-serif">
                    <Link href="#why-smartmurti" onClick={() => setMobileMenuOpen(false)}>Why Smart Murti</Link>
                    <Link href="#use-cases" onClick={() => setMobileMenuOpen(false)}>Use Cases</Link>
                    <Link href="#trust" onClick={() => setMobileMenuOpen(false)}>Trust</Link>
                    <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                    <Link
                        href={isLoggedIn ? "/pandit?ritual=ganpati-havan" : "/login"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 rounded-full bg-[#512A73] px-8 py-3 text-lg font-medium text-white transition-all hover:bg-[#42225e] font-sans"
                    >
                        Start Live Puja
                    </Link>
                </nav>
            </motion.div>
        </>
    );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-murti-stone/80 hover:text-divine-saffron transition-colors"
        >
            {label}
        </Link>
    );
}

function ConversionStorySection({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <section
            id="why-smartmurti"
            className="w-full bg-gradient-to-b from-[#FFFDF8] via-[#FBF5EA] to-[#FFFDF8] py-16 md:py-24"
        >
            <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                <div className="mx-auto mb-14 max-w-4xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#8B5A2B]">
                        Instant Access To Spiritual Guidance
                    </p>
                    <h2 className="mb-6 font-lora text-4xl font-bold text-[#241A14] md:text-6xl">
                        The easiest way for Hindu families anywhere in the world to talk to a Pandit right now
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#4D3C2E] md:text-xl">
                        Smart Murti gives families a live multilingual AI pandit for urgent spiritual
                        guidance, calm devotional support, and family rituals without waiting on local
                        temple availability or fragmented paid consultations.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={isLoggedIn ? "/pandit?ritual=ganpati-havan" : "/login"}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8f5d23] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#7b4f1e]"
                        >
                            Start Live Puja
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="#demo"
                            className="inline-flex items-center justify-center rounded-full border border-[#DDCCB7] bg-white/80 px-8 py-4 text-base font-semibold text-[#241A14] transition hover:border-[#CDB28E] hover:bg-white"
                        >
                            Preview flow
                        </a>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-700">
                        <span className="rounded-full bg-[#F5E8CF] px-4 py-2 text-[#8B5A2B]">
                            Live multilingual guidance
                        </span>
                        <span className="rounded-full bg-[#EFE3F7] px-4 py-2 text-[#5D3A83]">
                            Family can join from anywhere
                        </span>
                        <span className="rounded-full bg-[#E8EFE2] px-4 py-2 text-[#476340]">
                            Clear USD launch packages
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {urgencyCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className={`rounded-3xl border bg-gradient-to-br p-8 shadow-sm ${card.accent}`}
                            >
                                <div className="mb-6 inline-flex rounded-2xl bg-white/80 p-4 shadow-sm">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold text-gray-900">{card.title}</h3>
                                <p className="text-base leading-relaxed text-gray-700">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 rounded-[2rem] border border-[#E7D8C2] bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#5D3A83]">
                            Why families choose Smart Murti
                        </p>
                        <h3 className="mb-5 font-lora text-3xl font-bold text-[#241A14] md:text-4xl">
                            Better than stitching together temple calls, WhatsApp messages, and passive livestreams
                        </h3>
                        <div className="space-y-4">
                            {comparisonPoints.map((point) => (
                                <div key={point} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#476340]" />
                                    <p className="text-base leading-relaxed text-[#4D3C2E]">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#F5E8CF] via-[#FFF8EF] to-white p-6">
                        <div className="relative">
                            <Image
                                src="/products/family-namaste.jpg"
                                alt="Family joining Smart Murti together"
                                width={520}
                                height={520}
                                className="mb-5 rounded-[1.5rem] object-cover shadow-lg"
                            />
                            <div className="rounded-[1.5rem] bg-white/85 p-5 backdrop-blur">
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B5A2B]">
                                    Best fit
                                </p>
                                <p className="mt-2 text-base leading-relaxed text-[#4D3C2E]">
                                    NRI families, urgent guidance, family rituals across time zones, and
                                    spiritually serious moments that need a calm human-feeling guide now.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DemoSection({
    onStartDemo,
}: {
    onStartDemo: (mode: "call" | "chat") => void;
}) {
    return (
        <section id="demo" className="w-full min-h-[60vh] md:h-screen relative flex items-end md:items-center justify-center bg-black">
            <img
                src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.webp"
                alt="Smart Murti Demo"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            {/* Dark gradient overlay for readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/40 md:via-transparent" />

            {/* Overlay Buttons */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 pb-10 md:pb-0 pt-40 md:pt-0">

                {/* Left Button: Live Call */}
                <motion.button
                    onClick={() => onStartDemo("call")}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                >
                    <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                        <Phone className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                    </div>
                    <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">Live Call</span>
                </motion.button>

                <motion.a
                    href="/pandit?ritual=ganpati-havan"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.28 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-[#8f5d23]/90 backdrop-blur-md border border-amber-200/20 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-[#7b4f1e] hover:border-amber-100/40 transition-all duration-300"
                >
                    <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                        <Flame className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">Live Puja</span>
                </motion.a>

                {/* Right Button: Live Chat */}
                <motion.button
                    onClick={() => onStartDemo("chat")}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                >
                    <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">Live Chat</span>
                    <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                        <MessageCircle className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                    </div>
                </motion.button>

            </div>
        </section>
    );
}

function UseCasesSection() {
    return (
        <section id="use-cases" className="w-full bg-white py-16 md:py-24">
            <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-purple-700">
                        One Smart Pandit, multiple specialist paths
                    </p>
                    <h2 className="mb-6 font-lora text-4xl font-bold text-gray-900 md:text-5xl">
                        Start with one clear need, then let Smart Pandit guide the rest
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                        The front door stays simple. Inside, Smart Pandit can route families toward
                        the kind of support they actually need, without turning the homepage into a
                        confusing wall of characters.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {specialistCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-[2rem] border border-gray-100 bg-gradient-to-br from-white to-[#FFF8EF] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className={`mb-6 inline-flex rounded-2xl p-4 ${card.accent}`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold text-gray-900">{card.title}</h3>
                                <p className="text-base leading-relaxed text-gray-700">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TrustSection() {
    return (
        <section
            id="trust"
            className="w-full overflow-hidden bg-gradient-to-br from-[#3A2316] via-[#512A73] to-[#22160E] py-16 md:py-24"
        >
            <div className="container relative mx-auto max-w-screen-xl px-4 md:px-6">
                <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                            Built for sacred moments
                        </p>
                        <h2 className="mb-6 font-lora text-4xl font-bold text-white md:text-5xl">
                            Calm, respectful, and designed to earn trust before it asks for it
                        </h2>
                        <p className="max-w-2xl text-lg leading-relaxed text-purple-100/85">
                            Smart Murti should not feel like a novelty AI app when the moment is
                            serious. The experience has to feel steady, spiritually grounded, and
                            easy for families to return to again.
                        </p>

                        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
                            <div className="space-y-4">
                                {trustPillars.map((pillar) => {
                                    const Icon = pillar.icon;

                                    return (
                                        <div key={pillar.title} className="flex items-start gap-4">
                                            <div className="mt-1 rounded-full bg-white/10 p-2">
                                                <Icon className="h-5 w-5 text-amber-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                                                <p className="mt-1 leading-relaxed text-purple-100/80">
                                                    {pillar.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                                What the first session should feel like
                            </p>
                            <h3 className="mb-4 text-3xl font-bold text-white">
                                &quot;I can get real spiritual help right now.&quot;
                            </h3>
                            <p className="leading-relaxed text-purple-100/80">
                                Not futuristic. Not gimmicky. Not like a feature catalog. Just calm
                                spiritual access for families that need help now.
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/12 to-white/5 p-7 backdrop-blur">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Retention angle
                            </p>
                            <h3 className="mb-4 text-3xl font-bold text-white">
                                Start with guidance now, return later for full family puja
                            </h3>
                            <p className="leading-relaxed text-purple-100/80">
                                The homepage should convert on urgent guidance first, then let repeat
                                trust and family coordination pull people into larger spiritual rituals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section id="faq" className="w-full bg-gradient-to-b from-[#FFF8EF] to-white py-16 md:py-24">
            <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                        Common questions
                    </p>
                    <h2 className="mb-4 font-lora text-4xl font-bold text-gray-900 md:text-5xl">
                        What families usually want to know before they start
                    </h2>
                    <p className="text-lg text-gray-700">
                        Clear answers for people deciding whether Smart Pandit is right for their
                        family, especially when the need is urgent.
                    </p>
                </div>

                <div className="space-y-4">
                    {homeFaqs.slice(0, 5).map((faq) => (
                        <article
                            key={faq.question}
                            className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm md:p-8"
                        >
                            <h3 className="mb-3 text-xl font-bold text-gray-900">
                                {faq.question}
                            </h3>
                            <p className="leading-relaxed text-gray-700">{faq.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FinalCtaSection({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <section className="w-full bg-black py-16 md:py-24" id="contact">
            <div className="container mx-auto max-w-screen-lg px-4 text-center md:px-6">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                    Ready when you are
                </p>
                <h2 className="mb-5 font-lora text-4xl font-bold text-white md:text-5xl">
                    Talk to Smart Pandit now
                </h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/75">
                    Start with guidance now. Bring your family in later when you need a full live
                    puja. One clear front door, one calm spiritual guide.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href={isLoggedIn ? "/home" : "/login"}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-8 py-4 text-base font-semibold text-black transition hover:bg-[#f4c80d]"
                    >
                        Talk to Smart Pandit now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                        href="#demo"
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                    >
                        Preview the flow
                    </a>
                </div>
            </div>
        </section>
    );
}

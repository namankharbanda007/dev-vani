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
        accent: "from-amber-50 to-orange-50 border-amber-200 text-amber-700",
    },
    {
        title: "Urgent Guidance",
        description:
            "Talk to Smart Pandit for health, protection, peace, family stress, and important life decisions.",
        icon: Clock3,
        accent: "from-purple-50 to-indigo-50 border-purple-200 text-purple-700",
    },
    {
        title: "Your Language",
        description:
            "Get spiritual guidance in Hindi, English, Hinglish, and other languages without awkward translation.",
        icon: Users,
        accent: "from-rose-50 to-pink-50 border-rose-200 text-rose-700",
    },
];

const comparisonPoints = [
    "Instant access, without waiting for local pandit availability or timezone coordination.",
    "Far more affordable than fragmented live consultations and per-minute apps.",
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
        title: "Relationship & Love",
        description:
            "Ask for calm spiritual guidance around marriage, love, compatibility, and family tension.",
        icon: HeartHandshake,
        accent: "bg-rose-100 text-rose-700",
    },
    {
        title: "Money & Direction",
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

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFBEB] via-[#FAF9F6] to-white">
                <main className="flex-1">
                    <Preloader progress={loadingProgress} isLoaded={isLoaded} />
                    <RootHeader />
                    <HeroPandit
                        setLoadingProgress={setLoadingProgress}
                        setIsLoaded={setIsLoaded}
                    />
                    <ConversionStorySection />
                    <DemoSection onStartDemo={handleStartDemo} />
                    <UseCasesSection />
                    <WhatsappIntegration />
                    <TrustSection />
                    <FaqSection />
                    <FinalCtaSection />
                </main>
            </div>
        </ReactLenis>
    );
}

function RootHeader() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });
    }, []);

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
                            href={isLoggedIn ? "/home" : "/login"}
                            className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all"
                        >
                            Talk to Smart Pandit now
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
                className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
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
                        href={isLoggedIn ? "/home" : "/login"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 px-8 py-3 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all font-sans"
                    >
                        Talk to Smart Pandit now
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

function ConversionStorySection() {
    return (
        <section
            id="why-smartmurti"
            className="w-full bg-gradient-to-b from-white via-[#FFF8E7] to-white py-16 md:py-24"
        >
            <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                <div className="mx-auto mb-14 max-w-4xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                        Instant Access To Spiritual Guidance
                    </p>
                    <h2 className="mb-6 font-lora text-4xl font-bold text-gray-900 md:text-6xl">
                        The easiest way for Hindu families anywhere in the world to talk to a Pandit right now
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700 md:text-xl">
                        Smart Murti gives families a live multilingual AI pandit for urgent spiritual
                        guidance, calm devotional support, and family rituals without waiting on local
                        temple availability or expensive per-minute services.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition hover:bg-gray-800"
                        >
                            Talk to Smart Pandit now
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="#demo"
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white/70 px-8 py-4 text-base font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-white"
                        >
                            See live demo
                        </a>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-700">
                        <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-800">
                            Live multilingual guidance
                        </span>
                        <span className="rounded-full bg-purple-100 px-4 py-2 text-purple-800">
                            Family can join from anywhere
                        </span>
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-800">
                            Affordable alternative to per-minute apps
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

                <div className="mt-12 grid grid-cols-1 gap-8 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">
                            Why families choose Smart Murti
                        </p>
                        <h3 className="mb-5 font-lora text-3xl font-bold text-gray-900 md:text-4xl">
                            Better than stitching together temple calls, WhatsApp messages, and passive livestreams
                        </h3>
                        <div className="space-y-4">
                            {comparisonPoints.map((point) => (
                                <div key={point} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                                    <p className="text-base leading-relaxed text-gray-700">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-amber-100 via-orange-50 to-white p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.35),transparent_45%)]" />
                        <div className="relative">
                            <Image
                                src="/products/family-namaste.jpg"
                                alt="Family joining Smart Murti together"
                                width={520}
                                height={520}
                                className="mb-5 rounded-[1.5rem] object-cover shadow-lg"
                            />
                            <div className="rounded-[1.5rem] bg-white/85 p-5 backdrop-blur">
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                                    Best fit
                                </p>
                                <p className="mt-2 text-base leading-relaxed text-gray-800">
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
        <section id="demo" className="w-full min-h-[75vh] md:h-screen relative flex items-end md:items-center justify-center bg-black">
            <img
                src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.webp"
                alt="Smart Murti Demo"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 md:from-black/55 md:via-black/15" />

            <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-36 sm:px-6 md:gap-16 md:pt-20">
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                        See it in action
                    </p>
                    <h2 className="mb-5 font-lora text-4xl font-bold leading-tight text-white md:text-6xl">
                        A real-time pandit experience that feels personal, calm, and immediate
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                        Watch how Smart Pandit responds naturally in real time, so families can
                        move from stress and uncertainty into guidance without waiting days for help.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                    <motion.button
                        onClick={() => onStartDemo("call")}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group flex w-full items-center justify-center gap-4 rounded-2xl border border-white/15 bg-black/70 px-6 py-5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:bg-black md:w-auto md:rounded-full md:px-8"
                    >
                        <div className="rounded-full bg-white/10 p-3 transition-colors duration-300 group-hover:bg-[#FFD700] group-hover:text-black">
                            <Phone className="h-6 w-6 fill-current md:h-8 md:w-8" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                                Live demo
                            </p>
                            <span className="text-lg font-bold tracking-[0.12em] text-white md:text-2xl">
                                Live Call
                            </span>
                        </div>
                    </motion.button>

                    <motion.button
                        onClick={() => onStartDemo("chat")}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group flex w-full items-center justify-center gap-4 rounded-2xl border border-white/15 bg-black/70 px-6 py-5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:bg-black md:w-auto md:rounded-full md:px-8"
                    >
                        <div className="text-left">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                                Low-friction start
                            </p>
                            <span className="text-lg font-bold tracking-[0.12em] text-white md:text-2xl">
                                Live Chat
                            </span>
                        </div>
                        <div className="rounded-full bg-white/10 p-3 transition-colors duration-300 group-hover:bg-[#FFD700] group-hover:text-black">
                            <MessageCircle className="h-6 w-6 fill-current md:h-8 md:w-8" />
                        </div>
                    </motion.button>
                </div>
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
            className="w-full overflow-hidden bg-gradient-to-br from-[#28164E] via-[#3A1A74] to-[#191133] py-16 md:py-24"
        >
            <div className="container relative mx-auto max-w-screen-xl px-4 md:px-6">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />

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
                                “I can get real spiritual help right now.”
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

function FinalCtaSection() {
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
                    puja. One clear front door, one calm spiritual companion.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-8 py-4 text-base font-semibold text-black transition hover:bg-[#f4c80d]"
                    >
                        Talk to Smart Pandit now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                        href="#demo"
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                    >
                        Watch the demo
                    </a>
                </div>
            </div>
        </section>
    );
}

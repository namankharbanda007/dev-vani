"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import {
    motion,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Heart,
    Sparkles,
    Users,
    Phone,
    MessageCircle,
    BookOpen,
    Music,
    PlayCircle,
    Star,
    Shield,
    Zap,
    X,
    Menu,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import HeroPandit from "@/app/landing-2/components/HeroPandit";
import Preloader from "@/app/landing-2/components/Preloader";
import DemoForm, { GuestData } from "@/app/landing-2/components/DemoForm";
import DemoSession from "@/app/landing-2/components/DemoSession";
import DivinationServices from "@/app/landing-2/components/DivinationServices";
import WhatsappIntegration from "@/app/components/LandingPage/WhatsappIntegration";
import YoutubeDemo from "@/app/components/LandingPage/YoutubeDemo";

const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: false,
    smoothWheel: true,
};

const familyHighlights = [
    {
        title: "For Children",
        description: "A friend who plays, learns, and grows with them",
        icon: Heart,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
    {
        title: "For Parents",
        description: "Spiritual guidance and daily wisdom",
        icon: Sparkles,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        title: "For Everyone",
        description: "Meaningful connections without screens",
        icon: Users,
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
    },
];

const guideCards = [
    {
        title: "Expert Astrologer",
        description: "Discover your planetary alignments.",
        image: "/assets/Cartoon Astrologer.jpg",
        alt: "Astrologer",
        bg: "bg-orange-50",
    },
    {
        title: "Palm Reader",
        description: "Unlock the destiny written on your hands.",
        image: "/assets/Cartoon Palm Reader.jpg",
        alt: "Palm Reader",
        bg: "bg-purple-50",
    },
    {
        title: "Face Reader",
        description: "Reveal hidden traits and compatibility.",
        image: "/assets/Cartoon Face Reader.jpg",
        alt: "Face Reader",
        bg: "bg-pink-50",
    },
];

const indianLanguages = [
    "हिंदी (Hindi)",
    "தமிழ் (Tamil)",
    "తెలుగు (Telugu)",
    "বাংলা (Bengali)",
    "मराठी (Marathi)",
    "ગુજરાતી (Gujarati)",
    "ಕನ್ನಡ (Kannada)",
    "മലയാളം (Malayalam)",
    "ਪੰਜਾਬੀ (Punjabi)",
    "ଓଡ଼ିଆ (Odia)",
    "অসমীয়া (Assamese)",
    "& 12+ more!",
];

const globalLanguages = [
    "English",
    "Español (Spanish)",
    "中文 (Chinese)",
    "العربية (Arabic)",
    "Français (French)",
    "Deutsch (German)",
    "日本語 (Japanese)",
    "한국어 (Korean)",
    "Português (Portuguese)",
    "Русский (Russian)",
    "Italiano (Italian)",
    "& 100+ more!",
];

const howItWorksSteps = [
    {
        number: "1",
        title: "Choose Your AI Guide",
        description:
            "Select between a wise Pandit for spiritual guidance, an Astrologer, or a playful character.",
        icon: Users,
        glow: "bg-purple-200",
        gradient: "from-purple-500 to-purple-700",
        text: "text-purple-900",
        badge: "text-purple-600",
    },
    {
        number: "2",
        title: "Connect Instantly",
        description:
            "Start a voice or text chat directly from your phone. Enjoy seamless, real-time conversations.",
        icon: MessageCircle,
        glow: "bg-amber-200",
        gradient: "from-amber-500 to-yellow-600",
        text: "text-amber-900",
        badge: "text-amber-600",
    },
    {
        number: "3",
        title: "Explore Divination",
        description:
            "Go beyond chat. Upload your palm for AI analysis or get personalized Vedic astrology readings.",
        icon: Sparkles,
        glow: "bg-pink-200",
        gradient: "from-pink-500 to-red-600",
        text: "text-pink-900",
        badge: "text-pink-600",
    },
];

const trustCards = [
    {
        title: "Ad-Free Experience",
        description:
            "No advertisements, no distractions. Just pure, meaningful conversations with your companion.",
        icon: Shield,
        bg: "bg-purple-500",
    },
    {
        title: "Privacy First",
        description:
            "Your conversations stay between you and your companion. We never sell your data. Ever.",
        icon: Heart,
        bg: "bg-amber-500",
    },
    {
        title: "Instant Access",
        description:
            "Available 24/7 on your phone or computer. Your personal spiritual guide is always just one click away.",
        icon: Zap,
        bg: "bg-pink-500",
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

            {showDemoSession && guestData && (
                <DemoSession
                    guestData={guestData}
                    mode={demoMode}
                    onClose={() => setShowDemoSession(false)}
                />
            )}

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFBEB] via-[#FAF9F6] to-white">
                <main className="flex-1">
                    <Preloader progress={loadingProgress} isLoaded={isLoaded} />
                    <RootHeader />
                    <HeroPandit
                        setLoadingProgress={setLoadingProgress}
                        setIsLoaded={setIsLoaded}
                    />
                    <FamilySection />
                    <GuidesSection />
                    <DemoSection onStartDemo={handleStartDemo} />
                    <DivinationServices />
                    <DailyAshramSection />
                    <LanguageSection />
                    <WhatsappIntegration />
                    <HowItWorksSection />
                    <TrustSection />
                    <section
                        id="contact"
                        className="bg-gradient-to-b from-white to-purple-50 py-16"
                    >
                        <YoutubeDemo caption="SMART मूर्ति Explainer" />
                    </section>
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
                        y: 0,
                    }}
                    animate={{
                        width: isScrolled ? "80%" : "95%",
                        maxWidth: isScrolled ? "56rem" : "80rem",
                        borderRadius: isScrolled ? "9999px" : "0px",
                        backgroundColor: isScrolled
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(255, 255, 255, 0)",
                        backdropFilter: isScrolled
                            ? "blur(12px)"
                            : "blur(0px)",
                        borderWidth: isScrolled ? "1px" : "0px",
                        borderColor: isScrolled
                            ? "rgba(255, 255, 255, 0.5)"
                            : "transparent",
                        y: 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-auto flex items-center justify-between px-6 py-3 shadow-sm transition-shadow duration-300"
                    style={{
                        boxShadow: isScrolled
                            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            : "none",
                    }}
                >
                    <Link href="/landing-2" className="flex items-center gap-2">
                        <div className="relative h-10 w-auto">
                            <img
                                src="/assets/landing/logo.png"
                                alt="Smart Murti"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <HeaderLink href="/products/smart-pandit" label="Shop" />
                        <HeaderLink href="#story" label="Our Story" />
                        <HeaderLink href="/pricing" label="Pricing" />
                        <HeaderLink href="#contact" label="Contact" />
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={isLoggedIn ? "/home" : "/login"}
                            className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all"
                        >
                            {isLoggedIn ? "Home" : "Login"}
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
                    <Link
                        href="/products/smart-pandit"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Shop
                    </Link>
                    <Link href="#story" onClick={() => setMobileMenuOpen(false)}>
                        Our Story
                    </Link>
                    <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                        Pricing
                    </Link>
                    <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                        Contact
                    </Link>
                    <Link
                        href={isLoggedIn ? "/home" : "/login"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 px-8 py-3 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all font-sans"
                    >
                        {isLoggedIn ? "Home" : "Login"}
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

function FamilySection() {
    return (
        <section
            id="story"
            className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50"
        >
            <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-amber-300 rounded-3xl blur-2xl opacity-20" />
                        <Image
                            src="/products/family-namaste.jpg"
                            alt="SMART मूर्ति Family - Bringing spirituality and companionship together"
                            width={600}
                            height={600}
                            className="relative z-10 rounded-3xl shadow-2xl"
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 leading-tight">
                            A Companion for Every Family Member
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Whether it&apos;s spiritual guidance from the Pandit for the elders, or a playful friend for the children, SMART मूर्ति brings the entire family together through meaningful conversations.
                        </p>

                        <div className="space-y-4">
                            {familyHighlights.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.title} className="flex items-start gap-3">
                                        <div className={`${item.iconBg} p-2 rounded-lg`}>
                                            <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function GuidesSection() {
    return (
        <section className="w-full py-12 md:py-20 bg-white border-y border-gray-100">
            <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-12">
                    Meet Your Spiritual Guides
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {guideCards.map((card) => (
                        <div
                            key={card.title}
                            className={`${card.bg} rounded-3xl p-6 flex flex-col items-center`}
                        >
                            <Image
                                src={card.image}
                                alt={card.alt}
                                width={200}
                                height={200}
                                className="rounded-full shadow-lg border-4 border-white mb-6 w-full h-auto max-w-[250px] object-cover aspect-square"
                            />
                            <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                            <p className="text-gray-600 mt-2">{card.description}</p>
                        </div>
                    ))}
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
        <section className="w-full min-h-[60vh] md:h-screen relative flex items-end md:items-center justify-center bg-black">
            <img
                src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.webp"
                alt="Smart Murti Demo"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/40 md:via-transparent" />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 md:gap-0 pb-10 md:pb-0 pt-40 md:pt-0">
                <motion.button
                    onClick={() => onStartDemo("call")}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                >
                    <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                        <Phone className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                    </div>
                    <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">
                        Live Call
                    </span>
                </motion.button>

                <motion.button
                    onClick={() => onStartDemo("chat")}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:bg-black hover:border-white/20 transition-all duration-300"
                >
                    <span className="text-base md:text-2xl font-bold text-white tracking-wider md:tracking-widest uppercase font-satoshi">
                        Live Chat
                    </span>
                    <div className="p-2 md:p-3 bg-white/10 rounded-full group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                        <MessageCircle className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                    </div>
                </motion.button>
            </div>
        </section>
    );
}

function DailyAshramSection() {
    return (
        <section className="py-24 px-6 md:px-10 bg-soft-paper relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-murti-stone mb-6">
                        Your Daily Digital Ashram
                    </h2>
                    <p className="text-lg text-murti-stone/70">
                        Cultivate a consistent spiritual path with our daily tools and vast library of devotional music.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-indigo-50 border border-indigo-100 p-8 md:p-12 flex flex-col justify-between group"
                    >
                        <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 text-indigo-400 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                            <Star className="w-80 h-80" />
                        </div>

                        <div className="relative z-10 mb-20 whitespace-normal">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-8 shadow-sm">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-indigo-950 mb-4 whitespace-normal">
                                Daily Horoscope &<br />
                                Detailed Reports
                            </h3>
                            <p className="text-lg text-indigo-900/70 font-medium max-w-md whitespace-normal">
                                Receive personalized daily forecasts. Understand your planetary movements and get actionable spiritual remedies directly to your phone.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link
                                href="/horoscope"
                                className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                            >
                                View Sample Report →
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-orange-50 border border-orange-100 p-8 md:p-12 flex flex-col justify-between group"
                    >
                        <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 text-orange-400 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                            <Music className="w-80 h-80" />
                        </div>

                        <div className="relative z-10 mb-20 whitespace-normal">
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-8 shadow-sm">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-orange-950 mb-4 whitespace-normal">
                                Unlimited Free Bhajans &<br />
                                Aarti Library
                            </h3>
                            <p className="text-lg text-orange-900/70 font-medium max-w-md whitespace-normal">
                                Immerse yourself in devotion. Stream thousands of high-quality, ad-free Bhajans, Mantras, and Aartis designed to elevate your environment.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link
                                href="/bhajan"
                                className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-800 transition-colors"
                            >
                                Listen Now →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function LanguageSection() {
    return (
        <section className="w-full py-12 md:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                        Speaks Your Language, Understands Your Heart
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        SMART मूर्ति companions speak fluently in <strong>all major world languages</strong>, including every Indian language. Have natural conversations in your mother tongue!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <LanguageCard
                        title="Indian Languages"
                        languages={indianLanguages}
                        iconBg="from-orange-500 to-amber-600"
                        checkColor="text-orange-500"
                        border="border-orange-100 hover:border-orange-200"
                    />
                    <LanguageCard
                        title="Global Languages"
                        languages={globalLanguages}
                        iconBg="from-blue-500 to-cyan-600"
                        checkColor="text-blue-500"
                        border="border-blue-100 hover:border-blue-200"
                    />
                </div>

                <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-orange-200 shadow-lg">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                        🗣️ Speak in Your Mother Tongue
                    </p>
                    <p className="text-gray-700 text-lg">
                        No matter where you&apos;re from or what language you speak, SMART मूर्ति understands you perfectly and responds naturally in your preferred language!
                    </p>
                </div>
            </div>
        </section>
    );
}

function LanguageCard({
    title,
    languages,
    iconBg,
    checkColor,
    border,
}: {
    title: string;
    languages: string[];
    iconBg: string;
    checkColor: string;
    border: string;
}) {
    return (
        <div
            className={`bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl ${border} transition-all hover:shadow-2xl`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`bg-gradient-to-br ${iconBg} p-3 rounded-full shadow-md`}>
                    <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {languages.map((language) => (
                    <div key={language} className="flex items-center gap-2">
                        <span className={checkColor}>✓</span>
                        <span className="text-gray-700">{language}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HowItWorksSection() {
    return (
        <section className="w-full py-12 md:py-20 bg-gradient-to-b from-white to-purple-50">
            <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600">
                        Three simple steps to meaningful conversations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {howItWorksSteps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-6">
                                    <div
                                        className={`absolute inset-0 ${step.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`}
                                    />
                                    <div
                                        className={`relative bg-gradient-to-br ${step.gradient} p-6 rounded-full shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className="h-12 w-12 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg">
                                        <span className={`text-lg font-bold ${step.badge}`}>
                                            {step.number}
                                        </span>
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold ${step.text} mb-3`}>
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
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
        <section className="w-full py-12 md:py-16 bg-gradient-to-br from-purple-900 to-purple-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="container px-4 md:px-6 max-w-screen-lg mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-lora text-white mb-4">
                        Built on Trust &amp; Privacy
                    </h2>
                    <p className="text-purple-200 text-lg">
                        Your wellbeing is our priority
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {trustCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 shadow-lg"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`${card.bg} p-4 rounded-full mb-4 shadow-lg`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-purple-100 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

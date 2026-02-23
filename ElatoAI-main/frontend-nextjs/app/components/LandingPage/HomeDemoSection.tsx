"use client";

import { useState } from "react";
import DemoForm, { GuestData } from "@/app/landing-2/components/DemoForm";
import DemoSession from "@/app/landing-2/components/DemoSession";
import { Phone, MessageCircle } from "lucide-react";

export default function HomeDemoSection() {
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
        <>
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

            <section className="w-full min-h-[60vh] md:h-screen relative flex items-end md:items-center justify-center bg-black">
                <img
                    src="/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.webp"
                    alt="Smart Murti Demo"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/40 md:via-transparent" />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12 md:pb-0 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">
                        Experience the Divine Connection
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-sm">
                        Talk directly to our AI Pandit and experience personalized spiritual guidance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-[800px] mx-auto mt-12 gap-6 px-4">
                        <button
                            onClick={() => handleStartDemo("call")}
                            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-orange-500/20"
                        >
                            <Phone className="w-5 h-5" />
                            Live Call
                        </button>
                        <button
                            onClick={() => handleStartDemo("chat")}
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Live Chat
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

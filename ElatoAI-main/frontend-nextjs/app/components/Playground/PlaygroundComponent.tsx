"use client";

import React, { useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/db/users";
import _ from "lodash";
import PersonalityFilters from "./PersonalityFilters";
import { TranscriptProvider } from "../Realtime/contexts/TranscriptContext";
import { EventProvider } from "../Realtime/contexts/EventContext";
import App from "../Realtime/App";
import { defaultPersonalityId } from "@/lib/data";
import UserPersonalities from "./UserPersonalities";
import HoroscopeHero from "../HoroscopeHero";
import { Sparkles, Sun, Moon, Sunset } from "lucide-react";

interface PlaygroundProps {
    currentUser: IUser;
    allPersonalities: IPersonality[];
    myPersonalities: IPersonality[];
}

const Playground: React.FC<PlaygroundProps> = ({
    currentUser,
    allPersonalities,
    myPersonalities,
}) => {
    const isDoctor = currentUser.user_info.user_type === "doctor";

    const supabase = createClient();

    const [personalityIdState, setPersonalityIdState] = useState<string>(
        currentUser.personality!.personality_id ?? defaultPersonalityId
    );

    const [selectedFilters, setSelectedFilters] = useState<PersonalityFilter[]>(
        []
    );

    // Time-based greeting
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: "Good Morning", icon: <Sun className="w-6 h-6 text-amber-500" />, emoji: "🌅" };
        if (hour < 17) return { text: "Good Afternoon", icon: <Sun className="w-6 h-6 text-orange-500" />, emoji: "☀️" };
        if (hour < 21) return { text: "Good Evening", icon: <Sunset className="w-6 h-6 text-purple-500" />, emoji: "🌇" };
        return { text: "Good Night", icon: <Moon className="w-6 h-6 text-indigo-400" />, emoji: "🌙" };
    }, []);

    const userName = currentUser.supervisee_name || "Friend";

    const onPersonalityPicked = async (personalityIdPicked: string) => {
        setPersonalityIdState(personalityIdPicked);
        await updateUser(
            supabase,
            {
                personality_id: personalityIdPicked,
            },
            currentUser.user_id
        );
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] py-6 md:py-10 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col w-full gap-10">

                {/* ===== Hero Greeting Section ===== */}
                <div className="relative overflow-hidden rounded-3xl mx-2 md:mx-0">
                    {/* Glassmorphism card */}
                    <div className="relative z-10 p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-3 flex-1">
                                {/* Greeting badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-100/50">
                                    {greeting.icon}
                                    <span className="text-sm font-medium text-gray-600">{greeting.text}</span>
                                </div>

                                {/* Main heading */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-lora text-gray-900 tracking-tight leading-tight">
                                    Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-600">{userName}</span> 🙏
                                </h1>

                                {/* Blessing text */}
                                <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
                                    {isDoctor
                                        ? "Your patients are waiting. Start a healing conversation."
                                        : "May the stars guide your path today. Choose an avatar to begin."
                                    }
                                </p>
                            </div>

                            {/* Connect Button */}
                            <div className="w-fit flex-shrink-0">
                                <TranscriptProvider>
                                    <EventProvider>
                                        <App personalityIdState={personalityIdState} isDoctor={isDoctor} userId={currentUser.user_id} />
                                    </EventProvider>
                                </TranscriptProvider>
                            </div>
                        </div>

                        {/* Decorative floating sparkles */}
                        <div className="absolute top-4 right-4 animate-float opacity-20 pointer-events-none">
                            <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="absolute bottom-6 right-20 animate-float opacity-10 pointer-events-none" style={{ animationDelay: '1s' }}>
                            <Sparkles className="w-6 h-6 text-amber-400" />
                        </div>
                    </div>
                </div>

                {/* ===== Horoscope Section ===== */}
                <div className="w-full px-2 md:px-0">
                    <HoroscopeHero currentUser={currentUser} />
                </div>

                {/* ===== Divider ===== */}
                <div className="flex items-center gap-4 px-4 md:px-0">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                    <span className="text-sm font-medium text-gray-400 tracking-wide">EXPLORE AVATARS</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                </div>

                {/* ===== Personalities Grid ===== */}
                <div className="flex flex-col gap-6 px-2 md:px-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-lora tracking-tight">Your Avatars</h2>
                            <div className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                {allPersonalities.length}
                            </div>
                        </div>
                        <PersonalityFilters
                            setSelectedFilters={setSelectedFilters}
                            selectedFilters={selectedFilters}
                            languageState={'en-US'}
                            currentUser={currentUser}
                        />
                    </div>

                    <UserPersonalities
                        selectedFilters={selectedFilters}
                        onPersonalityPicked={onPersonalityPicked}
                        personalityIdState={personalityIdState}
                        languageState={'en-US'}
                        disableButtons={false}
                        allPersonalities={isDoctor
                            ? allPersonalities.filter(p => p.is_story || p.is_doctor)
                            : allPersonalities}
                        myPersonalities={myPersonalities}
                    />
                </div>
            </div>
        </div>
    );
};

export default Playground;
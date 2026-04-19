"use client";

import { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import type { UserProfileData } from "@/app/types/UserProfileData";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function ClientPage({ userProfile }: { userProfile: UserProfileData | null }) {
    const HOST_ROOM_STORAGE_KEY = "smartmurti-astrologer-host-room";
    const [hasJoined, setHasJoined] = useState(false);
    const [participants, setParticipants] = useState<string[]>(userProfile ? [userProfile.name] : []);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>("");
    const [isOriginalHost, setIsOriginalHost] = useState<boolean>(false);

    useEffect(() => {
        const room = searchParams.get('room');
        const hostParam = searchParams.get('host');
        const storedHostRoom =
            typeof window !== "undefined"
                ? window.sessionStorage.getItem(HOST_ROOM_STORAGE_KEY)
                : null;
        if (room) {
            setRoomId(room);
            setIsOriginalHost(hostParam === "1" || storedHostRoom === room);
        } else {
            const newRoom = `astrologer-${uuidv4()}`;
            setRoomId(newRoom);
            setIsOriginalHost(true);
            if (typeof window !== "undefined") {
                window.sessionStorage.setItem(HOST_ROOM_STORAGE_KEY, newRoom);
            }
            router.replace(`/astrologer?room=${newRoom}&host=1`);
        }
    }, [searchParams, router]);

    const handleJoin = (names?: string[]) => {
        try {
            const ctx = getSharedAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
                console.log("🔊 WebAudio Context resumed via user gesture");
            }
        } catch (e) {
            console.error("Failed to resume WebAudio:", e);
        }

        if (names) {
            setParticipants(names);
        }
        setHasJoined(true);
    };

    const handleLeave = () => {
        window.location.href = "/home";
    };

    if (!hasJoined) {
        if (userProfile) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white font-sans selection:bg-indigo-500/30">
                    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-center"
                        >
                            <div className="mb-6">
                                <img
                                    src={userProfile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userProfile.name)}`}
                                    alt={userProfile.name}
                                    className="w-20 h-20 rounded-full mx-auto border-2 border-amber-400/50 object-cover shadow-lg"
                                />
                            </div>

                            <h1 className="text-2xl font-bold font-lora mb-1 tracking-tight">
                                Namaste, {userProfile.name} ✨
                            </h1>
                            <p className="text-gray-400 text-sm mb-6">
                                Enter the astrology specialist lane inside Smart Murti
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {userProfile.zodiacSign && (
                                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                                        ♈ {userProfile.zodiacSign}
                                    </span>
                                )}
                                {userProfile.dateOfBirth && (
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                                        🎂 {new Date(userProfile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                )}
                                {userProfile.rashi && (
                                    <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                                        🌙 {userProfile.rashi}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleJoin()}
                                className="w-full group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all overflow-hidden text-lg"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Star className="w-5 h-5" /> Enter Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white font-sans selection:bg-indigo-500/30">
                <JoinScreen onJoin={handleJoin} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white font-sans selection:bg-indigo-500/30">
            <CallScreen
                participants={participants}
                roomId={roomId}
                onLeave={handleLeave}
                isOriginalHost={isOriginalHost}
                userAvatarUrl={userProfile?.avatarUrl || null}
                userProfile={userProfile || undefined}
            />
        </div>
    );
}


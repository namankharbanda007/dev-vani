"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import type { UserProfileData } from "@/app/types/UserProfileData";

export default function ClientPage({ userProfile }: { userProfile: UserProfileData | null }) {
    const hostRoomStorageKey = "smartmurti-astrologer-host-room";
    const [hasJoined, setHasJoined] = useState(false);
    const [participants, setParticipants] = useState<string[]>(userProfile ? [userProfile.name] : []);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>("");
    const [isOriginalHost, setIsOriginalHost] = useState<boolean>(false);

    useEffect(() => {
        const room = searchParams.get("room");
        const hostParam = searchParams.get("host");
        const storedHostRoom =
            typeof window !== "undefined"
                ? window.sessionStorage.getItem(hostRoomStorageKey)
                : null;

        if (room) {
            setRoomId(room);
            setIsOriginalHost(hostParam === "1" || storedHostRoom === room);
            return;
        }

        const newRoom = `astrologer-${uuidv4()}`;
        setRoomId(newRoom);
        setIsOriginalHost(true);
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(hostRoomStorageKey, newRoom);
        }
        router.replace(`/astrologer?room=${newRoom}&host=1`);
    }, [searchParams, router]);

    const handleJoin = (names?: string[]) => {
        try {
            const ctx = getSharedAudioContext();
            if (ctx.state === "suspended") {
                ctx.resume();
                console.log("WebAudio context resumed via user gesture");
            }
        } catch (error) {
            console.error("Failed to resume WebAudio:", error);
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
        return (
            <div className="min-h-screen bg-[#fffaf2] font-sans text-[#20130b]">
                <JoinScreen onJoin={handleJoin} initialName={userProfile?.name} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 font-sans text-white selection:bg-indigo-500/30">
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

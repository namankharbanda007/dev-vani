"use client";

import { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function ClientPage({ initialUser, initialAvatarUrl }: { initialUser: string | null; initialAvatarUrl?: string | null }) {
    const [hasJoined, setHasJoined] = useState(false);
    const [participants, setParticipants] = useState<string[]>(initialUser ? [initialUser] : []);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>("");
    const [isOriginalHost, setIsOriginalHost] = useState<boolean>(false);

    useEffect(() => {
        const room = searchParams.get('room');
        if (room) {
            setRoomId(room);
        } else {
            const newRoom = uuidv4();
            setRoomId(newRoom);
            setIsOriginalHost(true);
            router.replace(`/astrologer?room=${newRoom}`);
        }
    }, [searchParams, router]);

    const handleJoin = (names: string[]) => {
        try {
            const ctx = getSharedAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
                console.log("🔊 WebAudio Context resumed via user gesture");
            }
        } catch (e) {
            console.error("Failed to resume WebAudio:", e);
        }

        setParticipants(names);
        setHasJoined(true);
    };

    const handleLeave = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white font-sans selection:bg-indigo-500/30">
            {!hasJoined ? (
                <JoinScreen onJoin={handleJoin} initialName={initialUser} />
            ) : (
                <CallScreen participants={participants} roomId={roomId} onLeave={handleLeave} isOriginalHost={isOriginalHost} userAvatarUrl={initialAvatarUrl || null} />
            )}
        </div>
    );
}

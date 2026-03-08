"use client";

import { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function ClientPage({ initialUser, initialAvatarUrl }: { initialUser: string | null; initialAvatarUrl?: string | null }) {
    // Always start with hasJoined = false so the user must click "Join" to capture the user gesture (prevents AudioContext crash).
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
            const newRoom = `pandit-${uuidv4()}`;
            setRoomId(newRoom);
            setIsOriginalHost(true);
            // Push the generated room to the URL so the user sees they are in a specific session
            router.replace(`/pandit?room=${newRoom}`);
        }
    }, [searchParams, router]);

    const handleJoin = (names: string[]) => {
        // Eagerly resume Web Audio context during this exact user gesture (crucial for mobile Safari/Android)
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
        window.location.href = "/"; // Go back home on leave
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-purple-500/30">
            {!hasJoined ? (
                <JoinScreen onJoin={handleJoin} initialName={initialUser} />
            ) : (
                <CallScreen participants={participants} roomId={roomId} onLeave={handleLeave} isOriginalHost={isOriginalHost} userAvatarUrl={initialAvatarUrl || null} />
            )}
        </div>
    );
}


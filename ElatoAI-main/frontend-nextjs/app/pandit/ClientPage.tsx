"use client";

import { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen from "./components/CallScreen";

export default function ClientPage({ initialUser }: { initialUser: string | null }) {
    // Always start with hasJoined = false so the user must click "Join" to capture the user gesture (prevents AudioContext crash).
    const [hasJoined, setHasJoined] = useState(false);
    const [participants, setParticipants] = useState<string[]>(initialUser ? [initialUser] : []);

    const handleJoin = (names: string[]) => {
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
                <CallScreen participants={participants} onLeave={handleLeave} />
            )}
        </div>
    );
}

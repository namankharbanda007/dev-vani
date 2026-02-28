"use client";

import { useState } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen from "./components/CallScreen";

export default function PanditCallPage() {
    const [hasJoined, setHasJoined] = useState(false);
    const [participants, setParticipants] = useState<string[]>([]);

    const handleJoin = (names: string[]) => {
        setParticipants(names);
        setHasJoined(true);
    };

    const handleLeave = () => {
        setHasJoined(false);
        setParticipants([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-purple-500/30">
            {!hasJoined ? (
                <JoinScreen onJoin={handleJoin} />
            ) : (
                <CallScreen participants={participants} onLeave={handleLeave} />
            )}
        </div>
    );
}

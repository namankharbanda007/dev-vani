import React from "react";
import ActiveCallAvatar from "./ActiveCallAvatar";
import { PhoneOff } from "lucide-react";

interface ActiveCallViewProps {
    personality: any;
    state: "listening" | "speaking" | "idle" | "connecting";
    onEndCall?: () => void;
}

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ personality, state, onEndCall }) => {
    return (
        <div className="flex flex-col items-center justify-between h-full w-full bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden py-8 px-4">

            {/* Background Ambient Effect (Optional) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50 z-0 pointer-events-none" />

            {/* Top Section - Status */}
            <div className="z-10 text-gray-400 text-sm tracking-widest uppercase opacity-70">
                {state === 'connecting' && "Connecting..."}
                {state === 'listening' && "Listening..."}
                {state === 'speaking' && "Speaking..."}
                {state === 'idle' && "Interactive"}
            </div>

            {/* Middle Section - Avatar & Title */}
            <div className="z-10 flex flex-col items-center gap-4 flex-1 justify-center">
                {/* Avatar with Aura */}
                <ActiveCallAvatar personality={personality} state={state} />

                {/* Character Title */}
                <h2 className="text-2xl font-light tracking-wide text-white/90">
                    {personality.title}
                </h2>
            </div>

            {/* Bottom Section - End Call Button */}
            {onEndCall && (
                <button
                    onClick={onEndCall}
                    className="z-10 flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:scale-105"
                >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                </button>
            )}

        </div>
    );
};

export default ActiveCallView;

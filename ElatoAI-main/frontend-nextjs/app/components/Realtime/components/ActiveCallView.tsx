import React from "react";
import ActiveCallAvatar from "./ActiveCallAvatar";
import { Mic, PhoneOff, Sparkles, Volume2 } from "lucide-react";

interface ActiveCallViewProps {
    personality: any;
    state: "listening" | "speaking" | "idle" | "connecting";
    onEndCall?: () => void;
}

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ personality, state, onEndCall }) => {
    const statusCopy = {
        connecting: "Preparing the line",
        listening: "Listening",
        speaking: "Speaking",
        idle: "Ready",
    }[state];

    const helperCopy = state === "connecting"
        ? "Keep this panel open while we connect your guide."
        : state === "speaking"
            ? "Smart Pandit is answering. You can interrupt naturally."
            : "Ask your question in your normal voice.";

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(180deg,#fff8ee_0%,#f8eddb_52%,#f4e4cc_100%)] px-5 py-6 text-[#24170f]">

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,197,108,0.34),_transparent_35%)]" />

            <div className="relative z-10 flex items-start justify-between gap-4 pr-10">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        Live guidance
                    </div>
                    <h2 className="mt-3 max-w-[300px] font-lora text-2xl font-semibold leading-tight text-[#24170f]">
                        {personality.title}
                    </h2>
                </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 py-6">
                <ActiveCallAvatar personality={personality} state={state} />

                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#24170f] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(36,23,15,0.18)]">
                        {state === "speaking" ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {statusCopy}
                    </div>
                    <p className="max-w-[300px] text-sm leading-6 text-[#6f5842]">
                        {helperCopy}
                    </p>
                </div>
            </div>

            {onEndCall && (
                <button
                    onClick={onEndCall}
                    className="relative z-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c7352f] px-6 py-4 font-semibold text-white shadow-[0_16px_34px_rgba(199,53,47,0.22)] transition hover:bg-[#ad2d28] active:scale-[0.98]"
                >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                </button>
            )}
        </div>
    );
};

export default ActiveCallView;

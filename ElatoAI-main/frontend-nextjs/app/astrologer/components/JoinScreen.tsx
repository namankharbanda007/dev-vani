"use client";

import { useState } from "react";
import { ArrowRight, CalendarClock, Mic, ShieldCheck, Users } from "lucide-react";

interface JoinScreenProps {
    onJoin: (names: string[]) => void;
    initialName?: string | null;
}

export default function JoinScreen({ onJoin, initialName }: JoinScreenProps) {
    const [displayName, setDisplayName] = useState(initialName || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = displayName.trim() || "Guest";
        onJoin([cleanName]);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[0.95fr_1.05fr]">
                <section className="rounded-lg border border-amber-100 bg-white p-8 shadow-sm">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                        Astrology specialist lane
                    </p>
                    <h1 className="font-lora text-4xl font-bold leading-tight text-[#20130b] md:text-5xl">
                        Ask for chart context after Smart Pandit guidance
                    </h1>
                    <p className="mt-5 leading-8 text-[#5b4837]">
                        This room is for horoscope, birth-chart, timing, and compatibility questions.
                        For puja or family ritual needs, Smart Pandit remains the main path.
                    </p>

                    <div className="mt-8 grid gap-4">
                        <TrustLine icon={Users} title="NRI family context" body="Use one family name or invite relatives from separate devices." />
                        <TrustLine icon={CalendarClock} title="Useful for timing" body="Ask about dates, muhurtas, career moves, and family decisions." />
                        <TrustLine icon={ShieldCheck} title="Guidance, not certainty" body="Astrology answers are spiritual guidance and should not replace professional advice." />
                    </div>
                </section>

                <section className="rounded-lg border border-amber-100 bg-[#20130b] p-8 text-white shadow-xl">
                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg border border-amber-300/40 bg-amber-300/15">
                            <Mic className="h-7 w-7 text-amber-200" />
                        </div>
                        <h2 className="font-lora text-3xl font-bold">Join Live Astrology Session</h2>
                        <p className="mt-3 text-sm leading-6 text-white/70">
                            Join as one person on this device. The AI Astrologer will use the display name you enter.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="ml-1 block text-sm font-medium text-white/80">
                                Display name
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Users className="h-5 w-5 text-white/45" />
                                </div>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Naman or Sharma Family"
                                    className="w-full rounded-lg border border-white/15 bg-white/10 py-3 pl-11 pr-4 font-medium text-white placeholder-white/45 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/30"
                                    required
                                />
                            </div>
                            <p className="ml-1 text-xs text-white/55">Use the name the astrologer should use in the room.</p>
                        </div>

                        <div className="flex gap-4 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
                            <Mic className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                            <div className="text-sm leading-relaxed text-amber-50/80">
                                <strong>Group audio:</strong> everyone in the room can speak, and the AI Astrologer responds to the group.
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-6 py-3.5 font-semibold text-black shadow-lg transition hover:bg-[#f4c80d]"
                        >
                            Join Session
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

function TrustLine({
    icon: Icon,
    title,
    body,
}: {
    icon: typeof Users;
    title: string;
    body: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <h3 className="font-semibold text-[#20130b]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#5b4837]">{body}</p>
            </div>
        </div>
    );
}

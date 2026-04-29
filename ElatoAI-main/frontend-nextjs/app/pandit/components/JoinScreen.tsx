"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Mic,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import type { LivePujaRitual } from "@/lib/livePujaRituals";

interface JoinScreenProps {
  onJoin: (names: string[]) => void;
  initialName?: string | null;
  ritual: LivePujaRitual;
}

export default function JoinScreen({ onJoin, initialName, ritual }: JoinScreenProps) {
  const [displayName, setDisplayName] = useState(initialName || "");
  const [familyRole, setFamilyRole] = useState("Family member");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = displayName.trim() || "Guest";
    onJoin([familyRole ? `${cleanName} (${familyRole})` : cleanName]);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute left-[-8%] top-[15%] h-72 w-72 rounded-full bg-amber-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[-6%] h-80 w-80 rounded-full bg-purple-400/20 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90">
              <Video className="h-4 w-4 text-amber-300" />
              <span>{ritual.title}</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-lora text-3xl font-bold leading-tight text-white md:text-5xl">
                Join one shared{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-purple-200 bg-clip-text text-transparent">
                  Smart Pandit
                </span>{" "}
                room.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Join as one person on this device. Smart Pandit will guide the
                {` ${ritual.shortTitle} `}flow and keep the family context in mind.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck className="h-5 w-5 text-amber-300" />
                <p className="mt-3 text-sm font-semibold text-white">
                  Structured ritual flow
                </p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  {ritual.sankalpHint}.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Users className="h-5 w-5 text-purple-200" />
                <p className="mt-3 text-sm font-semibold text-white">
                  Family joins together
                </p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Everyone can join the same {ritual.shortTitle} room, even from different countries.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <AudioLines className="h-5 w-5 text-amber-200" />
                <p className="mt-3 text-sm font-semibold text-white">
                  Voice-first conversation
                </p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Speak naturally, ask questions, and let Smart Pandit guide the room.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(16,14,24,0.62)] p-6">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10">
                <Mic className="h-8 w-8 text-amber-300" />
              </div>
              <h2 className="font-lora text-3xl font-bold tracking-tight text-white">
                Enter the room
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Use the name Smart Pandit should use for this device in the room.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Your display name
                </label>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-1">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Naman or Sharma Family"
                    className="w-full rounded-[14px] border-none bg-transparent px-4 py-3 text-white placeholder:text-white/35 focus:outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-white/45">
                  Example: Naman
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Family role
                </label>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-1">
                  <select
                    value={familyRole}
                    onChange={(e) => setFamilyRole(e.target.value)}
                    className="w-full rounded-[14px] border-none bg-transparent px-4 py-3 text-white focus:outline-none"
                  >
                    <option className="bg-[#15111f] text-white">Family member</option>
                    <option className="bg-[#15111f] text-white">Host</option>
                    <option className="bg-[#15111f] text-white">Parent</option>
                    <option className="bg-[#15111f] text-white">Elder</option>
                    <option className="bg-[#15111f] text-white">Child</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
                <p className="text-sm font-semibold text-amber-100">
                  Live audio is active in this room
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/75">
                  Everyone can speak naturally. Smart Pandit will lead {ritual.title} and respond live.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 px-6 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(124,58,237,0.28)]"
              >
                Join live puja
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

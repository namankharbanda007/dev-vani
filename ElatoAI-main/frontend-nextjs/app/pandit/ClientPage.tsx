"use client";

import { useState, useEffect, useMemo } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import type { UserProfileData } from "@/app/types/UserProfileData";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export default function ClientPage({
  userProfile,
}: {
  userProfile: UserProfileData | null;
}) {
  const [hasJoined, setHasJoined] = useState(false);
  const [participants, setParticipants] = useState<string[]>(
    userProfile ? [userProfile.name] : []
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [isOriginalHost, setIsOriginalHost] = useState<boolean>(false);

  useEffect(() => {
    const room = searchParams.get("room");
    if (room) {
      setRoomId(room);
    } else {
      const newRoom = `pandit-${uuidv4()}`;
      setRoomId(newRoom);
      setIsOriginalHost(true);
      router.replace(`/pandit?room=${newRoom}`);
    }
  }, [searchParams, router]);

  const handleJoin = (names?: string[]) => {
    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
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

  const roomLabel = useMemo(() => {
    if (!roomId) return "Preparing room...";
    return roomId.replace("pandit-", "").slice(0, 8).toUpperCase();
  }, [roomId]);

  if (!hasJoined) {
    if (userProfile) {
      return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#fff9f1_0%,#fff4e8_50%,#f6effd_100%)] text-gray-900 selection:bg-purple-200/50">
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            <div className="pointer-events-none absolute left-[-8%] top-[12%] h-72 w-72 rounded-full bg-amber-200/35 blur-[110px]" />
            <div className="pointer-events-none absolute bottom-[8%] right-[-4%] h-80 w-80 rounded-full bg-purple-200/35 blur-[120px]" />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#eadfce] bg-white/86 shadow-[0_24px_80px_rgba(84,58,28,0.12)] backdrop-blur-xl"
            >
              <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:p-10">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-sm font-medium text-amber-900">
                      <Sparkles className="h-4 w-4" />
                      <span>Smart Pandit live room</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/90 px-3 py-1.5 text-sm font-medium text-purple-700">
                      <Users className="h-4 w-4" />
                      <span>Room {roomLabel}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="font-lora text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                      Enter your{" "}
                      <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-amber-700 bg-clip-text text-transparent">
                        Smart Pandit
                      </span>{" "}
                      room, {userProfile.name}.
                    </h1>
                    <p className="max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                      This is the premium live family space, one room where your
                      family joins, Smart Pandit leads, and everyone can speak
                      naturally.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-[#fffaf3] p-4">
                      <ShieldCheck className="h-5 w-5 text-amber-700" />
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        Family ritual ready
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Best for puja, blessings, and urgent spiritual guidance.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-[#faf6ff] p-4">
                      <Users className="h-5 w-5 text-purple-700" />
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        Shared participation
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Family members across cities and countries can join one room.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-[#fff8ef] p-4">
                      <HeartHandshake className="h-5 w-5 text-rose-700" />
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        Personal context
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Smart Pandit can respond with your family and ritual context in mind.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleJoin()}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 px-6 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(124,58,237,0.28)]"
                    >
                      <AudioLines className="h-5 w-5" />
                      Enter live puja room
                    </button>
                    <button
                      onClick={() => (window.location.href = "/home")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-800 transition hover:border-purple-200 hover:bg-purple-50/40"
                    >
                      Back to home
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffefb_0%,#fff8ef_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        userProfile.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          userProfile.name
                        )}`
                      }
                      alt={userProfile.name}
                      className="h-20 w-20 rounded-full border-2 border-amber-200 object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Joining as
                      </p>
                      <h2 className="mt-2 font-lora text-2xl font-bold text-gray-900">
                        {userProfile.name}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {userProfile.zodiacSign ? (
                      <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                        {userProfile.zodiacSign}
                      </span>
                    ) : null}
                    {userProfile.dateOfBirth ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {new Date(userProfile.dateOfBirth).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    ) : null}
                    {userProfile.rashi ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                        {userProfile.rashi}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      What happens next
                    </p>
                    <ol className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
                      <li>1. You enter the live room and camera/mic connect.</li>
                      <li>2. Family can join from the same shared link.</li>
                      <li>3. Smart Pandit leads the puja and responds live.</li>
                    </ol>
                  </div>

                  <button
                    onClick={() => handleJoin()}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
                  >
                    Continue as {userProfile.name}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,178,0.12),transparent_32%),linear-gradient(180deg,#1f1b2d_0%,#120f19_100%)] text-white selection:bg-purple-500/30">
        <JoinScreen onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-purple-500/30">
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

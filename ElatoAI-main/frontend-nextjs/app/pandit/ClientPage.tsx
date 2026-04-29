"use client";

import { useState, useEffect, useMemo } from "react";
import JoinScreen from "./components/JoinScreen";
import CallScreen, { getSharedAudioContext } from "./components/CallScreen";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  DEFAULT_LIVE_PUJA_RITUAL_ID,
  LIVE_PUJA_RITUALS,
  getLivePujaRitual,
  isLivePujaRitualId,
} from "@/lib/livePujaRituals";

export default function ClientPage({
  userProfile,
}: {
  userProfile: UserProfileData | null;
}) {
  const HOST_ROOM_STORAGE_KEY = "smartmurti-pandit-host-room";
  const [hasJoined, setHasJoined] = useState(false);
  const [participants, setParticipants] = useState<string[]>(
    userProfile ? [userProfile.name] : []
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [inviteToken, setInviteToken] = useState<string>("");
  const [roomSetupError, setRoomSetupError] = useState<string | null>(null);
  const [isOriginalHost, setIsOriginalHost] = useState<boolean>(false);
  const [selectedRitualId, setSelectedRitualId] = useState<string>("");

  useEffect(() => {
    const room = searchParams.get("room");
    const invite = searchParams.get("invite") || "";
    const hostParam = searchParams.get("host");
    const ritualParam = searchParams.get("ritual");
    const resolvedRitualId = isLivePujaRitualId(ritualParam)
      ? ritualParam
      : room
        ? DEFAULT_LIVE_PUJA_RITUAL_ID
        : "";

    setSelectedRitualId(resolvedRitualId);

    const storedHostRoom =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(HOST_ROOM_STORAGE_KEY)
        : null;

    if (room) {
      setRoomId(room);
      setInviteToken(invite);
      setIsOriginalHost(hostParam === "1" || storedHostRoom === room);
    } else {
      if (!resolvedRitualId) {
        return;
      }

      let cancelled = false;

      const createRoom = async () => {
        try {
          setRoomSetupError(null);
          const response = await fetch("/api/live-puja/rooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              participantName: userProfile?.name,
              ritualId: resolvedRitualId,
            }),
          });
          const payload = await response.json().catch(() => null);

          if (!response.ok || !payload?.roomId || !payload?.inviteToken) {
            throw new Error(payload?.error || "Could not create the live puja room.");
          }

          if (cancelled) return;

          setRoomId(payload.roomId);
          setInviteToken(payload.inviteToken);
          setIsOriginalHost(true);
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(HOST_ROOM_STORAGE_KEY, payload.roomId);
          }
          router.replace(`/pandit?room=${encodeURIComponent(payload.roomId)}&invite=${encodeURIComponent(payload.inviteToken)}&ritual=${encodeURIComponent(resolvedRitualId)}&host=1`);
        } catch (error) {
          if (!cancelled) {
            setRoomSetupError(error instanceof Error ? error.message : "Could not create the live puja room.");
          }
        }
      };

      void createRoom();
      return () => {
        cancelled = true;
      };
    }
  }, [searchParams, router, userProfile?.name]);

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

  const selectedRitual = useMemo(
    () => getLivePujaRitual(selectedRitualId || DEFAULT_LIVE_PUJA_RITUAL_ID),
    [selectedRitualId]
  );

  const handleRitualSelect = (ritualId: string) => {
    router.push(`/pandit?ritual=${encodeURIComponent(ritualId)}`);
  };

  if (!hasJoined) {
    if (roomSetupError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f1e6] px-4 text-[#2b1d12]">
          <div className="max-w-md rounded-[28px] border border-[#eadfcf] bg-white p-8 text-center shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#aa7b2b]">Room setup</p>
            <h1 className="mt-3 font-lora text-3xl">Could not open live puja</h1>
            <p className="mt-3 text-sm leading-6 text-[#6d5843]">{roomSetupError}</p>
            <button
              onClick={() => router.replace("/login")}
              className="mt-6 rounded-full bg-[#7a4b18] px-6 py-3 text-sm font-semibold text-white"
            >
              Sign in again
            </button>
          </div>
        </div>
      );
    }

    if (userProfile && !selectedRitualId) {
      return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#fff9f1_0%,#fff4e8_58%,#f8efe2_100%)] text-[#2b1d12]">
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            <div className="pointer-events-none absolute left-[-8%] top-[12%] h-72 w-72 rounded-full bg-amber-200/40 blur-[110px]" />
            <div className="pointer-events-none absolute bottom-[8%] right-[-4%] h-80 w-80 rounded-full bg-orange-200/35 blur-[120px]" />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-6xl rounded-[32px] border border-[#eadfce] bg-white/88 p-6 shadow-[0_24px_80px_rgba(84,58,28,0.12)] backdrop-blur-xl md:p-8"
            >
              <div className="flex flex-col gap-3 md:max-w-3xl">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900">
                  <Sparkles className="h-4 w-4" />
                  Live family puja setup
                </div>
                <h1 className="font-lora text-3xl font-bold leading-tight text-[#26190f] md:text-5xl">
                  Choose the puja before opening the family room.
                </h1>
                <p className="text-base leading-8 text-[#6d5843] md:text-lg">
                  Smart Pandit will use this ritual, samagri, and sankalp context when the host starts the live session.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {LIVE_PUJA_RITUALS.map((ritual) => (
                  <button
                    key={ritual.id}
                    onClick={() => handleRitualSelect(ritual.id)}
                    className="group rounded-[26px] border border-[#eadfce] bg-[#fffaf3] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d5ad67] hover:bg-[#fff5e6] hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#aa7b2b]">
                          {ritual.durationLabel}
                        </p>
                        <h2 className="mt-2 font-lora text-2xl font-bold text-[#26190f]">
                          {ritual.title}
                        </h2>
                      </div>
                      <ArrowRight className="mt-2 h-5 w-5 text-[#8f5d23] transition group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#66513d]">
                      {ritual.description}
                    </p>
                    <p className="mt-4 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-medium text-[#5a4632]">
                      Sankalp: {ritual.sankalpHint}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

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
                      This is your {selectedRitual.title} room, one place where your
                      family joins, Smart Pandit leads, and everyone can speak
                      naturally.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-[#fffaf3] p-4">
                      <ShieldCheck className="h-5 w-5 text-amber-700" />
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        {selectedRitual.shortTitle} ready
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {selectedRitual.sankalpHint}.
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
                      Enter {selectedRitual.shortTitle} room
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
                      <li>1. Review the {selectedRitual.shortTitle} samagri and enter the room.</li>
                      <li>2. Family joins from the same shared link.</li>
                      <li>3. The host starts when everyone is ready.</li>
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
        <JoinScreen onJoin={handleJoin} ritual={selectedRitual} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#2b1d12_0%,#5a3415_52%,#1a120c_100%)] text-white font-sans selection:bg-amber-300/30">
      <CallScreen
        participants={participants}
        roomId={roomId}
        inviteToken={inviteToken}
        onLeave={handleLeave}
        isOriginalHost={isOriginalHost}
        userAvatarUrl={userProfile?.avatarUrl || null}
        userProfile={userProfile || undefined}
        ritual={selectedRitual}
      />
    </div>
  );
}

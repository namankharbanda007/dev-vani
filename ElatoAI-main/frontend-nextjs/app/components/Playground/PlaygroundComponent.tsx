"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/db/users";
import PersonalityFilters from "./PersonalityFilters";
import { TranscriptProvider } from "../Realtime/contexts/TranscriptContext";
import { EventProvider } from "../Realtime/contexts/EventContext";
import App from "../Realtime/App";
import { defaultPersonalityId } from "@/lib/data";
import UserPersonalities from "./UserPersonalities";
import HoroscopeHero from "../HoroscopeHero";
import {
  ArrowRight,
  AudioLines,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Sunset,
  Users,
  WalletCards,
} from "lucide-react";

interface PlaygroundProps {
  currentUser: IUser;
  allPersonalities: IPersonality[];
  myPersonalities: IPersonality[];
}

type IntentAction = "call" | "puja";

export default function Playground({
  currentUser,
  allPersonalities,
  myPersonalities,
}: PlaygroundProps) {
  const isDoctor = currentUser.user_info.user_type === "doctor";
  const supabase = createClient();

  const [personalityIdState, setPersonalityIdState] = useState<string>(
    currentUser.personality!.personality_id ?? defaultPersonalityId
  );
  const [selectedFilters, setSelectedFilters] = useState<PersonalityFilter[]>(
    []
  );
  const [pendingAction, setPendingAction] = useState<"call" | "chat" | null>(
    null
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: "Good Morning",
        icon: <Sun className="h-5 w-5 text-amber-500" />,
      };
    }
    if (hour < 17) {
      return {
        text: "Good Afternoon",
        icon: <Sun className="h-5 w-5 text-orange-500" />,
      };
    }
    if (hour < 21) {
      return {
        text: "Good Evening",
        icon: <Sunset className="h-5 w-5 text-purple-500" />,
      };
    }
    return {
      text: "Good Night",
      icon: <Moon className="h-5 w-5 text-indigo-400" />,
    };
  }, []);

  const userName = currentUser.supervisee_name || "Friend";
  const firstName = userName.split(" ")[0] || "Friend";

  const normalizedPersonalities = useMemo(
    () =>
      (isDoctor
        ? allPersonalities.filter((p) => p.is_story || p.is_doctor)
        : allPersonalities
      ).filter((p) => p.creator_id === null),
    [allPersonalities, isDoctor]
  );

  const currentPersonality =
    normalizedPersonalities.find(
      (p) => p.personality_id === personalityIdState
    ) ||
    normalizedPersonalities.find((p) =>
      p.title.toLowerCase().includes("pandit")
    ) ||
    normalizedPersonalities[0];

  const onPersonalityPicked = useCallback(
    async (personalityIdPicked: string) => {
      setPersonalityIdState(personalityIdPicked);
      await updateUser(
        supabase,
        {
          personality_id: personalityIdPicked,
        },
        currentUser.user_id
      );
    },
    [currentUser.user_id, supabase]
  );

  const handleCallCharacter = useCallback(() => {
    setPendingAction("call");
  }, []);

  const handleChatCharacter = useCallback(() => {
    setPendingAction("chat");
  }, []);

  const findGuide = useCallback(
    (keywords: string[]) =>
      normalizedPersonalities.find((p) => {
        const haystack = `${p.title} ${p.short_description || ""}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      }),
    [normalizedPersonalities]
  );

  const livePujaGuide =
    findGuide(["pandit ji", "ganpati havan", "satyanarayan", "sundarkand"]) ||
    currentPersonality;
  const relationshipGuide =
    findGuide(["relationship", "love", "lalit"]) || currentPersonality;
  const protectionGuide =
    findGuide(["ankshastri", "spiritual guide", "protection", "healing"]) ||
    currentPersonality;
  const financeGuide =
    findGuide(["financial", "business", "career", "path decider"]) ||
    currentPersonality;

  const launchGuide = useCallback(
    async (guide: IPersonality | undefined, action: "call" | "chat") => {
      if (!guide?.personality_id) return;
      await onPersonalityPicked(guide.personality_id);
      setPendingAction(action);
    },
    [onPersonalityPicked]
  );

  const launchIntent = useCallback(
    async (guide: IPersonality | undefined, action: IntentAction) => {
      if (!guide?.personality_id) return;
      await onPersonalityPicked(guide.personality_id);
      if (action === "puja") {
        window.location.href = "/pandit";
        return;
      }
      setPendingAction("call");
    },
    [onPersonalityPicked]
  );

  const intentLanes = useMemo(
    () => [
      {
        key: "health",
        title: "Health & Protection",
        body: "For family peace, healing, blessings, and urgent spiritual guidance.",
        icon: ShieldCheck,
        accent:
          "from-amber-50 via-orange-50 to-rose-50 border-amber-200/70",
        guide: protectionGuide,
        action: "call" as IntentAction,
      },
      {
        key: "love",
        title: "Love & Relationship",
        body: "Talk through marriage, emotions, family tension, and relationship questions.",
        icon: HeartHandshake,
        accent:
          "from-rose-50 via-pink-50 to-fuchsia-50 border-rose-200/70",
        guide: relationshipGuide,
        action: "call" as IntentAction,
      },
      {
        key: "ritual",
        title: "Family Ritual",
        body: "Move directly into a deeper Smart Pandit session or live family puja.",
        icon: Users,
        accent:
          "from-purple-50 via-violet-50 to-indigo-50 border-purple-200/70",
        guide: livePujaGuide,
        action: "puja" as IntentAction,
      },
      {
        key: "finance",
        title: "Career & Finance",
        body: "Get practical spiritual guidance for work, money, and big decisions.",
        icon: WalletCards,
        accent:
          "from-slate-50 via-zinc-50 to-stone-50 border-slate-200/80",
        guide: financeGuide,
        action: "call" as IntentAction,
      },
    ],
    [financeGuide, livePujaGuide, protectionGuide, relationshipGuide]
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1600px] flex-col py-4 md:py-8">
      <div className="flex w-full flex-col gap-8">
        <div className="relative mx-2 overflow-hidden rounded-[28px] md:mx-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.18),_transparent_38%)]" />
          <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_18px_80px_rgba(88,60,30,0.10)] backdrop-blur-xl">
            <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)] md:p-8 lg:p-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/90 px-3 py-1.5 text-sm font-medium text-amber-900">
                    {greeting.icon}
                    <span>{greeting.text}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50/90 px-3 py-1.5 text-sm font-medium text-purple-700">
                    <Sparkles className="h-4 w-4" />
                    <span>Smart Pandit is ready</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                    One trusted spiritual front door
                  </p>
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight text-gray-950 md:text-5xl font-lora">
                    Namaste,{" "}
                    <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-amber-700 bg-clip-text text-transparent">
                      {firstName}
                    </span>
                    . Talk to Smart Pandit now.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                    Start one calm spiritual conversation now. Move into puja,
                    astrology, or family guidance only when you need something
                    deeper.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => void launchGuide(currentPersonality, "call")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(124,58,237,0.28)]"
                  >
                    <AudioLines className="h-4 w-4" />
                    Talk to Smart Pandit now
                  </button>
                  <button
                    onClick={() => void launchGuide(currentPersonality, "chat")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-6 py-4 text-sm font-semibold text-gray-800 transition hover:border-purple-200 hover:bg-purple-50/40"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Open chat instead
                  </button>
                  <Link
                    href="/pandit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-6 py-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                  >
                    <Users className="h-4 w-4" />
                    Start live family puja
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Current Guide
                    </p>
                    <p className="mt-2 text-base font-semibold text-gray-900">
                      {currentPersonality?.title || "Pandit Ji"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Best For
                    </p>
                    <p className="mt-2 text-base font-semibold text-gray-900">
                      Urgent guidance, rituals, family questions
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Format
                    </p>
                    <p className="mt-2 text-base font-semibold text-gray-900">
                      Call, chat, or shared live puja
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,250,242,0.95),rgba(246,239,255,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                  What do you need today?
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 font-lora">
                  Choose your lane
                </h2>
                <div className="mt-5 grid gap-3">
                  {intentLanes.map((lane) => {
                    const Icon = lane.icon;
                    return (
                      <button
                        key={lane.key}
                        onClick={() => void launchIntent(lane.guide, lane.action)}
                        className={`group rounded-[24px] border bg-gradient-to-r px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${lane.accent}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl bg-white/80 p-3 text-gray-900 shadow-sm">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-base font-semibold text-gray-900">
                                {lane.title}
                              </p>
                              <ArrowRight className="h-4 w-4 text-gray-500 transition group-hover:translate-x-0.5" />
                            </div>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              {lane.body}
                            </p>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                              {lane.guide?.title || "Smart Pandit"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-2 md:px-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
          <div className="rounded-[28px] border border-gray-100 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Continue your journey
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 font-lora">
                  Pick up where you left off
                </h2>
              </div>
              <div className="hidden rounded-2xl bg-purple-50 p-3 text-purple-700 md:block">
                <AudioLines className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                onClick={() => void launchGuide(currentPersonality, "call")}
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Resume with {currentPersonality?.title || "Smart Pandit"}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Return to your main guide for a live spiritual conversation.
                </p>
              </button>
              <Link
                href="/pandit"
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Open family puja room
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Bring relatives into one shared Smart Pandit session.
                </p>
              </Link>
              <button
                onClick={() => void launchGuide(currentPersonality, "chat")}
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Ask a quick question
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Use chat for shorter guidance without entering a full call.
                </p>
              </button>
              <Link
                href="/astrologer"
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Go deeper with astrology
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Use the astrologer lane when the question needs birth-chart
                  context.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              Daily devotion
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 font-lora">
              Gentle daily layer
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Horoscope is useful, but it should support your spiritual
              relationship, not replace the front door.
            </p>
            <div className="mt-5">
              <HoroscopeHero currentUser={currentUser} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 md:px-0">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Specialist Lanes
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
        </div>

        <div className="flex flex-col gap-6 px-2 md:px-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-gray-800 md:text-2xl font-lora">
              Specialist Pandits & Advisors
            </h2>
            <PersonalityFilters
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              languageState="en-US"
              currentUser={currentUser}
            />
          </div>

          <UserPersonalities
            selectedFilters={selectedFilters}
            onPersonalityPicked={onPersonalityPicked}
            onCallCharacter={handleCallCharacter}
            onChatCharacter={handleChatCharacter}
            personalityIdState={personalityIdState}
            languageState="en-US"
            disableButtons={false}
            allPersonalities={normalizedPersonalities}
            myPersonalities={myPersonalities}
          />
        </div>
      </div>

      <TranscriptProvider>
        <EventProvider>
          <App
            personalityIdState={personalityIdState}
            isDoctor={isDoctor}
            userData={{ id: currentUser.user_id }}
            pendingAction={pendingAction}
            onActionHandled={() => setPendingAction(null)}
          />
        </EventProvider>
      </TranscriptProvider>
    </div>
  );
}

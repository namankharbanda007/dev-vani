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
import { DEFAULT_LIVE_PUJA_RITUAL_ID } from "@/lib/livePujaRituals";
import UserPersonalities from "./UserPersonalities";
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
type PendingCharacterAction =
  | {
      type: "call" | "chat";
      personalityId: string;
    }
  | null;

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
  const [pendingAction, setPendingAction] = useState<PendingCharacterAction>(null);

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
      ),
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

  const handleCallCharacter = useCallback((personalityId: string) => {
    setPendingAction({ type: "call", personalityId });
  }, []);

  const handleChatCharacter = useCallback((personalityId: string) => {
    setPendingAction({ type: "chat", personalityId });
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
      setPendingAction({ type: action, personalityId: guide.personality_id });
    },
    [onPersonalityPicked]
  );

  const launchIntent = useCallback(
    async (guide: IPersonality | undefined, action: IntentAction) => {
      if (!guide?.personality_id) return;
      await onPersonalityPicked(guide.personality_id);
      if (action === "puja") {
        window.location.href = `/pandit?ritual=${DEFAULT_LIVE_PUJA_RITUAL_ID}`;
        return;
      }
      setPendingAction({ type: "call", personalityId: guide.personality_id });
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
        body: "Choose a puja, prepare samagri, invite family, and start together.",
        icon: Users,
        accent:
          "from-amber-50 via-orange-50 to-yellow-50 border-amber-200/70",
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
        <div className="relative mx-2 overflow-hidden rounded-[30px] border border-[#eadfce] bg-[linear-gradient(135deg,#fffaf3_0%,#fff6eb_48%,#f7f0ff_100%)] shadow-[0_18px_70px_rgba(104,76,41,0.10)] md:mx-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.14),_transparent_30%),radial-gradient(circle_at_left_center,_rgba(251,191,36,0.16),_transparent_28%)]" />
          <div className="relative z-10 flex flex-col gap-8 p-6 md:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-amber-900">
                {greeting.icon}
                <span>{greeting.text}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-700">
                <Sparkles className="h-4 w-4" />
                <span>Smart Pandit concierge</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] lg:items-end">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                    One trusted spiritual front door
                  </p>
                  <h1 className="max-w-3xl font-lora text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                    Namaste,{" "}
                    <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-amber-700 bg-clip-text text-transparent">
                      {firstName}
                    </span>
                    . Get the right guidance now.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                    Start with Smart Pandit. Move into chat, specialist advice,
                    or live family puja only when you need more.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      window.location.href = `/pandit?ritual=${DEFAULT_LIVE_PUJA_RITUAL_ID}`;
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f5d23] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(143,93,35,0.22)] transition hover:-translate-y-0.5 hover:bg-[#7b4f1e]"
                  >
                    <Users className="h-4 w-4" />
                    Start live family puja
                  </button>
                  <button
                    onClick={() => void launchGuide(currentPersonality, "call")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white/90 px-6 py-4 text-sm font-semibold text-[#5b3a18] transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <AudioLines className="h-4 w-4" />
                    Talk to Smart Pandit now
                  </button>
                  <button
                    onClick={() => void launchGuide(currentPersonality, "chat")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-6 py-4 text-sm font-semibold text-gray-800 transition hover:border-amber-200 hover:bg-amber-50/40"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Open chat
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/80 bg-white/75 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Current Guide
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {currentPersonality?.title || "Pandit Ji"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/75 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Best For
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    Urgent guidance, rituals, family questions
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/75 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Main Flow
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    Call first, deepen later
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-2 md:px-0 md:grid-cols-2 xl:grid-cols-4">
          {intentLanes.map((lane) => {
            const Icon = lane.icon;
            return (
              <button
                key={lane.key}
                onClick={() => void launchIntent(lane.guide, lane.action)}
                className={`group rounded-[26px] border bg-gradient-to-r p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${lane.accent}`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white/85 p-3 text-gray-900 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-gray-900">
                        {lane.title}
                      </p>
                      <ArrowRight className="h-4 w-4 text-gray-500 transition group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {lane.body}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      {lane.guide?.title || "Smart Pandit"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 px-2 md:px-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-[28px] border border-gray-100 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Continue your journey
                </p>
                <h2 className="mt-2 font-lora text-2xl font-bold text-gray-900">
                  Choose the next best action
                </h2>
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
                  Go straight back into a live spiritual conversation.
                </p>
              </button>
              <button
                onClick={() => void launchGuide(currentPersonality, "chat")}
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Ask a quick question
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Stay lightweight when you only need one answer.
                </p>
              </button>
              <Link
                href={`/pandit?ritual=${DEFAULT_LIVE_PUJA_RITUAL_ID}`}
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Start live family puja
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Bring family together in one shared Smart Pandit session.
                </p>
              </Link>
              <Link
                href="/astrologer"
                className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <p className="text-sm font-semibold text-gray-900">
                  Go to astrology specialist
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Use the astrologer lane when the question needs chart context.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              Daily layer
            </p>
            <h2 className="mt-2 font-lora text-2xl font-bold text-gray-900">
              Horoscope, without taking over the page
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Daily astrology is useful, but the front door stays Smart Pandit.
            </p>
            <div className="mt-5 rounded-[24px] border border-amber-100 bg-[linear-gradient(135deg,#fff8ec_0%,#fffaf3_100%)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Daily insight
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                Your horoscope is ready
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Check your sign, mood, lucky time, and guidance for today without letting horoscope become the whole product.
              </p>
              <Link
                href="/horoscope"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-50"
              >
                Open horoscope
                <ArrowRight className="h-4 w-4" />
              </Link>
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

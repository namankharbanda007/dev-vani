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
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col py-6 px-4 md:px-6 md:py-10">
      <div className="flex w-full flex-col gap-10">
        
        {/* PREMIUM HERO SECTION */}
        <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.08),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.1),_transparent_40%)]" />
          
          <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10">
                  {greeting.icon}
                  <span>{greeting.text}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10">
                  <Sparkles className="h-4 w-4" />
                  <span>Smart Pandit Ready</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 font-lora">
                Namaste, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-500">
                  {firstName}
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                Connect deeply with your spiritual self today. Whether you need immediate guidance, astrology, or family rituals—we are here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => void launchGuide(currentPersonality, "call")}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-amber-500/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <AudioLines className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Talk to {currentPersonality?.title || "Smart Pandit"}</span>
                </button>
                <button
                  onClick={() => void launchGuide(currentPersonality, "chat")}
                  className="group flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                >
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <span>Open Chat</span>
                </button>
              </div>
            </div>
            
            {/* Daily Devotion integrated directly into the hero right side for a bento feel */}
            <div className="h-full rounded-3xl bg-gray-50 p-1 border border-gray-100">
               <div className="h-full rounded-[20px] bg-white p-6 shadow-sm overflow-hidden flex flex-col">
                  <div className="mb-4 flex-shrink-0">
                     <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Daily Devotion</p>
                  </div>
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <HoroscopeHero currentUser={currentUser} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* BENTO GRID ACTION LANES */}
        <div className="grid gap-4 md:grid-cols-3">
          
          {/* Main Large Card: Live Puja */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[32px] border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/30 p-8 transition-all hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] cursor-pointer"
               onClick={() => void launchIntent(livePujaGuide, "puja")}
          >
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 transform transition-transform group-hover:scale-110">
              <Users size={200} />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-amber-600/10">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-lora">Live Family Puja</h3>
                <p className="mt-2 max-w-md text-amber-900/70">Gather your family for a shared spiritual session directly from your home.</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <span>Enter Puja Room</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Side Cards within the Grid */}
          <div className="flex flex-col gap-4">
            <Link href="/astrologer" className="group flex-1 rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50/30 p-8 transition-all hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]">
               <div className="flex h-full flex-col justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-indigo-600/10">
                     <Moon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="mt-4">
                     <h3 className="text-lg font-bold text-gray-900 font-lora">Astrology</h3>
                     <p className="mt-1 text-sm text-indigo-900/70">Deep birth-chart guidance and alignment.</p>
                  </div>
               </div>
            </Link>
            <div className="group flex-1 rounded-[32px] border border-purple-100 bg-gradient-to-br from-purple-50 to-fuchsia-50/30 p-8 transition-all hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] cursor-pointer"
                 onClick={() => void launchIntent(financeGuide, "call")}
            >
               <div className="flex h-full flex-col justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-purple-600/10">
                     <WalletCards className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="mt-4">
                     <h3 className="text-lg font-bold text-gray-900 font-lora">Career & Finance</h3>
                     <p className="mt-1 text-sm text-purple-900/70">Practical spiritual guidance for decisions.</p>
                  </div>
               </div>
            </div>
          </div>
          
        </div>

        {/* BOTTOM SECTION: Specialists */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-lora">
              Specialist Advisors
            </h2>
            <div className="bg-white rounded-full shadow-sm ring-1 ring-gray-100 p-1 max-w-full overflow-x-auto">
               <PersonalityFilters
                 setSelectedFilters={setSelectedFilters}
                 selectedFilters={selectedFilters}
                 languageState="en-US"
                 currentUser={currentUser}
               />
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-[32px] p-6 lg:p-10 border border-gray-100/60">
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

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveGuideImageSrc } from "@/lib/guideImages";
import { Phone, MessageCircle, Info } from "lucide-react";
import ModifyCharacterSheet from "./ModifyCharacterSheet";

interface CharacterSectionProps {
    allPersonalities: IPersonality[];
    languageState: string;
    personalityIdState: string;
    onPersonalityPicked: (personalityIdPicked: string) => Promise<void> | void;
    onCallCharacter?: (personalityId: string) => void;
    onChatCharacter?: (personalityId: string) => void;
    title: string;
    eyebrow?: string;
    disableButtons: boolean;
    selectedFilters: PersonalityFilter[];
}

const CharacterSection = ({
    allPersonalities,
    languageState,
    personalityIdState,
    onPersonalityPicked,
    onCallCharacter,
    onChatCharacter,
    title,
    eyebrow = "Guides",
    disableButtons,
    selectedFilters,
}: CharacterSectionProps) => {
    const filteredPersonalities = allPersonalities.filter((personality) =>
        selectedFilters.every((filter) => personality[filter] === true)
    );

    if (filteredPersonalities.length === 0) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-end justify-between gap-3 px-1">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a87835]">{eyebrow}</p>
                    <h3 className="font-lora text-xl text-[#24170f] md:text-2xl">{title}</h3>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                    {filteredPersonalities.length}
                </span>
            </div>

            <div className="relative -mx-2 md:-mx-0">
                <div
                    className="scrollbar-hide flex gap-4 overflow-x-auto px-2 py-3 md:px-0"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {filteredPersonalities.map((personality) => {
                        const isCurrentPersonality =
                            personalityIdState === personality.personality_id;

                        return (
                            <div
                                key={personality.personality_id}
                                className="group/card relative w-[170px] flex-shrink-0 sm:w-[190px] md:w-[210px]"
                            >
                                <div
                                    className={cn(
                                        "relative h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300",
                                        "hover:scale-[1.03] hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10",
                                        isCurrentPersonality
                                            ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/15"
                                            : ""
                                    )}
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                                        <Image
                                            src={resolveGuideImageSrc(personality)}
                                            alt={personality.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                        <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                                            <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
                                                {personality.title}
                                            </h3>
                                            {personality.short_description && (
                                                <p className="mt-0.5 line-clamp-1 text-[11px] font-light text-white/60">
                                                    {personality.short_description}
                                                </p>
                                            )}

                                            <div className="mt-2.5 flex items-center gap-2">
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (onCallCharacter && personality.personality_id) {
                                                            await onPersonalityPicked(personality.personality_id);
                                                            onCallCharacter(personality.personality_id);
                                                        }
                                                    }}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/40 active:scale-95"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                    <span>Call</span>
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (onChatCharacter && personality.personality_id) {
                                                            await onPersonalityPicked(personality.personality_id);
                                                            onChatCharacter(personality.personality_id);
                                                        }
                                                    }}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/30 active:scale-95"
                                                >
                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                    <span>Chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <ModifyCharacterSheet
                                    openPersonality={personality}
                                    languageState={languageState}
                                    isCurrentPersonality={isCurrentPersonality}
                                    onPersonalityPicked={onPersonalityPicked}
                                    disableButtons={disableButtons}
                                >
                                    <button
                                        className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-1.5 text-white opacity-0 backdrop-blur-md transition-all group-hover/card:opacity-100 hover:bg-white/40"
                                        title="Details"
                                    >
                                        <Info className="h-3.5 w-3.5" />
                                    </button>
                                </ModifyCharacterSheet>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CharacterSection;

import ModifyCharacterSheet from "./ModifyCharacterSheet";
import Image from "next/image";
import { cn, getPersonalityImageSrc } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Check, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiComponent } from "./EmojiImage";

interface CharacterSectionProps {
    allPersonalities: IPersonality[];
    languageState: string;
    personalityIdState: string;
    onPersonalityPicked: (personalityIdPicked: string) => void;
    title: string;
    disableButtons: boolean;
    selectedFilters: PersonalityFilter[];
}

const CharacterSection = ({
    allPersonalities,
    languageState,
    personalityIdState,
    onPersonalityPicked,
    title,
    disableButtons,
    selectedFilters,
}: CharacterSectionProps) => {

    const filteredPersonalities = allPersonalities.filter((personality) => {
        return selectedFilters.every((filter) => {
            return personality[filter] === true;
        });
    });

    if (filteredPersonalities.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPersonalities.map((personality, index) => {
                        const isCurrentPersonality = personalityIdState === personality.personality_id;
                        return (
                            <ModifyCharacterSheet
                                key={personality.personality_id}
                                openPersonality={personality}
                                languageState={languageState}
                                isCurrentPersonality={isCurrentPersonality}
                                onPersonalityPicked={onPersonalityPicked}
                                disableButtons={disableButtons}
                            >
                                <div
                                    className={cn(
                                        "group relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer",
                                        "bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1",
                                        isCurrentPersonality ? "ring-2 ring-purple-500 ring-offset-2" : "hover:border-purple-300"
                                    )}
                                >
                                    {/* Card Content */}
                                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                                        {personality.creator_id === null ? (
                                            <Image
                                                src={getPersonalityImageSrc(personality.key)}
                                                alt={personality.key}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-amber-100 relative">
                                                {personality.subtitle && personality.subtitle.startsWith('http') ? (
                                                    <Image
                                                        src={personality.subtitle}
                                                        alt={personality.title}
                                                        fill
                                                        className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                                                        <EmojiComponent personality={personality} />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                                        {/* Selection Indicator */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className={cn(
                                                "rounded-full p-2 transition-all duration-300",
                                                isCurrentPersonality
                                                    ? "bg-purple-600 text-white shadow-lg scale-100"
                                                    : "bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                            )}>
                                                {isCurrentPersonality ? (
                                                    <Check className="h-4 w-4" strokeWidth={3} />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                            <h3 className="font-lora font-bold text-xl mb-1 truncate shadow-sm">
                                                {personality.title}
                                            </h3>
                                            <p className="text-sm text-gray-200 line-clamp-2 font-medium">
                                                {personality.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ModifyCharacterSheet>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CharacterSection;

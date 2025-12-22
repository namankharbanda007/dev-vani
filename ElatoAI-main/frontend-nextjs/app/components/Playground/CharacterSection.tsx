"use client";

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
import { Check, CheckCircle, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiComponent } from "./EmojiImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ImageUpload from "@/app/components/CreateCharacter/ImageUpload";
import { createClient } from "@/utils/supabase/client";
import { updatePersonalityAction } from "@/app/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
    const [editingPersonality, setEditingPersonality] = useState<IPersonality | null>(null);
    const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        };
        fetchUser();
    }, []);

    const filteredPersonalities = allPersonalities.filter((personality) => {
        return selectedFilters.every((filter) => {
            return personality[filter] === true;
        });
    });

    const handleSaveImage = async () => {
        if (!editingPersonality || !editingPersonality.personality_id || !newImageUrl) return;

        setIsSaving(true);
        try {
            const result = await updatePersonalityAction(editingPersonality.personality_id, {
                subtitle: newImageUrl
            });

            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Character image updated!" });
                setEditingPersonality(null);
                setNewImageUrl(null);
                router.refresh();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update image.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (filteredPersonalities.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Category Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 font-lora px-1">{title}</h3>

            {/* Horizontal Scroll Container - Netflix Style */}
            <div className="relative -mx-6 md:-mx-10">
                <div className="flex gap-3 overflow-x-auto py-2 px-6 md:px-10 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {filteredPersonalities.map((personality, index) => {
                        const isCurrentPersonality = personalityIdState === personality.personality_id;
                        const isOwner = currentUserId && personality.creator_id === currentUserId;

                        return (
                            <div
                                key={personality.personality_id}
                                className="relative group/card flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
                            >
                                <ModifyCharacterSheet
                                    openPersonality={personality}
                                    languageState={languageState}
                                    isCurrentPersonality={isCurrentPersonality}
                                    onPersonalityPicked={onPersonalityPicked}
                                    disableButtons={disableButtons}
                                >
                                    <div
                                        className={cn(
                                            "relative overflow-hidden rounded-2xl cursor-pointer h-full transition-all duration-200",
                                            "bg-white border border-gray-200 shadow-sm hover:shadow-md",
                                            isCurrentPersonality ? "ring-2 ring-purple-500" : "hover:border-purple-300"
                                        )}
                                    >
                                        {/* Card Content */}
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            {personality.subtitle && personality.subtitle.startsWith('http') ? (
                                                <Image
                                                    src={personality.subtitle}
                                                    alt={personality.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : personality.creator_id === null ? (
                                                <Image
                                                    src={getPersonalityImageSrc(personality.key)}
                                                    alt={personality.key}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-amber-100">
                                                    <EmojiComponent personality={personality} />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                            {/* Selection Indicator */}
                                            {isCurrentPersonality && (
                                                <div className="absolute top-2 right-2 z-10">
                                                    <div className="rounded-full p-1.5 bg-purple-600 text-white">
                                                        <Check className="h-3 w-3" strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Text Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                <h3 className="font-semibold text-sm leading-tight truncate">
                                                    {personality.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                </ModifyCharacterSheet>

                                {/* Edit Image Button (Outside Sheet Trigger) */}
                                {isOwner && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setEditingPersonality(personality);
                                            setNewImageUrl(personality.subtitle?.startsWith('http') ? personality.subtitle : null);
                                        }}
                                        className="absolute top-3 left-3 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/card:opacity-100 transform hover:scale-110"
                                        title="Change Image"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div >

            <Dialog open={!!editingPersonality} onOpenChange={(open) => !open && setEditingPersonality(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Character Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <ImageUpload
                            onImageSelected={(url) => setNewImageUrl(url)}
                            currentImage={newImageUrl}
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setEditingPersonality(null)}>Cancel</Button>
                            <Button onClick={handleSaveImage} disabled={isSaving || !newImageUrl}>
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Save Change
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default CharacterSection;
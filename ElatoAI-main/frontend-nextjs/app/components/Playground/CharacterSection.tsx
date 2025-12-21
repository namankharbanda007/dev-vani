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
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPersonalities.map((personality, index) => {
                        const isCurrentPersonality = personalityIdState === personality.personality_id;
                        const isOwner = currentUserId && personality.creator_id === currentUserId;

                        return (
                            <div key={personality.personality_id} className="relative group/card">
                                <ModifyCharacterSheet
                                    openPersonality={personality}
                                    languageState={languageState}
                                    isCurrentPersonality={isCurrentPersonality}
                                    onPersonalityPicked={onPersonalityPicked}
                                    disableButtons={disableButtons}
                                >
                                    <div
                                        className={cn(
                                            "group relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer h-full",
                                            "bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1",
                                            isCurrentPersonality ? "ring-2 ring-purple-500 ring-offset-2" : "hover:border-purple-300"
                                        )}
                                    >
                                        {/* Card Content */}
                                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                                            {personality.subtitle && personality.subtitle.startsWith('http') ? (
                                                <Image
                                                    src={personality.subtitle}
                                                    alt={personality.title}
                                                    fill
                                                    className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : personality.creator_id === null ? (
                                                <Image
                                                    src={getPersonalityImageSrc(personality.key)}
                                                    alt={personality.key}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-amber-100 relative">
                                                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                                                        <EmojiComponent personality={personality} />
                                                    </div>
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
                                                    {personality.subtitle && !personality.subtitle.startsWith('http') ? personality.subtitle : ''}
                                                </p>
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
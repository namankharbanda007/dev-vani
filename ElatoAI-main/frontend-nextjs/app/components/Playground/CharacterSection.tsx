"use client";

import Image from "next/image";
import { cn, getPersonalityImageSrc } from "@/lib/utils";
import { Phone, MessageCircle, Info, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiComponent } from "./EmojiImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ImageUpload from "@/app/components/CreateCharacter/ImageUpload";
import { createClient } from "@/utils/supabase/client";
import { updatePersonalityAction } from "@/app/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ModifyCharacterSheet from "./ModifyCharacterSheet";

interface CharacterSectionProps {
    allPersonalities: IPersonality[];
    languageState: string;
    personalityIdState: string;
    onPersonalityPicked: (personalityIdPicked: string) => void;
    onCallCharacter?: (personalityId: string) => void;
    onChatCharacter?: (personalityId: string) => void;
    title: string;
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
    disableButtons,
    selectedFilters,
}: CharacterSectionProps) => {
    const [editingPersonality, setEditingPersonality] = useState<IPersonality | null>(null);
    const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [detailPersonality, setDetailPersonality] = useState<IPersonality | null>(null);
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

    // Extract emoji from title for pill badge
    const emojiMatch = title.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)/u);
    const emoji = emojiMatch ? emojiMatch[0] : null;
    const titleText = emoji ? title.replace(emoji, '').trim() : title;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Category Title */}
            <div className="flex items-center gap-3 px-1">
                {emoji && (
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-purple-50 text-lg border border-purple-100/50">
                        {emoji}
                    </span>
                )}
                <h3 className="section-title text-xl md:text-2xl text-gray-800 font-lora">{titleText}</h3>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    {filteredPersonalities.length}
                </span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative -mx-2 md:-mx-0">
                <div className="flex gap-4 overflow-x-auto py-3 px-2 md:px-0 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {filteredPersonalities.map((personality) => {
                        const isCurrentPersonality = personalityIdState === personality.personality_id;
                        const isOwner = currentUserId && personality.creator_id === currentUserId;

                        return (
                            <div
                                key={personality.personality_id}
                                className="relative group/card flex-shrink-0 w-[170px] sm:w-[190px] md:w-[210px]"
                            >
                                <div
                                    className={cn(
                                        "relative overflow-hidden rounded-2xl cursor-pointer h-full transition-all duration-300",
                                        "bg-white border border-gray-100 shadow-sm",
                                        "hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/10",
                                        isCurrentPersonality
                                            ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/15"
                                            : "hover:border-purple-200"
                                    )}
                                >
                                    {/* Card Image */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                                        {personality.subtitle && (personality.subtitle.startsWith('http') || personality.subtitle.startsWith('/')) ? (
                                            <Image
                                                src={personality.subtitle}
                                                alt={personality.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            />
                                        ) : personality.creator_id === null ? (
                                            <Image
                                                src={getPersonalityImageSrc(personality.key)}
                                                alt={personality.key}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 via-purple-50 to-amber-100">
                                                <EmojiComponent personality={personality} />
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                                            <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                                                {personality.title}
                                            </h3>
                                            {personality.short_description && (
                                                <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1 font-light">
                                                    {personality.short_description}
                                                </p>
                                            )}

                                            {/* === CALL & CHAT BUTTONS (always visible) === */}
                                            <div className="flex items-center gap-2 mt-2.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onCallCharacter) {
                                                            onPersonalityPicked(personality.personality_id);
                                                            onCallCharacter(personality.personality_id);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1.5 flex-1 justify-center py-2 px-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 transition-all duration-200"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>Call</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onChatCharacter) {
                                                            onPersonalityPicked(personality.personality_id);
                                                            onChatCharacter(personality.personality_id);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1.5 flex-1 justify-center py-2 px-3 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30 hover:bg-white/30 active:scale-95 transition-all duration-200"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    <span>Chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Image Button (for owners) */}
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

                                {/* Info button (for character details) */}
                                <ModifyCharacterSheet
                                    openPersonality={personality}
                                    languageState={languageState}
                                    isCurrentPersonality={isCurrentPersonality}
                                    onPersonalityPicked={onPersonalityPicked}
                                    disableButtons={disableButtons}
                                >
                                    <button
                                        className="absolute top-3 right-3 z-20 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/card:opacity-100"
                                        title="Details"
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                    </button>
                                </ModifyCharacterSheet>
                            </div>
                        );
                    })}
                </div>
            </div>

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
        </div>
    );
};

export default CharacterSection;
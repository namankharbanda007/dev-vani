import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCharacterImageAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ImageGeneratorProps {
    onImageGenerated: (url: string) => void;
    initialPrompt?: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, initialPrompt }) => {
    // Determine prompt from props if available
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Update prompt if prop changes (e.g. user edits description)
    React.useEffect(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt);
        }
    }, [initialPrompt]);

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);
        try {
            const result = await generateCharacterImageAction(prompt);

            if (result.error || !result.data) {
                throw new Error(result.error || "Generation failed");
            }

            const base64Data = result.data;

            // Convert base64 to Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const file = new File([blob], "generated-image.jpg", { type: 'image/jpeg' });

            // Upload to Supabase 
            // (Reusing the same logic as upload, assumes bucket exists)
            // Note: Since we don't have direct access to Supabase client here without context or hook,
            // we assume the usage is correct or we should refactor upload logic to a utility.
            // Wait, this component ALREADY had createClient() so it's fine.
            const supabase = createClient();

            const fileName = `generated_${Math.random().toString(36).substring(2)}_${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('character-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('character-images')
                .getPublicUrl(fileName);

            setPreviewUrl(publicUrl);
            onImageGenerated(publicUrl);
            toast({ title: "Magic!", description: "Image generated and saved." });

        } catch (error: any) {
            console.error("Generation error:", error);
            toast({ title: "Error", description: error.message || "Failed to generate image.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4 w-full h-full flex flex-col items-center justify-center">
            {previewUrl ? (
                <div className="relative group w-full h-64 rounded-xl overflow-hidden shadow-sm border-2 border-cyan-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-gray-900"
                        >
                            <RefreshCw className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} />
                            Regenerate
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 bg-cyan-50/50 rounded-2xl border border-cyan-100 w-full h-64">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">AI Appearance</h3>
                        <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                            Generate a unique look based on your character's description.
                        </p>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md rounded-full px-6"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Creating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" /> Generate Look
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;

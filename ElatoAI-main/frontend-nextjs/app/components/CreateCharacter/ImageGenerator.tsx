
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateCharacterImageAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ImageGeneratorProps {
    onImageGenerated: (url: string) => void;
    initialPrompt?: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, initialPrompt }) => {
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const supabase = createClient();

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
        <div className="space-y-4">
            <div className="flex gap-2">
                <Textarea
                    placeholder="Describe your character's appearance..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px] bg-white/50 border-gray-200 resize-none"
                />
            </div>
            <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.length}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
                {isGenerating ? (
                    <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Image
                    </>
                )}
            </Button>

            {previewUrl && (
                <div className="mt-4 border-2 border-purple-100 rounded-xl overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Generated" className="w-full h-auto object-cover" />
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;

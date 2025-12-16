
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onImageSelected: (url: string) => void;
    currentImage?: string | null;
    theme?: 'purple' | 'cyan';
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, currentImage, theme = 'purple' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({ title: "Error", description: "Please upload an image file.", variant: "destructive" });
            return;
        }

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Error", description: "Image size should be less than 5MB.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        setPreviewUrl(URL.createObjectURL(file)); // Immediate local preview

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('character-images') // Assuming this bucket exists
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('character-images')
                .getPublicUrl(filePath);

            onImageSelected(publicUrl);
            setPreviewUrl(publicUrl); // Update with remote URL
            toast({ title: "Success", description: "Image uploaded successfully." });

        } catch (error: any) {
            console.error("Upload error:", error);
            toast({ title: "Upload Failed", description: error.message || "Failed to upload image. Please ensure the 'character-images' bucket exists in Supabase.", variant: "destructive" });
            setPreviewUrl(currentImage || null); // Revert on failure
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onImageSelected("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const themeStyles = {
        purple: {
            border: "hover:border-purple-500 hover:bg-purple-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            text: "text-purple-600"
        },
        cyan: {
            border: "hover:border-cyan-500 hover:bg-cyan-50",
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
            text: "text-cyan-600"
        }
    };

    const currentTheme = themeStyles[theme || 'purple'];

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-64 relative",
                    currentTheme.border
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className={cn("p-4 rounded-full mb-3", currentTheme.iconBg)}>
                            <Upload className={cn("w-8 h-8", currentTheme.iconColor)} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Click to upload an image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            {isUploading && <p className={cn("text-xs text-center animate-pulse", currentTheme.text)}>Uploading...</p>}
        </div>
    );
};

export default ImageUpload;

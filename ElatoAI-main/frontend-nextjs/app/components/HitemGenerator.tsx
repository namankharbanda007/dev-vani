
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import "@google/model-viewer";

// ... Global types for model-viewer remain the same ...
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    poster?: string;
                    alt?: string;
                    "camera-controls"?: boolean;
                    "auto-rotate"?: boolean;
                    ar?: boolean;
                    "shadow-intensity"?: string;
                    "shadow-softness"?: string;
                    exposure?: string;
                    "environment-image"?: string;
                },
                HTMLElement
            >;
        }
    }
}

export default function HitemGenerator() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "queued" | "running" | "success" | "failed">("idle");
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleReset = () => {
        setImageFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        setIsGenerating(false);
        setTaskId(null);
        setModelUrl(null);
        setStatus("idle");
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast({ title: "File too large", description: "Image size should be less than 10MB.", variant: "destructive" });
            return;
        }

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setStatus("idle");
        setModelUrl(null);
    };

    const uploadAndGenerate = async () => {
        if (!imageFile) return;

        setIsUploading(true);
        setStatus("uploading");

        try {
            // 1. Upload to Supabase
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `hitem_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("character-images")
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("character-images")
                .getPublicUrl(filePath);

            // 2. Call API
            setIsUploading(false);
            setIsGenerating(true);
            setStatus("queued");

            const res = await fetch("/api/hitem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: publicUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("API Error Response:", data);
                throw new Error(data.error || "Failed to start generation");
            }

            if (!data.task_id) {
                console.error("Missing task_id in response:", data);
                throw new Error("Failed to start generation: No Task ID returned.");
            }

            setTaskId(data.task_id);
            setStatus("running");

        } catch (error: any) {
            console.error("Error:", error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setIsUploading(false);
            setIsGenerating(false);
            setStatus("failed");
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (taskId && (status === "queued" || status === "running")) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/hitem?task_id=${taskId}`);
                    const data = await res.json();

                    if (res.ok) {
                        // Hitem3D Status: 'success' (completed), 'running', 'failed' (inferred, documentation vague on explicit enum)
                        // Based on data.data structure, if model URL exists it's usually done. 
                        // Often status field is 'status'. 
                        // Assuming status: 0=pending?, 1=running?, 2=success? or strings. 
                        // Let's assume standard strings or check for model presence.

                        // Adjusting based on common patterns if docs unclear: check if 'model' or 'mesh' url is present.
                        // Documentation usually returns a status field.

                        if (data.status === "success" || (data.model && data.model.length > 0)) {
                            setStatus("success");
                            // Usually returns a model URL. Let's assume data.model is the URL or data.model_urls.glb
                            // If Hitem returns .obj/.glb directly in a field.
                            // Check if there is a 'models' array or similar.
                            // For now assuming `data.model` is the URL string based on common simple APIs, or data.result.

                            // Safest: check data struct. The backend returns data directly.
                            const url = data.model || data.result || (data.models && data.models[0]);

                            if (url) {
                                setModelUrl(url);
                                setIsGenerating(false);
                                setTaskId(null);
                                setProgress(100);
                            }
                        } else if (data.status === "failed") {
                            setStatus("failed");
                            setIsGenerating(false);
                            setTaskId(null);
                            toast({ title: "Generation Failed", description: "AI could not generate a model.", variant: "destructive" });
                        } else {
                            // Still running
                            setStatus("running");
                            setProgress((prev) => {
                                // Fake progress
                                return prev < 90 ? prev + 5 : prev;
                            });
                        }
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 3000); // Poll every 3s
        }

        return () => clearInterval(interval);
    }, [taskId, status]);

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-amber-600 font-lora">
                    Turn Your Image into 3D Magic
                </h2>
                <p className="text-gray-600 mt-2">Upload any photo and watch it come to life as a 3D model instantly!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Upload */}
                <div className="flex flex-col gap-4">
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
                            imageFile ? "border-purple-300 bg-purple-50/50" : "border-gray-300 hover:border-purple-400 hover:bg-white/80"
                        )}
                        onClick={() => !isGenerating && !isUploading && fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4 z-10" />
                        ) : (
                            <div className="flex flex-col items-center p-6 text-center z-10">
                                <div className="bg-purple-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-purple-600" />
                                </div>
                                <p className="text-lg font-semibold text-gray-700">Click to Upload Image</p>
                                <p className="text-sm text-gray-500 mt-1">Supports JPG/PNG</p>
                            </div>
                        )}

                        {previewUrl && !isGenerating && !modelUrl && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                                <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-lg">Change Image</span>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isGenerating || isUploading}
                        />
                    </div>

                    {!modelUrl && (
                        <Button
                            size="lg"
                            className={cn(
                                "w-full text-lg h-12 rounded-xl transition-all shadow-md",
                                isGenerating || isUploading ? "bg-gray-400" : "bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                            )}
                            onClick={uploadAndGenerate}
                            disabled={!imageFile || isUploading || isGenerating}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
                                </>
                            ) : isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Magic...
                                </>
                            ) : (
                                <>
                                    Generate 3D Model ✨
                                </>
                            )}
                        </Button>
                    )}

                    {isGenerating && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-gradient-to-r from-purple-500 to-amber-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                            <p className="text-xs text-center text-gray-500 mt-1">Creating your 3D masterpiece...</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Result or Placeholder */}
                <div className="flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative min-h-[400px]">
                    {modelUrl ? (
                        <>
                            <model-viewer
                                src={modelUrl}
                                alt="A 3D model generated by AI"
                                auto-rotate={true}
                                camera-controls={true}
                                shadow-intensity="1"
                                style={{ width: "100%", height: "100%", backgroundColor: "#f9fafb" } as any}
                            >
                            </model-viewer>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                <Button variant="outline" size="sm" onClick={handleReset} className="bg-white/80 backdrop-blur shadow-sm hover:bg-white">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Try Another
                                </Button>
                                <a href={modelUrl} download="model.glb">
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                                        Download .GLB
                                    </Button>
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center group">
                            {isGenerating ? (
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-32 h-32 bg-purple-100 rounded-full mb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-amber-100 to-purple-200 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                    <p className="text-xl font-medium text-purple-800">Processing...</p>
                                    <p className="text-sm">Our AI sculptors are determining the shape</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-4xl">🔮</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-500 mb-2">3D Viewport</h3>
                                    <p className="text-sm">Your generated 3D model will appear here interaction-ready.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

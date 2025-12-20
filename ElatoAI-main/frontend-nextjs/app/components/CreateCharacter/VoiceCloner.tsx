
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Upload, StopCircle, Play, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface VoiceClonerProps {
    onCloneSuccess: (agentId: string, voiceName: string) => void;
    language?: string;
}

export default function VoiceCloner({ onCloneSuccess, language }: VoiceClonerProps) {
    const [mode, setMode] = useState<'record' | 'upload'>('record');
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [previewUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Or audio/wav
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast({ title: "Microphone Access Denied", description: "Please allow microphone access to record voice.", variant: "destructive" });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioBlob(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleClone = async () => {
        if (!audioBlob || !name) {
            toast({ title: "Missing Information", description: "Please provide a name and an audio sample.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('name', name);
        formData.append('description', description);
        if (language) {
            formData.append('language', language);
        }

        try {
            const response = await fetch('/api/voice/clone', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to clone voice');
            }

            toast({ title: "Success!", description: "Voice cloned successfully." });
            onCloneSuccess(data.agent_id, data.name);

        } catch (error: any) {
            console.error("Cloning error:", error);
            toast({ title: "Cloning Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setAudioBlob(null);
        setPreviewUrl(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setName('');
        setDescription('');
        setRecordingTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-4 mb-4">
                <Button
                    variant={mode === 'record' ? 'default' : 'outline'}
                    onClick={() => setMode('record')}
                    className="w-1/2"
                    type="button"
                >
                    <Mic className="w-4 h-4 mr-2" />
                    Record
                </Button>
                <Button
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setMode('upload')}
                    className="w-1/2"
                    type="button"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                </Button>
            </div>

            {mode === 'record' ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    {!audioBlob ? (
                        <>
                            <div className="text-4xl font-mono mb-4 text-gray-700">{formatTime(recordingTime)}</div>
                            {!isRecording ? (
                                <Button
                                    size="lg"
                                    variant="destructive"
                                    className="rounded-full w-16 h-16 p-0 shadow-lg hover:scale-110 transition-transform"
                                    onClick={startRecording}
                                    type="button"
                                >
                                    <Mic className="w-8 h-8" />
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full w-16 h-16 p-0 animate-pulse border-4 border-red-500"
                                    onClick={stopRecording}
                                    type="button"
                                >
                                    <StopCircle className="w-8 h-8 text-red-500" />
                                </Button>
                            )}
                            <p className="mt-4 text-sm text-gray-500">
                                {isRecording ? "Recording... Speak clearly." : "Tap to start recording"}
                            </p>
                        </>
                    ) : (
                        <div className="w-full">
                            <audio controls src={previewUrl!} className="w-full mb-4" />
                            <Button variant="ghost" onClick={() => setAudioBlob(null)} className="text-red-500" type="button">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Record Again
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    {!audioBlob ? (
                        <>
                            <Label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700">
                                <Upload className="w-10 h-10" />
                                <span className="text-sm font-medium">Click to upload audio file (WAV/MP3)</span>
                            </Label>
                            <Input
                                id="audio-upload"
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </>
                    ) : (
                        <div className="w-full text-center">
                            <audio controls src={previewUrl!} className="w-full mb-4" />
                            <Button variant="ghost" onClick={() => setAudioBlob(null)} className="text-red-500" type="button">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Choose Different File
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="voice-name">Voice Name</Label>
                    <Input
                        id="voice-name"
                        placeholder="e.g. My Professional Voice"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* <div className="space-y-2">
                    <Label htmlFor="voice-desc">Description (Optional)</Label>
                    <Input
                        id="voice-desc"
                        placeholder="e.g. Recorded in a quiet room"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div> */}
            </div>

            <Button
                onClick={handleClone}
                disabled={!audioBlob || !name || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-600 text-white"
                type="button"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cloning Voice & Creating Agent...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Voice Clone
                    </>
                )}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">
                This will create a custom voice and agent in ElevenLabs.
            </p>
        </div>
    );
}

import { Sparkles } from "lucide-react";

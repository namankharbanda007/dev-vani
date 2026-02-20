"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AartiPlayerProps {
    audioSrc: string;
    title: string;
}

export default function AartiPlayer({ audioSrc, title }: AartiPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : 0.7; // Default 70% volume
        }
    }, [isMuted]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration);
    };

    const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const width = bounds.width;
        const newProgress = (x / width) * 100;
        const newTime = (newProgress / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-orange-50/10 border border-orange-500/20 rounded-2xl p-4 w-full backdrop-blur-md">
            <audio
                ref={audioRef}
                src={audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    setIsPlaying(false);
                    setProgress(0);
                }}
            />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePlayPause}
                        className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
                    </button>
                    <div>
                        <h4 className="text-white font-medium text-sm">{title}</h4>
                        <p className="text-orange-200/60 text-xs">Aarti Audio</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-orange-200/60 hover:text-white transition-colors p-2"
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-orange-200/50 w-8 text-right font-mono">
                    {formatTime((progress / 100) * duration || 0)}
                </span>
                <div
                    className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden cursor-pointer relative group"
                    onClick={handleProgressScrub}
                >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Active Progress */}
                    <div
                        className="h-full bg-orange-400 rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Playhead dot */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                    </div>
                </div>
                <span className="text-xs text-orange-200/50 w-8 font-mono">
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
}

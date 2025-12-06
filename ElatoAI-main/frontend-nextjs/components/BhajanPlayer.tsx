'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import { Track } from '../app/bhajan/data';
import Image from 'next/image';

interface BhajanPlayerProps {
    currentTrack: Track;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function BhajanPlayer({ currentTrack, isPlaying, onPlayPause, onNext, onPrev }: BhajanPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        setIsMuted(vol === 0);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            const newMuted = !isMuted;
            setIsMuted(newMuted);
            audioRef.current.muted = newMuted;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 border-t border-orange-500/30 backdrop-blur-xl p-4 z-50 shadow-[0_-4px_20px_rgba(234,88,12,0.3)]">
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={onNext}
            />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-full md:w-1/3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-orange-400/50 shadow-lg shadow-orange-500/20">
                        {currentTrack.cover ? (
                            <Image
                                src={currentTrack.cover}
                                alt={currentTrack.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-orange-800 flex items-center justify-center text-orange-200">
                                <span className="text-xs">Om</span>
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-orange-50 font-semibold truncate text-lg">{currentTrack.title}</h3>
                        <p className="text-orange-200/70 text-sm truncate">{currentTrack.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
                    <div className="flex items-center gap-6">
                        <button className="text-orange-300 hover:text-orange-100 transition-colors">
                            <Shuffle size={18} />
                        </button>
                        <button onClick={onPrev} className="text-orange-100 hover:text-white transition-colors hover:scale-110 transform duration-200">
                            <SkipBack size={24} />
                        </button>
                        <button
                            onClick={onPlayPause}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:scale-105 transition-transform duration-200 border border-orange-300/50"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={onNext} className="text-orange-100 hover:text-white transition-colors hover:scale-110 transform duration-200">
                            <SkipForward size={24} />
                        </button>
                        <button className="text-orange-300 hover:text-orange-100 transition-colors">
                            <Repeat size={18} />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 text-xs text-orange-200 font-medium">
                        <span>{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1 bg-orange-900/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 hover:[&::-webkit-slider-thumb]:bg-orange-300"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume */}
                <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
                    <button onClick={toggleMute} className="text-orange-200 hover:text-white">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-orange-900/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 hover:[&::-webkit-slider-thumb]:bg-orange-300"
                    />
                </div>
            </div>
        </div>
    );
}

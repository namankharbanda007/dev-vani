'use client';

import React, { useState } from 'react';
import { bhajans, Track } from './data';
import BhajanPlayer from '../../components/BhajanPlayer';
import { Play, Music, Share2 } from 'lucide-react';

export default function BhajanPage() {
    const [currentTrack, setCurrentTrack] = useState<Track>(bhajans[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = (track: Track) => {
        if (currentTrack.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        const currentIndex = bhajans.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % bhajans.length;
        setCurrentTrack(bhajans[nextIndex]);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        const currentIndex = bhajans.findIndex(t => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + bhajans.length) % bhajans.length;
        setCurrentTrack(bhajans[prevIndex]);
        setIsPlaying(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 dark:from-stone-900 dark:via-orange-950/30 dark:to-stone-900 text-stone-800 dark:text-stone-100 pb-24">
            {/* Header / Hero Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604869515883-c95c2b33f7b5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50 dark:to-stone-900"></div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="mb-4 p-3 rounded-full bg-orange-100/10 backdrop-blur-sm border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
                        <Music size={40} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-500 mb-2 drop-shadow-sm">
                        Divine Melodies
                    </h1>
                    <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-medium max-w-2xl">
                        Immerse yourself in spiritual bliss with our collection of Bhajans and Aartis.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">

                {/* Track List */}
                <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-orange-200 dark:border-orange-900/30 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-100 flex items-center gap-2">
                            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
                            Sacred Tracks
                        </h2>
                        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm font-medium transition-colors shadow-lg shadow-orange-500/20">
                            Play All
                        </button>
                    </div>

                    <div className="divide-y divide-orange-100 dark:divide-orange-900/30">
                        {bhajans.map((track, index) => (
                            <div
                                key={track.id}
                                onClick={() => handlePlay(track)}
                                className={`group flex items-center gap-4 p-4 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer ${currentTrack.id === track.id ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                            >
                                <div className="text-stone-400 font-medium w-6 text-center group-hover:hidden">
                                    {index + 1}
                                </div>
                                <div className="hidden group-hover:flex w-6 justify-center text-orange-600 dark:text-orange-400">
                                    <Play size={16} fill="currentColor" />
                                </div>

                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                    <div className="w-full h-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center">
                                        <Music size={20} className="text-orange-500 dark:text-orange-300" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold truncate ${currentTrack.id === track.id ? 'text-orange-600 dark:text-orange-400' : 'text-stone-800 dark:text-stone-200'}`}>
                                        {track.title}
                                    </h3>
                                    <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                                        {track.artist}
                                    </p>
                                </div>

                                <div className="hidden md:block text-sm text-stone-400">
                                    {track.duration}
                                </div>

                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: track.title,
                                                    text: `Listen to ${track.title} by ${track.artist} on Divine Melodies`,
                                                    url: window.location.href,
                                                }).catch(console.error);
                                            } else {
                                                navigator.clipboard.writeText(`${window.location.href} - Listen to ${track.title}`);
                                                alert('Link copied to clipboard!');
                                            }
                                        }}
                                        className="p-2 text-stone-400 hover:text-orange-500 transition-colors"
                                        title="Share"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Player Component */}
            <BhajanPlayer
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </div>
    );
}

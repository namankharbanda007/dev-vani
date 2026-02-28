import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Video, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function PalmReadingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#b2a4d4] via-[#dcd2eb] to-[#f4effc] overflow-hidden relative">

            {/* Background Clouds / Ethereal Styling Setup */}
            <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full max-w-7xl mx-auto">

                {/* Header Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#3b1d4a] mb-8 md:mb-12 font-lora tracking-wide text-center drop-shadow-sm">
                    AI PALM READING SECTION
                </h1>

                {/* 3 Column Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">

                    {/* Card 1: Intro / Character Screen */}
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2a135a] via-[#46238b] to-[#5d30a8] shadow-2xl overflow-hidden flex flex-col h-[700px] border-4 border-indigo-500/30">
                        {/* Domain Tag */}
                        <div className="pt-8 text-center text-amber-200/80 font-semibold tracking-widest text-sm mb-2">
                            SMARTMURTI.COM
                        </div>
                        {/* Title */}
                        <h2 className="text-3xl font-bold text-white text-center leading-tight px-6 z-10">
                            AI PALM READING<br />SECTION
                        </h2>

                        {/* Sparkles / Stars BG Effect */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

                        {/* Character Placeholder Area */}
                        <div className="flex-1 relative flex items-end justify-center pb-24">
                            {/* Speech Bubble Placeholder */}
                            <div className="absolute top-10 right-8 bg-blue-100/90 backdrop-blur-sm text-blue-900 px-6 py-2 rounded-2xl rounded-bl-none font-bold text-lg shadow-lg">
                                Namaste!
                            </div>

                            {/* Character Image */}
                            <div className="w-64 h-80 relative z-10 overflow-hidden rounded-t-full mt-4">
                                <Image
                                    src="/assets/Cartoon Palm Reader.jpg"
                                    fill
                                    className="object-cover object-center"
                                    alt="Smart Murti Pandit"
                                />
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
                            <Button className="w-full bg-gradient-to-b from-[#ffb443] to-[#d67b22] hover:from-[#ffc466] hover:to-[#e68d33] text-white rounded-2xl py-8 text-2xl font-bold shadow-[0_8px_0_#a85c15,0_15px_20px_rgba(0,0,0,0.4)] transition-all active:translate-y-[6px] active:shadow-[0_2px_0_#a85c15,0_5px_10px_rgba(0,0,0,0.4)] border border-orange-300/50">
                                Start Your Reading
                            </Button>
                        </div>
                    </div>


                    {/* Card 2: Analysis / Scan Screen */}
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2a135a] via-[#46238b] to-[#5d30a8] shadow-2xl overflow-hidden flex flex-col h-[700px] border-4 border-indigo-500/30 p-6">

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-fuchsia-200 text-center leading-tight mb-6 mt-4">
                            YOUR PALM<br />ANALYSIS
                        </h2>

                        {/* Scan CTA Button */}
                        <Button className="w-full bg-gradient-to-b from-[#ffb443] to-[#d67b22] hover:from-[#ffc466] hover:to-[#e68d33] text-white rounded-2xl py-8 px-6 text-xl font-bold shadow-[0_6px_0_#a85c15,0_10px_15px_rgba(0,0,0,0.3)] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_#a85c15,0_5px_10px_rgba(0,0,0,0.4)] flex justify-between items-center mb-8 border border-orange-300/50">
                            <span>SCAN YOUR<br />PALM</span>
                            <div className="bg-white/20 p-3 rounded-full">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </Button>

                        {/* Results Card */}
                        <div className="flex-1 bg-[#fdfaf5] rounded-[2rem] p-6 shadow-xl border-4 border-amber-50 relative overflow-hidden flex flex-col items-center">
                            <h3 className="text-xl font-extrabold text-[#4a3a2e] mb-4 text-center">YOUR RESULTS</h3>

                            <div className="flex flex-row w-full h-full gap-4">
                                {/* Palm Map Illustration */}
                                <div className="w-1/2 relative h-full flex items-center justify-center p-2">
                                    <div className="w-full relative h-[90%] rounded-3xl overflow-hidden shadow-sm border border-amber-200/50 bg-white">
                                        <Image
                                            src="/assets/palm-reading/palm-map.png"
                                            fill
                                            className="object-cover"
                                            alt="Palm Analysis"
                                        />
                                    </div>
                                    <Sparkles className="absolute left-[-10px] top-1/2 text-amber-400 h-6 w-6 z-10 animate-pulse" />
                                </div>

                                {/* Mock Predictions List */}
                                <div className="w-1/2 flex flex-col justify-center space-y-4 text-xs font-medium text-[#5c4b3f]">
                                    <div className="relative pl-3 border-l-2 border-amber-300">
                                        <p className="font-bold text-[#8c6b5d] mb-0.5">Mystical lines</p>
                                        <p className="leading-tight">or prediction liness</p>
                                    </div>
                                    <div className="relative pl-3 border-l-2 border-amber-300">
                                        <p className="font-bold text-[#8c6b5d] mb-0.5">Predictions:</p>
                                        <p className="leading-tight">market invitation</p>
                                    </div>
                                    <div className="relative pl-3 border-l-2 border-amber-300">
                                        <p className="font-bold text-[#8c6b5d] mb-0.5">Predictions:</p>
                                        <p className="leading-tight">mavour mysticien gain</p>
                                    </div>
                                    <div className="relative pl-3 border-l-2 border-amber-300">
                                        <p className="font-bold text-[#8c6b5d] mb-0.5">Mystics line:</p>
                                        <p className="leading-tight">regular predictions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Card 3: Video Call Screen */}
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2a135a] via-[#46238b] to-[#5d30a8] shadow-2xl overflow-hidden flex flex-col h-[700px] border-4 border-indigo-500/30">
                        {/* Title */}
                        <div className="pt-8 mb-6">
                            <h2 className="text-3xl font-bold text-fuchsia-200 text-center leading-tight">
                                LIVE AI<br />VIDEO CALL
                            </h2>
                        </div>

                        {/* Phone Mockup Frame */}
                        <div className="flex-1 mx-6 mb-28 bg-[#1a0f35] rounded-t-[2.5rem] rounded-b-[1.5rem] border-[6px] border-gray-800 shadow-inner overflow-hidden relative flex flex-col">
                            {/* Notch Area */}
                            <div className="flex justify-between items-center px-6 py-2 text-[10px] text-white/50 font-medium">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <div className="w-4 h-2.5 rounded-sm border border-white/40 flex justify-end p-[1px]"><div className="w-2.5 h-full bg-white/60 rounded-[1px]"></div></div>
                                </div>
                            </div>

                            {/* App Header Mock */}
                            <div className="flex justify-center gap-4 py-2 opacity-30">
                                <div className="w-6 h-6 rounded bg-white/20"></div>
                                <div className="w-6 h-6 rounded bg-fuchsia-400 flex gap-1 items-center justify-center p-1"><div className="w-1 h-3 bg-white rounded-full" /><div className="w-1 h-2 bg-white rounded-full" /><div className="w-1 h-3 bg-white rounded-full" /></div>
                                <div className="w-6 h-6 rounded bg-white/20"></div>
                            </div>

                            {/* Main Video Area Placeholder */}
                            <div className="flex-1 m-2 mt-0 border border-amber-500/30 rounded-2xl bg-gradient-to-b from-amber-100 to-orange-50 relative overflow-hidden flex flex-col items-center justify-end pb-4 shadow-[inset_0_0_20px_rgba(251,146,60,0.3)]">
                                <Image
                                    src="/assets/Cartoon Palm Reader.jpg"
                                    fill
                                    className="object-cover"
                                    alt="Video Call Frame"
                                />

                                {/* Mock Video Call Controls */}
                                <div className="flex gap-3 relative z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center border-2 border-white/20"></div>
                                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border-2 border-white/20"></div>
                                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border-2 border-white/20"></div>
                                </div>
                            </div>

                            {/* Bottom Remote Participants Mock */}
                            <div className="h-20 flex gap-2 px-2 pb-2">
                                <div className="flex-1 bg-gray-700/50 rounded-xl overflow-hidden relative flex items-center justify-center text-[10px] text-white/30 border border-white/10">[Cam 1]</div>
                                <div className="flex-1 bg-gray-700/50 rounded-xl overflow-hidden relative flex items-center justify-center text-[10px] text-white/30 border border-white/10">[Cam 2]</div>
                                <div className="flex-1 bg-gray-700/50 rounded-xl overflow-hidden relative flex items-center justify-center text-[10px] text-white/30 border border-white/10">[Cam 3]</div>
                            </div>
                        </div>

                        {/* CTA Button overlaying the phone */}
                        <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
                            <Button className="w-full bg-gradient-to-b from-[#ffb443] to-[#d67b22] hover:from-[#ffc466] hover:to-[#e68d33] text-white rounded-2xl py-8 px-6 text-[22px] font-bold shadow-[0_8px_0_#a85c15,0_15px_20px_rgba(0,0,0,0.4)] transition-all active:translate-y-[6px] active:shadow-[0_2px_0_#a85c15,0_5px_10px_rgba(0,0,0,0.4)] flex justify-between items-center border border-orange-300/50">
                                <span>CALL AI PALM<br />READER NOW</span>
                                <div className="bg-white/20 p-3 rounded-full shrink-0">
                                    <Video className="h-8 w-8 text-white fill-white" />
                                </div>
                            </Button>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

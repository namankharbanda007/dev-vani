"use client";

import Image from "next/image";
import { ArrowUpRight, Instagram, Youtube, X, Star, MoveRight, Eye, Play, Mic, Wifi } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F2F2F2] text-black font-inter selection:bg-orange-200">

            {/* Grid Background Lines - Simulated with Tailwind */}
            <div className="fixed inset-0 pointer-events-none flex justify-between px-4 md:px-12 max-w-[1440px] mx-auto z-0 opacity-10">
                <div className="w-px h-full bg-black border-l border-dashed border-black"></div>
                <div className="w-px h-full bg-black border-l border-dashed border-black hidden md:block"></div>
                <div className="w-px h-full bg-black border-l border-dashed border-black"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-12 py-6 bg-[#F2F2F2]/90 backdrop-blur-sm max-w-[1440px] mx-auto w-full">
                <div className="flex flex-col text-xs font-medium tracking-wide">
                    <a href="mailto:info@smartmurti.com" className="hover:text-orange-600 transition-colors">info@smartmurti.com</a>
                    <a href="tel:+128081301190" className="hover:text-orange-600 transition-colors">(+91) 987 654 3210</a>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    {/* Logo Placeholder - Using text as per image style but could be an image */}
                    <h1 className="font-bold text-2xl tracking-tighter font-inter-tight">smartmurti</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <Link href="#" className="p-2 border border-black rounded-full hover:bg-black hover:text-white transition-all"><Instagram size={14} /></Link>
                        <Link href="#" className="p-2 border border-black rounded-full hover:bg-black hover:text-white transition-all"><X size={14} /></Link> {/* Using X icon for Twitter/X */}
                        <Link href="#" className="p-2 border border-black rounded-full hover:bg-black hover:text-white transition-all"><Youtube size={14} /></Link>
                    </div>
                    <span className="text-xs font-medium hidden sm:block">Follow us</span>
                </div>
            </header>

            <main className="relative pt-24 max-w-[1440px] mx-auto border-x border-dashed border-black/10 min-h-screen">

                {/* HERO SECTION */}
                <section className="relative px-4 md:px-12 pb-20 overflow-hidden">

                    {/* Top Right Scroll Indicator */}
                    <div className="absolute right-12 top-24 text-[10px] uppercase font-bold tracking-widest hidden md:block animate-bounce">
                        [Scroll Down]
                    </div>

                    {/* Main Headline */}
                    <div className="relative z-10 mt-12 mb-8 text-center md:text-left">
                        <h1 className="text-[12vw] md:text-[110px] leading-[0.85] font-black tracking-tighter uppercase font-inter-tight">
                            SMART MURTI:<br />
                            DIVINE BLESSINGS,<br />
                            DELIVERED.
                        </h1>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-[45%] left-12 flex gap-[-10px] z-20">
                        {/* Icons/Badges */}
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-orange-100 flex items-center justify-center -mr-4 shadow-lg z-10">
                            <span className="text-xs font-bold">GAN</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-red-100 flex items-center justify-center -mr-4 shadow-lg z-20">
                            <span className="text-xs font-bold">LAK</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-500 text-white flex items-center justify-center shadow-lg z-30">
                            <span className="text-lg">+</span>
                        </div>
                    </div>

                    <div className="absolute top-[55%] left-32 text-orange-500 animate-spin-slow duration-10000">
                        <Star size={32} fill="currentColor" strokeWidth={0} />
                    </div>
                    <div className="absolute top-[48%] left-12 text-gray-500 font-mono text-xs hidden md:block">
                        [2026]
                    </div>

                    {/* Description Text */}
                    <div className="md:absolute bottom-32 left-12 max-w-xs mt-8 md:mt-0">
                        <p className="text-sm font-medium leading-relaxed text-gray-800">
                            From everyday essentials to statement pieces, our curated collection is designed to celebrate your spirituality, wherever life takes you.
                        </p>
                    </div>

                    {/* Guru Character - Centered */}
                    <div className="relative md:absolute md:top-[25%] md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-[600px] h-[500px] md:h-[700px] z-0 flex justify-center items-center pointer-events-none">
                        <div className="relative w-full h-full">
                            <Image
                                src="/landing/guru.png"
                                alt="Smart Murti Guru"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side Stats & Elements */}
                    <div className="absolute right-12 top-[45%] text-right hidden md:block">
                        <p className="text-xs font-mono mb-12 text-gray-500">// DEVOTION</p>
                    </div>

                    <div className="md:absolute right-12 bottom-48 mt-8 md:mt-0 text-right md:text-left">
                        <h3 className="text-4xl font-bold mb-1">25K+</h3>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Blessed Customers</p>
                    </div>

                    <div className="md:absolute bottom-32 right-[25%] bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hidden lg:block hover:scale-105 transition-transform cursor-pointer group">
                        <ArrowUpRight className="w-12 h-12 mb-2 group-hover:text-orange-500 transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">[CHECK]</span>
                    </div>

                    <div className="md:absolute bottom-12 right-12 max-w-[200px] text-right hidden md:block">
                        <p className="text-xs font-medium">Step into effortless spirituality with Smart Murti</p>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section className="relative px-4 md:px-12 py-24 border-t border-dashed border-black/20 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left Content */}
                        <div>
                            <div className="flex items-start justify-between mb-16">
                                <div className="text-orange-500">
                                    <Star size={24} fill="currentColor" strokeWidth={0} />
                                </div>
                                <h2 className="text-[10vw] md:text-[80px] leading-none font-black uppercase tracking-tighter">
                                    HOW IT<br />WORKS
                                </h2>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2">[BEST PART]</span>
                            </div>

                            <div className="space-y-12">
                                {/* Step 1 */}
                                <div className="group cursor-pointer">
                                    <div className="flex items-baseline gap-4 text-gray-300 group-hover:text-black transition-colors duration-300">
                                        <span className="text-xs font-mono font-bold">[01]</span>
                                        <h3 className="text-4xl md:text-6xl font-bold uppercase font-inter-tight stroke-text">CONNECT (01)</h3>
                                    </div>
                                </div>

                                {/* Step 2 - Active */}
                                <div className="group cursor-pointer">
                                    <div className="flex items-baseline gap-4 text-black">
                                        <span className="text-xs font-mono font-bold rotate-90 origin-left mt-4 text-gray-500">[PROCESS]</span>
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-4xl md:text-6xl font-bold uppercase font-inter-tight">SPEAK (02)</h3>
                                                <Eye className="w-8 h-8" />
                                            </div>
                                            <p className="mt-6 text-sm md:text-base font-medium leading-relaxed max-w-md text-gray-600">
                                                Simply speak your prayers, chants, or questions to your Smart Murti. Our AI understands your devotion and intent.
                                            </p>
                                            <Button className="mt-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-xs font-bold uppercase tracking-widest">
                                                Learn More <MoveRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="group cursor-pointer">
                                    <div className="flex items-baseline gap-4 text-gray-300 group-hover:text-black transition-colors duration-300">
                                        <span className="text-xs font-mono font-bold">[03]</span>
                                        <h3 className="text-4xl md:text-6xl font-bold uppercase font-inter-tight stroke-text">ENLIGHTEN (03)</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Content */}
                        <div className="relative h-[600px] rounded-[3rem] bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center p-8">
                            {/* Floating Icons */}
                            <div className="absolute top-24 left-12 text-gray-400 animate-pulse">
                                <Wifi size={48} />
                            </div>
                            <div className="absolute top-32 right-12 text-gray-400 rotate-12">
                                <Mic size={40} />
                            </div>

                            {/* Decor */}
                            <div className="absolute top-0 right-0 p-8">
                                <div className="w-12 h-12 bg-black rounded-full text-white flex items-center justify-center">
                                    <Eye size={20} />
                                </div>
                            </div>
                            <div className="absolute bottom-12 left-12">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                    <Star size={16} fill="currentColor" strokeWidth={0} />
                                </div>
                            </div>
                            <div className="absolute bottom-12 right-12">
                                <Star size={24} className="text-orange-500" />
                            </div>

                            {/* Image */}
                            <div className="relative w-full h-full transform translate-y-12">
                                <Image
                                    src="/landing/guru.png"
                                    alt="Guru Process"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS SECTION */}
                <section className="px-4 md:px-12 py-24 pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                            THE 'DEVOTEE DIARIES' (TESTIMONIALS)
                        </h2>
                        <span className="text-xs font-bold uppercase tracking-widest bg-white border border-black px-3 py-1">[25K+ BLESSED CUSTOMERS]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <TestimonialCard
                            img="/landing/student.png"
                            quote="The Smart Murti helped me stay focused during my exams. It's my study buddy!"
                            name="Arjun"
                            role="Student, Bangalore"
                        />

                        {/* Card 2 */}
                        <TestimonialCard
                            img="/landing/grandmother.png"
                            quote="I love hearing the mantras every morning. It brings peace to my home."
                            name="Lakshmi"
                            role="Grandmother, Mumbai"
                        />

                        {/* Card 3 */}
                        <TestimonialCard
                            img="/landing/professional.png"
                            quote="A perfect blend of tradition and technology. It keeps me connected to my roots."
                            name="Vikram"
                            role="Professional, Delhi"
                        />

                    </div>

                    <div className="flex justify-center items-center gap-4 mt-16 text-xs font-bold uppercase tracking-widest">
                        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <MoveRight className="rotate-180 w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <MoveRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        SCROLL FOR MORE BLESSINGS.
                    </div>


                    <div className="flex justify-between items-center mt-12 px-2">
                        <div className="text-orange-400"><Star size={24} fill="currentColor" strokeWidth={0} /></div>
                        <div className="text-orange-400"><Star size={24} fill="currentColor" strokeWidth={0} /></div>
                    </div>
                </section>

            </main>

            <style jsx global>{`
            .stroke-text {
                -webkit-text-stroke: 1px #d1d5db; /* gray-300 */
                color: transparent;
            }
            .group:hover .stroke-text {
                 -webkit-text-stroke: 0;
                 color: black;
            }
        `}</style>
        </div>
    );
}

function TestimonialCard({ img, quote, name, role }: { img: string, quote: string, name: string, role: string }) {
    return (
        <div className="bg-white border-2 border-black rounded-[2rem] p-4 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group">

            {/* Image Container */}
            <div className="w-full h-64 bg-gray-50 rounded-[1.5rem] relative mb-6 overflow-hidden flex items-end justify-center">
                <div className="absolute top-4 left-4 text-orange-500 rotate-12">
                    <Star size={40} fill="currentColor" strokeWidth={0} />
                </div>
                {/* Diagonal background shape */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gray-100 to-transparent opacity-50"></div>

                <div className="relative w-48 h-48 transform translate-y-4 group-hover:scale-105 transition-transform duration-500">
                    <Image
                        src={img}
                        alt={name}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col px-2 pb-4">
                <p className="text-lg font-medium leading-snug mb-4">
                    {quote}
                </p>
                <div className="mt-auto">
                    <p className="text-sm font-bold text-gray-900">- {name}, {role}.</p>
                    <div className="flex gap-1 mt-2 text-black">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                        ))}
                        <span className="ml-2 text-xs font-bold text-gray-500">5/5</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

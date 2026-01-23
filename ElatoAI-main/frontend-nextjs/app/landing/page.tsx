"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube, FaArrowRight } from "react-icons/fa6";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F2F2F2] text-black font-sans relative overflow-hidden selection:bg-orange-200 -mt-[44px]">
            {/* Dashed Vertical Lines - Decorative background */}
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none px-4 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto opacity-10 h-full w-full">
                <div className="border-r border-dashed border-black h-full"></div>
                <div className="border-r border-dashed border-black h-full hidden md:block"></div>
                <div className="border-r border-dashed border-black h-full hidden lg:block"></div>
                <div className="border-r border-dashed border-black h-full hidden xl:block"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 flex flex-col md:flex-row justify-between items-center px-6 py-6 md:px-12 lg:px-24 w-full max-w-[1920px] mx-auto">
                {/* Left: Contact */}
                <div className="text-xs md:text-sm font-medium tracking-wide self-start md:self-auto mb-4 md:mb-0">
                    <p>info@smartmurti.com</p>
                    <p>(+12) 808 130 1190</p>
                </div>

                {/* Center: Logo */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 md:block">
                    <div className="w-32 md:w-48 relative h-12 md:h-16">
                        <Image
                            src="/assets/landing/logo.png"
                            alt="Smart Murti Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Right: Socials */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                    <Link href="#" className="w-8 h-8 flex items-center justify-center border border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300">
                        <FaInstagram className="w-4 h-4" />
                    </Link>
                    <Link href="#" className="w-8 h-8 flex items-center justify-center border border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300">
                        <span className="text-xs font-bold">𝕏</span>
                    </Link>
                    <Link href="#" className="w-8 h-8 flex items-center justify-center border border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300">
                        <FaYoutube className="w-4 h-4" />
                    </Link>
                    <span className="text-sm font-medium ml-2 hidden sm:block">Follow us</span>
                </div>
            </header>

            {/* Hero Content - Adjusted for Layout issues */}
            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 pt-4 md:pt-12 pb-0 flex flex-col items-center justify-center min-h-[90vh]">

                {/* Main Heading & Character Container */}
                <div className="relative w-full text-center flex justify-center items-center mt-8 mb-0 h-full min-h-[600px] md:min-h-[800px]">

                    {/* Background Text Layer */}
                    <div className="relative z-0 pointer-events-none select-none flex flex-col items-center justify-center w-full h-full pb-32">
                        {/* Reduced text size to 8.5vw to better match reference */}
                        <h1 className="text-[8.5vw] 2xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-black">
                            SMART MURTI:
                        </h1>
                        <h1 className="text-[8.5vw] 2xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-black whitespace-nowrap">
                            DIVINE BLESSINGS,
                        </h1>
                        <h1 className="text-[8.5vw] 2xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-black text-right w-full pr-[2vw]">
                            DELIVERED.
                        </h1>
                    </div>

                    {/* Character Image Layer - Foreground */}
                    {/* Significantly increased size and anchored to bottom */}
                    <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-[90vw] md:w-[800px] lg:w-[1000px] xl:w-[1200px] z-20 flex items-end justify-center pointer-events-none">
                        <Image
                            src="/assets/landing/character.png"
                            alt="Divine Character"
                            width={1100}
                            height={1100}
                            className="object-contain drop-shadow-2xl translate-y-16"
                            priority
                        />
                    </div>
                </div>


                {/* Floating Elements / Details */}

                {/* Left Side Details relative to viewport/container */}
                <div className="absolute bottom-[20%] left-6 md:left-12 lg:left-24 max-w-xs hidden lg:block z-30">
                    {/* Icons/Badges */}
                    <div className="flex -space-x-4 mb-16 pointer-events-auto">
                        <div className="w-12 h-12 rounded-full bg-[#FFD7BA] border-2 border-white relative overflow-hidden flex items-center justify-center">
                            <span className="text-xl">🕉️</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#FFA07A] border-2 border-white relative overflow-hidden flex items-center justify-center">
                            <span className="text-xl">🪔</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-lg font-bold">
                            +
                        </div>
                    </div>

                    <div className="mb-6 font-mono text-sm text-gray-500">[2026]</div>

                    <p className="text-sm font-medium leading-relaxed text-gray-800 max-w-[200px]">
                        From everyday essentials to statement pieces, our curated collection is designed to celebrate your spirituality, wherever life takes you.
                    </p>
                </div>

                {/* Right Side Details */}
                <div className="absolute top-[30%] right-6 md:right-12 lg:right-24 text-right hidden lg:block z-30">
                    <div className="text-xs font-mono mb-32 text-gray-500 tracking-widest">[SCROLL DOWN]</div>

                    <div className="text-xs font-mono mb-6 uppercase text-gray-500 tracking-widest">// Fashion</div>

                    <div className="text-left">
                        <h3 className="text-4xl font-bold">25K+</h3>
                        <p className="text-[10px] font-bold tracking-wider text-gray-600 uppercase">Blessed Customers</p>
                    </div>
                </div>

                {/* Floating Check Button */}
                <div className="absolute bottom-[10%] right-[20%] z-40 bg-white p-5 rounded-[2rem] shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer group">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-xl mb-2 group-hover:bg-black group-hover:text-white transition-colors">
                        <FaArrowRight className="transform -rotate-45 text-xl" />
                    </div>
                    <div className="text-center text-[10px] font-bold uppercase tracking-widest">[CHECK]</div>
                </div>

                {/* Bottom Right Text */}
                <div className="absolute bottom-12 right-12 max-w-[200px] text-right hidden lg:block">
                    <p className="text-sm font-medium leading-tight">
                        Step into effortless spirituality with Smart Murti
                    </p>
                </div>

                {/* Decorative Star */}
                <div className="absolute top-[60%] left-[20%] text-orange-500 text-7xl font-serif hidden md:block animate-spin-slow box-content z-10">
                    *
                </div>

            </div>
        </div>
    );
}

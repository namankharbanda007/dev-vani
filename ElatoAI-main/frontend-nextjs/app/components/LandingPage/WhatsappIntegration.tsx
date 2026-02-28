"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function WhatsappIntegration() {
    return (
        <section className="w-full py-16 md:py-24 bg-[#0a100d] relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-900 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-900 rounded-full blur-[100px] opacity-20"></div>
            </div>

            <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
                {/* Left side text */}
                <div className="flex-1 space-y-6 text-white text-center lg:text-left">
                    <div className="inline-block bg-emerald-500/20 text-emerald-400 font-semibold px-4 py-2 rounded-full mb-2 border border-emerald-500/30">
                        WhatsApp Integration
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-lora leading-tight">
                        Daily Horoscope & Remedies, <br />
                        <span className="text-emerald-400">Direct to your WhatsApp</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Start your day with divine guidance. Receive your personalized daily horoscope, lucky elements, and powerful remedies straight from Smart Pandit directly on WhatsApp.
                    </p>

                    <ul className="text-left space-y-4 text-gray-200 mt-8 max-w-md mx-auto lg:mx-0">
                        <li className="flex items-start gap-3">
                            <span className="bg-emerald-500 p-1 rounded-full text-white mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span>Personalized birth-chart based predictions</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-emerald-500 p-1 rounded-full text-white mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span>Lucky colors, numbers, and gemstones</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-emerald-500 p-1 rounded-full text-white mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span>Daily tasks and spiritual power-boosts</span>
                        </li>
                    </ul>

                    <div className="pt-6">
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-3 mx-auto lg:mx-0">
                            <MessageCircle className="w-6 h-6" />
                            Try it on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Right side Visual - Mockup of the image */}
                <div className="flex-1 flex justify-center lg:justify-end relative w-full pt-10 lg:pt-0">
                    <div className="relative w-full max-w-[320px] lg:max-w-sm">
                        {/* The Phone Mockup */}
                        <div className="relative bg-[#0d1418] border-[12px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19] z-10 w-full mx-auto">
                            {/* iPhone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-gray-900 rounded-b-3xl z-30"></div>

                            {/* WhatsApp Header */}
                            <div className="bg-[#075e54] p-4 pt-8 flex items-center gap-3 relative z-20">
                                <div className="w-10 h-10 rounded-full bg-white overflow-hidden shrink-0">
                                    <Image src="/assets/Cartoon Astrologer.jpg" alt="Pandit" width={40} height={40} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white leading-tight truncate w-32">Smart Pandit</h4>
                                    <p className="text-xs text-white/70">typing...</p>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="bg-[#efe7dd] h-full p-4 flex flex-col gap-4 relative overflow-y-auto pb-24 scrollbar-hide">
                                {/* WA Background pattern mockup */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }}></div>

                                {/* User Message */}
                                <div className="bg-[#dcf8c6] p-3 rounded-xl rounded-tr-none self-end max-w-[85%] shadow-sm relative z-10 text-gray-800 text-sm mt-2">
                                    horoscope bheje do pandit ji
                                    <span className="text-[10px] text-gray-500 ml-2 float-right mt-1">9:01 AM ✓✓</span>
                                </div>

                                {/* Bot Message */}
                                <div className="bg-white p-3 rounded-xl rounded-tl-none self-start w-[95%] shadow-sm relative z-10 border-l-4 border-emerald-500 text-sm">

                                    {/* Rich Card */}
                                    <div className="bg-[#111b21] rounded-xl p-4 mb-3 text-white">
                                        <h5 className="text-center font-bold text-emerald-400 mb-3 border-b border-gray-700 pb-2">Lucky Elements</h5>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                                            <div>
                                                <p className="text-gray-400 mb-1">Colour</p>
                                                <p className="font-bold text-lg flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Orange</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 mb-1">Number</p>
                                                <p className="font-bold text-lg text-white">2</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 mb-1">Gemstone</p>
                                                <p className="font-bold text-[15px] text-emerald-400 truncate">Emerald</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 mb-1">Direction</p>
                                                <p className="font-bold text-[15px] text-white">North-East</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-800 font-medium mb-2 leading-relaxed text-[13px]">
                                        🌅 Good Morning Praveen!<br />
                                        Monday - Bhagwan Shiv ka powerful din 🙏
                                    </p>
                                    <p className="text-gray-600 mb-2 leading-relaxed text-[12px]">
                                        Aaj full focus mode ON! Goals crystal clear honge, tasks time pe perfectly smash kar loge...
                                    </p>
                                    <p className="text-emerald-700 font-bold font-serif text-[12px] pr-12">
                                        Smartmurti - Your pocket Pandit!
                                    </p>

                                    <span className="absolute bottom-2 right-2 text-[10px] text-gray-400 pt-1">9:01 AM</span>
                                </div>
                            </div>

                            {/* Chat Input Area Mockup */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#f0f0f0] flex items-center gap-2 z-20">
                                <div className="flex-1 bg-white rounded-full px-4 py-2 text-gray-400 text-sm">Message</div>
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Character Image extending out of phone */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-24 lg:-left-40 w-48 md:w-56 lg:w-72 aspect-[3/4] z-20 hidden md:block" style={{ transform: 'scaleX(-1) translateY(-50%)' }}>
                            {/* We flip it horizontally so it peaks out from behind */}
                            <Image src="/assets/erasebg-transformed (5).png.png" alt="Smart Pandit Character" fill className="object-contain drop-shadow-2xl" />
                        </div>

                        <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-24 lg:-right-32 w-48 md:w-56 lg:w-72 aspect-[3/4] z-20 hidden lg:block pointer-events-none">
                            <Image src="/assets/Cartoon Palm Reader.jpg" alt="Second Character" fill className="object-contain drop-shadow-2xl opacity-60 rounded-full blur-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

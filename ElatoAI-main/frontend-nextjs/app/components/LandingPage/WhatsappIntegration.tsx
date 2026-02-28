"use client";

import Image from "next/image";
import { MessageCircle, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsappIntegration() {
    return (
        <section className="w-full py-24 md:py-32 relative overflow-hidden bg-black">
            {/* Deep premium background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a12] via-black to-[#05100a] pointer-events-none" />

            {/* Cosmic/Spiritual lighting effects */}
            <div className="absolute top-1/4 left-0 w-full h-[500px] bg-emerald-900/10 blur-[150px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Left Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-8 max-w-2xl"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>Next-Gen Spiritual Companion</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-lora leading-[1.15] mb-6">
                                Your Personal Pandit,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                                    Always on WhatsApp.
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
                                Experience divine guidance seamlessly integrated into your daily life. Get personalized horoscopes, profound remedies, and answers to life's burning questions—right where you chat.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {[
                                "Daily Horoscope & Lucky Elements tailored to your birth chart.",
                                "Instant answers to spiritual and astrological queries 24/7.",
                                "Reminders for important Muhurtas and Puja times."
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-1 shrink-0 bg-emerald-500/20 rounded-full p-0.5">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <p className="text-gray-300 text-lg leading-snug">{feature}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="pt-4"
                        >
                            <button className="group relative inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5c] text-black font-bold text-lg py-4 px-10 rounded-full shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-all overflow-hidden">
                                <MessageCircle className="w-6 h-6 fill-black/10" />
                                <span className="relative z-10 tracking-wide">Connect on WhatsApp</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

                                {/* Button shine effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual Area: Cinematic Image Display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative lg:ml-auto w-full max-w-lg mx-auto lg:max-w-none"
                    >
                        {/* Ambient glow behind image */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full transform -translate-y-12 scale-110" />

                        <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm group">
                            <Image
                                src="/assets/landing-2/Gemini_Generated_Image_gsxe1ugsxe1ugsxe.png"
                                alt="WhatsApp Spiritual Guide"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />

                            {/* Premium gradient overlay to blend image into background smoothly */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

                            {/* Floating UI Element embedded in image */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-wide">Smart Pandit</h4>
                                        <p className="text-emerald-300 text-xs font-medium mt-0.5">Typing a divine message...</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating decorative particles */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 blur-2xl rounded-full"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import { BookOpen, Music, PlayCircle, Star } from "lucide-react";

export default function DailySpirituality() {
    return (
        <section className="py-24 px-6 md:px-10 bg-soft-paper relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-murti-stone mb-6">
                        Your Daily Digital Ashram
                    </h2>
                    <p className="text-lg text-murti-stone/70">
                        Cultivate a consistent spiritual path with our daily tools and vast library of devotional music.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Daily Horoscope */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-indigo-50 border border-indigo-100 p-8 md:p-12 flex flex-col justify-between group"
                    >
                        <div className="absolute top-0 right-0 -transtale-y-10 translate-x-10 text-indigo-400 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                            <Star className="w-80 h-80" />
                        </div>

                        <div className="relative z-10 mb-20 whitespace-normal">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-8 shadow-sm">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-indigo-950 mb-4 whitespace-normal">
                                Daily Horoscope &<br />Detailed Reports
                            </h3>
                            <p className="text-lg text-indigo-900/70 font-medium max-w-md whitespace-normal">
                                Receive personalized daily forecasts. Understand your planetary movements and get actionable spiritual remedies directly to your phone.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <button className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                View Sample Report →
                            </button>
                        </div>
                    </motion.div>

                    {/* Free Bhajans */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-orange-50 border border-orange-100 p-8 md:p-12 flex flex-col justify-between group"
                    >
                        <div className="absolute top-0 right-0 -transtale-y-10 translate-x-10 text-orange-400 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                            <Music className="w-80 h-80" />
                        </div>

                        <div className="relative z-10 mb-20 whitespace-normal">
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-8 shadow-sm">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-orange-950 mb-4 whitespace-normal">
                                Unlimited Free Bhajans &<br />Aarti Library
                            </h3>
                            <p className="text-lg text-orange-900/70 font-medium max-w-md whitespace-normal">
                                Immerse yourself in devotion. Stream thousands of high-quality, ad-free Bhajans, Mantras, and Aartis designed to elevate your environment.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <button className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-800 transition-colors">
                                Listen Now →
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

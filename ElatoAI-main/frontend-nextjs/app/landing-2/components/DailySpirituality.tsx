"use client";

import { motion } from "framer-motion";
import { BookOpen, Music, PlayCircle, Star } from "lucide-react";
import Link from "next/link";

export default function DailySpirituality() {
    return (
        <section className="relative overflow-hidden bg-soft-paper px-6 py-24 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="mb-6 text-4xl font-serif font-bold text-murti-stone md:text-5xl">
                        Your Daily Digital Ashram
                    </h2>
                    <p className="text-lg text-murti-stone/70">
                        Cultivate a consistent spiritual path with our daily tools and devotional music library.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-8 md:p-12"
                    >
                        <div className="pointer-events-none absolute right-0 top-0 -translate-y-10 translate-x-10 text-indigo-400 opacity-10 transition-opacity duration-700 group-hover:opacity-20">
                            <Star className="h-80 w-80" />
                        </div>

                        <div className="relative z-10 mb-20">
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <h3 className="mb-4 text-3xl font-serif font-bold text-indigo-950">
                                Daily Horoscope and Detailed Reports
                            </h3>
                            <p className="max-w-md text-lg font-medium text-indigo-900/70">
                                Receive personalized daily forecasts, understand your planetary movements, and get actionable spiritual remedies.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link href="/horoscope" className="flex items-center gap-2 font-bold text-indigo-600 transition-colors hover:text-indigo-800">
                                View Daily Horoscope
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-orange-100 bg-orange-50 p-8 md:p-12"
                    >
                        <div className="pointer-events-none absolute right-0 top-0 -translate-y-10 translate-x-10 text-orange-400 opacity-10 transition-opacity duration-700 group-hover:opacity-20">
                            <Music className="h-80 w-80" />
                        </div>

                        <div className="relative z-10 mb-20">
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                                <PlayCircle className="h-8 w-8" />
                            </div>
                            <h3 className="mb-4 text-3xl font-serif font-bold text-orange-950">
                                Unlimited Free Bhajans and Aarti Library
                            </h3>
                            <p className="max-w-md text-lg font-medium text-orange-900/70">
                                Stream high-quality bhajans, mantras, and aartis designed to deepen your daily devotion.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link href="/bhajan" className="flex items-center gap-2 font-bold text-orange-600 transition-colors hover:text-orange-800">
                                Listen Now
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

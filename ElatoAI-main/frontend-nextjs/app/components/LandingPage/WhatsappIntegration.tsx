"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_LINK =
    "https://wa.me/917982251998?text=Namaste%20Smart%20Murti%2C%20I%20want%20to%20try%20Smart%20Pandit.";

const features = [
    "Daily horoscope and lucky elements tailored to your birth chart.",
    "Instant answers to spiritual and astrological questions.",
    "Reminders for important muhurats and puja times.",
];

export default function WhatsappIntegration() {
    return (
        <section className="w-full bg-[#09120D] py-20 text-white md:py-28">
            <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex max-w-2xl flex-col gap-7"
                >
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                            <Sparkles className="h-4 w-4" />
                            WhatsApp Companion
                        </div>
                        <h2 className="font-lora text-4xl font-bold leading-tight md:text-5xl">
                            Your personal Pandit, ready where families already chat.
                        </h2>
                        <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-50/75">
                            Get devotional guidance, horoscope nudges, and practical remedies in a familiar
                            WhatsApp flow without opening another app.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                                <p className="text-base leading-7 text-emerald-50/80">{feature}</p>
                            </div>
                        ))}
                    </div>

                    <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-base font-bold text-black shadow-[0_18px_45px_rgba(37,211,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[#20bd5c]"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Connect on WhatsApp
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl"
                >
                    <div className="relative aspect-[4/5] w-full">
                        <Image
                            src="/assets/landing-2/Gemini_Generated_Image_gsxe1ugsxe1ugsxe.png"
                            alt="Smart Pandit WhatsApp guidance"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 560px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Smart Pandit</h4>
                                    <p className="mt-1 text-xs font-medium text-emerald-100/85">
                                        Ready to guide your next question.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

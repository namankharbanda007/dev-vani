import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Music, Home, Check, Flame } from "lucide-react";
import PreorderForm from "@/app/components/PreorderForm";

export default function SmartMandirPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 via-red-50 to-white">
            <main className="flex-1">
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-100 via-red-50 to-amber-50 py-12 md:py-32">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-10 top-20 h-96 w-96 rounded-full bg-orange-300 blur-3xl" />
                        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-red-300 blur-3xl" />
                    </div>

                    <div className="container relative z-10 mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                            <div className="space-y-8">
                                <div className="inline-block rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
                                    Coming Soon
                                </div>

                                <h1 className="bg-gradient-to-r from-orange-900 via-red-700 to-amber-600 bg-clip-text font-lora text-4xl font-bold leading-tight text-transparent md:text-6xl">
                                    Smart Mandir
                                </h1>

                                <p className="text-2xl font-semibold text-orange-900 md:text-3xl">
                                    Complete AI-Powered Home Temple
                                </p>

                                <p className="text-lg leading-relaxed text-gray-700">
                                    A premium home temple experience with devotional audio, guided rituals, and interactive spiritual support built into the mandir itself.
                                </p>

                                <div className="rounded-2xl border-2 border-orange-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm uppercase tracking-wide text-gray-600">Starting From</p>
                                            <p className="text-4xl font-bold text-orange-900">Rs 6,499</p>
                                        </div>
                                        <div className="flex-1 border-l border-orange-200 pl-4">
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <Home className="h-5 w-5" />
                                                <span className="font-semibold">Complete temple setup</span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">Built for guided devotion at home.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-100 p-2">
                                            <Sparkles className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Guided spiritual interactions</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-100 p-2">
                                            <Music className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Bhajans, aartis, and devotional audio</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-100 p-2">
                                            <Flame className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Ritual-friendly guided experiences</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <PreorderForm productName="Smart Mandir" productPrice="Rs 6,499" accentColor="orange" />
                                    <Link href="/products">
                                        <Button size="lg" variant="outline" className="rounded-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Products
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-300 to-red-300 opacity-30 blur-3xl" />
                                <Image
                                    src="/products/smart-mandir.jpg"
                                    alt="Smart Mandir home temple"
                                    width={600}
                                    height={600}
                                    className="relative z-10 rounded-3xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-white py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                        <h2 className="mb-4 text-center font-lora text-4xl font-bold text-gray-900">
                            What Makes It Special
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-gray-600">
                            Traditional devotion with a modern guided layer.
                        </p>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex gap-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-orange-900">Guided Devotion</h3>
                                    <p className="text-gray-700">
                                        Designed to support prayer, ritual, and calm daily spiritual routines.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500">
                                    <Music className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-orange-900">Devotional Audio</h3>
                                    <p className="text-gray-700">
                                        Bhajans, aartis, and guided spiritual playback for the home mandir.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500">
                                    <Flame className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-orange-900">Ritual Experience</h3>
                                    <p className="text-gray-700">
                                        Built for guided havan and ritual-style experiences without overwhelming the user.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-orange-900">Premium Setup</h3>
                                    <p className="text-gray-700">
                                        Crafted as a complete home worship product, not just a generic smart device.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

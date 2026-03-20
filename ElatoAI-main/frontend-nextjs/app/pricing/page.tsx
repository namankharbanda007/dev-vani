import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, MessageCircle, Phone, Sparkles, Star } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">
                <section className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 md:py-24">
                    <div className="container mx-auto max-w-screen-xl px-4 text-center md:px-6">
                        <h1 className="mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text font-lora text-4xl font-bold text-transparent md:text-6xl">
                            Prepaid Wallet Pricing
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-700 md:text-2xl">
                            Recharge your Smart Murti wallet and pay only for the spiritual experiences you use.
                        </p>
                    </div>
                </section>

                <section className="w-full py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <h2 className="mb-12 text-center text-3xl font-bold">Core Services</h2>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-3xl border-2 border-orange-100 bg-white p-8 shadow-xl transition-all hover:border-orange-300">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                                        <MessageCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">AI Chat</h3>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">Rs 5</span>
                                        <span className="text-gray-500">/min</span>
                                    </div>
                                    <p className="mt-2 text-gray-600">
                                        Text-first spiritual guidance with your saved guides.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-3xl border-2 border-amber-100 bg-white p-8 shadow-xl transition-all hover:border-amber-300">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">AI Call</h3>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">Rs 9</span>
                                        <span className="text-gray-500">/min</span>
                                    </div>
                                    <p className="mt-2 text-gray-600">
                                        Voice sessions with AI Pandit and spiritual guides.
                                    </p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border-2 border-yellow-100 bg-white p-8 shadow-xl transition-all hover:border-yellow-300">
                                <div className="absolute right-0 top-0 p-4 opacity-10">
                                    <Sparkles className="h-24 w-24" />
                                </div>
                                <div className="relative z-10 mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Rituals and Readings</h3>
                                </div>
                                <ul className="relative z-10 mb-8 space-y-4">
                                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="font-medium text-gray-700">Digital Puja</span>
                                        <span className="font-bold text-gray-900">Rs 101</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="font-medium text-gray-700">AI Face Reading</span>
                                        <span className="font-bold text-gray-900">Rs 51</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">Online Havan</span>
                                        <span className="font-bold text-gray-900">Rs 501</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gray-50 py-16">
                    <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
                        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                            <div className="p-6">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
                                    1
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Recharge Wallet</h3>
                                <p className="text-gray-600">Add funds and keep a balance ready for sessions and services.</p>
                            </div>
                            <div className="p-6">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl font-bold text-amber-600">
                                    2
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Use Services</h3>
                                <p className="text-gray-600">Start chat, calls, or rituals and spend only on what you use.</p>
                            </div>
                            <div className="p-6">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-2xl font-bold text-yellow-600">
                                    3
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Come Back Anytime</h3>
                                <p className="text-gray-600">Use your balance whenever you want spiritual guidance again.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gradient-to-br from-orange-600 to-amber-600 py-16">
                    <div className="container mx-auto max-w-screen-md px-4 text-center md:px-6">
                        <Wallet className="mx-auto mb-6 h-16 w-16 text-white/50" />
                        <h2 className="mb-6 font-lora text-3xl font-bold text-white md:text-5xl">
                            Explore The Main Journeys
                        </h2>
                        <p className="mb-8 text-xl text-orange-100">
                            Try the live Pandit or Astrologer experience, then fund your wallet when your payment flow is fully production-ready.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/pandit">
                                <Button size="lg" className="w-full rounded-full bg-white px-10 py-6 text-lg font-bold text-orange-700 hover:bg-gray-100 sm:w-auto">
                                    Visit Pandit
                                </Button>
                            </Link>
                            <Link href="/astrologer">
                                <Button size="lg" variant="outline" className="w-full rounded-full border-white px-10 py-6 text-lg font-bold text-white hover:bg-white/10 sm:w-auto">
                                    Visit Astrologer
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

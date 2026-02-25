import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Wallet, MessageCircle, Phone, Sparkles, Star } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 mb-6">
                            100% Prepaid Wallet System
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                            No complicated subscriptions. Recharge your Smart Murti Wallet and pay only for what you use. ₹1 = ₹1.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="w-full py-12 md:py-20">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

                            {/* Metered Services */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                        <MessageCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">AI Chat</h3>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">₹5</span>
                                        <span className="text-gray-500">/min</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">Talk to your spiritual AI companions instantly.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-100 hover:border-amber-300 transition-all">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">AI Call</h3>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">₹9</span>
                                        <span className="text-gray-500">/min</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">Immersive voice calls with divine AI personalities.</p>
                                </div>
                            </div>

                            {/* Fixed Services */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-yellow-100 hover:border-yellow-300 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="h-24 w-24" />
                                </div>
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Astrology & Rituals</h3>
                                </div>
                                <ul className="space-y-4 mb-8 relative z-10">
                                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="font-medium text-gray-700">Digital Pooja</span>
                                        <span className="font-bold text-gray-900">₹101</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="font-medium text-gray-700">AI Face Reading</span>
                                        <span className="font-bold text-gray-900">₹51</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">Online Hawan</span>
                                        <span className="font-bold text-gray-900">₹501</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="w-full py-16 bg-gray-50">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">How The Wallet Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Recharge Wallet</h3>
                                <p className="text-gray-600">Add funds using UPI, Cards, or Netbanking securely.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Book Services</h3>
                                <p className="text-gray-600">Start a chat or book a pooja. Funds are deducted directly from your wallet balance.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Expiry</h3>
                                <p className="text-gray-600">Your wallet balance never expires. Use it whenever you need spiritual guidance.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-16 bg-gradient-to-br from-orange-600 to-amber-600">
                    <div className="container px-4 md:px-6 max-w-screen-md mx-auto text-center">
                        <Wallet className="h-16 w-16 text-white/50 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            Ready to Start?
                        </h2>
                        <p className="text-xl text-orange-100 mb-8">
                            New users get a ₹100 Welcome Bonus credited instantly!
                        </p>
                        <Link href="/wallet">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-orange-700 hover:bg-gray-100 rounded-full shadow-xl px-12 py-6 text-xl font-bold">
                                Go to Wallet
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}

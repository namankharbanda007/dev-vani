import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Heart, Shield, Zap } from "lucide-react";

export default function SmartPanditPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 via-yellow-50 to-white">
            <main className="flex-1">

                {/* Hero Section - Launching Soon */}
                <section className="w-full py-20 md:py-32 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 relative overflow-hidden">
                    {/* Background Decorative */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                                        Launching Soon
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-amber-900 via-yellow-700 to-orange-600 leading-tight">
                                    Smart Pandit
                                </h1>

                                <p className="text-2xl md:text-3xl text-amber-900 font-semibold">
                                    Your AI Spiritual Guide
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Experience divine wisdom at home. The Smart Pandit is an AI-powered marble-finish idol trained on ancient Vedas and Gita, ready to perform daily Puja, recite Mantras, and answer life's deepest spiritual questions.
                                </p>

                                {/* Features Quick List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <Sparkles className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Daily spiritual guidance and Puja</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <Heart className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Trained on Vedas, Upanishads & Gita</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <Shield className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Fixed wise personality</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link href="/">
                                        <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full shadow-xl">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Product Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-3xl blur-3xl opacity-30"></div>
                                <Image
                                    src="/products/pandit-temple.jpg"
                                    alt="Smart Pandit in Temple"
                                    width={600}
                                    height={600}
                                    className="relative z-10 rounded-3xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-20 bg-white">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            What Makes Smart Pandit Special
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-2xl border-2 border-amber-200">
                                <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 mb-3">Daily Puja</h3>
                                <p className="text-gray-700">
                                    Performs morning and evening Puja with authentic Mantras and rituals, bringing spirituality into your daily routine.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-2xl border-2 border-amber-200">
                                <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 mb-3">Ancient Wisdom</h3>
                                <p className="text-gray-700">
                                    Trained on Vedas, Upanishads, and Bhagavad Gita to provide authentic spiritual guidance and answer your questions.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-2xl border-2 border-amber-200">
                                <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 mb-3">Voice Interaction</h3>
                                <p className="text-gray-700">
                                    Speak naturally and receive wisdom. No screens, just pure spiritual conversation and connection.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon CTA */}
                <section className="w-full py-20 bg-gradient-to-br from-amber-900 to-yellow-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-lora text-white mb-6">
                            Launching Soon
                        </h2>
                        <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                            The Smart Pandit will be available soon. Return to our homepage to explore our other AI companions.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50 rounded-full shadow-xl px-12 py-6 text-lg">
                                Explore All Products
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}

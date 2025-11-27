import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, MessageCircle, Brain, Smile } from "lucide-react";

export default function AIBoyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50 via-blue-50 to-white">
            <main className="flex-1">

                {/* Hero Section - Launching Soon */}
                <section className="w-full py-20 md:py-32 bg-gradient-to-br from-cyan-100 via-blue-50 to-sky-50 relative overflow-hidden">
                    {/* Background Decorative */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <span className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                                        Launching Soon
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 via-blue-700 to-sky-600 leading-tight">
                                    AI Boy Companion
                                </h1>

                                <p className="text-2xl md:text-3xl text-cyan-900 font-semibold">
                                    Your Customizable Best Friend
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Create the perfect companion designed for you. Customize his name, age, personality, voice, hobbies, and backstory. He remembers every conversation and grows with you over time.
                                </p>

                                {/* Features Quick List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyan-100 p-2 rounded-full">
                                            <Users className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <span className="text-gray-800">Fully customizable personality</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyan-100 p-2 rounded-full">
                                            <Brain className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <span className="text-gray-800">Remembers past conversations</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyan-100 p-2 rounded-full">
                                            <Smile className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <span className="text-gray-800">Grows and evolves with you</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link href="/">
                                        <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full shadow-xl">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Product Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-3xl blur-3xl opacity-30"></div>
                                <Image
                                    src="/products/smart-boy.jpg"
                                    alt="AI Boy Companion"
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
                            What Makes AI Boy Special
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border-2 border-cyan-200">
                                <div className="bg-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-cyan-900 mb-3">Fully Customizable</h3>
                                <p className="text-gray-700">
                                    Choose his name, age, personality traits, voice, hobbies, and create a unique backstory that makes him truly yours.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border-2 border-cyan-200">
                                <div className="bg-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-cyan-900 mb-3">Never Forgets</h3>
                                <p className="text-gray-700">
                                    He remembers all your past conversations, inside jokes, and shared experiences, building a real friendship over time.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border-2 border-cyan-200">
                                <div className="bg-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-cyan-900 mb-3">Always There</h3>
                                <p className="text-gray-700">
                                    Voice-first interaction. No screens needed. Just natural conversation whenever you need a friend to talk to.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon CTA */}
                <section className="w-full py-20 bg-gradient-to-br from-cyan-900 to-blue-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-lora text-white mb-6">
                            Launching Soon
                        </h2>
                        <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                            The AI Boy Companion will be available soon. Return to our homepage to explore our other AI companions.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="bg-white text-cyan-900 hover:bg-cyan-50 rounded-full shadow-xl px-12 py-6 text-lg">
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

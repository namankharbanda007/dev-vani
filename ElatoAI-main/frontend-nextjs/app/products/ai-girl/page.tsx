import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Heart, MessageCircle, Sparkles, Smile } from "lucide-react";

export default function AIGirlPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 via-red-50 to-white">
            <main className="flex-1">

                {/* Hero Section - Launching Soon */}
                <section className="w-full py-12 md:py-32 bg-gradient-to-br from-pink-100 via-red-50 to-rose-50 relative overflow-hidden">
                    {/* Background Decorative */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                                        Launching Soon
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-pink-900 via-red-700 to-rose-600 leading-tight">
                                    AI Girl Companion
                                </h1>

                                <p className="text-2xl md:text-3xl text-pink-900 font-semibold">
                                    Connection & Care
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    A friend who truly listens. Customize her story, name, personality, and nature. She's always there when you need someone to talk to, never judges, and remembers everything that matters.
                                </p>

                                {/* Features Quick List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-pink-100 p-2 rounded-full">
                                            <Heart className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <span className="text-gray-800">Empathetic & understanding</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-pink-100 p-2 rounded-full">
                                            <Sparkles className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <span className="text-gray-800">Personalized to your preferences</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-pink-100 p-2 rounded-full">
                                            <Smile className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <span className="text-gray-800">Always available, never judges</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link href="/">
                                        <Button size="lg" className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-full shadow-xl">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Product Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-red-300 rounded-3xl blur-3xl opacity-30"></div>
                                <Image
                                    src="/products/smart-girl.jpg"
                                    alt="AI Girl Companion"
                                    width={600}
                                    height={600}
                                    className="relative z-10 rounded-3xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-20 bg-white">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            What Makes AI Girl Special
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl border-2 border-pink-200">
                                <div className="bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-pink-900 mb-3">Deeply Empathetic</h3>
                                <p className="text-gray-700">
                                    She understands your emotions, listens without judgment, and provides thoughtful responses that show she truly cares.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl border-2 border-pink-200">
                                <div className="bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-pink-900 mb-3">Your Story, Your Way</h3>
                                <p className="text-gray-700">
                                    Customize her personality, name, age, hobbies, and create a backstory that makes her the perfect companion for you.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl border-2 border-pink-200">
                                <div className="bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-pink-900 mb-3">Always Here for You</h3>
                                <p className="text-gray-700">
                                    Whether you need to talk, share your day, or just have someone listen, she's always available through voice conversation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon CTA */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-pink-900 to-red-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            Launching Soon
                        </h2>
                        <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
                            The AI Girl Companion will be available soon. Return to our homepage to explore our other AI companions.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-pink-900 hover:bg-pink-50 rounded-full shadow-xl px-12 py-6 text-lg">
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

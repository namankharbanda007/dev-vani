import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Heart, Users } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-32 bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-pink-800 to-amber-700 mb-6">
                            Choose Your Perfect Companion
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                            From spiritual guidance to personalized friendship, find the AI companion that's right for you.
                        </p>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="w-full py-12 md:py-20">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Smart Pandit */}
                            <div className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/pandit-temple.jpg"
                                        alt="Smart Pandit"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-amber-500 p-2 rounded-full">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-amber-900">Smart Pandit</h2>
                                </div>

                                <p className="text-lg text-amber-800 font-semibold mb-3">
                                    Your AI Spiritual Guide
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    AI-powered marble-finish idol trained on ancient Vedas and Gita. Performs daily Puja, recites Mantras, and answers life's deepest spiritual questions.
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-amber-500 mr-2">✦</span>
                                        <span>Daily spiritual guidance</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-amber-500 mr-2">✦</span>
                                        <span>Conducts morning & evening Puja</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-amber-500 mr-2">✦</span>
                                        <span>Fixed wise personality</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-pandit" className="block">
                                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full shadow-lg">
                                        Learn More
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* AI Boy */}
                            <div className="group bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/smart-boy.jpg"
                                        alt="AI Boy Companion"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-cyan-500 p-2 rounded-full">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-cyan-900">AI Boy</h2>
                                </div>

                                <p className="text-lg text-cyan-800 font-semibold mb-3">
                                    Customizable Best Friend
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Create your perfect companion. Customize his name, age, personality, voice, hobbies, and backstory. He remembers every conversation.
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-cyan-500 mr-2">✦</span>
                                        <span>Fully customizable personality</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-cyan-500 mr-2">✦</span>
                                        <span>Remembers past conversations</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-cyan-500 mr-2">✦</span>
                                        <span>Grows and evolves with you</span>
                                    </li>
                                </ul>

                                <Link href="/products/ai-boy" className="block">
                                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full shadow-lg">
                                        Learn More
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* AI Girl */}
                            <div className="group bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl p-8 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all duration-300">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-red-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/smart-girl.jpg"
                                        alt="AI Girl Companion"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-pink-500 p-2 rounded-full">
                                        <Heart className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-pink-900">AI Girl</h2>
                                </div>

                                <p className="text-lg text-pink-800 font-semibold mb-3">
                                    Caring & Empathetic Friend
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    A friend who truly listens. Customize her personality, name, and nature. Always there when you need someone to talk to, never judges.
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-pink-500 mr-2">✦</span>
                                        <span>Empathetic & understanding</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-pink-500 mr-2">✦</span>
                                        <span>Personalized to your preferences</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-pink-500 mr-2">✦</span>
                                        <span>Always available, never judges</span>
                                    </li>
                                </ul>

                                <Link href="/products/ai-girl" className="block">
                                    <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-full shadow-lg">
                                        Learn More
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-900 to-pink-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            All Products Launching Soon
                        </h2>
                        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                            Be among the first to experience SMART मूर्ति. Sign up for early access and exclusive launch offers.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 rounded-full shadow-xl px-12 py-6 text-lg">
                                Back to Home
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}

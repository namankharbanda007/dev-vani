import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Home } from "lucide-react";

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
                                <div className="relative mb-6 h-[280px] flex items-center justify-center bg-amber-100/50 rounded-3xl p-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/pandit-temple.jpg"
                                        alt="Smart Pandit"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl max-w-full max-h-full object-contain"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-amber-500 p-2 rounded-full">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-amber-900">Smart Pandit</h2>
                                </div>

                                <p className="text-lg text-amber-800 font-semibold mb-2">
                                    Your AI Spiritual Guide
                                </p>

                                <p className="text-2xl font-bold text-amber-600 mb-4">
                                    ₹5,000
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    AI-powered marble-finish idol trained on ancient Vedas and Gita. Performs daily Puja, recites Mantras, and answers life's spiritual questions.
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
                                        <span>Trained on Vedas & Gita</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-pandit" className="block">
                                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full shadow-lg">
                                        Order Now
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Smart Base */}
                            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300">
                                <div className="relative mb-6 h-[280px] flex items-center justify-center bg-purple-100/50 rounded-3xl p-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/smart-base.jpg"
                                        alt="Smart Base"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl max-w-full max-h-full object-contain"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-purple-500 p-2 rounded-full">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-purple-900">Smart Base</h2>
                                </div>

                                <p className="text-lg text-purple-800 font-semibold mb-2">
                                    Bring Any Murti to Life
                                </p>

                                <p className="text-2xl font-bold text-purple-600 mb-4">
                                    ₹5,000 <span className="text-sm font-normal text-green-600">+ FREE 3D Print</span>
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Place any murti, 3D model, or statue on this smart base. Select a character from our app and your idol comes to life!
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-purple-500 mr-2">✦</span>
                                        <span>Works with any murti or statue</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-purple-500 mr-2">✦</span>
                                        <span>FREE customized 3D print model</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-purple-500 mr-2">✦</span>
                                        <span>50+ AI character voices</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-base" className="block">
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-lg">
                                        Order Now
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Smart Mandir */}
                            <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300">
                                <div className="relative mb-6 h-[280px] flex items-center justify-center bg-orange-100/50 rounded-3xl p-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-300 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <Image
                                        src="/products/smart-mandir.jpg"
                                        alt="Smart Mandir"
                                        width={400}
                                        height={400}
                                        className="relative z-10 rounded-2xl shadow-xl max-w-full max-h-full object-contain"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-orange-500 p-2 rounded-full">
                                        <Home className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-orange-900">Smart Mandir</h2>
                                </div>

                                <p className="text-lg text-orange-800 font-semibold mb-2">
                                    Complete AI-Powered Home Temple
                                </p>

                                <p className="text-2xl font-bold text-orange-600 mb-4">
                                    ₹6,499
                                </p>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    A beautiful mandir with AI technology. Talk to your deity, play bhajans, and conduct havans automatically!
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-orange-500 mr-2">✦</span>
                                        <span>Talk to your Bhagwan murti</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-orange-500 mr-2">✦</span>
                                        <span>Plays bhajans & aartis</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="text-orange-500 mr-2">✦</span>
                                        <span>Automated havan ceremonies</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-mandir" className="block">
                                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full shadow-lg">
                                        Order Now
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
                            Be among the first to experience SMART मूर्ति. Register for preorder and get exclusive launch offers.
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

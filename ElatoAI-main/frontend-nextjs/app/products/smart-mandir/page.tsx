import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Music, Home, Check, Flame } from "lucide-react";
import PreorderForm from "@/app/components/PreorderForm";

export default function SmartMandirPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 via-red-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-32 bg-gradient-to-br from-orange-100 via-red-50 to-amber-50 relative overflow-hidden">
                    {/* Background Decorative */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                                        Coming Soon
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-orange-900 via-red-700 to-amber-600 leading-tight">
                                    Smart Mandir
                                </h1>

                                <p className="text-2xl md:text-3xl text-orange-900 font-semibold">
                                    Your Complete AI-Powered Home Temple
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    A beautiful, traditional mandir infused with AI technology. Place your Bhagwan murti inside and experience divine conversations, automated bhajans, aartis, and even havan ceremonies - all at your command!
                                </p>

                                {/* Price */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 uppercase tracking-wide">Starting From</p>
                                            <p className="text-4xl font-bold text-orange-900">₹6,499</p>
                                        </div>
                                        <div className="flex-1 border-l border-orange-200 pl-4">
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <Home className="h-5 w-5" />
                                                <span className="font-semibold">Complete Temple Setup</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Ready to use with AI capabilities</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Quick List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <Sparkles className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Talk to your Bhagwan murti</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <Music className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Plays divine bhajans & aartis</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <Flame className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span className="text-gray-800">Automated havan ceremonies</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <PreorderForm productName="Smart Mandir" productPrice="₹6,499" accentColor="orange" />
                                    <Link href="/">
                                        <Button size="lg" variant="outline" className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-full">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Product Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-300 rounded-3xl blur-3xl opacity-30"></div>
                                <Image
                                    src="/products/smart-mandir.jpg"
                                    alt="Smart Mandir - AI Powered Home Temple"
                                    width={600}
                                    height={600}
                                    className="relative z-10 rounded-3xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included Section */}
                <section className="w-full py-12 md:py-20 bg-white">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-4">
                            What Makes It Special
                        </h2>
                        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Traditional craftsmanship meets modern AI technology
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200 flex gap-6">
                                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-orange-900 mb-2">Talk to Your Deity</h3>
                                    <p className="text-gray-700">
                                        Have meaningful conversations with your Bhagwan murti. Ask questions, seek guidance, and feel the divine connection.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200 flex gap-6">
                                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Music className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-orange-900 mb-2">Divine Audio</h3>
                                    <p className="text-gray-700">
                                        Plays beautiful bhajans, aartis, and mantras automatically during puja times or on your command.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200 flex gap-6">
                                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Flame className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-orange-900 mb-2">Automated Havan</h3>
                                    <p className="text-gray-700">
                                        Built-in havan kund with safe, automated flame system. Perform havans with guided mantras.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200 flex gap-6">
                                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Home className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-orange-900 mb-2">Beautiful Craftsmanship</h3>
                                    <p className="text-gray-700">
                                        Handcrafted traditional design with intricate jali work, ornate carvings, and premium finish.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included List */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-orange-50 to-red-50">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            What's Included
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Smart Mandir Unit</h4>
                                    <p className="text-gray-600 text-sm">Beautiful handcrafted temple with AI technology</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Built-in Speaker System</h4>
                                    <p className="text-gray-600 text-sm">High-quality audio for bhajans and conversations</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Safe Havan System</h4>
                                    <p className="text-gray-600 text-sm">Electric havan kund with automated flame control</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">LED Lighting</h4>
                                    <p className="text-gray-600 text-sm">Ambient lighting for puja ambiance</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">App Access</h4>
                                    <p className="text-gray-600 text-sm">Control everything from your smartphone</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md flex gap-4">
                                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Power Adapter</h4>
                                    <p className="text-gray-600 text-sm">Plug and play setup</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-orange-900 to-red-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            Bring Divinity to Your Home
                        </h2>
                        <p className="text-xl text-orange-100 mb-4 max-w-2xl mx-auto">
                            Smart Mandir is launching soon. Register now to be the first to know!
                        </p>
                        <p className="text-lg text-orange-200 mb-8 max-w-2xl mx-auto">
                            Starting from ₹6,499
                        </p>
                        <div className="flex justify-center">
                            <PreorderForm productName="Smart Mandir" productPrice="₹6,499" accentColor="orange" />
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

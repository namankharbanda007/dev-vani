import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Users, Gift, Check } from "lucide-react";
import PreorderForm from "@/app/components/PreorderForm";

export default function SmartBasePage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 via-indigo-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-32 bg-gradient-to-br from-purple-100 via-indigo-50 to-violet-50 relative overflow-hidden">
                    {/* Background Decorative */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                                        Coming Soon
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-indigo-700 to-violet-600 leading-tight">
                                    Smart Base
                                </h1>

                                <p className="text-2xl md:text-3xl text-purple-900 font-semibold">
                                    Bring Any Murti to Life
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Place any murti, 3D model, or statue on this smart base and watch it come to life! Select from 50+ AI characters in our app, and your idol will speak, respond, and have meaningful conversations with you.
                                </p>

                                {/* Price */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 uppercase tracking-wide">Special Price</p>
                                            <p className="text-4xl font-bold text-purple-900">₹5,000</p>
                                        </div>
                                        <div className="flex-1 border-l border-purple-200 pl-4">
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Gift className="h-5 w-5" />
                                                <span className="font-semibold">FREE Customized 3D Print Model</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Get a personalized 3D printed figure with your base!</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Quick List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Zap className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="text-gray-800">Works with any murti or statue</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Users className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="text-gray-800">50+ AI character voices to choose</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="text-gray-800">Your idol speaks and responds naturally</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <PreorderForm productName="Smart Base" productPrice="₹5,000" accentColor="purple" />
                                    <Link href="/">
                                        <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-full">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Product Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-3xl blur-3xl opacity-30"></div>
                                <Image
                                    src="/products/smart-base.jpg"
                                    alt="Smart Base with 3D printed model"
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
                            What's Included
                        </h2>
                        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Everything you need to bring your idol to life
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Included Item 1 */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-purple-200 flex gap-6">
                                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">Smart Base Device</h3>
                                    <p className="text-gray-700">
                                        The AI-powered base with built-in speaker and microphone. Simply place any murti on top and it becomes alive!
                                    </p>
                                </div>
                            </div>

                            {/* Included Item 2 */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 flex gap-6">
                                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Gift className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-900 mb-2">FREE Custom 3D Print Model</h3>
                                    <p className="text-gray-700">
                                        Get a personalized 3D printed figure of your choice - yourself, a loved one, or any character you want!
                                    </p>
                                </div>
                            </div>

                            {/* Included Item 3 */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-purple-200 flex gap-6">
                                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">App Access</h3>
                                    <p className="text-gray-700">
                                        Full access to our mobile app with 50+ AI characters to choose from. Switch personalities anytime!
                                    </p>
                                </div>
                            </div>

                            {/* Included Item 4 */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-purple-200 flex gap-6">
                                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">USB-C Charging Cable</h3>
                                    <p className="text-gray-700">
                                        Keep your Smart Base powered and ready for conversations anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            How It Works
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="text-center">
                                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-purple-900 mb-3">Place Your Murti</h3>
                                <p className="text-gray-700">
                                    Put any murti, 3D model, or statue on the Smart Base
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="text-center">
                                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-purple-900 mb-3">Choose a Character</h3>
                                <p className="text-gray-700">
                                    Select from 50+ AI personalities in our app
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center">
                                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-purple-900 mb-3">Start Talking!</h3>
                                <p className="text-gray-700">
                                    Your idol comes to life and responds to your voice
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-900 to-indigo-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            Get Your Smart Base Today
                        </h2>
                        <p className="text-xl text-purple-100 mb-4 max-w-2xl mx-auto">
                            Special Offer: ₹5,000 with FREE customized 3D print model
                        </p>
                        <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">
                            Transform any murti or statue into an AI-powered conversational companion!
                        </p>
                        <div className="flex justify-center">
                            <PreorderForm productName="Smart Base" productPrice="₹5,000" accentColor="purple" />
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

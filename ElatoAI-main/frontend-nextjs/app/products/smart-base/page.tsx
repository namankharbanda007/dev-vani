import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Check } from "lucide-react";
import PreorderForm from "@/app/components/PreorderForm";

export default function SmartBasePage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 via-indigo-50 to-white">
            <main className="flex-1">
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-50 to-violet-50 py-12 md:py-32">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-10 top-20 h-96 w-96 rounded-full bg-purple-300 blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-indigo-300 blur-3xl"></div>
                    </div>

                    <div className="container relative z-10 mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
                        <div className="space-y-8">
                            <div className="inline-block">
                                <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
                                    Coming Soon
                                </span>
                            </div>

                            <h1 className="bg-gradient-to-r from-purple-900 via-indigo-700 to-violet-600 bg-clip-text font-lora text-4xl font-bold leading-tight text-transparent md:text-6xl">
                                Smart Base
                            </h1>

                            <p className="text-2xl font-semibold text-purple-900 md:text-3xl">
                                Upgrade Your Existing Murti
                            </p>

                            <p className="text-lg leading-relaxed text-gray-700">
                                Place your existing murti on this smart base to unlock devotional audio, guided rituals, and spiritual guidance without changing your home mandir setup.
                            </p>

                            <div className="rounded-2xl border-2 border-purple-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-gray-600">Special Price</p>
                                        <p className="text-4xl font-bold text-purple-900">Rs5,000</p>
                                    </div>
                                    <div className="flex-1 border-l border-purple-200 pl-4">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Sparkles className="h-5 w-5" />
                                            <span className="font-semibold">Faith-first home upgrade</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Built to work with the murti you already worship at home.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <Zap className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="text-gray-800">Works with your home murti or devotional statue</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="text-gray-800">Guided puja, aarti, and mantra support</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="text-gray-800">Natural spiritual conversations for daily devotion</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                <PreorderForm productName="Smart Base" productPrice="Rs5,000" accentColor="purple" />
                                <Link href="/">
                                    <Button size="lg" variant="outline" className="rounded-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                                        <ChevronRight className="mr-2 h-5 w-5" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-300 to-indigo-300 opacity-30 blur-3xl"></div>
                            <Image
                                src="/products/smart-base.jpg"
                                alt="Smart Base for home mandir"
                                width={600}
                                height={600}
                                className="relative z-10 rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>
                </section>

                <section className="w-full bg-white py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                        <h2 className="mb-4 text-center font-lora text-4xl font-bold text-gray-900">
                            What's Included
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-gray-600">
                            Everything you need for a connected devotional setup
                        </p>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex gap-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-purple-900">Smart Base Device</h3>
                                    <p className="text-gray-700">
                                        The connected base with built-in speaker and microphone. Place your murti on top for prayer support and guided interaction.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-green-900">Devotional Audio Experience</h3>
                                    <p className="text-gray-700">
                                        Access bhajans, aartis, mantra recitation, and prayer guidance designed for daily spiritual practice.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-purple-900">App Access</h3>
                                    <p className="text-gray-700">
                                        Full access to spiritual sessions, rituals, and personalized faith-tech features in the SmartMurti app.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-purple-900">USB-C Charging Cable</h3>
                                    <p className="text-gray-700">
                                        Keep your Smart Base powered and ready for guided rituals anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                        <h2 className="mb-12 text-center font-lora text-4xl font-bold text-gray-900">
                            How It Works
                        </h2>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                                    1
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-purple-900">Place Your Murti</h3>
                                <p className="text-gray-700">
                                    Put your murti or devotional statue on the Smart Base
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                                    2
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-purple-900">Choose a Ritual Flow</h3>
                                <p className="text-gray-700">
                                    Open the app to start guided puja, aarti, mantra, or spiritual consultation
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                                    3
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-purple-900">Begin Devotion</h3>
                                <p className="text-gray-700">
                                    Receive spiritual guidance and devotional audio through your home setup
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gradient-to-br from-purple-900 to-indigo-800 py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 text-center md:px-6">
                        <h2 className="mb-6 font-lora text-3xl font-bold text-white md:text-5xl">
                            Get Your Smart Base Today
                        </h2>
                        <p className="mx-auto mb-4 max-w-2xl text-xl text-purple-100">
                            Special launch price: Rs5,000
                        </p>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-purple-200">
                            Bring prayer guidance, devotional audio, and faith-tech rituals into your existing home mandir.
                        </p>
                        <div className="flex justify-center">
                            <PreorderForm productName="Smart Base" productPrice="Rs5,000" accentColor="purple" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

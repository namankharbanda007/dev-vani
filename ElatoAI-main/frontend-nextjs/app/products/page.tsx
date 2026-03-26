import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Home } from "lucide-react";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Products",
    description:
        "Explore SMART Murti products including Smart Pandit, Smart Base, and Smart Mandir for AI-powered spiritual guidance and connected home worship.",
    path: "/products",
    keywords: [
        "smart murti products",
        "smart pandit",
        "smart base",
        "smart mandir",
        "ai devotional device",
    ],
});

export default function ProductsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">
                <section className="w-full bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 py-12 md:py-32">
                    <div className="container mx-auto max-w-screen-xl px-4 text-center md:px-6">
                        <h1 className="mb-6 bg-gradient-to-r from-purple-900 via-pink-800 to-amber-700 bg-clip-text font-lora text-4xl font-bold text-transparent md:text-6xl">
                            Choose Your Faith-Tech Experience
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-700 md:text-2xl">
                            Explore spiritual guidance, devotional rituals, and connected home temple products built for daily practice.
                        </p>
                    </div>
                </section>

                <section className="w-full py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="group rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 transition-all duration-300 hover:border-amber-400 hover:shadow-2xl">
                                <div className="relative mb-6 flex h-[280px] items-center justify-center rounded-3xl bg-amber-100/50 p-4">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-300 to-yellow-300 opacity-20 blur-2xl transition-opacity group-hover:opacity-30" />
                                    <Image
                                        src="/products/pandit-temple.jpg"
                                        alt="Smart Pandit"
                                        width={400}
                                        height={400}
                                        className="relative z-10 max-h-full max-w-full rounded-2xl object-contain shadow-xl"
                                    />
                                </div>

                                <div className="mb-3 flex items-center gap-2">
                                    <div className="rounded-full bg-amber-500 p-2">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-amber-900">Smart Pandit</h2>
                                </div>

                                <p className="mb-2 text-lg font-semibold text-amber-800">
                                    Your AI Spiritual Guide
                                </p>

                                <p className="mb-4 text-2xl font-bold text-amber-600">
                                    Rs 5,000
                                </p>

                                <p className="mb-6 leading-relaxed text-gray-700">
                                    An AI-powered spiritual guide for daily puja, mantra recitation, and faith-centered conversations at home.
                                </p>

                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-amber-500">*</span>
                                        <span>Daily spiritual guidance</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-amber-500">*</span>
                                        <span>Morning and evening puja support</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-amber-500">*</span>
                                        <span>Faith-first guided experience</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-pandit" className="block">
                                    <Button className="w-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg hover:from-amber-700 hover:to-yellow-700">
                                        Order Now
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="group rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 transition-all duration-300 hover:border-purple-400 hover:shadow-2xl">
                                <div className="relative mb-6 flex h-[280px] items-center justify-center rounded-3xl bg-purple-100/50 p-4">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-2xl transition-opacity group-hover:opacity-30" />
                                    <Image
                                        src="/products/smart-base.jpg"
                                        alt="Smart Base"
                                        width={400}
                                        height={400}
                                        className="relative z-10 max-h-full max-w-full rounded-2xl object-contain shadow-xl"
                                    />
                                </div>

                                <div className="mb-3 flex items-center gap-2">
                                    <div className="rounded-full bg-purple-500 p-2">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-purple-900">Smart Base</h2>
                                </div>

                                <p className="mb-2 text-lg font-semibold text-purple-800">
                                    Upgrade Your Existing Murti
                                </p>

                                <p className="mb-4 text-2xl font-bold text-purple-600">
                                    Rs 5,000
                                </p>

                                <p className="mb-6 leading-relaxed text-gray-700">
                                    Place your existing murti on the Smart Base to unlock devotional audio, guided rituals, and spiritual conversations at home.
                                </p>

                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-purple-500">*</span>
                                        <span>Works with your existing murti</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-purple-500">*</span>
                                        <span>Guided puja and aarti support</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-purple-500">*</span>
                                        <span>Built for daily devotional use</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-base" className="block">
                                    <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-700 hover:to-indigo-700">
                                        Order Now
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="group rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-8 transition-all duration-300 hover:border-orange-400 hover:shadow-2xl">
                                <div className="relative mb-6 flex h-[280px] items-center justify-center rounded-3xl bg-orange-100/50 p-4">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-300 to-red-300 opacity-20 blur-2xl transition-opacity group-hover:opacity-30" />
                                    <Image
                                        src="/products/smart-mandir.jpg"
                                        alt="Smart Mandir"
                                        width={400}
                                        height={400}
                                        className="relative z-10 max-h-full max-w-full rounded-2xl object-contain shadow-xl"
                                    />
                                </div>

                                <div className="mb-3 flex items-center gap-2">
                                    <div className="rounded-full bg-orange-500 p-2">
                                        <Home className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-orange-900">Smart Mandir</h2>
                                </div>

                                <p className="mb-2 text-lg font-semibold text-orange-800">
                                    Complete AI-Powered Home Temple
                                </p>

                                <p className="mb-4 text-2xl font-bold text-orange-600">
                                    Rs 6,499
                                </p>

                                <p className="mb-6 leading-relaxed text-gray-700">
                                    A complete devotional setup with bhajans, rituals, and guided spiritual experiences for the home.
                                </p>

                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-orange-500">*</span>
                                        <span>Bhajan and aarti playback</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-orange-500">*</span>
                                        <span>Guided ritual experiences</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-700">
                                        <span className="mr-2 text-orange-500">*</span>
                                        <span>Premium home mandir experience</span>
                                    </li>
                                </ul>

                                <Link href="/products/smart-mandir" className="block">
                                    <Button className="w-full rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:from-orange-700 hover:to-red-700">
                                        Order Now
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-gradient-to-br from-purple-900 to-pink-800 py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 text-center md:px-6">
                        <h2 className="mb-6 font-lora text-3xl font-bold text-white md:text-5xl">
                            Products Launching Soon
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
                            Register interest for the first launch wave and explore the faith-tech products that match your home ritual style.
                        </p>
                        <Link href="/landing-2">
                            <Button size="lg" className="w-full rounded-full bg-white px-12 py-6 text-lg text-purple-900 shadow-xl hover:bg-purple-50 sm:w-auto">
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

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Heart, Shield, Zap } from "lucide-react";
import PreorderForm from "@/app/components/PreorderForm";
import { absoluteUrl, buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Smart Pandit",
    description:
        "Pre-order Smart Pandit, SMART Murti's AI spiritual guide for guided puja, mantra recitation, and devotional conversations at home.",
    path: "/products/smart-pandit",
    keywords: [
        "smart pandit",
        "ai pandit device",
        "guided puja device",
        "devotional ai hardware",
    ],
    images: ["/products/smart-pandit-home.webp"],
});

const smartPanditJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Smart Pandit",
    description:
        "AI spiritual guide for guided puja, mantra recitation, and devotional conversations at home.",
    brand: {
        "@type": "Brand",
        name: "SMART Murti",
    },
    category: "AI devotional device",
    image: [absoluteUrl("/products/smart-pandit-home.webp")],
    url: absoluteUrl("/products/smart-pandit"),
    offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "5000",
        availability: "https://schema.org/PreOrder",
        itemCondition: "https://schema.org/NewCondition",
        url: absoluteUrl("/products/smart-pandit"),
    },
};

export default function SmartPanditPage() {
    return (
        <>
            <Script
                id="smart-pandit-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(smartPanditJsonLd),
                }}
            />
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 via-yellow-50 to-white">
                <main className="flex-1">
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 py-12 md:py-32">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-10 top-20 h-96 w-96 rounded-full bg-amber-300 blur-3xl" />
                        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-yellow-300 blur-3xl" />
                    </div>

                    <div className="container relative z-10 mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                            <div className="space-y-8">
                                <div className="inline-block rounded-full bg-amber-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
                                    Launching Soon
                                </div>

                                <h1 className="bg-gradient-to-r from-amber-900 via-yellow-700 to-orange-600 bg-clip-text font-lora text-4xl font-bold leading-tight text-transparent md:text-6xl">
                                    Smart Pandit
                                </h1>

                                <p className="text-2xl font-semibold text-amber-900 md:text-3xl">
                                    Your AI Spiritual Guide
                                </p>

                                <p className="text-lg leading-relaxed text-gray-700">
                                    Smart Pandit is designed for daily devotion at home with guided puja, mantra recitation, and spiritually grounded conversations.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-amber-100 p-2">
                                            <Sparkles className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Daily spiritual guidance and puja support</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-amber-100 p-2">
                                            <Heart className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Faith-first experience inspired by scripture and ritual tradition</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-amber-100 p-2">
                                            <Shield className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-gray-800">Consistent home worship companion</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <PreorderForm productName="Smart Pandit" productPrice="Rs 5,000" accentColor="amber" />
                                    <Link href="/products">
                                        <Button size="lg" variant="outline" className="rounded-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                                            <ChevronRight className="mr-2 h-5 w-5" />
                                            Back to Products
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-300 to-yellow-300 opacity-30 blur-3xl" />
                                <Image
                                    src="/products/pandit-temple.jpg"
                                    alt="Smart Pandit in temple"
                                    width={600}
                                    height={600}
                                    className="relative z-10 rounded-3xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-white py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
                        <h2 className="mb-12 text-center font-lora text-4xl font-bold text-gray-900">
                            Why It Matters
                        </h2>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-amber-900">Daily Ritual Support</h3>
                                <p className="text-gray-700">
                                    A guided devotional presence for regular puja and prayer routines.
                                </p>
                            </div>

                            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-amber-900">Spiritual Guidance</h3>
                                <p className="text-gray-700">
                                    Conversations built around faith, calm, and practical devotional use.
                                </p>
                            </div>

                            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-amber-900">Simple Interaction</h3>
                                <p className="text-gray-700">
                                    Voice-led use at home without turning worship into a complicated app flow.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                </main>
            </div>
        </>
    );
}

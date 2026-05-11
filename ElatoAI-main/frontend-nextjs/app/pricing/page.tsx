import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Globe2, MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import { buildMetadata, siteConfig } from "@/app/lib/seo";
import { formatUsd, nriLaunchPackages } from "@/app/lib/pricing";

export const metadata = buildMetadata({
    title: "Pricing",
    description:
        `View ${siteConfig.name}'s NRI launch packages for AI Pandit guidance, digital puja, live family puja, and premium havan.`,
    path: "/pricing",
    keywords: [
        "smart murti pricing",
        "nri ai pandit pricing",
        "ai pandit pricing",
        "live family puja pricing",
        "online havan pricing",
        "usd puja packages",
    ],
});

const supportItems = [
    {
        icon: MessageCircle,
        title: "Guidance first",
        body: "Start with the question your family has today, then move into a puja only when the moment calls for it.",
    },
    {
        icon: Users,
        title: "Family room",
        body: "Live puja packages are built for relatives joining from the US, Canada, Dubai, India, or anywhere else.",
    },
    {
        icon: ShieldCheck,
        title: "No confusing minute trap",
        body: "NRI launch pricing is package-led because families are paying for trust, ritual flow, and completion.",
    },
];

const addOns = [
    "AI face or palm reading from $4.99",
    "Daily horoscope and bhajan access included during early launch",
    "Custom puja or family request reviewed by support before confirmation",
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#fffaf2]">
            <main className="flex-1">
                <section className="w-full border-b border-amber-100 bg-[#fff4df] py-14 md:py-24">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="mx-auto max-w-4xl text-center">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                                NRI-first launch pricing
                            </p>
                            <h1 className="mb-6 font-lora text-4xl font-bold text-[#20130b] md:text-6xl">
                                NRI Launch Packages
                            </h1>
                            <p className="mx-auto max-w-3xl text-lg leading-8 text-[#5b4837] md:text-xl">
                                Smart Murti is not priced like a generic chatbot. NRI families pay for
                                trusted spiritual guidance, structured puja flow, and family participation
                                across time zones.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-20">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {nriLaunchPackages.map((item) => (
                                <article
                                    key={item.name}
                                    className="flex min-h-[340px] flex-col rounded-lg border border-amber-100 bg-white p-6 shadow-sm"
                                >
                                    <p className="text-sm font-semibold text-amber-700">{item.bestFor}</p>
                                    <h2 className="mt-3 text-2xl font-bold text-[#20130b]">{item.name}</h2>
                                    <p className="mt-4 font-lora text-5xl font-bold text-[#8f4f18]">
                                        {formatUsd(item.price)}
                                    </p>
                                    <p className="mt-5 flex-1 leading-7 text-[#5b4837]">{item.description}</p>
                                    <Link href={item.price >= 51 ? "/pandit?ritual=ganpati-havan" : "/login"}>
                                        <Button className="mt-6 w-full rounded-lg bg-[#20130b] py-6 text-base font-semibold text-white hover:bg-[#3a2416]">
                                            {item.cta}
                                        </Button>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full bg-white py-14">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="grid gap-5 md:grid-cols-3">
                            {supportItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <article key={item.title} className="rounded-lg border border-[#eadfcf] bg-[#fffaf2] p-6">
                                        <Icon className="h-7 w-7 text-[#a85f18]" />
                                        <h3 className="mt-4 text-xl font-bold text-[#20130b]">{item.title}</h3>
                                        <p className="mt-3 leading-7 text-[#5b4837]">{item.body}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="w-full py-14">
                    <div className="container mx-auto grid max-w-screen-xl gap-8 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-6">
                        <div>
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                                How payment works
                            </p>
                            <h2 className="font-lora text-3xl font-bold text-[#20130b] md:text-5xl">
                                Package-led first, wallet second
                            </h2>
                            <p className="mt-5 max-w-2xl leading-8 text-[#5b4837]">
                                The wallet is the internal balance layer for sessions and service usage.
                                The customer-facing NRI launch offer is a simple USD package, so families
                                understand what spiritual outcome they are buying before any recharge.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href="/pandit?ritual=ganpati-havan">
                                    <Button size="lg" className="w-full rounded-lg bg-[#a85f18] text-white hover:bg-[#8f4f18] sm:w-auto">
                                        Start Live Puja
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="w-full rounded-lg border-[#caa46c] text-[#6a4520] sm:w-auto">
                                        Talk to Smart Pandit
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-lg border border-amber-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
                                    <Globe2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#20130b]">Launch add-ons</h3>
                                    <p className="text-sm text-[#7a6651]">Useful, but not the main wedge.</p>
                                </div>
                            </div>
                            <ul className="mt-6 space-y-4">
                                {addOns.map((item) => (
                                    <li key={item} className="flex gap-3 text-[#5b4837]">
                                        <Sparkles className="mt-1 h-4 w-4 shrink-0 text-amber-700" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 rounded-lg bg-[#fff4df] p-4">
                                <div className="flex gap-3">
                                    <CalendarCheck className="mt-1 h-5 w-5 shrink-0 text-[#a85f18]" />
                                    <p className="text-sm leading-6 text-[#5b4837]">
                                        For the FutureX demo, lead with <strong>Smart Pandit guidance</strong> and
                                        <strong> Live Family Puja</strong>. These are the two behaviors that prove the wedge.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

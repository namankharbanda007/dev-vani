import Image from "next/image";
import Link from "next/link";
import { Camera, Hand, HeartPulse, LineChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "AI Palm Reading",
    description:
        "Explore SMART Murti's AI palm reading experience for spiritual reflection, personality interpretation, and guided next steps.",
    path: "/palm-reading",
    keywords: [
        "ai palm reading",
        "smart murti palm reading",
        "palmistry ai",
        "spiritual palm reading",
    ],
});

const readingPoints = [
    {
        title: "Life Line",
        body: "A calm interpretation of vitality, major life phases, and where spiritual discipline may help.",
        icon: HeartPulse,
    },
    {
        title: "Heart Line",
        body: "Guidance around emotions, relationships, family harmony, and how to approach sensitive conversations.",
        icon: Hand,
    },
    {
        title: "Head Line",
        body: "Reflection on decision-making, focus, stress patterns, and the mindset behind important choices.",
        icon: LineChart,
    },
];

export default function PalmReadingPage() {
    return (
        <div className="min-h-screen bg-[#fffaf2]">
            <main>
                <section className="border-b border-amber-100 bg-[#fff4df] py-14 md:py-24">
                    <div className="container mx-auto grid max-w-screen-xl gap-10 px-4 md:grid-cols-[0.95fr_1.05fr] md:px-6">
                        <div className="flex flex-col justify-center">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                                Quick spiritual reading
                            </p>
                            <h1 className="font-lora text-4xl font-bold text-[#20130b] md:text-6xl">
                                AI Palm Reading that feels respectful, not random
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5b4837]">
                                Upload a clear palm photo, get a structured palmistry-style reading, and
                                continue into Smart Pandit if the question needs a puja, sankalp, or family guidance.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href="/login">
                                    <Button size="lg" className="w-full rounded-lg bg-[#20130b] text-white hover:bg-[#3a2416] sm:w-auto">
                                        Start Palm Reading
                                    </Button>
                                </Link>
                                <Link href="/pandit">
                                    <Button size="lg" variant="outline" className="w-full rounded-lg border-[#caa46c] text-[#6a4520] sm:w-auto">
                                        Ask Smart Pandit
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-amber-100 bg-white shadow-sm">
                            <Image
                                src="/assets/Cartoon Palm Reader.jpg"
                                fill
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="object-cover"
                                alt="Smart Murti palm reader guide"
                                priority
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#20130b]/85 to-transparent p-6 text-white">
                                <div className="inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
                                    <Camera className="h-4 w-4" />
                                    Clear photo, private reading
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-14 md:py-20">
                    <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="mb-10 max-w-3xl">
                            <h2 className="font-lora text-3xl font-bold text-[#20130b] md:text-5xl">
                                What the reading checks
                            </h2>
                            <p className="mt-4 leading-8 text-[#5b4837]">
                                This page should set expectations clearly. It is a spiritual reflection tool,
                                not a medical, financial, or guaranteed future prediction.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {readingPoints.map((point) => {
                                const Icon = point.icon;
                                return (
                                    <article key={point.title} className="rounded-lg border border-amber-100 bg-white p-6 shadow-sm">
                                        <Icon className="h-7 w-7 text-[#a85f18]" />
                                        <h3 className="mt-4 text-xl font-bold text-[#20130b]">{point.title}</h3>
                                        <p className="mt-3 leading-7 text-[#5b4837]">{point.body}</p>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="mt-8 rounded-lg border border-amber-100 bg-[#fff4df] p-5">
                            <div className="flex gap-3">
                                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#a85f18]" />
                                <p className="leading-7 text-[#5b4837]">
                                    For NRI users, palm reading should be a low-friction first step. The real monetization
                                    path is moving from a quick reading into trusted Smart Pandit guidance or a family puja package.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

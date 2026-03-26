import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Smart Murti Demo Experience",
    description:
        "Discover SMART Murti's alternate landing experience for AI-powered devotional guidance, astrology, and daily spiritual rituals.",
    path: "/landing-2",
    keywords: [
        "smart murti demo",
        "ai pandit demo",
        "spiritual ai demo",
    ],
});

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-sans antialiased text-murti-stone bg-soft-paper selection:bg-divine-saffron selection:text-white">
            {children}
        </div>
    );
}

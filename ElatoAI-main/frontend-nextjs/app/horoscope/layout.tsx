import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Daily Horoscope",
    description:
        "Get SMART Murti's daily horoscope experience with zodiac forecasts, spiritual remedies, and personalized guidance.",
    path: "/horoscope",
    keywords: [
        "daily horoscope",
        "smart murti horoscope",
        "vedic horoscope",
        "ai horoscope",
    ],
});

export default function HoroscopeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

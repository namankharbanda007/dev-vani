import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Bhajan Library",
    description:
        "Listen to SMART Murti's bhajan library with devotional songs, mantras, and aarti tracks for daily spiritual practice.",
    path: "/bhajan",
    keywords: [
        "bhajan app",
        "devotional music",
        "aarti library",
        "smart murti bhajan",
    ],
});

export default function BhajanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

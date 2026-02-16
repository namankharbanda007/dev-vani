import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Smart Murti - Tradition Reimagined",
    description: "Experience the fusion of ancient devotion and futuristic technology.",
};

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

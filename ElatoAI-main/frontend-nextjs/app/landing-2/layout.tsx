import { buildMetadata, siteConfig } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: siteConfig.name,
    description:
        `Redirecting to the main ${siteConfig.name} experience for AI Pandit guidance and live family puja.`,
    path: "/landing-2",
    noIndex: true,
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

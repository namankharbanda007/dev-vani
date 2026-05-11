import Script from "next/script";
import RootHomePage from "./components/RootHomePage";
import {
    absoluteUrl,
    buildMetadata,
    homeFaqs,
    siteConfig,
} from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: siteConfig.name,
    description:
        `Talk to ${siteConfig.name}'s live multilingual AI Pandit for spiritual guidance, family puja, and urgent devotional support from anywhere in the world.`,
    path: "/",
    keywords: [
        "ai pandit",
        "live ai pandit",
        "family puja online",
        "multilingual spiritual guidance",
    ],
});

const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": absoluteUrl("/#webpage"),
            url: absoluteUrl("/"),
            name: siteConfig.name,
            description:
                `Homepage for ${siteConfig.name}'s live multilingual AI Pandit, family puja, and spiritual guidance.`,
            isPartOf: {
                "@id": absoluteUrl("/#website"),
            },
            about: [
                {
                    "@type": "Thing",
                    name: "Live AI pandit guidance",
                },
                {
                    "@type": "Thing",
                    name: "Family puja online",
                },
                {
                    "@type": "Thing",
                    name: "Multilingual devotional support",
                },
            ],
        },
        {
            "@type": "FAQPage",
            "@id": absoluteUrl("/#faq"),
            mainEntity: homeFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            })),
        },
    ],
};

export default function HomePage() {
    return (
        <>
            <Script
                id="home-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(homeJsonLd),
                }}
            />
            <RootHomePage />
        </>
    );
}

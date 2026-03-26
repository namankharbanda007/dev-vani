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
        "Explore SMART Murti's AI devotional ecosystem for guided puja, spiritual conversations, astrology, horoscopes, bhajans, and connected home temple products.",
    path: "/",
    keywords: [
        "ai spiritual guide",
        "guided puja",
        "ai devotional ecosystem",
        "home temple ai",
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
                "Homepage for SMART Murti's AI devotional ecosystem, products, services, and spiritual tools.",
            isPartOf: {
                "@id": absoluteUrl("/#website"),
            },
            about: [
                {
                    "@type": "Thing",
                    name: "AI spiritual guidance",
                },
                {
                    "@type": "Thing",
                    name: "Guided puja",
                },
                {
                    "@type": "Thing",
                    name: "Vedic astrology",
                },
                {
                    "@type": "Thing",
                    name: "Bhajans and devotional music",
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

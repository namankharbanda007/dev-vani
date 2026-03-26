import type { Metadata } from "next";

export const siteConfig = {
    name: "SMART Murti",
    alternateName: "SMART मूर्ति",
    url: "https://smartmurti.com",
    description:
        "SMART Murti is an AI devotional ecosystem for guided puja, spiritual conversations, Vedic astrology, daily horoscopes, bhajans, and connected home temple experiences.",
    defaultOgImage: "/logos/smartmurti-icon.jpg",
    creator: "SMART Murti Team",
    publisher: "SMART Murti",
    locale: "en_US",
    keywords: [
        "smart murti",
        "SMART Murti",
        "ai pandit",
        "ai astrologer",
        "ai devotional platform",
        "guided puja app",
        "vedic astrology ai",
        "daily horoscope",
        "bhajan app",
        "home temple technology",
        "spiritual ai assistant",
        "devotional ai device",
    ],
} as const;

type BuildMetadataInput = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    images?: string[];
    noIndex?: boolean;
    type?: "website" | "article";
};

export const homeFaqs = [
    {
        question: "What is SMART Murti?",
        answer:
            "SMART Murti is an AI devotional ecosystem that combines spiritual conversations, guided puja support, astrology tools, bhajans, and connected home temple products in one platform.",
    },
    {
        question: "What can I do with the AI Pandit?",
        answer:
            "You can speak with an AI Pandit for mantra explanations, puja guidance, devotional Q&A, and everyday spiritual support through voice or chat.",
    },
    {
        question: "Does SMART Murti offer astrology and horoscope features?",
        answer:
            "Yes. SMART Murti includes an AI astrologer, daily horoscope experiences, and additional divination tools such as palm reading.",
    },
    {
        question: "Is SMART Murti only a device?",
        answer:
            "No. SMART Murti spans both software and hardware, including digital spiritual services, devotional media, and products like Smart Pandit, Smart Base, and Smart Mandir.",
    },
    {
        question: "Which languages does SMART Murti support?",
        answer:
            "SMART Murti supports major Indian and global languages so users can have devotional conversations in their preferred language.",
    },
];

export const aiReferencePages = [
    {
        path: "/",
        title: "Homepage",
        description:
            "Main overview of SMART Murti, including products, AI spiritual guidance, astrology, bhajans, and devotional use cases.",
    },
    {
        path: "/products",
        title: "Products",
        description:
            "Overview of SMART Murti hardware experiences such as Smart Pandit, Smart Base, and Smart Mandir.",
    },
    {
        path: "/products/smart-pandit",
        title: "Smart Pandit",
        description:
            "AI spiritual guide for guided puja, mantra recitation, and devotional conversations at home.",
    },
    {
        path: "/products/smart-base",
        title: "Smart Base",
        description:
            "Smart devotional base that upgrades an existing murti with audio, rituals, and spiritual guidance.",
    },
    {
        path: "/products/smart-mandir",
        title: "Smart Mandir",
        description:
            "AI-powered home temple experience with devotional audio, rituals, and interactive spiritual support.",
    },
    {
        path: "/pandit",
        title: "AI Pandit",
        description:
            "Live AI Pandit experience for spiritual conversations and guided devotional support.",
    },
    {
        path: "/astrologer",
        title: "AI Astrologer",
        description:
            "Live AI astrologer experience for chart-based guidance and spiritual consultation.",
    },
    {
        path: "/horoscope",
        title: "Horoscope",
        description:
            "Daily horoscope experience with personalized forecasts and spiritual remedies.",
    },
    {
        path: "/bhajan",
        title: "Bhajan Library",
        description:
            "Devotional music experience with bhajans, mantras, and aarti content.",
    },
    {
        path: "/palm-reading",
        title: "Palm Reading",
        description:
            "AI palm reading experience for spiritual and personality insights.",
    },
    {
        path: "/pricing",
        title: "Pricing",
        description:
            "Prepaid wallet pricing for SMART Murti's AI spiritual services and experiences.",
    },
];

export const sitemapEntries = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/landing-2", changeFrequency: "weekly", priority: 0.92 },
    { path: "/products", changeFrequency: "weekly", priority: 0.9 },
    { path: "/products/smart-pandit", changeFrequency: "weekly", priority: 0.88 },
    { path: "/products/smart-base", changeFrequency: "weekly", priority: 0.84 },
    { path: "/products/smart-mandir", changeFrequency: "weekly", priority: 0.84 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.82 },
    { path: "/pandit", changeFrequency: "weekly", priority: 0.8 },
    { path: "/astrologer", changeFrequency: "weekly", priority: 0.8 },
    { path: "/horoscope", changeFrequency: "daily", priority: 0.8 },
    { path: "/bhajan", changeFrequency: "weekly", priority: 0.76 },
    { path: "/palm-reading", changeFrequency: "weekly", priority: 0.72 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
] as const;

export function absoluteUrl(path = "/") {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalizedPath, siteConfig.url).toString();
}

export function buildMetadata({
    title,
    description,
    path = "/",
    keywords = [],
    images = [siteConfig.defaultOgImage],
    noIndex = false,
    type = "website",
}: BuildMetadataInput): Metadata {
    const canonical = absoluteUrl(path);
    const ogTitle =
        title === siteConfig.name ? siteConfig.name : `${title} | ${siteConfig.name}`;
    const ogImages = images.map((image) => ({
        url: absoluteUrl(image),
        width: 1200,
        height: 630,
        alt: ogTitle,
    }));

    return {
        title,
        description,
        keywords: [...new Set([...siteConfig.keywords, ...keywords])],
        alternates: {
            canonical,
        },
        openGraph: {
            title: ogTitle,
            description,
            url: canonical,
            siteName: siteConfig.name,
            locale: siteConfig.locale,
            type,
            images: ogImages,
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description,
            images: ogImages.map((image) => image.url),
        },
        robots: noIndex
            ? {
                  index: false,
                  follow: false,
              }
            : undefined,
    };
}

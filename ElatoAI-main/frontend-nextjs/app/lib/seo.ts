import type { Metadata } from "next";

export const siteConfig = {
    name: "SMART Murti",
    alternateName: "SMART Murti",
    url: "https://smartmurti.com",
    description:
        "SMART Murti gives Hindu families instant access to a live multilingual AI Pandit for spiritual guidance, family puja, and urgent devotional support from anywhere in the world.",
    defaultOgImage: "/logos/smartmurti-icon.jpg",
    creator: "SMART Murti Team",
    publisher: "SMART Murti",
    locale: "en_US",
    keywords: [
        "smart murti",
        "ai pandit",
        "live ai pandit",
        "family puja online",
        "multilingual spiritual guidance",
        "online pandit consultation",
        "urgent spiritual guidance",
        "video puja for nri families",
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
            "SMART Murti lets Hindu families talk to a live multilingual AI Pandit for spiritual guidance, family puja, and urgent devotional support from anywhere in the world.",
    },
    {
        question: "What can I do with Smart Pandit?",
        answer:
            "You can speak with Smart Pandit for spiritual guidance, family questions, puja support, devotional Q&A, and live voice or chat conversations in your preferred language.",
    },
    {
        question: "Does SMART Murti offer astrology and horoscope features?",
        answer:
            "Yes. SMART Murti includes an AI astrologer, daily horoscope guidance, and specialist lanes for relationship, finance, and other personal questions.",
    },
    {
        question: "Can my family join from different countries?",
        answer:
            "Yes. SMART Murti is built for families across countries and time zones, so relatives can join shared spiritual moments even when they are not in the same place.",
    },
    {
        question: "Which languages does SMART Murti support?",
        answer:
            "SMART Murti supports Hindi, English, Hinglish, and other major Indian and global languages so families can receive guidance naturally.",
    },
];

export const aiReferencePages = [
    {
        path: "/",
        title: "Homepage",
        description:
            "Homepage for SMART Murti, featuring live multilingual AI Pandit guidance, family puja, and urgent spiritual support.",
    },
    {
        path: "/pandit",
        title: "AI Pandit",
        description:
            "Live AI Pandit experience for spiritual conversations, guided devotional support, and family puja.",
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
            "NRI launch packages for SMART Murti AI Pandit guidance, digital puja, live family puja, and premium havan.",
    },
    {
        path: "/privacy",
        title: "Privacy Policy",
        description:
            "Privacy Policy for SMART Murti and Smartmurti AI Private Limited.",
    },
    {
        path: "/terms",
        title: "Terms of Service",
        description:
            "Terms of Service for SMART Murti and Smartmurti AI Private Limited.",
    },
    {
        path: "/refunds",
        title: "Refund Policy",
        description:
            "Refund Policy for SMART Murti digital sessions, wallet recharges, and failed payments.",
    },
    {
        path: "/disclaimer",
        title: "Disclaimer",
        description:
            "Disclaimer for SMART Murti covering AI guidance limits and non-professional advice boundaries.",
    },
    {
        path: "/contact",
        title: "Contact",
        description:
            "Contact Smartmurti AI Private Limited and SMART Murti support.",
    },
];

export const sitemapEntries = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.82 },
    { path: "/pandit", changeFrequency: "weekly", priority: 0.8 },
    { path: "/astrologer", changeFrequency: "weekly", priority: 0.8 },
    { path: "/horoscope", changeFrequency: "daily", priority: 0.8 },
    { path: "/bhajan", changeFrequency: "weekly", priority: 0.76 },
    { path: "/palm-reading", changeFrequency: "weekly", priority: 0.72 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
    { path: "/refunds", changeFrequency: "monthly", priority: 0.46 },
    { path: "/disclaimer", changeFrequency: "monthly", priority: 0.44 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.44 },
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
    const ogTitle = title === siteConfig.name ? siteConfig.name : `${title} | ${siteConfig.name}`;
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

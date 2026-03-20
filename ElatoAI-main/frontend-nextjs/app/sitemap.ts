// app/sitemap.ts

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: "https://smartmurti.com",
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: "https://smartmurti.com/landing-2",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.95,
        },
        {
            url: "https://smartmurti.com/products",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: "https://smartmurti.com/products/smart-base",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: "https://smartmurti.com/products/smart-mandir",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: "https://smartmurti.com/products/smart-pandit",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: "https://smartmurti.com/pricing",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: "https://smartmurti.com/pandit",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://smartmurti.com/astrologer",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://smartmurti.com/horoscope",
            lastModified,
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: "https://smartmurti.com/bhajan",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.75,
        },
        {
            url: "https://smartmurti.com/palm-reading",
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: "https://smartmurti.com/privacy",
            lastModified,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: "https://smartmurti.com/terms",
            lastModified,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}

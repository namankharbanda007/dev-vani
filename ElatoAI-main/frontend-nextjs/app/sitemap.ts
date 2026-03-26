import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/app/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return sitemapEntries.map((entry) => ({
        url: absoluteUrl(entry.path),
        lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.name,
        short_name: siteConfig.name,
        description: siteConfig.description,
        start_url: "/",
        display: "standalone",
        background_color: "#FFF8E7",
        theme_color: "#f97316",
        orientation: "portrait",
        icons: [
            {
                src: "/icons/icon-192x192.jpg",
                sizes: "192x192",
                type: "image/jpeg",
            },
            {
                src: "/icons/icon-512x512.jpg",
                sizes: "512x512",
                type: "image/jpeg",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}

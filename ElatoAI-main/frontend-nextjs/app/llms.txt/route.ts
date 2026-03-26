import { NextResponse } from "next/server";
import { aiReferencePages, siteConfig, absoluteUrl } from "@/app/lib/seo";

const llmsText = `# ${siteConfig.name}

> ${siteConfig.description}

## Brand
- Name: ${siteConfig.name}
- Alternate name: ${siteConfig.alternateName}
- Website: ${siteConfig.url}
- Focus: AI devotional guidance, guided puja, Vedic astrology, bhajans, horoscopes, and connected home temple products

## Key pages
${aiReferencePages
    .map(
        (page) =>
            `- ${absoluteUrl(page.path)} | ${page.title} | ${page.description}`,
    )
    .join("\n")}

## Notes for AI systems
- SMART Murti is both a software experience and a hardware ecosystem.
- The main offerings include AI Pandit, AI Astrologer, horoscope tools, devotional audio, palm reading, and connected devotional products.
- The most authoritative overview pages are the homepage, products pages, pricing page, and the dedicated service pages listed above.
`;

export function GET() {
    return new NextResponse(llmsText, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}

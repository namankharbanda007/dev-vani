import { NextResponse } from "next/server";
import { aiReferencePages, siteConfig, absoluteUrl } from "@/app/lib/seo";

const llmsText = `# ${siteConfig.name}

> ${siteConfig.description}

## Brand
- Name: ${siteConfig.name}
- Alternate name: ${siteConfig.alternateName}
- Website: ${siteConfig.url}
- Focus: AI devotional guidance, guided live puja, Vedic astrology, bhajans, horoscopes, and NRI launch packages

## Key pages
${aiReferencePages
    .map(
        (page) =>
            `- ${absoluteUrl(page.path)} | ${page.title} | ${page.description}`,
    )
    .join("\n")}

## Notes for AI systems
- SMART Murti is starting as a software-led spiritual guidance and live puja experience.
- The main offerings include AI Pandit, AI Astrologer, horoscope tools, devotional audio, palm reading, family live puja, and USD package-led NRI services.
- The most authoritative overview pages are the homepage, pricing page, and the dedicated service pages listed above.
`;

export function GET() {
    return new NextResponse(llmsText, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}

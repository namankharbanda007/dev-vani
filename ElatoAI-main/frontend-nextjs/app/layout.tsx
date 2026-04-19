import { GeistSans } from "geist/font/sans";
import {
    Inter,
    Baloo_2,
    Comic_Neue,
    Quicksand,
    Fredoka,
    Lora,
    Inter_Tight,
    Borel,
    Silkscreen,
    Luckiest_Guy,
    Karla,
} from "next/font/google";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "@livekit/components-styles";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import { getUserById } from "@/db/users";
import TawkToScript from "@/app/components/TawkToScript";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { absoluteUrl, siteConfig } from "@/app/lib/seo";

const karla = Karla({
    subsets: ["latin"],
    variable: "--font-karla",
});

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const interTight = Inter_Tight({
    weight: ["500", "600", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-inter-tight",
    display: "swap",
});

const baloo2 = Baloo_2({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-baloo2",
});

const comicNeue = Comic_Neue({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-comic-neue",
    weight: ["300", "400", "700"],
});

const quicksand = Quicksand({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-quicksand",
});

const fredoka = Fredoka({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-fredoka",
});

const lora = Lora({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lora",
});

const borel = Borel({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-borel",
    weight: ["400"],
});

const silkscreen = Silkscreen({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-silkscreen",
    weight: ["400"],
});

const luckiestGuy = Luckiest_Guy({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-luckiest-guy",
    weight: ["400"],
});

const fonts = `${inter.variable} ${interTight.variable} ${baloo2.variable} ${comicNeue.variable} ${quicksand.variable} ${fredoka.variable} ${lora.variable} ${karla.variable} ${borel.variable} ${silkscreen.variable} ${luckiestGuy.variable}`;

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    description: siteConfig.description,
    authors: [
        {
            name: "Naman Kharbanda",
            url: siteConfig.url,
        },
    ],
    keywords: [...siteConfig.keywords],
    openGraph: {
        title: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        type: "website",
        images: [
            {
                url: absoluteUrl(siteConfig.defaultOgImage),
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} - AI devotional ecosystem`,
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    generator: "Next.js",
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    alternates: {
        canonical: siteConfig.url,
        languages: {
            "en-US": siteConfig.url,
            "hi-IN": siteConfig.url,
        },
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [absoluteUrl(siteConfig.defaultOgImage)],
    },
    assets: absoluteUrl("/images"),
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
    appleWebApp: {
        capable: true,
        title: siteConfig.name,
        statusBarStyle: "black-translucent",
    },
    category: "Spiritual technology",
    classification: "AI devotional platform",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: siteConfig.name,
            alternateName: siteConfig.alternateName,
            url: siteConfig.url,
            logo: absoluteUrl(siteConfig.defaultOgImage),
            description: siteConfig.description,
            knowsAbout: [
                "AI spiritual guidance",
                "Guided puja",
                "Vedic astrology",
                "Bhajans and devotional audio",
                "Connected home temple products",
            ],
        },
        {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: siteConfig.url,
            name: siteConfig.name,
            alternateName: siteConfig.alternateName,
            description: siteConfig.description,
            publisher: {
                "@id": absoluteUrl("/#organization"),
            },
            inLanguage: ["en", "hi"],
        },
        {
            "@type": "CollectionPage",
            "@id": absoluteUrl("/#collection-page"),
            url: siteConfig.url,
            name: siteConfig.name,
            description: siteConfig.description,
            isPartOf: {
                "@id": absoluteUrl("/#website"),
            },
            about: [
                {
                    "@type": "Thing",
                    name: "AI devotional ecosystem",
                },
                {
                    "@type": "Thing",
                    name: "Spiritual guidance",
                },
                {
                    "@type": "Thing",
                    name: "Vedic astrology",
                },
            ],
        },
    ],
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const dbUser = user?.id ? await getUserById(supabase, user.id) : null;

    return (
        <html
            lang="en"
            className={`${GeistSans.className} h-full ${fonts}`}
            suppressHydrationWarning
        >
            <head>
                <Script
                    id="site-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            </head>
            <body className="bg-background text-foreground flex min-h-screen flex-col bg-gray-50 font-karla">
                <NextTopLoader showSpinner={false} color="#facc15" />
                <LayoutWrapper user={dbUser ?? null}>{children}</LayoutWrapper>
                <Toaster />
            </body>
            <TawkToScript />
            <GoogleAnalytics gaId="G-CR07NVH6CN" />
        </html>
    );
}

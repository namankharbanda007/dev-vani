import { GeistSans } from "geist/font/sans";
import { Product, WithContext } from "schema-dts";
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
} from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./components/Footer";
import { fetchGithubStars } from "./actions";
import { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Karla } from "next/font/google";

const karla = Karla({
	subsets: ["latin"],
	variable: "--font-karla",
});


import Script from "next/script";
import { Navbar } from "./components/Nav/Navbar";
import { getUserById } from "@/db/users";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const inter_tight = Inter_Tight({
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

const fonts = `${inter.variable} ${inter_tight.variable} ${baloo2.variable} ${comicNeue.variable} ${quicksand.variable} ${fredoka.variable} ${lora.variable} ${karla.variable} ${borel.variable} ${silkscreen.variable}`;

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: {
        default:
            "SMART मूर्ति: World's First Devotional Ecosystem",
        template:
            "%s | SMART मूर्ति: World's First Devotional Ecosystem",
    },
    applicationName: "SMART मूर्ति",
    description:
        "SMART मूर्ति is the world's first devotional ecosystem that brings Murti to life with AI-powered interactive experiences, fostering spiritual growth and connection.",
    authors: [
        {
            name: "Naman Kharbanda",
            url: "https://smartmurti.com/about",
        },
    ],
    keywords: [
        "AI bhagwan",
        "AI bhagwan murti",
        "AI smart murti",
        "smart murti",
        "ai krishna",
        "ai ram bhagwan",
        "emotional growth",
        "Smart Murti AI",
        "conversational AI",
        "google home",
        "amazon echo",
        "smart speaker",
        "AI speaker",
        "emotional support",
        "AI for adults",
        "AI assistant",
        "smart AI device",
    ],
    openGraph: {
        title: "Smart Murti AI: The Compact Device to Bring AI Characters to Life",
        description:
            "Smart Murti brings objects to life through engaging, conversational AI experiences. More than a device, it's your gateway to a world where AI brings magic to the ordinary.",
        siteName: "Smart Murti AI",
        locale: "en-US",
        type: "website",
        images: [
            {
                url: "https://SmartMurti.com/images/orange.png",
                width: 1200,
                height: 630,
                alt: "Smart Murti AI conversational device - Front View",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    generator: "Next.js",
    creator: "Smart Murti Team",
    publisher: "Smart Murti AI Ltd.",
    alternates: {
        canonical: "https://SmartMurti.com",
        languages: {
            "en-US": "https://SmartMurti.com",
            "zh-CN": "https://SmartMurti.com",
        },
    },
    icons: {
        icon: "https://trustpilotreview.shop/wp-content/uploads/2025/10/Screenshot-2025-10-26-161326-e1761475494285.png",
        apple: "https://trustpilotreview.shop/wp-content/uploads/2025/10/Screenshot-2025-10-26-161326-e1761475494285.png",
    },
    twitter: {
        card: "summary_large_image",
        title: "Smart Murti - An AI-powered device that brings murti to life through engaging, conversational experiences",
        description:
            "More than a device, Smart Murti is your gateway to a world where AI brings magic to the ordinary through engaging learning and interactive experiences.",
        images: ["https://Smart Murtiai.com/images/orange.png"],
    },
    assets: "https://Smart Murtiai.com/images",
    formatDetection: {
        telephone: false,
    },
    appleWebApp: {
        capable: true,
        title: "Smart Murti AI",
        statusBarStyle: "black-translucent",
    },
    category: "AI device",
    classification: "Interactive, conversational AI Devices",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Smart Murti AI",
    description:
        "Smart Murti is an AI-enabled device that brings murti to life through conversational AI. More than a device, it's your gateway to a world where AI brings magic to the ordinary.",
    brand: {
        "@type": "Brand",
        name: "Smart Murti AI",
    },
    offers: {
        "@type": "Offer",
        url: "https://smartmurti.com",
        priceCurrency: "USD",
        price: "57.99",
        priceValidUntil: "2024-12-31", // set a realistic date in the future
        availability: "https://schema.org/InStock",
        seller: {
            "@type": "Organization",
            name: "Smart Murti AI Ltd.",
        },
        hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            returnPolicyCategory:
                "https://schema.org/MerchantReturnUnspecified",
            merchantReturnDays: 30,
        },
        shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: {
                "@type": "DefinedRegion",
                name: "Worldwide", // Reflects availability in all countries
            },
            shippingRate: {
                "@type": "MonetaryAmount",
                value: "0.00",
                currency: "USD", // Free shipping
            },
        },
    },
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "14",
    },
    review: [
        {
            "@type": "Review",
            author: {
                "@type": "Person",
                name: "Kai L.",
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
            },
            reviewBody:
                "I wished to have a toy for my friends kids, chatting just for fun ... and hearing all is 'out-of-the-.box' is a unbelievable awesome",
        },
        {
            "@type": "Review",
            author: {
                "@type": "Person",
                name: "Lauren A. W.",
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
            },
            reviewBody:
                "I want to make a my mother happy. I think this box will really help!",
        },
        {
            "@type": "Review",
            author: {
                "@type": "Person",
                name: "Steven Z.",
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
            },
            reviewBody: "this is fantastic, extremely useful. Thanks so much.",
        },
        {
            "@type": "Review",
            author: {
                "@type": "Person",
                name: "Big cube",
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: "4.5",
            },
            reviewBody:
                "Really cool project you've got going on, hoping one day it might use a local llm",
        },
    ],
    image: "https://smartmurti.com/images/orange.png",
    category: "Interactive AI Device",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const { stars } = await fetchGithubStars("namankhar/dev-vani");

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let dbUser: IUser | undefined;
    if (user) {
        dbUser = await getUserById(supabase, user.id);
    }


    return (
        <html
            lang="en"
            className={`${GeistSans.className} h-full ${fonts}`}
            suppressHydrationWarning
        >
            <head>
                <link rel="canonical" href="https://www.smartmurti.com" />
                <Script
                    id="product-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            </head>
            <body className="bg-background text-foreground flex flex-col min-h-screen bg-gray-50 font-karla">
                <NextTopLoader showSpinner={false} color="#facc15" />

                {/* <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                > */}
                <main className="flex-grow mx-auto w-full flex flex-col">
                    <Navbar user={dbUser ?? null} stars={stars} />
                    {children}
                    <Footer />
                </main>
                {/* <Analytics /> */}
                <Toaster />
                {/* </ThemeProvider> */}
            </body>
            <GoogleAnalytics gaId="G-Cnaman" />
        </html>
    );
}

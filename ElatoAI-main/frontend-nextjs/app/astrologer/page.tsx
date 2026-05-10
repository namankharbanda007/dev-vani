import { createClient } from "@/utils/supabase/server";
import ClientPage from "./ClientPage";
import { Suspense } from "react";
import { getSimpleUserById } from "@/db/users";
import type { UserProfileData } from "@/app/types/UserProfileData";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "AI Astrologer",
    description:
        "Talk to SMART Murti's real-time AI astrologer for horoscope support, birth-chart context, and NRI family guidance.",
    path: "/astrologer",
    keywords: [
        "ai astrologer",
        "vedic astrology ai",
        "smart murti astrologer",
        "online astrology chat",
    ],
});

export default async function AstrologerCallPage() {
    const supabase = createClient();
    let userProfile: UserProfileData | null = null;
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user && !error) {
            const dbUser = await getSimpleUserById(supabase, user.id);
            const userName = dbUser?.supervisor_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
            const avatarUrl = dbUser?.avatar_url || user.user_metadata?.avatar_url || null;

            const metadata = (dbUser?.user_info as any)?.user_metadata || {};

            userProfile = {
                name: userName,
                avatarUrl,
                dateOfBirth: dbUser?.date_of_birth || metadata.birth_date || null,
                zodiacSign: dbUser?.zodiac_sign || null,
                birthPlace: metadata.birth_place || null,
                birthTime: metadata.birth_time || null,
                rashi: metadata.rashi || null,
            };
        }
    } catch (err) {
        console.error("Supabase SSR Auth Error:", err);
    }

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fffaf2] font-lora text-xl text-[#20130b]">Preparing astrology room...</div>}>
            <ClientPage userProfile={userProfile} />
        </Suspense>
    );
}


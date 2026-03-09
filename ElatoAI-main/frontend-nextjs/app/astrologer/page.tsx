import { createClient } from "@/utils/supabase/server";
import ClientPage from "./ClientPage";
import { Suspense } from "react";
import { getSimpleUserById } from "@/db/users";
import type { UserProfileData } from "@/app/types/UserProfileData";

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
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 flex items-center justify-center text-white font-lora text-xl">Connecting to the Stars...</div>}>
            <ClientPage userProfile={userProfile} />
        </Suspense>
    );
}


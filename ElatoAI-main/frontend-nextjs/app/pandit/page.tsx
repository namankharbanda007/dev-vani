import { createClient } from "@/utils/supabase/server";
import ClientPage from "./ClientPage";
import { Suspense } from "react";
import { getSimpleUserById } from "@/db/users";

export default async function PanditCallPage() {
    const supabase = createClient();
    let initialUser = null;
    let initialAvatarUrl: string | null = null;
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        // If the user is logged in, extract their name or email to auto-join the call.
        // We prioritize the full name from user metadata, else email name.
        if (user && !error) {
            initialUser = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

            // Try to get avatar from DB first (uploaded photo), fallback to auth metadata
            const dbUser = await getSimpleUserById(supabase, user.id);
            initialAvatarUrl = dbUser?.avatar_url || user.user_metadata?.avatar_url || null;
        }
    } catch (err) {
        console.error("Supabase SSR Auth Error:", err);
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center text-white font-lora text-xl">Entering Ashram...</div>}>
            <ClientPage initialUser={initialUser} initialAvatarUrl={initialAvatarUrl} />
        </Suspense>
    );
}

import { createClient } from "@/utils/supabase/server";
import ClientPage from "./ClientPage";
import { Suspense } from "react";
import { getSimpleUserById } from "@/db/users";

export default async function AstrologerCallPage() {
    const supabase = createClient();
    let initialUser = null;
    let initialAvatarUrl: string | null = null;
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user && !error) {
            initialUser = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
            const dbUser = await getSimpleUserById(supabase, user.id);
            initialAvatarUrl = dbUser?.avatar_url || user.user_metadata?.avatar_url || null;
        }
    } catch (err) {
        console.error("Supabase SSR Auth Error:", err);
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 flex items-center justify-center text-white font-lora text-xl">Connecting to the Stars...</div>}>
            <ClientPage initialUser={initialUser} initialAvatarUrl={initialAvatarUrl} />
        </Suspense>
    );
}

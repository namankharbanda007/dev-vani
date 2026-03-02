import { createClient } from "@/utils/supabase/server";
import ClientPage from "./ClientPage";
import { Suspense } from "react";

export default async function PanditCallPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If the user is logged in, extract their name or email to auto-join the call.
    // We prioritize the full name from user metadata, else email name.
    let initialUser = null;
    if (user) {
        initialUser = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center text-white font-lora text-xl">Entering Ashram...</div>}>
            <ClientPage initialUser={initialUser} />
        </Suspense>
    );
}

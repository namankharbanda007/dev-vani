"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthHashHandler() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleAuthHash = async () => {
            // Check if the URL has a hash with access_token (Implicit Grant flow artifact)
            if (window.location.hash && window.location.hash.includes("access_token")) {
                console.log("Detected auth hash, attempting to set session...");

                // Parse the hash parameters
                const params = new URLSearchParams(window.location.hash.substring(1)); // remove the #
                const access_token = params.get("access_token");
                const refresh_token = params.get("refresh_token");

                if (access_token && refresh_token) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (!error && data.session) {
                        console.log("Session set successfully from hash. Redirecting...");
                        // Clear the hash
                        window.history.replaceState(null, "", window.location.pathname);
                        // Refresh to sync server state
                        router.refresh();
                        router.push("/home");
                    } else {
                        console.error("Failed to set session from hash:", error);
                    }
                }
            }
        };

        handleAuthHash();
    }, [router, supabase]);

    return null;
}

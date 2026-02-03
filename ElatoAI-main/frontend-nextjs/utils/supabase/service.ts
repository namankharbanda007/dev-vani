import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service role key to bypass RLS policies
 * USE WITH CAUTION - Only use server-side for admin operations
 */
export const createServiceClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY not found - user creation may fail due to RLS");
        throw new Error("Service role key not configured");
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

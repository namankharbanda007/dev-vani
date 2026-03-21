import { createClient as createDirectClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

interface RouteAuthResult {
  supabase: SupabaseClient;
  user: User | null;
  token: string | null;
}

export async function getSupabaseForRouteAuth(request?: Request): Promise<RouteAuthResult> {
  const authHeader =
    request?.headers.get("authorization") || request?.headers.get("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();

    const supabase = createDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    return {
      supabase,
      user: user ?? null,
      token,
    };
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: user ?? null,
    token: null,
  };
}

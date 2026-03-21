import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const invalidReason = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return "Missing Expo Supabase environment variables.";
  }

  if (
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseAnonKey.includes("<YOUR_") ||
    supabaseAnonKey === "your-anon-key"
  ) {
    return "The app is still pointing at local placeholder Supabase values instead of your real project.";
  }

  return null;
})();

export const supabaseConfigError = invalidReason
  ? `${invalidReason} Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile-app-expo/.env.`
  : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

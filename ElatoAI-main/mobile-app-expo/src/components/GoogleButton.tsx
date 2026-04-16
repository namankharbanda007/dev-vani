import { Pressable, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

interface GoogleButtonProps {
  onError: (message: string) => void;
}

export function GoogleButton({ onError }: GoogleButtonProps) {
  const handlePress = async () => {
    try {
      if (!supabase) {
        throw new Error("Supabase is not configured yet.");
      }

      const redirectTo = "smartmurti://auth/callback";
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error("Google sign in URL was not returned.");
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type !== "success" || !result.url) {
        return;
      }

      let code: string | null = null;
      try {
        code = new URL(result.url).searchParams.get("code");
      } catch {
        const codeMatch = result.url.match(/[?&]code=([^&]+)/);
        code = codeMatch ? decodeURIComponent(codeMatch[1]) : null;
      }

      if (!code) {
        throw new Error("Google sign in did not return an auth code.");
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        throw exchangeError;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign in failed. Check your Supabase redirect URL setup.";
      onError(message);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <View style={styles.iconContainer}>
        <Ionicons name="logo-google" size={26} color="#EA4335" />
      </View>
      <Text style={styles.label}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    shadowColor: "#6A4A2C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
});

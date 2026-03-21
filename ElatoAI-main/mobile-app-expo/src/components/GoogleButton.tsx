import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
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

      const redirectTo = Linking.createURL("auth/callback");
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
        <Text style={styles.icon}>G</Text>
      </View>
      <Text style={styles.label}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#DC2626",
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  label: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
});

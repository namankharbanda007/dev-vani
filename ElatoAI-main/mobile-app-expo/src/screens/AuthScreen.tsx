import { useMemo, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandMark } from "../components/BrandMark";
import { GoogleButton } from "../components/GoogleButton";
import { MessageBanner } from "../components/MessageBanner";
import { ModeTabs } from "../components/ModeTabs";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextField } from "../components/TextField";
import { supabase } from "../lib/supabase";
import { colors, gradients } from "../theme/colors";
import { fonts } from "../theme/typography";

type AuthMode = "login" | "signup";

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const heading = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome Back!",
            description: "Ready to continue your journey?",
            submit: "Login",
            pending: "Logging in...",
            gradient: "login" as const,
          }
        : {
            title: "Join the Family",
            description: "Start your spiritual journey today",
            submit: "Create Account",
            pending: "Creating account...",
            gradient: "signup" as const,
          },
    [mode]
  );

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleResetPassword = async () => {
    resetMessages();

    if (!email.trim()) {
      setErrorMessage("Enter your email first, then tap Forgot password.");
      return;
    }

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured yet.");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: "smartmurti://auth/callback",
      });

      if (error) {
        throw error;
      }

      setSuccessMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to send reset email.");
    }
  };

  const handleSubmit = async () => {
    resetMessages();
    setLoading(true);

    try {
      if (mode === "login") {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }
      } else {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: "smartmurti://auth/callback",
          },
        });

        if (error) {
          throw error;
        }

        setSuccessMessage("Account created. Check your email to complete sign in.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.includes("Database error")
            ? "System is busy. Please try again."
            : error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    resetMessages();
    setMode(nextMode);
  };

  return (
    <LinearGradient colors={gradients.page} style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.shell}>
              <View style={styles.heroCard}>
                <ImageBackground
                  source={require("../../assets/branding/login-hero.jpg")}
                  style={styles.heroImage}
                  imageStyle={styles.heroImageBorder}
                >
                  <View style={styles.heroOverlay} />
                  <View style={styles.heroCopy}>
                    <BrandMark />
                    <Text style={styles.heroTitle}>Spirituality Meets Companionship</Text>
                    <Text style={styles.heroDescription}>
                      Join thousands of families discovering AI-powered spiritual guidance
                      and companionship.
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.brandTitle}>SMART मूर्ति</Text>
                <ModeTabs mode={mode} onChange={switchMode} />

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{heading.title}</Text>
                  <Text style={styles.sectionDescription}>{heading.description}</Text>
                </View>

                <GoogleButton onError={setErrorMessage} />

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>
                    {mode === "login" ? "or using email" : "or create with email"}
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.formFields}>
                  <TextField
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="devotee@smartmurti.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextField
                    label={mode === "login" ? "Password" : "Create Password"}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry
                  />
                  {mode === "login" ? (
                    <Pressable onPress={handleResetPassword}>
                      <Text style={styles.inlineLink}>Forgot password?</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.helperText}>Must be at least 6 characters</Text>
                  )}

                  <PrimaryButton
                    label={loading ? heading.pending : heading.submit}
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!email.trim() || (mode === "signup" ? password.length < 6 : password.length === 0)}
                    variant={heading.gradient}
                  />
                </View>

                {errorMessage ? <MessageBanner tone="error" text={errorMessage} /> : null}
                {successMessage ? <MessageBanner tone="success" text={successMessage} /> : null}

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    By continuing, you agree to our{" "}
                    <Text
                      style={styles.footerLink}
                      onPress={() => Linking.openURL("https://www.smartmurti.com/terms")}
                    >
                      Terms of Service
                    </Text>
                    {" "}and{" "}
                    <Text
                      style={styles.footerLink}
                      onPress={() => Linking.openURL("https://www.smartmurti.com/privacy")}
                    >
                      Privacy Policy
                    </Text>
                    .
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  shell: {
    gap: 18,
  },
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    minHeight: 280,
    shadowColor: colors.purple900,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  heroImage: {
    minHeight: 280,
    justifyContent: "flex-end",
  },
  heroImageBorder: {
    borderRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(43, 11, 81, 0.38)",
  },
  heroCopy: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    gap: 10,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 34,
  },
  heroDescription: {
    color: "rgba(255,255,255,0.88)",
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  formCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  brandTitle: {
    textAlign: "center",
    color: colors.purple900,
    fontFamily: fonts.brand,
    fontSize: 34,
    letterSpacing: 1,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    textAlign: "center",
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 22,
  },
  sectionDescription: {
    textAlign: "center",
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerLabel: {
    color: colors.gray400,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  formFields: {
    gap: 14,
  },
  inlineLink: {
    alignSelf: "flex-end",
    color: colors.purple600,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  helperText: {
    marginTop: -4,
    marginLeft: 4,
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 14,
  },
  footerText: {
    textAlign: "center",
    color: colors.gray400,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  footerLink: {
    color: colors.purple900,
    textDecorationLine: "underline",
  },
});

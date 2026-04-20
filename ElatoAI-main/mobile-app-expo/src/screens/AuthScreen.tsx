import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GoogleButton } from "../components/GoogleButton";
import { MessageBanner } from "../components/MessageBanner";
import { supabase } from "../lib/supabase";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

type AuthMode = "login" | "signup";

function AuthField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.fieldWrap}>
      <View style={styles.fieldLabelChip}>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <View style={styles.fieldShell}>
        <View style={styles.fieldIconWrap}>
          <Ionicons name={icon} size={20} color={colors.gray500} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.fieldInput}
        />
      </View>
    </View>
  );
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const copy = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome Back",
            description:
              "Return to one calm spiritual front door for guidance, puja, and family support.",
            divider: "OR CONTINUE WITH EMAIL",
            submit: "Login",
            pending: "Logging in...",
          }
        : {
            title: "Begin With Smart Pandit",
            description:
              "Create your account and start with a spiritual guide that feels personal, immediate, and family-ready.",
            divider: "OR CREATE WITH EMAIL",
            submit: "Create Account",
            pending: "Creating account...",
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
      if (!supabase) {
        throw new Error("Supabase is not configured yet.");
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }
      } else {
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

  const disabled =
    !email.trim() || (mode === "signup" ? password.length < 6 : password.length === 0);

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerShell}>
              <Text style={styles.brandWordmark}>SMART मूर्ति</Text>
              <Text style={styles.headerSubcopy}>
                Instant spiritual guidance, live puja access, and one calm front door for your family.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.brandKicker}>Start with Smart Pandit</Text>

              <View style={styles.tabRow}>
                <Pressable
                  onPress={() => {
                    resetMessages();
                    setMode("login");
                  }}
                  style={styles.tabButton}
                >
                  <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                    Login
                  </Text>
                  <View
                    style={[
                      styles.tabUnderline,
                      mode === "login" && styles.tabUnderlineActive,
                    ]}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    resetMessages();
                    setMode("signup");
                  }}
                  style={styles.tabButton}
                >
                  <Text style={[styles.tabText, mode === "signup" && styles.tabTextActive]}>
                    Sign Up
                  </Text>
                  <View
                    style={[
                      styles.tabUnderline,
                      mode === "signup" && styles.tabUnderlineActive,
                    ]}
                  />
                </Pressable>
              </View>

              <View style={styles.welcomeBlock}>
                <Text style={styles.welcomeTitle}>{copy.title}</Text>
                <Text style={styles.welcomeSubtitle}>{copy.description}</Text>
              </View>

              <GoogleButton onError={setErrorMessage} />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{copy.divider}</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.fieldsStack}>
                <AuthField
                  icon="mail-outline"
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="devotee@smartmurti.com"
                  keyboardType="email-address"
                />

                <AuthField
                  icon="key-outline"
                  label={mode === "login" ? "Password" : "Create Password"}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                />

                {mode === "login" ? (
                  <Pressable onPress={handleResetPassword} style={styles.forgotWrap}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.signupHint}>
                    Password must be at least 6 characters.
                  </Text>
                )}

                <Pressable
                  onPress={() => void handleSubmit()}
                  disabled={loading || disabled}
                  style={[
                    styles.submitButton,
                    (loading || disabled) && styles.submitButtonDisabled,
                  ]}
                >
                  <Text style={styles.submitText}>{loading ? copy.pending : copy.submit}</Text>
                </Pressable>
              </View>

              {errorMessage ? <MessageBanner tone="error" text={errorMessage} /> : null}
              {successMessage ? <MessageBanner tone="success" text={successMessage} /> : null}

              <Text style={styles.footerText}>
                By continuing, you agree to our{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => Linking.openURL("https://www.smartmurti.com/terms")}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => Linking.openURL("https://www.smartmurti.com/privacy")}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>

            <View style={styles.heroShell}>
              <View style={styles.heroArtCard}>
                <Image
                  source={require("../../assets/branding/login-hero.jpg")}
                  style={styles.heroArt}
                  resizeMode="cover"
                />
                <View style={styles.heroOverlay} />
              </View>
              <Text style={styles.heroHeading}>
                Guidance first. Family puja when you need more.
              </Text>
              <Text style={styles.heroSubcopy}>
                Begin with one personal conversation, then bring relatives in later when the moment becomes bigger.
              </Text>
              <View style={styles.trustRow}>
                <View style={styles.trustChip}>
                  <Text style={styles.trustChipText}>Live multilingual guidance</Text>
                </View>
                <View style={styles.trustChip}>
                  <Text style={styles.trustChipText}>Family can join later</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.softPaper,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  headerShell: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 2,
  },
  brandWordmark: {
    color: colors.murtiStone,
    fontFamily: fonts.brand,
    fontSize: 34,
    textAlign: "center",
  },
  headerSubcopy: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 360,
  },
  heroShell: {
    gap: 10,
    paddingHorizontal: 4,
  },
  heroHeading: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 30,
    paddingHorizontal: 4,
  },
  heroSubcopy: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 4,
    maxWidth: 360,
  },
  heroArtCard: {
    minHeight: 156,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.12)",
    backgroundColor: "#F0D7A8",
    shadowColor: "#6A4A2C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  heroArt: {
    width: "100%",
    height: 156,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,247,234,0.12)",
  },
  trustRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    paddingHorizontal: 6,
  },
  trustChip: {
    borderRadius: 999,
    backgroundColor: "#F3E6D1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  trustChipText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 26,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.08)",
    shadowColor: "#6A4A2C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  brandKicker: {
    textAlign: "center",
    color: colors.divineSaffron,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    marginHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    position: "relative",
  },
  tabText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  tabTextActive: {
    color: colors.murtiStone,
    fontFamily: fonts.bodyBold,
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "transparent",
  },
  tabUnderlineActive: {
    backgroundColor: colors.divineSaffron,
  },
  welcomeBlock: {
    alignItems: "center",
    gap: 6,
  },
  welcomeTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 30,
    textAlign: "center",
  },
  welcomeSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
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
  dividerText: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  fieldsStack: {
    gap: 16,
  },
  fieldWrap: {
    paddingTop: 8,
  },
  fieldLabelChip: {
    alignSelf: "flex-start",
    marginLeft: 14,
    marginBottom: -10,
    zIndex: 2,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
  },
  fieldLabel: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  fieldShell: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  fieldIconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldInput: {
    flex: 1,
    color: colors.gray900,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingVertical: 14,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    color: colors.divineSaffron,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  signupHint: {
    marginLeft: 6,
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  submitButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.divineSaffron,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8C4A15",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  footerText: {
    marginTop: 2,
    textAlign: "center",
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  footerLink: {
    color: colors.divineSaffron,
    textDecorationLine: "underline",
  },
});

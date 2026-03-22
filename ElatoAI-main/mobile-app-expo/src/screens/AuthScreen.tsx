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
      <View style={styles.fieldShell}>
        <View style={styles.fieldLabelChip}>
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <View style={styles.fieldIconWrap}>
          <Ionicons name={icon} size={22} color="#4A4A4A" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8F8A82"
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
            title: "Welcome Back!",
            description: "Ready to continue your journey?",
            divider: "OR USING EMAIL",
            submit: "Login",
            pending: "Logging in...",
          }
        : {
            title: "Join the Family",
            description: "Start your spiritual journey today",
            divider: "OR CREATE WITH EMAIL",
            submit: "Sign Up",
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

  const disabled = !email.trim() || (mode === "signup" ? password.length < 6 : password.length === 0);

  return (
    <View style={styles.page}>
      <Image
        source={require("../../assets/branding/login-hero.jpg")}
        style={styles.absoluteBg}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroPanel}>
              <Image
                source={require("../../assets/branding/smart-murti-logo.png")}
                resizeMode="contain"
                style={styles.heroLogo}
              />
              <Text style={styles.heroSubcopy}>
                Join thousands of families discovering AI-{"\n"}
                powered spiritual guidance and companionship.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.brandTitle}>SMART मूर्ति</Text>

              <View style={styles.tabRow}>
                <Pressable onPress={() => { resetMessages(); setMode("login"); }} style={styles.tabButton}>
                  <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>Login</Text>
                  <View style={[styles.tabUnderline, mode === "login" && styles.tabUnderlineActive]} />
                </Pressable>
                <Pressable onPress={() => { resetMessages(); setMode("signup"); }} style={styles.tabButton}>
                  <Text style={[styles.tabText, mode === "signup" && styles.tabTextActive]}>Sign Up</Text>
                  <View style={[styles.tabUnderline, mode === "signup" && styles.tabUnderlineActive]} />
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
                  placeholder="••••••••"
                  secureTextEntry
                />

                {mode === "login" ? (
                  <Pressable onPress={handleResetPassword} style={styles.forgotWrap}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.signupHint}>Must be at least 6 characters</Text>
                )}

                <Pressable
                  onPress={() => void handleSubmit()}
                  disabled={loading || disabled}
                  style={[styles.submitButton, (loading || disabled) && styles.submitButtonDisabled]}
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
              
              <SafeAreaView edges={['bottom']} style={{ height: 0 }} />
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
    backgroundColor: '#FAF5ED',
  },
  absoluteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  heroPanel: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 'auto',
    marginBottom: 20,
  },
  heroLogo: {
    width: 200,
    height: 38,
    tintColor: "#3B312A",
    marginBottom: 8,
  },
  heroSubcopy: {
    textAlign: "center",
    color: "#4A3F35",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: "#FFFDF8",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 18,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(123, 94, 50, 0.08)",
  },
  brandTitle: {
    textAlign: "center",
    color: '#3B1E75', // Closer to the mockup's rich deep purple
    fontFamily: fonts.brand,
    fontSize: 36,
    letterSpacing: 0.5,
    marginTop: -4,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D9CFC4",
    marginHorizontal: 16,
    marginBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    position: "relative",
  },
  tabText: {
    color: "#7E746A",
    fontFamily: fonts.body,
    fontSize: 16,
  },
  tabTextActive: {
    color: '#3B1E75',
    fontFamily: fonts.bodyBold,
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1, // Exactly override the borderBottom pixel
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "transparent",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabUnderlineActive: {
    backgroundColor: '#3B1E75',
  },
  welcomeBlock: {
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  welcomeTitle: {
    color: "#161311",
    fontFamily: fonts.bodyBold,
    fontSize: 26,
  },
  welcomeSubtitle: {
    color: "#4C443C",
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9CFC4",
  },
  dividerText: {
    color: "#4C443C",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  fieldsStack: {
    gap: 16,
  },
  fieldWrap: {
    paddingTop: 8,
  },
  fieldLabel: {
    color: "#6E635A",
    fontFamily: fonts.body,
    fontSize: 12,
  },
  fieldLabelChip: {
    position: "absolute",
    top: -9,
    left: 14,
    zIndex: 2,
    paddingHorizontal: 8,
    backgroundColor: "#FFFDF8",
  },
  fieldShell: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#A3978B",
    backgroundColor: "#FFFDF8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  fieldIconWrap: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldInput: {
    flex: 1,
    color: "#1E1A16",
    fontFamily: fonts.body,
    fontSize: 16,
    paddingVertical: 14,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 4,
  },
  forgotText: {
    color: '#340E7D',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  signupHint: {
    marginLeft: 8,
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  submitButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#340E7D',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#340E7D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
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
    marginTop: 4,
    textAlign: "center",
    color: "#4C443C",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  footerLink: {
    color: '#340E7D',
    textDecorationLine: "underline",
  },
});

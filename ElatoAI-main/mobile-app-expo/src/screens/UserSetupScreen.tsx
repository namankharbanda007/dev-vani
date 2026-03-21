import { useMemo, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextField } from "../components/TextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { updateCurrentUserProfile } from "../lib/smartMurtiApi";
import { DbUser } from "../models/types";
import { colors, gradients } from "../theme/colors";
import { fonts } from "../theme/typography";

interface UserSetupScreenProps {
  dbUser: DbUser | null;
  mode: "onboarding" | "edit";
  onSaved: () => Promise<void> | void;
  onClose?: () => void;
}

export function UserSetupScreen({
  dbUser,
  mode,
  onSaved,
  onClose,
}: UserSetupScreenProps) {
  const metadata = useMemo(
    () =>
      ((dbUser?.user_info as Record<string, unknown> | null)?.user_metadata ||
        {}) as Record<string, string | undefined>,
    [dbUser?.user_info]
  );

  const [name, setName] = useState(dbUser?.supervisee_name || "");
  const [age, setAge] = useState(
    dbUser?.supervisee_age ? String(dbUser.supervisee_age) : ""
  );
  const [persona, setPersona] = useState(dbUser?.supervisee_persona || "");
  const [birthPlace, setBirthPlace] = useState(metadata.birth_place || "");
  const [birthDate, setBirthDate] = useState(metadata.birth_date || "");
  const [birthTime, setBirthTime] = useState(metadata.birth_time || "");
  const [rashi, setRashi] = useState(metadata.rashi || "");
  const [languageCode, setLanguageCode] = useState(dbUser?.language_code || "en-US");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heading = mode === "onboarding" ? "Hello there!" : "Edit your profile";
  const subHeading =
    mode === "onboarding"
      ? "Let's personalize your Smart Murti experience with the same details we ask on the website."
      : "Update your Smart Murti details, horoscope inputs, and devotional preferences.";
  const actionLabel =
    mode === "onboarding" ? "Continue to Smart Murti" : "Save profile";

  const handleSave = async () => {
    const cleanedName = name.trim();
    const numericAge = Number(age);

    if (!cleanedName) {
      setError("Please enter your name.");
      return;
    }

    if (!numericAge || numericAge < 1 || numericAge > 120) {
      setError("Please enter a valid age.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateCurrentUserProfile({
        supervisee_name: cleanedName,
        supervisee_age: numericAge,
        supervisee_persona: persona,
        birth_place: birthPlace,
        birth_date: birthDate,
        birth_time: birthTime,
        rashi,
        language_code: languageCode.trim() || "en-US",
      });

      await onSaved();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not save your profile.");
    } finally {
      setSubmitting(false);
    }
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.shell}>
              <View style={styles.heroCard}>
                <ImageBackground
                  source={require("../../assets/branding/login-hero.jpg")}
                  style={styles.heroImage}
                  imageStyle={styles.heroImageBorder}
                >
                  <View style={styles.heroOverlay} />
                  {onClose ? (
                    <Pressable onPress={onClose} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={20} color={colors.white} />
                    </Pressable>
                  ) : null}
                  <View style={styles.heroCopy}>
                    {mode === "onboarding" ? (
                      <View style={styles.progressShell}>
                        <View style={styles.progressTrack}>
                          <View style={styles.progressFill} />
                        </View>
                        <Text style={styles.progressText}>Step 1 of 2</Text>
                      </View>
                    ) : null}
                    <Text style={styles.heroTitle}>{heading}</Text>
                    <Text style={styles.heroDescription}>{subHeading}</Text>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.brandTitle}>SMART मूर्ति</Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Basic Info</Text>
                  <TextField
                    label="Your Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Rahul Sharma"
                  />
                  <TextField
                    label="Your Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    placeholder="24"
                  />
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Persona / About You</Text>
                    <TextInput
                      value={persona}
                      onChangeText={setPersona}
                      placeholder="Tell Smart Murti about your goals, spiritual needs, and personality"
                      placeholderTextColor={colors.gray400}
                      style={styles.multilineInput}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Birth Details</Text>
                  <TextField
                    label="Birth Place"
                    value={birthPlace}
                    onChangeText={setBirthPlace}
                    placeholder="Mumbai, India"
                  />
                  <TextField
                    label="Birth Date"
                    value={birthDate}
                    onChangeText={setBirthDate}
                    placeholder="YYYY-MM-DD"
                  />
                  <TextField
                    label="Birth Time"
                    value={birthTime}
                    onChangeText={setBirthTime}
                    placeholder="HH:MM"
                  />
                  <TextField
                    label="Rashi"
                    value={rashi}
                    onChangeText={setRashi}
                    placeholder="Mesha (Aries)"
                  />
                  <TextField
                    label="Language Code"
                    value={languageCode}
                    onChangeText={setLanguageCode}
                    placeholder="en-IN"
                    autoCapitalize="none"
                  />
                </View>

                {error ? (
                  <View style={styles.errorCard}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <PrimaryButton
                  label={submitting ? "Saving..." : actionLabel}
                  onPress={handleSave}
                  loading={submitting}
                  variant={mode === "onboarding" ? "signup" : "neutral"}
                />
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
    padding: 18,
  },
  shell: {
    gap: 18,
  },
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    minHeight: 260,
  },
  heroImage: {
    minHeight: 260,
    justifyContent: "flex-end",
  },
  heroImageBorder: {
    borderRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(43, 11, 81, 0.44)",
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroCopy: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    gap: 10,
  },
  progressShell: {
    gap: 8,
    marginBottom: 6,
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.26)",
    overflow: "hidden",
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#F59E0B",
  },
  progressText: {
    color: "#FDE68A",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 36,
  },
  heroDescription: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    gap: 18,
  },
  brandTitle: {
    textAlign: "center",
    color: colors.purple900,
    fontFamily: fonts.brand,
    fontSize: 34,
    letterSpacing: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 110,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.gray900,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  errorCard: {
    borderRadius: 18,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 14,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
});

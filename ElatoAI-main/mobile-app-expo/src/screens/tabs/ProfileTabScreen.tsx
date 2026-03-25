import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";
import { Ionicons } from "@expo/vector-icons";
import { DbUser } from "../../models/types";
import {
  getGuideShortTitle,
  getUserMetadata,
  LANGUAGE_OPTIONS,
  updateCurrentUserLanguage,
  uploadCurrentUserAvatar,
} from "../../lib/smartMurtiApi";
import { supabase, supabaseConfigError } from "../../lib/supabase";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface ProfileTabScreenProps {
  session: Session;
  dbUser: DbUser | null;
  onEditProfile: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function ProfileTabScreen({
  session,
  dbUser,
  onEditProfile,
  refreshing = false,
  onRefresh,
}: ProfileTabScreenProps) {
  const metadata = getUserMetadata(dbUser);
  const [signingOut, setSigningOut] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingLanguage, setSavingLanguage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayName = dbUser?.supervisee_name || dbUser?.supervisor_name || "Smart Murti user";
  const activeLanguage = dbUser?.language_code || "en-US";
  const currentGuide = dbUser?.personality?.title ? getGuideShortTitle(dbUser.personality.title) : "Pandit Ji";
  const avatarUrl =
    dbUser?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(session.user.email || "smartmurti")}`;

  const languageLabel = useMemo(
    () => LANGUAGE_OPTIONS.find((item) => item.code === activeLanguage)?.label || activeLanguage,
    [activeLanguage]
  );

  const resetBanners = () => {
    setMessage(null);
    setError(null);
  };

  const handleAvatarUpload = async () => {
    resetBanners();

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Photo library permission is needed to upload a profile photo.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      setUploadingPhoto(true);
      await uploadCurrentUserAvatar(asset.uri, asset.mimeType || "image/jpeg");
      setMessage("Profile photo updated.");
      await onRefresh?.();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not update profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === activeLanguage || savingLanguage) {
      return;
    }

    resetBanners();
    setSavingLanguage(languageCode);
    try {
      await updateCurrentUserLanguage(languageCode);
      setMessage(`Language preference updated to ${LANGUAGE_OPTIONS.find((item) => item.code === languageCode)?.label || languageCode}.`);
      await onRefresh?.();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not update language.");
    } finally {
      setSavingLanguage(null);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of Smart Murti?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          if (supabaseConfigError || !supabase) {
            return;
          }

          setSigningOut(true);
          resetBanners();
          try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
              throw signOutError;
            }
          } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : "Could not sign out.");
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.purple900]} />
        ) : undefined
      }
    >
      <LinearGradient colors={["#1F1A3D", "#4C1D95", "#6D28D9"]} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroEyebrow}>Profile & Settings</Text>
            <Text style={styles.heroHeading}>{displayName}</Text>
            <Text style={styles.heroSubheading}>{session.user.email}</Text>
          </View>
          <Pressable
            onPress={handleAvatarUpload}
            disabled={uploadingPhoto}
            style={({ pressed }) => [styles.photoAction, pressed && styles.pressed, uploadingPhoto && styles.disabled]}
          >
            <Ionicons name="camera-outline" size={18} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.heroAvatarWrap}>
          <Image source={{ uri: avatarUrl }} style={styles.heroAvatar} />
          <Pressable
            onPress={handleAvatarUpload}
            disabled={uploadingPhoto}
            style={({ pressed }) => [styles.avatarBadge, pressed && styles.pressed]}
          >
            <Ionicons name="image-outline" size={16} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Wallet</Text>
            <Text style={styles.statValue}>Rs. {Number(dbUser?.wallet_balance ?? 0).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Guide</Text>
            <Text style={styles.statValue}>{currentGuide}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Language</Text>
            <Text style={styles.statValue}>{languageLabel}</Text>
          </View>
        </View>
      </LinearGradient>

      {message ? (
        <View style={styles.successCard}>
          <Text style={styles.successText}>{message}</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Language Preference</Text>
            <Text style={styles.cardSubtitle}>Use the same devotional language setting you expect on the website.</Text>
          </View>
        </View>

        <View style={styles.languageGrid}>
          {LANGUAGE_OPTIONS.map((option) => {
            const active = activeLanguage === option.code;
            return (
              <Pressable
                key={option.code}
                onPress={() => void handleLanguageChange(option.code)}
                style={({ pressed }) => [
                  styles.languageChip,
                  active && styles.languageChipActive,
                  pressed && styles.pressed,
                  savingLanguage === option.code && styles.disabled,
                ]}
              >
                <Text style={[styles.languageChipText, active && styles.languageChipTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Devotee Details</Text>
            <Text style={styles.cardSubtitle}>These are the core profile settings used across Smart Murti.</Text>
          </View>
          <Pressable onPress={onEditProfile} style={({ pressed }) => [styles.inlineButton, pressed && styles.pressed]}>
            <Text style={styles.inlineButtonText}>Edit</Text>
          </Pressable>
        </View>

        <InfoRow label="Your Name" value={dbUser?.supervisee_name || "Not set"} />
        <InfoRow label="Guardian Name" value={dbUser?.supervisor_name || "Not set"} />
        <InfoRow label="Age" value={dbUser?.supervisee_age || "Not set"} />
        <InfoRow label="Persona" value={dbUser?.supervisee_persona || "Not set"} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Horoscope Inputs</Text>
            <Text style={styles.cardSubtitle}>These fields power your zodiac guidance and personalized readings.</Text>
          </View>
        </View>

        <InfoRow label="Birth Place" value={metadata.birth_place || "Not set"} />
        <InfoRow label="Birth Date" value={metadata.birth_date || "Not set"} />
        <InfoRow label="Birth Time" value={metadata.birth_time || "Not set"} />
        <InfoRow label="Rashi" value={metadata.rashi || "Not set"} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Account</Text>
            <Text style={styles.cardSubtitle}>Manage your profile, uploads, and session preferences.</Text>
          </View>
        </View>

        <Pressable onPress={onEditProfile} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Ionicons name="create-outline" size={18} color={colors.white} />
          <Text style={styles.primaryButtonText}>Open Full Profile Editor</Text>
        </Pressable>

        <Pressable
          onPress={handleAvatarUpload}
          disabled={uploadingPhoto}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, uploadingPhoto && styles.disabled]}
        >
          <Ionicons name="cloud-upload-outline" size={18} color={colors.gray900} />
          <Text style={styles.secondaryButtonText}>{uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSignOut}
        disabled={signingOut}
        style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed, signingOut && styles.disabled]}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.white} />
        <Text style={styles.signOutText}>{signingOut ? "Signing out..." : "Sign Out"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 16,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 30,
    padding: 20,
    gap: 18,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  heroEyebrow: {
    color: "#DDD6FE",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroHeading: {
    marginTop: 6,
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 30,
  },
  heroSubheading: {
    marginTop: 4,
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.body,
    fontSize: 14,
  },
  photoAction: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarWrap: {
    alignSelf: "center",
    position: "relative",
  },
  heroAvatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  avatarBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  statValue: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  card: {
    borderRadius: 26,
    backgroundColor: colors.white,
    padding: 18,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  cardTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 23,
  },
  cardSubtitle: {
    marginTop: 4,
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 260,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  languageChip: {
    borderRadius: 16,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  languageChipActive: {
    backgroundColor: "#F3E8FF",
    borderColor: "#C4B5FD",
  },
  languageChipText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  languageChipTextActive: {
    color: colors.purple900,
  },
  infoRow: {
    borderRadius: 18,
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  infoLabel: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoValue: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  inlineButton: {
    borderRadius: 999,
    backgroundColor: colors.gray50,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inlineButtonText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  primaryButton: {
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.purple900,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  secondaryButton: {
    height: 50,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  signOutButton: {
    height: 54,
    borderRadius: 22,
    backgroundColor: colors.rose600,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  signOutText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  successCard: {
    borderRadius: 18,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    padding: 14,
  },
  successText: {
    color: colors.successText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
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
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.6,
  },
});

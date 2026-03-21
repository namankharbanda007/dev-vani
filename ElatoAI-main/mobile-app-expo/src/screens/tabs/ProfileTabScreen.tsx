import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { DbUser } from "../../models/types";
import { supabase } from "../../lib/supabase";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { getRemoteAsset } from "../../lib/smartMurtiApi";

interface ProfileTabScreenProps {
  session: Session;
  dbUser: DbUser | null;
  onEditProfile: () => void;
}

function ProfileField({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function ProfileTabScreen({ session, dbUser, onEditProfile }: ProfileTabScreenProps) {
  const metadata = ((dbUser?.user_info as Record<string, unknown> | null)?.user_metadata ||
    {}) as Record<string, string | undefined>;

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  const displayName = dbUser?.supervisee_name || dbUser?.supervisor_name || "Smart Murti user";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHero}>
        <Image source={{ uri: getRemoteAsset("/assets/landing/logo.png") }} style={styles.logo} resizeMode="contain" />
        <Image
          source={{
            uri:
              dbUser?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(session.user.email || "smartmurti")}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>{displayName}</Text>
        <Text style={styles.emailText}>{session.user.email}</Text>
        <Pressable onPress={onEditProfile} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Basic Info</Text>
      <ProfileField label="Your Name" value={dbUser?.supervisee_name || "Not set"} />
      <ProfileField label="Guardian Name" value={dbUser?.supervisor_name || "Not set"} />
      <ProfileField label="Age" value={dbUser?.supervisee_age ?? "Not set"} />
      <ProfileField label="Persona" value={dbUser?.supervisee_persona || "Not set"} />
      <ProfileField label="Current Guide" value={dbUser?.personality?.title || "Smart Guide"} />
      <ProfileField label="Language" value={dbUser?.language_code || "en-US"} />

      <Text style={styles.sectionTitle}>Birth Details</Text>
      <ProfileField label="Birth Place" value={metadata.birth_place || "Not set"} />
      <ProfileField label="Birth Date" value={metadata.birth_date || "Not set"} />
      <ProfileField label="Birth Time" value={metadata.birth_time || "Not set"} />
      <ProfileField label="Rashi" value={metadata.rashi || "Not set"} />

      <Text style={styles.sectionTitle}>Account</Text>
      <ProfileField label="Wallet Balance" value={`Rs. ${Number(dbUser?.wallet_balance ?? 0).toLocaleString("en-IN")}`} />
      <ProfileField label="Plan" value={dbUser?.is_premium ? "Premium" : "Free"} />

      <Pressable onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
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
    gap: 12,
    paddingBottom: 28,
  },
  profileHero: {
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    padding: 24,
    gap: 10,
  },
  logo: {
    width: 150,
    height: 48,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.gray100,
  },
  nameText: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 28,
    textAlign: "center",
  },
  emailText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 22,
    marginTop: 6,
  },
  editButton: {
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  editButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  infoCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    padding: 18,
    gap: 6,
  },
  infoLabel: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
  },
  infoValue: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  signOutButton: {
    borderRadius: 20,
    backgroundColor: colors.rose600,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  signOutText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
});

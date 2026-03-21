import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBar, AppTab } from "../components/BottomTabBar";
import { DbUser, Personality } from "../models/types";
import { fetchCurrentUserBundle, fetchFaithPersonalities } from "../lib/smartMurtiApi";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { GuideChatScreen } from "./GuideChatScreen";
import { LiveCallScreen } from "./LiveCallScreen";
import { HomeTabScreen } from "./tabs/HomeTabScreen";
import { HoroscopeTabScreen } from "./tabs/HoroscopeTabScreen";
import { BhajanTabScreen } from "./tabs/BhajanTabScreen";
import { WalletTabScreen } from "./tabs/WalletTabScreen";
import { ProfileTabScreen } from "./tabs/ProfileTabScreen";
import { UserSetupScreen } from "./UserSetupScreen";

interface NativeShellScreenProps {
  session: Session;
}

export function NativeShellScreen({ session }: NativeShellScreenProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Personality | null>(null);
  const [selectedCallGuide, setSelectedCallGuide] = useState<Personality | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const loadBundle = useCallback(async () => {
    try {
      setError(null);
      const [userBundle, faithPersonalities] = await Promise.all([
        fetchCurrentUserBundle(),
        fetchFaithPersonalities(),
      ]);

      setDbUser(userBundle.dbUser);
      setPersonalities(faithPersonalities);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to load Smart Murti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBundle();
  }, [loadBundle]);

  const needsOnboarding = !loading && !error && !dbUser?.supervisee_name?.trim();

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedCallGuide) {
        setSelectedCallGuide(null);
        return true;
      }

      if (selectedGuide) {
        setSelectedGuide(null);
        return true;
      }

      if (editingProfile) {
        setEditingProfile(false);
        return true;
      }

      if (needsOnboarding) {
        return true;
      }

      if (activeTab !== "home") {
        setActiveTab("home");
        return true;
      }

      return true;
    });

    return () => subscription.remove();
  }, [activeTab, editingProfile, needsOnboarding, selectedCallGuide, selectedGuide]);

  const userName = useMemo(() => {
    return (
      dbUser?.supervisee_name ||
      dbUser?.supervisor_name ||
      (session.user.user_metadata?.name as string | undefined) ||
      session.user.email?.split("@")[0] ||
      "Devotee"
    );
  }, [dbUser?.supervisee_name, dbUser?.supervisor_name, session.user.email, session.user.user_metadata]);

  if (selectedCallGuide) {
    return (
      <LiveCallScreen
        personality={selectedCallGuide}
        languageCode={dbUser?.language_code}
        onClose={() => setSelectedCallGuide(null)}
      />
    );
  }

  if (selectedGuide) {
    return <GuideChatScreen personality={selectedGuide} onClose={() => setSelectedGuide(null)} />;
  }

  if (editingProfile) {
    return (
      <UserSetupScreen
        dbUser={dbUser}
        mode="edit"
        onClose={() => setEditingProfile(false)}
        onSaved={async () => {
          await loadBundle();
          setEditingProfile(false);
        }}
      />
    );
  }

  if (needsOnboarding) {
    return <UserSetupScreen dbUser={dbUser} mode="onboarding" onSaved={loadBundle} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>SMART मूर्ति</Text>
          <Text style={styles.brandSubtitle}>Native devotional companion</Text>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.purple900} />
            <Text style={styles.centerText}>Loading Smart Murti...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : activeTab === "home" ? (
          <HomeTabScreen
            userName={userName}
            dbUser={dbUser}
            personalities={personalities}
            onOpenGuide={setSelectedGuide}
            onOpenCall={setSelectedCallGuide}
            onOpenHoroscope={() => setActiveTab("horoscope")}
            onOpenBhajan={() => setActiveTab("bhajan")}
            onOpenWallet={() => setActiveTab("wallet")}
          />
        ) : activeTab === "horoscope" ? (
          <HoroscopeTabScreen userName={userName} dbUser={dbUser} />
        ) : activeTab === "bhajan" ? (
          <BhajanTabScreen />
        ) : activeTab === "wallet" ? (
          <WalletTabScreen dbUser={dbUser} onBalanceChange={loadBundle} />
        ) : (
          <ProfileTabScreen
            session={session}
            dbUser={dbUser}
            onEditProfile={() => setEditingProfile(true)}
          />
        )}
      </View>

      <BottomTabBar activeTab={activeTab} onSelect={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.softPaper,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.softPaper,
  },
  brandTitle: {
    color: colors.gray900,
    fontFamily: fonts.brand,
    fontSize: 28,
  },
  brandSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  centerText: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});

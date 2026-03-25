import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { BottomTabBar, AppTab } from "../components/BottomTabBar";
import { DbUser, Personality, BhajanTrack } from "../models/types";
import {
  fetchCurrentUserBundle,
  fetchFaithPersonalities,
  LIVE_PUJA_PANDIT_PERSONALITY_ID,
} from "../lib/smartMurtiApi";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { GuideChatScreen } from "./GuideChatScreen";
import { LiveCallScreen } from "./LiveCallScreen";
import { PanditVideoScreen } from "./PanditVideoScreen";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Personality | null>(null);
  const [selectedCallGuide, setSelectedCallGuide] = useState<Personality | null>(null);
  const [selectedVideoGuide, setSelectedVideoGuide] = useState<Personality | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  // Bhajan player state - lifted to persist across tab switches
  const bhajanSoundRef = useRef<Audio.Sound | null>(null);
  const [bhajanActiveTrackId, setBhajanActiveTrackId] = useState<string | null>(null);
  const [bhajanPlaying, setBhajanPlaying] = useState(false);

  // Screen transition animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTabSwitch = useCallback((nextTab: AppTab) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 8,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(nextTab);
      slideAnim.setValue(-8);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

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
      setRefreshing(false);
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

      if (selectedVideoGuide) {
        setSelectedVideoGuide(null);
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
        animateTabSwitch("home");
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [activeTab, animateTabSwitch, editingProfile, needsOnboarding, selectedCallGuide, selectedGuide, selectedVideoGuide]);

  const userName = useMemo(() => {
    return (
      dbUser?.supervisee_name ||
      dbUser?.supervisor_name ||
      (session.user.user_metadata?.name as string | undefined) ||
      session.user.email?.split("@")[0] ||
      "Devotee"
    );
  }, [dbUser?.supervisee_name, dbUser?.supervisor_name, session.user.email, session.user.user_metadata]);

  const handlePullRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBundle();
  }, [loadBundle]);

  const handleOpenVideoCall = useCallback(
    (guide: Personality) => {
      const lowerTitle = guide.title.toLowerCase();

      if (lowerTitle.includes("pandit")) {
        const livePujaGuide =
          personalities.find(
            (candidate) =>
              candidate.personality_id === LIVE_PUJA_PANDIT_PERSONALITY_ID
          ) ||
          personalities.find(
            (candidate) =>
              !candidate.creator_id &&
              candidate.title.toLowerCase().includes("pandit")
          ) ||
          guide;

        setSelectedVideoGuide(livePujaGuide);
        return;
      }

      setSelectedVideoGuide(guide);
    },
    [personalities]
  );

  // Bhajan player callbacks for BhajanTabScreen
  const bhajanPlayerState = useMemo(() => ({
    soundRef: bhajanSoundRef,
    activeTrackId: bhajanActiveTrackId,
    setActiveTrackId: setBhajanActiveTrackId,
    playing: bhajanPlaying,
    setPlaying: setBhajanPlaying,
  }), [bhajanActiveTrackId, bhajanPlaying]);

  useEffect(() => {
    return () => {
      void bhajanSoundRef.current?.unloadAsync();
      bhajanSoundRef.current = null;
    };
  }, []);

  if (selectedCallGuide) {
    return (
      <LiveCallScreen
        personality={selectedCallGuide}
        languageCode={dbUser?.language_code}
        onClose={() => setSelectedCallGuide(null)}
      />
    );
  }

  if (selectedVideoGuide) {
    return (
      <PanditVideoScreen
        personality={selectedVideoGuide}
        participantName={userName}
        languageCode={dbUser?.language_code}
        onClose={() => setSelectedVideoGuide(null)}
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

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.purple900} />
            <Text style={styles.centerText}>Loading Smart Murti...</Text>
          </View>
        ) : error ? (
          <ScrollView
            contentContainerStyle={styles.centerState}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handlePullRefresh} colors={[colors.purple900]} />
            }
          >
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryHint}>Pull down to retry</Text>
          </ScrollView>
        ) : activeTab === "home" ? (
          <HomeTabScreen
            userName={userName}
            dbUser={dbUser}
            personalities={personalities}
            onOpenGuide={setSelectedGuide}
            onOpenCall={setSelectedCallGuide}
            onOpenVideoCall={handleOpenVideoCall}
            onOpenHoroscope={() => animateTabSwitch("horoscope")}
            onOpenBhajan={() => animateTabSwitch("bhajan")}
            onOpenWallet={() => animateTabSwitch("wallet")}
            refreshing={refreshing}
            onRefresh={handlePullRefresh}
          />
        ) : activeTab === "horoscope" ? (
          <HoroscopeTabScreen userName={userName} dbUser={dbUser} />
        ) : activeTab === "bhajan" ? (
          <BhajanTabScreen playerState={bhajanPlayerState} />
        ) : activeTab === "wallet" ? (
          <WalletTabScreen dbUser={dbUser} onBalanceChange={loadBundle} />
        ) : (
          <ProfileTabScreen
            session={session}
            dbUser={dbUser}
            onEditProfile={() => setEditingProfile(true)}
            refreshing={refreshing}
            onRefresh={handlePullRefresh}
          />
        )}
      </Animated.View>

      <BottomTabBar activeTab={activeTab} onSelect={animateTabSwitch} />
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
  retryHint: {
    color: colors.gray400,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
});

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar, AppTab } from "../components/BottomTabBar";
import { DbUser, Personality, BhajanTrack } from "../models/types";
import {
  fetchMobileBootstrap,
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
import { LoadingScreen } from "./LoadingScreen";

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
  const [videoOverlayMinimized, setVideoOverlayMinimized] = useState(false);
  const [videoSessionActive, setVideoSessionActive] = useState(false);
  const [videoSessionStatus, setVideoSessionStatus] = useState("Opening your live puja room...");
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
      const payload = await fetchMobileBootstrap();
      setDbUser(payload.dbUser);
      setPersonalities(payload.personalities);
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

  const closeVideoSession = useCallback(() => {
    setSelectedVideoGuide(null);
    setVideoOverlayMinimized(false);
    setVideoSessionActive(false);
    setVideoSessionStatus("Opening your live puja room...");
  }, []);

  const needsOnboarding = !loading && !error && !dbUser?.supervisee_name?.trim();

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedCallGuide) {
        setSelectedCallGuide(null);
        return true;
      }

      if (selectedVideoGuide && !videoOverlayMinimized) {
        if (videoSessionActive) {
          setVideoOverlayMinimized(true);
          return true;
        }

        closeVideoSession();
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
  }, [activeTab, animateTabSwitch, closeVideoSession, editingProfile, needsOnboarding, selectedCallGuide, selectedGuide, selectedVideoGuide, videoOverlayMinimized, videoSessionActive]);

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
        setVideoOverlayMinimized(false);
        setVideoSessionActive(false);
        setVideoSessionStatus("Opening your live puja room...");
        return;
      }

      setSelectedVideoGuide(guide);
      setVideoOverlayMinimized(false);
      setVideoSessionActive(false);
      setVideoSessionStatus("Opening your live puja room...");
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          <LoadingScreen
            subtitle="Gathering your guides, rituals, and family space..."
          />
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

      {selectedVideoGuide ? (
        <>
          <View
            pointerEvents={videoOverlayMinimized ? "none" : "auto"}
            style={[
              styles.videoOverlayLayer,
              videoOverlayMinimized && styles.videoOverlayHidden,
            ]}
          >
            <PanditVideoScreen
              personality={selectedVideoGuide}
              participantName={userName}
              languageCode={dbUser?.language_code}
              onMinimize={() => setVideoOverlayMinimized(true)}
              onSessionStateChange={({ active, status }) => {
                setVideoSessionActive(active);
                setVideoSessionStatus(status);
              }}
              onClose={closeVideoSession}
            />
          </View>

          {videoOverlayMinimized ? (
            <View style={styles.videoMiniDockWrap} pointerEvents="box-none">
              <Pressable
                onPress={() => setVideoOverlayMinimized(false)}
                style={({ pressed }) => [
                  styles.videoMiniDock,
                  pressed && styles.videoMiniDockPressed,
                ]}
              >
                <View style={styles.videoMiniIcon}>
                  <Ionicons name="videocam" size={18} color={colors.white} />
                </View>
                <View style={styles.videoMiniCopy}>
                  <Text style={styles.videoMiniTitle}>
                    {selectedVideoGuide.title || "Live Puja"}
                  </Text>
                  <Text style={styles.videoMiniStatus}>
                    {videoSessionActive ? videoSessionStatus || "Live puja active" : "Tap to return to the room"}
                  </Text>
                </View>
                <View style={styles.videoMiniAction}>
                  <Text style={styles.videoMiniActionText}>Return</Text>
                  <Ionicons name="chevron-up" size={16} color={colors.gray900} />
                </View>
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}
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
  videoOverlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    elevation: 20,
    backgroundColor: colors.softPaper,
  },
  videoOverlayHidden: {
    opacity: 0,
  },
  videoMiniDockWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    zIndex: 50,
    elevation: 24,
  },
  videoMiniDock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(255, 250, 244, 0.98)",
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.1)",
    shadowColor: "#1F1711",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  videoMiniDockPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  videoMiniIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.divineSaffron,
  },
  videoMiniCopy: {
    flex: 1,
    gap: 2,
  },
  videoMiniTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  videoMiniStatus: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  videoMiniAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  videoMiniActionText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});

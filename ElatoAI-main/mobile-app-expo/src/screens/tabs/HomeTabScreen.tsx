import { useMemo, useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DbUser, Personality } from "../../models/types";
import {
  canGuideUseVideo,
  DEFAULT_LIVE_PUJA_RITUAL_ID,
  LIVE_PUJA_RITUALS,
  filterHomeGuides,
  getGuideDisplaySubtitle,
  getGuideImageAsset,
  getGuideShortTitle,
  HOME_PANDIT_PERSONALITY_ID,
} from "../../lib/smartMurtiApi";
import { gradients, colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface HomeTabScreenProps {
  userName: string;
  dbUser: DbUser | null;
  personalities: Personality[];
  onOpenGuide: (personality: Personality) => void;
  onOpenCall: (personality: Personality) => void;
  onOpenVideoCall: (personality: Personality, ritualId?: string) => void;
  onOpenHoroscope: () => void;
  onOpenBhajan: () => void;
  onOpenWallet: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

type IntentLane = {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: readonly [string, string];
  matchGuide: (guides: Personality[], fallback: Personality | undefined) => Personality | undefined;
};

type UtilityShortcut = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function matchesAny(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function findGuideByKeywords(guides: Personality[], keywords: string[]) {
  return guides.find((guide) => matchesAny(guide.title, keywords));
}

export function HomeTabScreen({
  userName,
  dbUser,
  personalities,
  onOpenGuide,
  onOpenCall,
  onOpenVideoCall,
  onOpenHoroscope,
  onOpenBhajan,
  onOpenWallet,
  refreshing = false,
  onRefresh,
}: HomeTabScreenProps) {
  const homeGuides = filterHomeGuides(personalities);
  const panditGuide =
    homeGuides.find((guide) => guide.personality_id === HOME_PANDIT_PERSONALITY_ID) ||
    homeGuides.find((guide) => guide.title.toLowerCase().trim() === "pandit ji") ||
    homeGuides.find((guide) => guide.title.toLowerCase().includes("pandit"));
  const dbGuide = homeGuides.find((guide) => guide.personality_id === dbUser?.personality_id);
  const currentGuide = dbGuide || panditGuide || homeGuides[0] || personalities[0];
  const firstName = userName.split(" ")[0] || "Devotee";
  const featuredGuideName = currentGuide ? getGuideShortTitle(currentGuide) : "Pandit Ji";
  const continueVideoGuide =
    (currentGuide && canGuideUseVideo(currentGuide) ? currentGuide : undefined) ||
    (panditGuide && canGuideUseVideo(panditGuide) ? panditGuide : undefined);
  const activePlan = dbUser?.is_premium ? "Premium" : "Free";

  const intentLanes = useMemo<IntentLane[]>(
    () => [
      {
        key: "health",
        label: "Health & Protection",
        description: "Calm guidance for family peace, healing, and protection.",
        icon: "shield-checkmark-outline",
        colors: ["#FFF4E7", "#F7E0BE"],
        matchGuide: (guides, fallback) =>
          findGuideByKeywords(guides, ["ankshastri", "pandit ji", "spiritual guide"]) || fallback,
      },
      {
        key: "love",
        label: "Love & Relationship",
        description: "Sensitive advice for love, marriage, and family emotions.",
        icon: "heart-outline",
        colors: ["#FCEAE7", "#F6D4CB"],
        matchGuide: (guides, fallback) =>
          findGuideByKeywords(guides, ["relationship advisor", "love stories", "lalit"]) || fallback,
      },
      {
        key: "ritual",
        label: "Family Ritual",
        description: "Move directly into puja, havan, and shared family moments.",
        icon: "flame-outline",
        colors: ["#FFF1DE", "#F1C787"],
        matchGuide: (guides, fallback) =>
          findGuideByKeywords(guides, ["pandit ji", "havan", "puja", "satyanarayan", "sundarkand"]) || fallback,
      },
      {
        key: "career",
        label: "Career & Finance",
        description: "Get practical spiritual guidance for work, money, and decisions.",
        icon: "briefcase-outline",
        colors: ["#EEE7F8", "#D8C6EE"],
        matchGuide: (guides, fallback) =>
          findGuideByKeywords(guides, ["financial advisor", "business scaler", "career healer", "path decider"]) ||
          fallback,
      },
    ],
    []
  );

  const laneAnims = useRef(intentLanes.map(() => new Animated.Value(1))).current;

  const utilityShortcuts: UtilityShortcut[] = [
    {
      key: "bhajan",
      label: "Bhajans",
      icon: "musical-notes-outline",
      onPress: onOpenBhajan,
    },
    {
      key: "horoscope",
      label: "Horoscope",
      icon: "sparkles-outline",
      onPress: onOpenHoroscope,
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: "wallet-outline",
      onPress: onOpenWallet,
    },
  ];

  const animateLaneIn = (index: number) => {
    Animated.spring(laneAnims[index], {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 220,
      friction: 14,
    }).start();
  };

  const animateLaneOut = (index: number) => {
    Animated.spring(laneAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 220,
      friction: 14,
    }).start();
  };

  const openLane = (lane: IntentLane) => {
    const targetGuide = lane.matchGuide(homeGuides, currentGuide);
    if (!targetGuide) {
      return;
    }

    if (lane.key === "ritual" && canGuideUseVideo(targetGuide)) {
      onOpenVideoCall(targetGuide, DEFAULT_LIVE_PUJA_RITUAL_ID);
      return;
    }

    onOpenCall(targetGuide);
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
      <ImageBackground
        source={require("../../../assets/branding/smart-pandit-home.jpg")}
        style={styles.heroCard}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={["rgba(26,18,12,0.22)", "rgba(33,22,18,0.58)", "rgba(33,20,17,0.86)"]}
          style={styles.heroOverlay}
        />
        <View style={styles.heroGlow} />

        <View style={styles.heroTopRow}>
          <View style={styles.heroChip}>
            <Ionicons name="sparkles" size={13} color="#F6D28A" />
            <Text style={styles.heroChipText}>{featuredGuideName}</Text>
          </View>
          <View style={styles.heroChipMuted}>
            <Text style={styles.heroChipMutedText}>{activePlan} plan</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>For families, rituals, and urgent guidance</Text>
          <Text style={styles.heroTitle}>Namaste, {firstName}</Text>
          <Text style={styles.heroBody}>
            One trusted Pandit, ready when your family needs calm guidance, a live puja, or a quick answer in your own language.
          </Text>

          <View style={styles.heroActions}>
            <Pressable
              onPress={() => currentGuide && onOpenCall(currentGuide)}
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              style={({ pressed }) => [styles.heroPrimaryAction, pressed && styles.pressedAction]}
            >
              <Ionicons name="call" size={18} color={colors.white} />
              <Text style={styles.heroPrimaryActionText}>Talk to Smart Pandit now</Text>
            </Pressable>

            <View style={styles.heroSecondaryRow}>
              <Pressable
                onPress={() => currentGuide && onOpenGuide(currentGuide)}
                android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                style={({ pressed }) => [styles.heroSecondaryAction, pressed && styles.pressedAction]}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.white} />
                <Text style={styles.heroSecondaryActionText}>Chat</Text>
              </Pressable>

              {continueVideoGuide ? (
                <Pressable
                  onPress={() => onOpenVideoCall(continueVideoGuide, DEFAULT_LIVE_PUJA_RITUAL_ID)}
                  android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                  style={({ pressed }) => [styles.heroSecondaryAction, pressed && styles.pressedAction]}
                >
                  <Ionicons name="videocam-outline" size={16} color={colors.white} />
                  <Text style={styles.heroSecondaryActionText}>Live puja</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.heroFooter}>
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>Wallet</Text>
            <Text style={styles.heroMetricValue}>Rs. {Number(dbUser?.wallet_balance ?? 0).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.heroMetricDivider} />
          <View style={styles.heroMetricCard}>
            <Text style={styles.heroMetricLabel}>Today</Text>
            <Text style={styles.heroMetricValue}>Voice, chat, or live family puja</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What do you need today?</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the moment first, then we route you into the right Smart Pandit lane.
        </Text>
      </View>

      {continueVideoGuide ? (
        <View style={styles.ritualPickerCard}>
          <View style={styles.ritualPickerHeader}>
            <Text style={styles.ritualPickerEyebrow}>Live puja</Text>
            <Text style={styles.ritualPickerTitle}>Choose the ritual first</Text>
          </View>
          <View style={styles.ritualGrid}>
            {LIVE_PUJA_RITUALS.map((ritual) => (
              <Pressable
                key={ritual.id}
                onPress={() => onOpenVideoCall(continueVideoGuide, ritual.id)}
                android_ripple={{ color: "rgba(31,23,17,0.05)" }}
                style={({ pressed }) => [styles.ritualChip, pressed && styles.pressedAction]}
              >
                <Text style={styles.ritualChipTitle}>{ritual.shortTitle}</Text>
                <Text style={styles.ritualChipText}>{ritual.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.intentGrid}>
        {intentLanes.map((lane, index) => (
          <Animated.View key={lane.key} style={[styles.intentCardWrap, { transform: [{ scale: laneAnims[index] }] }]}>
            <Pressable
              onPress={() => openLane(lane)}
              onPressIn={() => animateLaneIn(index)}
              onPressOut={() => animateLaneOut(index)}
              android_ripple={{ color: "rgba(31,23,17,0.05)" }}
            >
              <LinearGradient colors={lane.colors} style={styles.intentCard}>
                <View style={styles.intentIconWrap}>
                  <Ionicons name={lane.icon} size={22} color={colors.gray900} />
                </View>
                <Text style={styles.intentTitle}>{lane.label}</Text>
                <Text style={styles.intentDescription}>{lane.description}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue your journey</Text>
        <Text style={styles.sectionSubtitle}>
          Come back into guidance quickly, without wading through the whole app again.
        </Text>
      </View>

      <View style={styles.continueCard}>
        <Pressable
          onPress={() => currentGuide && onOpenCall(currentGuide)}
          android_ripple={{ color: "rgba(31,23,17,0.04)" }}
          style={({ pressed }) => [styles.continueRow, pressed && styles.pressedAction]}
        >
          <View style={styles.continueIconWrap}>
            <Ionicons name="call-outline" size={18} color={colors.purple900} />
          </View>
          <View style={styles.continueCopy}>
            <Text style={styles.continueTitle}>Resume with {featuredGuideName}</Text>
            <Text style={styles.continueText}>Jump straight back into a live spiritual conversation.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </Pressable>

        {continueVideoGuide ? (
          <Pressable
            onPress={() => onOpenVideoCall(continueVideoGuide, DEFAULT_LIVE_PUJA_RITUAL_ID)}
            android_ripple={{ color: "rgba(31,23,17,0.04)" }}
            style={({ pressed }) => [styles.continueRow, pressed && styles.pressedAction]}
          >
            <View style={styles.continueIconWrap}>
              <Ionicons name="videocam-outline" size={18} color={colors.divineSaffron} />
            </View>
            <View style={styles.continueCopy}>
              <Text style={styles.continueTitle}>Continue family puja</Text>
              <Text style={styles.continueText}>Bring everyone back into one live spiritual moment.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
          </Pressable>
        ) : null}

        <Pressable
          onPress={onOpenHoroscope}
          android_ripple={{ color: "rgba(31,23,17,0.04)" }}
          style={({ pressed }) => [styles.continueRow, pressed && styles.pressedAction]}
        >
          <View style={styles.continueIconWrap}>
            <Ionicons name="sparkles-outline" size={18} color={colors.gray700} />
          </View>
          <View style={styles.continueCopy}>
            <Text style={styles.continueTitle}>Today's guidance</Text>
            <Text style={styles.continueText}>Check your horoscope and move with a little more clarity.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Specialist Pandits</Text>
        <Text style={styles.sectionSubtitle}>
          One Smart Murti system, gently routed into the specialist you need right now.
        </Text>
      </View>

      <View style={styles.guideSection}>
        {homeGuides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={38} color={colors.gray400} />
            <Text style={styles.emptyTitle}>No guides available</Text>
            <Text style={styles.emptyText}>Pull down to refresh, or check back later.</Text>
          </View>
        ) : (
          <>
            {currentGuide ? (
              <View style={styles.featureGuideCard}>
                <Image source={{ uri: getGuideImageAsset(currentGuide) }} style={styles.featureGuidePortrait} />
                <View style={styles.featureGuideCopy}>
                  <Text style={styles.featureGuideEyebrow}>Featured Guide</Text>
                  <Text style={styles.featureGuideTitle}>{currentGuide.title}</Text>
                  <Text style={styles.featureGuideSubtitle}>
                    {getGuideDisplaySubtitle(currentGuide) || "Spiritual guidance"}
                  </Text>
                  <View style={styles.featureGuideActions}>
                    <Pressable
                      onPress={() => onOpenCall(currentGuide)}
                      android_ripple={{ color: "rgba(255,255,255,0.18)" }}
                      style={({ pressed }) => [styles.featureGuidePrimaryButton, pressed && styles.pressedAction]}
                    >
                      <Ionicons name="call" size={15} color={colors.white} />
                      <Text style={styles.featureGuidePrimaryText}>Call</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onOpenGuide(currentGuide)}
                      android_ripple={{ color: "rgba(31,23,17,0.06)" }}
                      style={({ pressed }) => [styles.featureGuideSecondaryButton, pressed && styles.pressedAction]}
                    >
                      <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.gray900} />
                      <Text style={styles.featureGuideSecondaryText}>Chat</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={styles.guidesColumn}>
              {homeGuides
                .filter((guide) => guide.personality_id !== currentGuide?.personality_id)
                .map((guide) => (
                  <Pressable
                    key={guide.personality_id}
                    onPress={() => onOpenGuide(guide)}
                    android_ripple={{ color: "rgba(31,23,17,0.04)" }}
                    style={({ pressed }) => [styles.guideCard, pressed && styles.pressedAction]}
                  >
                    <View style={styles.guideTopRow}>
                      <Image source={{ uri: getGuideImageAsset(guide) }} style={styles.guidePortrait} />
                      <View style={styles.guideCopy}>
                        <Text style={styles.guideTitle}>{guide.title}</Text>
                        <Text style={styles.guideSubtitle}>{getGuideDisplaySubtitle(guide) || "Spiritual guidance"}</Text>
                      </View>
                      {canGuideUseVideo(guide) ? (
                        <View style={styles.videoPill}>
                          <Text style={styles.videoPillText}>Video</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.guideActionsRow}>
                      <Pressable
                        onPress={() => onOpenCall(guide)}
                        android_ripple={{ color: "rgba(255,255,255,0.18)" }}
                        style={({ pressed }) => [styles.guideCallButton, pressed && styles.pressedAction]}
                      >
                        <Ionicons name="call" size={16} color={colors.white} />
                        <Text style={styles.guideCallButtonText}>Call</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => onOpenGuide(guide)}
                        android_ripple={{ color: "rgba(31,23,17,0.06)" }}
                        style={({ pressed }) => [styles.guideChatButton, pressed && styles.pressedAction]}
                      >
                        <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.gray900} />
                        <Text style={styles.guideChatButtonText}>Chat</Text>
                      </Pressable>

                      {canGuideUseVideo(guide) ? (
                        <Pressable
                          onPress={() => onOpenVideoCall(guide, DEFAULT_LIVE_PUJA_RITUAL_ID)}
                          android_ripple={{ color: "rgba(31,23,17,0.06)" }}
                          style={({ pressed }) => [styles.guideChatButton, pressed && styles.pressedAction]}
                        >
                          <Ionicons name="videocam-outline" size={16} color={colors.gray900} />
                          <Text style={styles.guideChatButtonText}>Live Puja</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </Pressable>
                ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.utilityStrip}>
        {utilityShortcuts.map((shortcut) => (
          <Pressable
            key={shortcut.key}
            onPress={shortcut.onPress}
            android_ripple={{ color: "rgba(31,23,17,0.04)" }}
            style={({ pressed }) => [styles.utilityPill, pressed && styles.pressedAction]}
          >
            <Ionicons name={shortcut.icon} size={17} color={colors.gray700} />
            <Text style={styles.utilityPillText}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.trustCard}>
        <Text style={styles.trustTitle}>Quiet continuity for your family</Text>
        <Text style={styles.trustText}>
          Live multilingual guidance, family access across countries, and a calmer spiritual thread that stays with you through the day.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 18, gap: 18, paddingBottom: 28 },
  heroCard: {
    minHeight: 432,
    borderRadius: 34,
    overflow: "hidden",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#2B1E17",
  },
  heroImage: {
    borderRadius: 34,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGlow: {
    position: "absolute",
    top: -16,
    right: -28,
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: "rgba(244,210,142,0.16)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 12,
  },
  heroChip: {
    borderRadius: 999,
    backgroundColor: "rgba(19,15,13,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroChipText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  heroChipMuted: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  heroChipMutedText: {
    color: "rgba(255,255,255,0.88)",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  heroContent: {
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 20,
    gap: 12,
  },
  heroEyebrow: {
    color: "#F1D6A2",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 37,
    lineHeight: 43,
  },
  heroBody: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 310,
  },
  heroActions: {
    gap: 10,
    marginTop: 4,
  },
  heroPrimaryAction: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.divineSaffron,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },
  heroPrimaryActionText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  heroSecondaryRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  heroSecondaryAction: {
    minWidth: 120,
    height: 44,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: "rgba(19,15,13,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  heroSecondaryActionText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  heroFooter: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: "rgba(19,15,13,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  heroMetricCard: {
    flex: 1,
    gap: 4,
  },
  heroMetricLabel: {
    color: "rgba(255,255,255,0.68)",
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroMetricValue: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 21,
  },
  heroMetricDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  sectionHeader: { gap: 4, paddingHorizontal: 2 },
  sectionTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 25,
  },
  sectionSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 330,
  },
  ritualPickerCard: {
    borderRadius: 26,
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#E7CCA0",
    padding: 16,
    gap: 14,
  },
  ritualPickerHeader: {
    gap: 4,
  },
  ritualPickerEyebrow: {
    color: colors.divineSaffron,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  ritualPickerTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 23,
  },
  ritualGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ritualChip: {
    width: "48%",
    minHeight: 112,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.1)",
    padding: 13,
    gap: 6,
  },
  ritualChipTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  ritualChipText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  intentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  intentCardWrap: {
    width: "48%",
  },
  intentCard: {
    minHeight: 156,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.08)",
    gap: 12,
  },
  intentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  intentTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
  },
  intentDescription: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  continueCard: {
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: "hidden",
  },
  continueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(221,204,183,0.7)",
  },
  continueIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F8F0E3",
    alignItems: "center",
    justifyContent: "center",
  },
  continueCopy: {
    flex: 1,
    gap: 3,
  },
  continueTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  continueText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  guideSection: { gap: 12 },
  featureGuideCard: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#E7CCA0",
  },
  featureGuidePortrait: {
    width: "100%",
    height: 196,
    backgroundColor: colors.gray100,
  },
  featureGuideCopy: {
    padding: 18,
    gap: 6,
  },
  featureGuideEyebrow: {
    color: colors.divineSaffron,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featureGuideTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  featureGuideSubtitle: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  featureGuideActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  featureGuidePrimaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.purple900,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  featureGuidePrimaryText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  featureGuideSecondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F8F0E3",
    borderWidth: 1,
    borderColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  featureGuideSecondaryText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  guidesColumn: { gap: 12 },
  guideCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.08)",
  },
  guideTopRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  guidePortrait: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gray100,
  },
  guideCopy: { flex: 1, gap: 4 },
  guideTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
  guideSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  videoPill: {
    borderRadius: 999,
    backgroundColor: "#F3E6D1",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  videoPillText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  guideActionsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  guideCallButton: {
    minWidth: 92,
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.purple900,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  guideCallButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  guideChatButton: {
    minWidth: 92,
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F8F0E3",
    borderWidth: 1,
    borderColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  guideChatButtonText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  emptyText: {
    color: colors.gray400,
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: "center",
  },
  utilityStrip: {
    flexDirection: "row",
    gap: 10,
  },
  utilityPill: {
    flex: 1,
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: "#F5EEE2",
    borderWidth: 1,
    borderColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  utilityPillText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  trustCard: {
    borderRadius: 24,
    backgroundColor: "#F5EEE2",
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 18,
    gap: 6,
  },
  trustTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
  trustText: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  pressedAction: {
    opacity: 0.92,
  },
});

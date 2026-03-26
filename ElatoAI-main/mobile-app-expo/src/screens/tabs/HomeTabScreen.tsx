import { useRef } from "react";
import {
  Animated,
  Image,
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
  filterHomeGuides,
  getGuideDisplaySubtitle,
  getGuideImageAsset,
  getGuideShortTitle,
} from "../../lib/smartMurtiApi";
import { gradients, colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface HomeTabScreenProps {
  userName: string;
  dbUser: DbUser | null;
  personalities: Personality[];
  onOpenGuide: (personality: Personality) => void;
  onOpenCall: (personality: Personality) => void;
  onOpenVideoCall: (personality: Personality) => void;
  onOpenHoroscope: () => void;
  onOpenBhajan: () => void;
  onOpenWallet: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const shortcutItems = [
  {
    key: "horoscope",
    label: "Horoscope",
    icon: "sparkles-outline" as const,
    colors: ["#FEF3C7", "#FFF7ED"] as const,
  },
  {
    key: "bhajan",
    label: "Bhajans",
    icon: "musical-notes-outline" as const,
    colors: ["#EDE9FE", "#F5F3FF"] as const,
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: "wallet-outline" as const,
    colors: ["#DBEAFE", "#EFF6FF"] as const,
  },
];

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
    homeGuides.find((guide) => guide.title.toLowerCase().trim() === "pandit ji") ||
    homeGuides.find((guide) => guide.title.toLowerCase().includes("pandit"));
  const currentGuide =
    panditGuide ||
    homeGuides.find((guide) => guide.personality_id === dbUser?.personality_id) ||
    homeGuides[0] ||
    personalities[0];
  const featuredGuideName = currentGuide ? getGuideShortTitle(currentGuide) : "Pandit Ji";
  const currentGuideSupportsVideo = currentGuide ? canGuideUseVideo(currentGuide) : false;

  // Animated shortcut press
  const shortcutAnims = useRef(shortcutItems.map(() => new Animated.Value(1))).current;

  const handleShortcutPress = (key: string) => {
    if (key === "horoscope") {
      onOpenHoroscope();
      return;
    }

    if (key === "bhajan") {
      onOpenBhajan();
      return;
    }

    onOpenWallet();
  };

  const animateIn = (index: number) => {
    Animated.spring(shortcutAnims[index], { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };
  const animateOut = (index: number) => {
    Animated.spring(shortcutAnims[index], { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
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
      <LinearGradient colors={gradients.homeHero} style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>Smart Murti</Text>
          <Text style={styles.heroTitle}>Namaste, {userName.split(" ")[0] || "Devotee"}</Text>
          <View style={styles.featuredGuideChip}>
            <Ionicons name="sparkles" size={14} color="#FDE68A" />
            <Text style={styles.featuredGuideChipText}>{featuredGuideName}</Text>
          </View>
          <Text style={styles.heroBody}>
            Your Pandit, astrologer, horoscope, bhajans, and wallet are all available in one place now.
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaCard}>
              <Text style={styles.heroMetaLabel}>Wallet</Text>
              <Text style={styles.heroMetaValue}>
                Rs. {Number(dbUser?.wallet_balance ?? 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.heroMetaCard}>
              <Text style={styles.heroMetaLabel}>Plan</Text>
              <Text style={styles.heroMetaValue}>{dbUser?.is_premium ? "Premium" : "Free"}</Text>
            </View>
          </View>

          <View style={styles.heroActionsRow}>
            <Pressable
              onPress={() => currentGuide && onOpenCall(currentGuide)}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
              style={({ pressed }) => [styles.primaryAction, pressed && styles.pressedAction]}
            >
              <Ionicons name="call" size={18} color={colors.white} />
              <Text style={styles.primaryActionText}>Live Call</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (currentGuide) {
                  onOpenGuide(currentGuide);
                }
              }}
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressedAction]}
            >
              <Text style={styles.secondaryActionText}>Open Chat</Text>
            </Pressable>
            {currentGuideSupportsVideo ? (
              <Pressable
                onPress={() => currentGuide && onOpenVideoCall(currentGuide)}
                android_ripple={{ color: "rgba(255,255,255,0.15)" }}
                style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressedAction]}
              >
                <Text style={styles.secondaryActionText}>Video Puja</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <Image
          source={require("../../../assets/branding/smart-pandit-home.jpg")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <Text style={styles.sectionSubtitle}>Jump straight into your daily practice</Text>
      </View>

      <View style={styles.shortcutsRow}>
        {shortcutItems.map((item, index) => (
          <Animated.View key={item.key} style={[styles.shortcutCard, { transform: [{ scale: shortcutAnims[index] }] }]}>
            <Pressable
              onPress={() => handleShortcutPress(item.key)}
              onPressIn={() => animateIn(index)}
              onPressOut={() => animateOut(index)}
              android_ripple={{ color: "rgba(0,0,0,0.08)" }}
            >
              <LinearGradient colors={item.colors} style={styles.shortcutGradient}>
                <View style={styles.shortcutIconWrap}>
                  <Ionicons name={item.icon} size={24} color={colors.gray900} />
                </View>
                <Text style={styles.shortcutLabel}>{item.label}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Talk To Your Guides</Text>
        <Text style={styles.sectionSubtitle}>The same core guides featured on your website home page</Text>
      </View>

      <View style={styles.guideSection}>
        {homeGuides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={40} color={colors.gray400} />
            <Text style={styles.emptyTitle}>No guides available</Text>
            <Text style={styles.emptyText}>Pull down to refresh, or check back later.</Text>
          </View>
        ) : (
          <View style={styles.guidesColumn}>
            {homeGuides.map((guide, index) => (
              <Pressable
                key={guide.personality_id}
                onPress={() => onOpenGuide(guide)}
                android_ripple={{ color: "rgba(0,0,0,0.04)" }}
                style={({ pressed }) => [
                  styles.guideCard,
                  index === 0 && styles.featuredGuideCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.guideTopRow}>
                  <Image source={{ uri: getGuideImageAsset(guide) }} style={styles.guidePortrait} />
                  <View style={styles.guideCopy}>
                    <Text style={styles.guideTitle}>{guide.title}</Text>
                    <Text style={styles.guideSubtitle}>
                      {getGuideDisplaySubtitle(guide) || "Spiritual guidance"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
                </View>

                <View style={styles.guideActionsRow}>
                  <Pressable
                    onPress={() => onOpenCall(guide)}
                    android_ripple={{ color: "rgba(255,255,255,0.2)" }}
                    style={({ pressed }) => [styles.guideCallButton, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="call" size={16} color={colors.white} />
                    <Text style={styles.guideCallButtonText}>Call</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onOpenGuide(guide)}
                    android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                    style={({ pressed }) => [styles.guideChatButton, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.gray900} />
                    <Text style={styles.guideChatButtonText}>Chat</Text>
                  </Pressable>
                  {canGuideUseVideo(guide) ? (
                    <Pressable
                      onPress={() => onOpenVideoCall(guide)}
                      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                      style={({ pressed }) => [styles.guideChatButton, pressed && { opacity: 0.85 }]}
                    >
                      <Ionicons name="videocam-outline" size={16} color={colors.gray900} />
                      <Text style={styles.guideChatButtonText}>Video</Text>
                    </Pressable>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.valueCard}>
        <View style={styles.valueIconWrap}>
          <Ionicons name="logo-whatsapp" size={22} color="#22C55E" />
        </View>
        <View style={styles.valueCopy}>
          <Text style={styles.valueTitle}>Daily devotional flow</Text>
          <Text style={styles.valueText}>
            Use horoscope for the day, play bhajans in the background, and chat with your Pandit without leaving the app.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 18,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 30,
    overflow: "hidden",
  },
  heroCopy: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  heroEyebrow: {
    color: "#6EE7B7",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 40,
  },
  heroBody: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  featuredGuideChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  featuredGuideChipText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  heroActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  heroMetaCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  heroMetaLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  heroMetaValue: {
    marginTop: 5,
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  heroImage: {
    width: "100%",
    height: 230,
    marginTop: 14,
  },
  primaryAction: {
    minWidth: 100,
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pressedAction: {
    opacity: 0.85,
  },
  primaryActionText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  secondaryAction: {
    minWidth: 100,
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  sectionSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  shortcutsRow: {
    flexDirection: "row",
    gap: 10,
  },
  shortcutCard: {
    flex: 1,
  },
  shortcutGradient: {
    borderRadius: 22,
    padding: 14,
    minHeight: 110,
    justifyContent: "space-between",
  },
  shortcutIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  guidesColumn: {
    gap: 10,
  },
  guideSection: {
    gap: 10,
  },
  guideCard: {
    borderRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  featuredGuideCard: {
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  guideTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  guidePortrait: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.gray100,
  },
  guideCopy: {
    flex: 1,
    gap: 4,
  },
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
  guideActionsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  guideCallButton: {
    minWidth: 92,
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#16A34A",
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
    backgroundColor: colors.gray50,
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
  valueCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 18,
  },
  valueIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  valueCopy: {
    flex: 1,
    gap: 6,
  },
  valueTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
  valueText: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});

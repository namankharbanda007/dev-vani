import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

export type AppTab = "home" | "horoscope" | "bhajan" | "wallet" | "profile";

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}

const tabs: {
  key: AppTab;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  activeIcon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
  { key: "horoscope", label: "Horoscope", icon: "sparkles-outline", activeIcon: "sparkles" },
  { key: "bhajan", label: "Bhajans", icon: "musical-notes-outline", activeIcon: "musical-notes" },
  { key: "wallet", label: "Wallet", icon: "wallet-outline", activeIcon: "wallet" },
  { key: "profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
];

function TabButton({
  tab,
  active,
  onPress,
}: {
  tab: (typeof tabs)[number];
  active: boolean;
  onPress: () => void;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [active, activeAnim]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.92,
      useNativeDriver: true,
      tension: 260,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 260,
      friction: 10,
    }).start();
  };

  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const iconTranslateY = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  const labelOpacity = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tab}
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ scale: pressScale }],
          },
        ]}
      >
        {active ? <View style={styles.activeIndicator} /> : null}
        <Animated.View style={{ transform: [{ scale: iconScale }, { translateY: iconTranslateY }] }}>
          <Ionicons
            name={active ? tab.activeIcon : tab.icon}
            size={22}
            color={active ? colors.purple900 : colors.gray400}
          />
        </Animated.View>
        <Animated.Text
          style={[
            styles.tabLabel,
            active && styles.tabLabelActive,
            {
              opacity: labelOpacity,
            },
          ]}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export function BottomTabBar({ activeTab, onSelect }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom:
            Platform.OS === "ios"
              ? Math.max(insets.bottom, 10)
              : Math.max(insets.bottom, 6),
        },
      ]}
    >
      <View pointerEvents="none" style={styles.topGlow} />
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          tab={tab}
          active={activeTab === tab.key}
          onPress={() => onSelect(tab.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 251, 245, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(106, 74, 44, 0.12)",
    paddingTop: 9,
    paddingHorizontal: 8,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    position: "relative",
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    position: "relative",
    minHeight: 52,
    minWidth: 56,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  activeIndicator: {
    position: "absolute",
    top: -7,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.divineSaffron,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.gray500,
    marginTop: 2,
    letterSpacing: 0.15,
  },
  tabLabelActive: {
    color: colors.purple900,
    fontFamily: fonts.bodyBold,
  },
});

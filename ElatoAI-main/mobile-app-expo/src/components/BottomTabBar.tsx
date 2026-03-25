import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

export type AppTab = "home" | "horoscope" | "bhajan" | "wallet" | "profile";

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}

const tabs: { key: AppTab; label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; activeIcon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(iconAnim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [active, iconAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const iconScale = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const translateY = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
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
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {active && <View style={styles.activeIndicator} />}
        <Animated.View style={{ transform: [{ scale: iconScale }, { translateY }] }}>
          <Ionicons
            name={active ? tab.activeIcon : tab.icon}
            size={22}
            color={active ? colors.purple900 : colors.gray400}
          />
        </Animated.View>
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
          {tab.label}
        </Text>
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
              ? Math.max(insets.bottom, 20)
              : Math.max(insets.bottom, 12),
        },
      ]}
    >
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 8,
    paddingHorizontal: 4,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
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
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.purple900,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.gray400,
    marginTop: 1,
  },
  tabLabelActive: {
    color: colors.purple900,
    fontFamily: fonts.bodyBold,
  },
});

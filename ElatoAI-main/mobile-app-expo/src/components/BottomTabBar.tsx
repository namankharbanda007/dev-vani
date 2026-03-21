import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

export type AppTab = "home" | "horoscope" | "bhajan" | "wallet" | "profile";

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}

const items: { key: AppTab; label: string; renderIcon: (active: boolean) => React.ReactNode }[] = [
  {
    key: "home",
    label: "Home",
    renderIcon: (active) => (
      <Ionicons name={active ? "home" : "home-outline"} size={22} color={active ? colors.white : colors.gray500} />
    ),
  },
  {
    key: "horoscope",
    label: "Stars",
    renderIcon: (active) => (
      <Ionicons name={active ? "sparkles" : "sparkles-outline"} size={22} color={active ? colors.white : colors.gray500} />
    ),
  },
  {
    key: "bhajan",
    label: "Bhajans",
    renderIcon: (active) => (
      <MaterialCommunityIcons name={active ? "music-circle" : "music-circle-outline"} size={24} color={active ? colors.white : colors.gray500} />
    ),
  },
  {
    key: "wallet",
    label: "Wallet",
    renderIcon: (active) => (
      <Ionicons name={active ? "wallet" : "wallet-outline"} size={22} color={active ? colors.white : colors.gray500} />
    ),
  },
  {
    key: "profile",
    label: "Profile",
    renderIcon: (active) => (
      <Ionicons name={active ? "person" : "person-outline"} size={22} color={active ? colors.white : colors.gray500} />
    ),
  },
];

export function BottomTabBar({ activeTab, onSelect }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = item.key === activeTab;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={[styles.item, active && styles.activeItem]}
          >
            {item.renderIcon(active)}
            <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 14,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeItem: {
    backgroundColor: colors.gray900,
  },
  label: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  activeLabel: {
    color: colors.white,
  },
});

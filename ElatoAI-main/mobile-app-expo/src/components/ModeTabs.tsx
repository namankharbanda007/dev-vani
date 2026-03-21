import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface ModeTabsProps {
  mode: "login" | "signup";
  onChange: (mode: "login" | "signup") => void;
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <View style={styles.container}>
      {(["login", "signup"] as const).map((item) => {
        const active = mode === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {item === "login" ? "Login" : "Sign Up"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(243,244,246,0.95)",
    borderRadius: 18,
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  text: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.gray500,
  },
  activeText: {
    color: colors.purple700,
  },
});

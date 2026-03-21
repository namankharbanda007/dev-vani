import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients } from "../theme/colors";
import { fonts } from "../theme/typography";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "login" | "signup" | "neutral";
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "login",
  style,
}: PrimaryButtonProps) {
  const gradientColors =
    variant === "signup"
      ? gradients.signup
      : variant === "neutral"
        ? ([colors.gray900, colors.murtiStone] as const)
        : gradients.login;

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={style}>
      <LinearGradient colors={gradientColors} style={[styles.button, disabled && styles.disabled]}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  disabled: {
    opacity: 0.75,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
});

import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface MessageBannerProps {
  tone: "error" | "success";
  text: string;
}

export function MessageBanner({ tone, text }: MessageBannerProps) {
  const isError = tone === "error";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isError ? colors.errorBg : colors.successBg,
          borderColor: isError ? colors.errorBorder : colors.successBorder,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isError ? colors.errorText : colors.successText },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 19,
  },
});

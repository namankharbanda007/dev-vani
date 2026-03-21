import { StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../components/BrandMark";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface ConfigErrorScreenProps {
  message: string;
}

export function ConfigErrorScreen({ message }: ConfigErrorScreenProps) {
  return (
    <View style={styles.container}>
      <BrandMark />
      <Text style={styles.title}>Supabase Setup Needed</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.footer}>
        Add your real project URL and anon key in mobile-app-expo/.env, then restart Expo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: colors.softPaper,
  },
  title: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 28,
    textAlign: "center",
  },
  message: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
  footer: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});

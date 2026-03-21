import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../components/BrandMark";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <BrandMark />
      <Text style={styles.title}>SMART मूर्ति</Text>
      <ActivityIndicator size="small" color={colors.divineSaffron} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontFamily: fonts.brand,
    fontSize: 28,
    color: colors.purple900,
    letterSpacing: 1,
  },
});

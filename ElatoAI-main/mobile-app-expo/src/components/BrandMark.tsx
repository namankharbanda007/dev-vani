import { Image, StyleSheet, View } from "react-native";

export function BrandMark() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/branding/smart-murti-logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 84,
    height: 84,
  },
});

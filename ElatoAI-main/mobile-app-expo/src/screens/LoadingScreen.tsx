import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BrandMark } from "../components/BrandMark";
import { colors, gradients } from "../theme/colors";
import { fonts } from "../theme/typography";

type LoadingScreenProps = {
  title?: string;
  subtitle?: string;
};

export function LoadingScreen({
  title = "SMART मूर्ति",
  subtitle = "Preparing your Smart Pandit experience...",
}: LoadingScreenProps) {
  const logoFloat = useRef(new Animated.Value(0)).current;
  const haloPulse = useRef(new Animated.Value(0)).current;
  const dotPhase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(haloPulse, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(haloPulse, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const dotLoop = Animated.loop(
      Animated.timing(dotPhase, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    floatLoop.start();
    haloLoop.start();
    dotLoop.start();

    return () => {
      floatLoop.stop();
      haloLoop.stop();
      dotLoop.stop();
    };
  }, [dotPhase, haloPulse, logoFloat]);

  const logoTranslateY = logoFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const logoScale = haloPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const haloScale = haloPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.14],
  });
  const haloOpacity = haloPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.14, 0.28],
  });

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <LinearGradient colors={gradients.page} style={styles.container}>
      <View style={styles.backdrop}>
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />
      </View>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.halo,
            {
              opacity: haloOpacity,
              transform: [{ scale: haloScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.logoWrap,
            {
              transform: [{ translateY: logoTranslateY }, { scale: logoScale }],
            },
          ]}
        >
          <BrandMark />
        </Animated.View>

        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.dotRow}>
          {dots.map((dot) => {
            const opacity = dotPhase.interpolate({
              inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
              outputRange:
                dot === 0
                  ? [0.3, 1, 0.45, 0.3, 0.3, 0.3]
                  : dot === 1
                    ? [0.3, 0.45, 1, 0.45, 0.3, 0.3]
                    : [0.3, 0.3, 0.45, 1, 0.45, 0.3],
            });
            const translateY = dotPhase.interpolate({
              inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
              outputRange:
                dot === 0
                  ? [0, -3, 0, 0, 0, 0]
                  : dot === 1
                    ? [0, 0, -3, 0, 0, 0]
                    : [0, 0, 0, -3, 0, 0],
            });

            return (
              <Animated.View
                key={dot}
                style={[
                  styles.dot,
                  {
                    opacity,
                    transform: [{ translateY }],
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Live guidance. Family-ready. Multilingual.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  orbTop: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(200,107,31,0.12)",
  },
  orbBottom: {
    position: "absolute",
    bottom: -120,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(81,42,115,0.12)",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 18,
  },
  halo: {
    position: "absolute",
    top: 8,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.divineSaffron,
  },
  logoWrap: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.08)",
    shadowColor: "#4C1D95",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  copy: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: colors.gray900,
    fontFamily: fonts.brand,
    fontSize: 32,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 280,
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.divineSaffron,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(106,74,44,0.08)",
  },
  badgeText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textAlign: "center",
  },
});

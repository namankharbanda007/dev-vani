import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import { Personality } from "../models/types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface PanditVideoScreenProps {
  personality: Personality;
  onClose: () => void;
}

export function PanditVideoScreen({ personality, onClose }: PanditVideoScreenProps) {
  const webViewRef = useRef<WebViewType>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [screenKey, setScreenKey] = useState(0);

  const roomUrl = useMemo(() => "https://www.smartmurti.com/pandit", []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [screenKey]);

  const handleBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return;
    }

    onClose();
  };

  const handleRestartAsHost = () => {
    setLoading(true);
    setCanGoBack(false);
    setScreenKey((current) => current + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </Pressable>

        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Live Video Call</Text>
          <Text style={styles.headerSubtitle}>{personality.title}</Text>
        </View>

        <Pressable onPress={handleRestartAsHost} style={styles.iconButton}>
          <Ionicons name="reload" size={20} color={colors.gray900} />
        </Pressable>
      </View>

      <View style={styles.noticeCard}>
        <Ionicons name="videocam" size={18} color={colors.purple900} />
        <Text style={styles.noticeText}>
          This opens the same Smart Murti live video ashram flow used on the website `/pandit`
          page.
        </Text>
      </View>

      <View style={styles.webViewWrap}>
        <WebView
          key={screenKey}
          ref={webViewRef}
          source={{ uri: roomUrl }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo
          mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
          setSupportMultipleWindows={false}
          cacheEnabled={false}
          originWhitelist={["*"]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress > 0.35) {
              setLoading(false);
            }
          }}
          onNavigationStateChange={(state) => {
            setCanGoBack(state.canGoBack);
            if (state.url.includes("/pandit")) {
              setLoading(false);
            }
          }}
        />

        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.purple900} />
            <Text style={styles.loadingText}>Opening the live puja room...</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.softPaper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  headerSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noticeText: {
    flex: 1,
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  webViewWrap: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(253,251,247,0.92)",
  },
  loadingText: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});

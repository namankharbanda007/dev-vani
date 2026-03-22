import { useEffect, useRef, useState } from "react";
import {
  AppState,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { bhajans } from "../../data/bhajans";
import { BhajanTrack } from "../../models/types";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { getRemoteAsset } from "../../lib/smartMurtiApi";

async function configureAudioMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DuckOthers,
    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: true,
  });
}

interface BhajanPlayerState {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  activeTrackId: string | null;
  setActiveTrackId: (id: string | null) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

interface BhajanTabScreenProps {
  playerState: BhajanPlayerState;
}

export function BhajanTabScreen({ playerState }: BhajanTabScreenProps) {
  const { soundRef, activeTrackId, setActiveTrackId, playing, setPlaying } = playerState;
  const [error, setError] = useState<string | null>(null);

  // Track-level animations
  const scaleAnims = useRef(bhajans.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    configureAudioMode().catch(() => null);
  }, []);

  const animatePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const animatePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const startTrack = async (track: BhajanTrack) => {
    try {
      if (AppState.currentState !== "active") {
        throw new Error("Bring the app to the foreground before starting bhajan playback.");
      }

      setError(null);
      await configureAudioMode();

      if (soundRef.current) {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.src },
        {
          shouldPlay: true,
          progressUpdateIntervalMillis: 250,
        },
        undefined,
        false
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          return;
        }

        setPlaying(status.isPlaying);

        if (status.didJustFinish) {
          setPlaying(false);
          setActiveTrackId(null);
        }
      });

      soundRef.current = sound;
      setActiveTrackId(track.id);
      setPlaying(true);
    } catch (nextError) {
      setPlaying(false);
      setActiveTrackId(null);
      setError(nextError instanceof Error ? nextError.message : "Could not play this bhajan.");
    }
  };

  const toggleTrack = async (track: BhajanTrack) => {
    if (activeTrackId !== track.id) {
      await startTrack(track);
      return;
    }

    try {
      if (!soundRef.current) {
        await startTrack(track);
        return;
      }

      await configureAudioMode();
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        await startTrack(track);
        return;
      }

      if (status.isPlaying) {
        await soundRef.current.setStatusAsync({ shouldPlay: false });
        setPlaying(false);
      } else {
        await soundRef.current.setStatusAsync({ shouldPlay: true });
        setPlaying(true);
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Playback failed.");
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: getRemoteAsset("/assets/landing-2/Whisk_735a8a55d307434b6e1488437477c36beg.webp") }}
        style={styles.heroCard}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />
        <Text style={styles.heroEyebrow}>Daily Ashram</Text>
        <Text style={styles.heroTitle}>Bhajan and mantra library</Text>
        <Text style={styles.heroText}>
          Play devotional music directly inside the app - music continues even while you switch tabs.
        </Text>
      </ImageBackground>

      {/* Now-playing mini bar */}
      {activeTrackId ? (
        <Pressable
          onPress={() => {
            const activeTrack = bhajans.find((track) => track.id === activeTrackId);
            if (activeTrack) {
              void toggleTrack(activeTrack);
            }
          }}
          android_ripple={{ color: "rgba(252, 211, 77, 0.25)" }}
          style={styles.miniPlayer}
        >
          <View style={styles.miniPlayerDot} />
          <Text style={styles.miniPlayerText} numberOfLines={1}>
            {bhajans.find((t) => t.id === activeTrackId)?.title || "Playing"} - {playing ? "Playing" : "Paused"}
          </Text>
          <Ionicons
            name={playing ? "pause-circle" : "play-circle"}
            size={24}
            color={colors.gray900}
          />
        </Pressable>
      ) : null}

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.listCard}>
        {bhajans.map((track, index) => {
          const active = activeTrackId === track.id;
          return (
            <Animated.View key={track.id} style={{ transform: [{ scale: scaleAnims[index] }] }}>
              <Pressable
                onPress={() => toggleTrack(track)}
                onPressIn={() => animatePressIn(index)}
                onPressOut={() => animatePressOut(index)}
                android_ripple={{ color: "rgba(252, 211, 77, 0.3)" }}
                style={[styles.trackRow, active && styles.trackRowActive]}
              >
                <View style={[styles.trackIcon, active && styles.trackIconActive]}>
                  <Ionicons name={active && playing ? "pause" : "play"} size={20} color={active ? colors.white : colors.gray900} />
                </View>

                <View style={styles.trackCopy}>
                  <Text style={[styles.trackTitle, active && styles.trackTitleActive]}>{track.title}</Text>
                  <Text style={styles.trackMeta}>
                    {track.artist} • {track.duration}
                  </Text>
                </View>

                {active ? (
                  <View style={styles.nowPlayingBadge}>
                    <Text style={styles.nowPlayingText}>{playing ? "Playing" : "Paused"}</Text>
                  </View>
                ) : null}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 18,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    gap: 8,
    minHeight: 220,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.58)",
  },
  heroEyebrow: {
    color: "#FCD34D",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 29,
    lineHeight: 37,
  },
  heroText: {
    color: "rgba(255,255,255,0.84)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  miniPlayer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  miniPlayerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
  },
  miniPlayerText: {
    flex: 1,
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  errorCard: {
    borderRadius: 20,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 16,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
  listCard: {
    borderRadius: 28,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  trackRowActive: {
    backgroundColor: "#FEF3C7",
  },
  trackIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray50,
    alignItems: "center",
    justifyContent: "center",
  },
  trackIconActive: {
    backgroundColor: colors.gray900,
  },
  trackCopy: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  trackTitleActive: {
    color: colors.gray900,
  },
  trackMeta: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  nowPlayingBadge: {
    borderRadius: 12,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nowPlayingText: {
    color: "#16A34A",
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
});

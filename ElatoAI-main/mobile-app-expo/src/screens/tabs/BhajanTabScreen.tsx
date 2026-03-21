import { useEffect, useRef, useState } from "react";
import { AppState, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

export function BhajanTabScreen() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    configureAudioMode().catch(() => null);

    return () => {
      soundRef.current?.unloadAsync().catch(() => null);
    };
  }, []);

  const startTrack = async (track: BhajanTrack) => {
    try {
      if (AppState.currentState !== "active") {
        throw new Error("Bring the app to the foreground before starting bhajan playback.");
      }

      setError(null);
      await configureAudioMode();

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: track.src }, { shouldPlay: false }, undefined, false);

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
      await sound.playAsync();
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
        await soundRef.current.pauseAsync();
        setPlaying(false);
      } else {
        await soundRef.current.playAsync();
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
          Play devotional music directly inside the app while you read your horoscope or chat with your guide.
        </Text>
      </ImageBackground>

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.listCard}>
        {bhajans.map((track) => {
          const active = activeTrackId === track.id;
          return (
            <Pressable key={track.id} onPress={() => toggleTrack(track)} style={[styles.trackRow, active && styles.trackRowActive]}>
              <View style={[styles.trackIcon, active && styles.trackIconActive]}>
                <Ionicons name={active && playing ? "pause" : "play"} size={20} color={active ? colors.white : colors.gray900} />
              </View>

              <View style={styles.trackCopy}>
                <Text style={[styles.trackTitle, active && styles.trackTitleActive]}>{track.title}</Text>
                <Text style={styles.trackMeta}>
                  {track.artist} • {track.duration}
                </Text>
              </View>

              {active ? <Text style={styles.nowPlaying}>{playing ? "Playing" : "Paused"}</Text> : null}
            </Pressable>
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
  nowPlaying: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
});

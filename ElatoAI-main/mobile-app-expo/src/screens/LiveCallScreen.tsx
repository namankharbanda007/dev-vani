import { Buffer } from "buffer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  bypassVoiceProcessing,
  initialize,
  playPCMData,
  requestMicrophonePermissionsAsync,
  tearDown,
  toggleRecording,
  useExpoTwoWayAudioEventListener,
} from "@speechmatics/expo-two-way-audio";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGeminiLiveSession, type GeminiLiveSession } from "../lib/geminiLive";
import { getGuideDisplaySubtitle, getGuideImageAsset, getGuideSessionConfig } from "../lib/smartMurtiApi";
import { Personality } from "../models/types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface LiveCallScreenProps {
  personality: Personality;
  languageCode?: string | null;
  onClose: () => void;
}

function downsamplePcm16(inputBytes: Uint8Array, inputRate: number, outputRate: number) {
  if (inputRate === outputRate) {
    return inputBytes;
  }

  const inputSamples = new Int16Array(
    inputBytes.buffer,
    inputBytes.byteOffset,
    Math.floor(inputBytes.byteLength / 2)
  );
  const outputLength = Math.max(1, Math.round((inputSamples.length * outputRate) / inputRate));
  const outputSamples = new Int16Array(outputLength);

  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = (index * inputRate) / outputRate;
    const leftIndex = Math.floor(sourcePosition);
    const rightIndex = Math.min(leftIndex + 1, inputSamples.length - 1);
    const blend = sourcePosition - leftIndex;
    const left = inputSamples[leftIndex] || 0;
    const right = inputSamples[rightIndex] || left;
    outputSamples[index] = Math.round(left + (right - left) * blend);
  }

  return new Uint8Array(outputSamples.buffer);
}

function clampLevel(level: number) {
  return Math.max(0.04, Math.min(1, level));
}

export function LiveCallScreen({
  personality,
  onClose,
}: LiveCallScreenProps) {
  const [callStarted, setCallStarted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [statusText, setStatusText] = useState("Tap start to begin");
  const [error, setError] = useState<string | null>(null);
  const [inputLevel, setInputLevel] = useState(0.08);
  const [outputLevel, setOutputLevel] = useState(0.08);
  const liveSessionRef = useRef<GeminiLiveSession | null>(null);
  const callStartedRef = useRef(false);
  const mutedRef = useRef(false);
  const speakingRef = useRef(false);
  const mountedRef = useRef(true);

  const guideDescription = useMemo(
    () =>
      getGuideDisplaySubtitle(personality) ||
      "A direct Gemini Live voice call with your Smart Murti guide.",
    [personality]
  );

  const updateStatus = useCallback((nextStatus: string) => {
    if (mountedRef.current) {
      setStatusText(nextStatus);
    }
  }, []);

  const stopNativeAudio = useCallback(() => {
    try {
      toggleRecording(false);
    } catch {}

    try {
      tearDown();
    } catch {}

    speakingRef.current = false;
    if (mountedRef.current) {
      setInputLevel(0.08);
      setOutputLevel(0.08);
    }
  }, []);

  useExpoTwoWayAudioEventListener(
    "onMicrophoneData",
    useCallback((event) => {
      const session = liveSessionRef.current;
      if (!session || !callStartedRef.current || mutedRef.current || !event.data?.length) {
        return;
      }

      session.sendAudioChunk(Buffer.from(event.data).toString("base64"), 16000);
    }, [])
  );

  useExpoTwoWayAudioEventListener(
    "onInputVolumeLevelData",
    useCallback((event) => {
      if (!mountedRef.current) {
        return;
      }

      setInputLevel(clampLevel(Number(event.data) || 0));
      if (callStartedRef.current && !mutedRef.current && !speakingRef.current) {
        setStatusText("Listening...");
      }
    }, [])
  );

  useExpoTwoWayAudioEventListener(
    "onOutputVolumeLevelData",
    useCallback((event) => {
      if (!mountedRef.current) {
        return;
      }

      const level = clampLevel(Number(event.data) || 0);
      setOutputLevel(level);

      if (level > 0.06) {
        speakingRef.current = true;
        setStatusText("Guide is speaking...");
      } else if (callStartedRef.current && !mutedRef.current) {
        speakingRef.current = false;
      }
    }, [])
  );

  useExpoTwoWayAudioEventListener(
    "onAudioInterruption",
    useCallback((event) => {
      setError(`Audio was interrupted: ${event.data}`);
    }, [])
  );

  const handleStartCall = useCallback(async () => {
    try {
      setError(null);
      setConnecting(true);
      updateStatus("Connecting to your guide...");

      const permission = await requestMicrophonePermissionsAsync();
      if (!permission.granted) {
        throw new Error("Microphone permission is required for live calls.");
      }

      await initialize();
      bypassVoiceProcessing(false);

      const guideSession = await getGuideSessionConfig(personality.personality_id);
      const session = await createGeminiLiveSession({
        systemInstruction: guideSession.systemInstruction,
        voiceName: guideSession.voiceName,
        callbacks: {
          onReady: () => {
            updateStatus("Call connected");
          },
          onAudioChunk: (base64Chunk) => {
            const pcm24k = new Uint8Array(Buffer.from(base64Chunk, "base64"));
            const pcm16k = downsamplePcm16(pcm24k, 24000, 16000);
            playPCMData(pcm16k);
          },
          onInterrupted: () => {
            speakingRef.current = false;
            updateStatus(mutedRef.current ? "Muted" : "Listening...");
          },
          onTurnComplete: () => {
            speakingRef.current = false;
            updateStatus(mutedRef.current ? "Muted" : "Listening...");
          },
          onError: (message) => {
            setError(message);
          },
          onClose: () => {
            if (mountedRef.current && callStartedRef.current) {
              setError("Live call ended unexpectedly.");
            }
          },
        },
      });

      liveSessionRef.current = session;
      callStartedRef.current = true;
      mutedRef.current = false;
      setMuted(false);
      setCallStarted(true);
      updateStatus("Guide is joining...");

      toggleRecording(true);
      session.sendTextTurn(
        guideSession.openingLine ||
          "Begin this call with a short devotional welcome and invite the devotee to speak."
      );
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not start the live call.");
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      callStartedRef.current = false;
      setCallStarted(false);
      stopNativeAudio();
      updateStatus("Tap start to begin");
    } finally {
      if (mountedRef.current) {
        setConnecting(false);
      }
    }
  }, [personality.personality_id, stopNativeAudio, updateStatus]);

  const handleMuteToggle = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);

    try {
      toggleRecording(!nextMuted);
    } catch {}

    updateStatus(nextMuted ? "Muted" : "Listening...");
  }, [updateStatus]);

  const handleEndCall = useCallback(() => {
    callStartedRef.current = false;
    mutedRef.current = false;
    setMuted(false);
    setCallStarted(false);
    setConnecting(false);
    setError(null);
    updateStatus("Tap start to begin");

    try {
      liveSessionRef.current?.endAudioStream();
    } catch {}
    liveSessionRef.current?.close();
    liveSessionRef.current = null;
    stopNativeAudio();
    onClose();
  }, [onClose, stopNativeAudio, updateStatus]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      callStartedRef.current = false;
      mutedRef.current = false;
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      stopNativeAudio();
    };
  }, [stopNativeAudio]);

  const heroScale = 1 + outputLevel * 0.16;
  const micScale = 1 + inputLevel * 0.2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleEndCall} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Live Call</Text>
          <Text style={styles.headerSubtitle}>{personality.title}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ImageBackground
          source={{
            uri: getGuideImageAsset(personality),
          }}
          style={styles.heroCard}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          <View style={[styles.avatarRing, { transform: [{ scale: heroScale }] }]}>
            <View style={styles.avatarOuter}>
              <View style={[styles.avatarCore, { transform: [{ scale: micScale }] }]}>
                <MaterialCommunityIcons name="hands-pray" size={36} color={colors.white} />
              </View>
            </View>
          </View>

          <Text style={styles.heroName}>{personality.title}</Text>
          <Text style={styles.heroStatus}>{statusText}</Text>
          <Text style={styles.heroText}>{guideDescription}</Text>
        </ImageBackground>

        <View style={styles.signalCard}>
          <View style={styles.signalRow}>
            <Text style={styles.signalLabel}>Your voice</Text>
            <View style={styles.signalTrack}>
              <View style={[styles.signalFill, { width: `${Math.round(inputLevel * 100)}%` }]} />
            </View>
          </View>
          <View style={styles.signalRow}>
            <Text style={styles.signalLabel}>Guide voice</Text>
            <View style={styles.signalTrack}>
              <View
                style={[
                  styles.signalFill,
                  styles.signalFillGuide,
                  { width: `${Math.round(outputLevel * 100)}%` },
                ]}
              />
            </View>
          </View>
          <Text style={styles.signalHint}>
            Voice-only mode is active. No transcript is shown on screen.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        {!callStarted ? (
          <Pressable
            onPress={() => void handleStartCall()}
            style={[styles.startButton, connecting && styles.disabledButton]}
            disabled={connecting}
          >
            <Ionicons name="call" size={20} color={colors.white} />
            <Text style={styles.startButtonText}>
              {connecting ? "Connecting..." : "Start Voice Call"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.callControlsRow}>
            <Pressable
              onPress={handleMuteToggle}
              style={[styles.roundButton, muted && styles.roundButtonActive]}
            >
              <Ionicons name={muted ? "mic-off" : "mic"} size={20} color={colors.white} />
            </Pressable>
            <Pressable onPress={handleEndCall} style={styles.endCallButton}>
              <Ionicons name="call" size={22} color={colors.white} />
            </Pressable>
          </View>
        )}
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
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  headerCopy: {
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
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 16,
  },
  heroCard: {
    borderRadius: 30,
    alignItems: "center",
    padding: 24,
    gap: 10,
    minHeight: 360,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroImage: {
    borderRadius: 30,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.58)",
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCore: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.purple900,
    alignItems: "center",
    justifyContent: "center",
  },
  heroName: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 30,
    textAlign: "center",
  },
  heroStatus: {
    color: "#FDE68A",
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  heroText: {
    color: "rgba(255,255,255,0.84)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  signalCard: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 18,
    gap: 14,
  },
  signalRow: {
    gap: 8,
  },
  signalLabel: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  signalTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.gray100,
    overflow: "hidden",
  },
  signalFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple900,
  },
  signalFillGuide: {
    backgroundColor: "#16A34A",
  },
  signalHint: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
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
  controls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "rgba(253,251,247,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  startButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  callControlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
  },
  roundButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray900,
    alignItems: "center",
    justifyContent: "center",
  },
  roundButtonActive: {
    backgroundColor: colors.gray500,
  },
  endCallButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "135deg" }],
  },
});

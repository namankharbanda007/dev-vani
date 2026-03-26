import { Buffer } from "buffer";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import {
  bypassVoiceProcessing,
  initialize,
  playPCMData,
  requestMicrophonePermissionsAsync,
  tearDown,
  toggleRecording,
  useExpoTwoWayAudioEventListener,
} from "@speechmatics/expo-two-way-audio";
import {
  buildLiveOpeningTurn,
  canGuideUseVideo,
  getGuideSessionConfig,
  getGuideImageAsset,
} from "../lib/smartMurtiApi";
import { createGeminiLiveSession, type GeminiLiveSession } from "../lib/geminiLive";
import { downsamplePcm16, clampAudioLevel } from "../lib/audioUtils";
import { Personality } from "../models/types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface PanditVideoScreenProps {
  personality: Personality;
  participantName: string;
  languageCode?: string | null;
  onClose: () => void;
}

const listeningPanditVideo = require("../../assets/video/listening-pandit.mp4");
const speakingPanditVideo = require("../../assets/video/speaking-pandit.mp4");

/**
 * PanditVideoScreen — Live voice-to-voice session with pandit video overlay.
 *
 * Architecture: Same as LiveCallScreen (Gemini Live + expo-two-way-audio)
 * with speaking/listening pandit videos layered on top based on AI state.
 *
 * The user's mic audio is streamed to Gemini via sendAudioChunk().
 * Gemini's audio response is played through playPCMData().
 * Speaker identity is sent as "[participantName]: ..." prefix.
 */
export function PanditVideoScreen({
  personality,
  participantName,
  languageCode,
  onClose,
}: PanditVideoScreenProps) {
  const insets = useSafeAreaInsets();
  const supportsVideo = canGuideUseVideo(personality);
  const isPanditGuide = personality.title.toLowerCase().includes("pandit");

  // ── Session state ────────────────────────────────────────────────
  const [callStarted, setCallStarted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [statusText, setStatusText] = useState("Tap to begin the live puja");
  const [error, setError] = useState<string | null>(null);
  const [avatarVideoFailed, setAvatarVideoFailed] = useState(false);
  const [inputLevel, setInputLevel] = useState(0.08);
  const [outputLevel, setOutputLevel] = useState(0.08);
  const [agentActivity, setAgentActivity] = useState<
    "idle" | "listening" | "speaking"
  >("idle");

  const liveSessionRef = useRef<GeminiLiveSession | null>(null);
  const callStartedRef = useRef(false);
  const mutedRef = useRef(false);
  const speakingRef = useRef(false);
  const mountedRef = useRef(true);
  const userActivityRef = useRef(false);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Audio callbacks ──────────────────────────────────────────────
  const updateStatus = useCallback((next: string) => {
    if (mountedRef.current) {
      setStatusText(next);
    }
  }, []);

  const stopNativeAudio = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    try {
      toggleRecording(false);
    } catch {}
    try {
      tearDown();
    } catch {}
    speakingRef.current = false;
    userActivityRef.current = false;
    if (mountedRef.current) {
      setInputLevel(0.08);
      setOutputLevel(0.08);
      setAgentActivity("idle");
    }
  }, []);

  // Mic data → stream to Gemini with speaker identity
  useExpoTwoWayAudioEventListener(
    "onMicrophoneData",
    useCallback((event) => {
      const session = liveSessionRef.current;
      if (!session || !callStartedRef.current || mutedRef.current || !event.data?.length) {
        return;
      }
      const chunk = Buffer.from(event.data).toString("base64");
      if (!chunk) {
        return;
      }
      session.sendAudioChunk(chunk, 16000);
    }, [])
  );

  // Input volume visualisation
  useExpoTwoWayAudioEventListener(
    "onInputVolumeLevelData",
    useCallback((event) => {
      if (!mountedRef.current) return;
      const level = clampAudioLevel(Number(event.data) || 0);
      setInputLevel(level);

      if (!callStartedRef.current || mutedRef.current) {
        return;
      }

      if (level > 0.08) {
        if (!userActivityRef.current) {
          userActivityRef.current = true;
          liveSessionRef.current?.startActivity();
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      } else if (userActivityRef.current && !silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          liveSessionRef.current?.endActivity();
          userActivityRef.current = false;
          silenceTimeoutRef.current = null;
        }, 420);
      }
    }, [])
  );

  // Output volume → detect speaking state
  useExpoTwoWayAudioEventListener(
    "onOutputVolumeLevelData",
    useCallback((event) => {
      if (!mountedRef.current) return;
      const level = clampAudioLevel(Number(event.data) || 0);
      setOutputLevel(level);
      if (level > 0.06) {
        speakingRef.current = true;
        setAgentActivity("speaking");
        setStatusText("Pandit Ji is speaking...");
      } else if (callStartedRef.current && !mutedRef.current) {
        speakingRef.current = false;
        setAgentActivity("listening");
      }
    }, [])
  );

  useExpoTwoWayAudioEventListener(
    "onAudioInterruption",
    useCallback((event) => {
      setError(`Audio was interrupted: ${event.data}`);
    }, [])
  );

  // ── Start puja ═ same as LiveCallScreen start flow ───────────────
  const handleStartPuja = useCallback(async () => {
    try {
      setError(null);
      setConnecting(true);
      updateStatus("Connecting to Pandit Ji...");

      const permission = await requestMicrophonePermissionsAsync();
      if (!permission.granted) {
        throw new Error("Microphone permission is required for the live puja.");
      }

      await initialize();
      bypassVoiceProcessing(false);

      const guideSession = await getGuideSessionConfig(
        personality.personality_id,
        languageCode
      );

      // Build system instruction with speaker identity context
      const sessionContext = `${guideSession.systemInstruction}

LIVE PUJA MODE:
You are speaking with ${participantName} in a live puja session.
The devotee's voice comes through directly — you will hear them speak.
Address ${participantName} by name naturally in your responses.
Keep every response short, devotional, and easy to follow in real-time.
`;

      const session = await createGeminiLiveSession({
        systemInstruction: sessionContext,
        voiceName: guideSession.voiceName,
        startupRetries: 2,
        callbacks: {
          onReady: () => {
            updateStatus("Puja session connected");
          },
          onAudioChunk: (base64Chunk) => {
            const pcm24k = new Uint8Array(Buffer.from(base64Chunk, "base64"));
            const pcm16k = downsamplePcm16(pcm24k, 24000, 16000);
            try {
              playPCMData(pcm16k);
            } catch (playErr) {
              console.warn("Could not play pandit audio chunk", playErr);
            }
          },
          onInterrupted: () => {
            speakingRef.current = false;
            setAgentActivity("listening");
            updateStatus(mutedRef.current ? "Muted" : "Pandit Ji is listening...");
          },
          onTurnComplete: () => {
            speakingRef.current = false;
            setAgentActivity("listening");
            updateStatus(mutedRef.current ? "Muted" : "Pandit Ji is listening...");
          },
          onError: (message) => {
            setError(message);
          },
          onClose: () => {
            if (mountedRef.current && callStartedRef.current) {
              setError("Live puja session ended unexpectedly. Tap Start to reconnect.");
              setCallStarted(false);
              callStartedRef.current = false;
              setAgentActivity("idle");
              stopNativeAudio();
            }
          },
        },
      });

      liveSessionRef.current = session;
      callStartedRef.current = true;
      mutedRef.current = false;
      setMuted(false);
      setCallStarted(true);
      setAgentActivity("listening");
      updateStatus("Pandit Ji is joining the puja...");

      toggleRecording(true);
      updateStatus("Pandit Ji is listening...");

      session.sendTextTurn(
        buildLiveOpeningTurn(
          guideSession.openingLine || personality.first_message_prompt?.trim(),
          participantName,
          "puja"
        )
      );
    } catch (nextError) {
      const msg = nextError instanceof Error ? nextError.message : "Could not start the live puja.";
      setError(msg);
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      callStartedRef.current = false;
      setCallStarted(false);
      stopNativeAudio();
      updateStatus("Tap to begin the live puja");
    } finally {
      if (mountedRef.current) {
        setConnecting(false);
      }
    }
  }, [
    languageCode,
    participantName,
    personality.personality_id,
    personality.first_message_prompt,
    stopNativeAudio,
    updateStatus,
  ]);

  const handleMuteToggle = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    try {
      toggleRecording(!nextMuted);
    } catch {}
    if (nextMuted && userActivityRef.current) {
      liveSessionRef.current?.endActivity();
      userActivityRef.current = false;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
    updateStatus(nextMuted ? "Muted" : "Pandit Ji is listening...");
  }, [updateStatus]);

  const handleEndCall = useCallback(() => {
    callStartedRef.current = false;
    mutedRef.current = false;
    setMuted(false);
    setCallStarted(false);
    setConnecting(false);
    setError(null);
    setAgentActivity("idle");
    updateStatus("Tap to begin the live puja");
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

  // ── Early exit: guide doesn't support video ──────────────────────
  if (!supportsVideo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <Text style={styles.centerTitle}>Video not available</Text>
          <Text style={styles.centerText}>
            Only Pandit Ji and Astrologer currently support live video in the app.
          </Text>
          <Pressable onPress={onClose} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render ───────────────────────────────────────────────────────
  const heroScale = 1 + outputLevel * 0.12;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleEndCall} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{personality.title}</Text>
          <Text style={styles.headerSubtitle}>
            {isPanditGuide ? "Native live puja" : "Native video session"}
          </Text>
        </View>
      </View>

      {/* Main stage — pandit video + overlay */}
      <View style={styles.content}>
        <View style={styles.stageCard}>
          <View style={styles.panditStage}>
            {isPanditGuide && !avatarVideoFailed ? (
              <>
                <Video
                  source={listeningPanditVideo}
                  style={[
                    styles.panditVideo,
                    agentActivity === "speaking" && styles.hiddenStageVideo,
                  ]}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={agentActivity !== "speaking"}
                  isLooping
                  isMuted
                  onError={() => setAvatarVideoFailed(true)}
                />
                <Video
                  source={speakingPanditVideo}
                  style={[
                    styles.panditVideo,
                    agentActivity !== "speaking" && styles.hiddenStageVideo,
                  ]}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={agentActivity === "speaking"}
                  isLooping
                  isMuted
                  onError={() => setAvatarVideoFailed(true)}
                />
              </>
            ) : (
              <Image
                source={{ uri: getGuideImageAsset(personality) }}
                style={styles.panditVideo}
                resizeMode="cover"
              />
            )}
            <View style={styles.stageOverlay} />
            {agentActivity === "speaking" ? (
              <View style={styles.speakingAura} />
            ) : null}

            <View style={styles.panditBadge}>
              <Ionicons name="sparkles" size={14} color="#FDE68A" />
              <Text style={styles.panditBadgeText}>
                Live voice-to-voice puja
              </Text>
            </View>

            <View style={styles.stageTextWrap}>
              <Text style={styles.stageTitle}>{personality.title}</Text>
              <Text style={styles.stageStatus}>{statusText}</Text>
              {callStarted ? (
                <Text style={styles.stageSpeaker}>
                  Devotee: {participantName}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Signal bars */}
          <View style={styles.signalCard}>
            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Your voice</Text>
              <View style={styles.signalTrack}>
                <View
                  style={[
                    styles.signalFill,
                    { width: `${Math.round(inputLevel * 100)}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Pandit Ji</Text>
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
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      {/* Controls */}
      <View
        style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 18) }]}
      >
        {!callStarted ? (
          <Pressable
            onPress={() => void handleStartPuja()}
            style={[
              styles.startPujaButton,
              connecting && styles.disabled,
            ]}
            disabled={connecting}
          >
            {connecting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Ionicons name="play" size={18} color={colors.white} />
            )}
            <Text style={styles.startPujaButtonText}>
              {connecting ? "Connecting..." : "Start Live Puja"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.callControlsRow}>
            <Pressable
              onPress={handleMuteToggle}
              style={[styles.roundButton, muted && styles.roundButtonActive]}
            >
              <Ionicons
                name={muted ? "mic-off" : "mic"}
                size={20}
                color={colors.white}
              />
            </Pressable>
            <Pressable onPress={handleEndCall} style={styles.endCallButton}>
              <Ionicons
                name="call"
                size={22}
                color={colors.white}
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
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
    gap: 14,
  },
  stageCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: colors.white,
    padding: 14,
    gap: 14,
    overflow: "hidden",
  },
  panditStage: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 270,
    backgroundColor: "#111827",
    justifyContent: "flex-end",
  },
  panditVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  hiddenStageVideo: {
    opacity: 0,
  },
  stageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.28)",
  },
  speakingAura: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(34,197,94,0.14)",
    borderWidth: 2,
    borderColor: "rgba(134,239,172,0.45)",
  },
  panditBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  panditBadgeText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  stageTextWrap: {
    padding: 18,
    gap: 4,
  },
  stageTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 30,
  },
  stageStatus: {
    color: "#FDE68A",
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  stageSpeaker: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.body,
    fontSize: 13,
  },
  signalCard: {
    borderRadius: 20,
    backgroundColor: colors.gray50,
    padding: 14,
    gap: 12,
  },
  signalRow: {
    gap: 6,
  },
  signalLabel: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  signalTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.gray200,
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
  errorCard: {
    borderRadius: 18,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 14,
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
  startPujaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  startPujaButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.7,
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
  primaryButton: {
    height: 54,
    borderRadius: 22,
    backgroundColor: colors.purple900,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  centerTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 28,
    textAlign: "center",
  },
  centerText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});

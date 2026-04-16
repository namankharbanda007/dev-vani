import { Buffer } from "buffer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, AppState, Image, PermissionsAndroid, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, ResizeMode, Video } from "expo-av";
import { LiveKitRoom, VideoTrack, isTrackReference, useLocalParticipant, useTracks } from "@livekit/react-native";
import { Room, RoomEvent, Track } from "livekit-client";
import { bypassVoiceProcessing, initialize, playPCMData, requestMicrophonePermissionsAsync, tearDown, toggleRecording, useExpoTwoWayAudioEventListener } from "@speechmatics/expo-two-way-audio";
import { buildLiveOpeningTurn, buildLivePujaInviteLink, canGuideUseVideo, fetchLiveKitRoomToken, getGuideImageAsset, getGuideSessionConfig } from "../lib/smartMurtiApi";
import { createGeminiLiveSession, type GeminiLiveSession } from "../lib/geminiLive";
import { downsamplePcm16, clampAudioLevel } from "../lib/audioUtils";
import { Personality } from "../models/types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface Props {
  personality: Personality;
  participantName: string;
  languageCode?: string | null;
  onMinimize?: () => void;
  onSessionStateChange?: (payload: { active: boolean; status: string }) => void;
  onClose: () => void;
}

const listeningVideo = require("../../assets/video/listening-pandit.mp4");
const speakingVideo = require("../../assets/video/speaking-pandit.mp4");

function roomId() {
  return `smartmurti-puja-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function RoomView({
  personality,
  participantName,
  roomCode,
  remoteParticipants,
  roomReady,
  roomLoading,
  statusText,
  activity,
  cameraEnabled,
  inputLevel,
  outputLevel,
  avatarVideoFailed,
  onAvatarVideoFailed,
  onShareInvite,
}: {
  personality: Personality;
  participantName: string;
  roomCode: string;
  remoteParticipants: Array<{ identity: string; name: string }>;
  roomReady: boolean;
  roomLoading: boolean;
  statusText: string;
  activity: "idle" | "listening" | "speaking";
  cameraEnabled: boolean;
  inputLevel: number;
  outputLevel: number;
  avatarVideoFailed: boolean;
  onAvatarVideoFailed: () => void;
  onShareInvite: () => void;
}) {
  const tracks = useTracks([Track.Source.Camera]).filter(isTrackReference) as any[];
  const { localParticipant, cameraTrack } = useLocalParticipant();
  const localTrack =
    tracks.find((trackRef) => trackRef.participant?.isLocal) ||
    (cameraTrack
      ? ({
          participant: localParticipant,
          publication: cameraTrack,
          source: Track.Source.Camera,
        } as any)
      : undefined);
  const remoteTrackMap = useMemo(
    () =>
      new Map(
        tracks
          .filter((trackRef) => !trackRef.participant?.isLocal)
          .map((trackRef) => [trackRef.participant?.identity, trackRef] as const)
      ),
    [tracks]
  );
  const remoteTiles = remoteParticipants.map((participant) => ({
    ...participant,
    trackRef: remoteTrackMap.get(participant.identity),
  }));
  const panditMode = personality.title.toLowerCase().includes("pandit") && !avatarVideoFailed;
  const roomCount = remoteParticipants.length + 1;

  return (
    <View style={styles.card}>
      <View style={styles.stage}>
        {panditMode ? (
          <>
            <Video source={listeningVideo} style={[styles.stageMedia, activity === "speaking" && styles.hidden]} resizeMode={ResizeMode.COVER} shouldPlay={activity !== "speaking"} isLooping isMuted onError={onAvatarVideoFailed} />
            <Video source={speakingVideo} style={[styles.stageMedia, activity !== "speaking" && styles.hidden]} resizeMode={ResizeMode.COVER} shouldPlay={activity === "speaking"} isLooping isMuted onError={onAvatarVideoFailed} />
          </>
        ) : (
          <Image source={{ uri: getGuideImageAsset(personality) }} style={styles.stageMedia} resizeMode="cover" />
        )}
        <View style={styles.overlay} />
        <View style={styles.topRow}>
          <View style={styles.chip}><Ionicons name="sparkles" size={13} color="#FDE68A" /><Text style={styles.chipText}>{roomLoading ? "Opening room..." : roomReady ? `${roomCount} in room` : "Joining room..."}</Text></View>
          <Pressable onPress={onShareInvite} style={({ pressed }) => [styles.share, pressed && styles.pressed]}><Ionicons name="share-social-outline" size={14} color={colors.white} /><Text style={styles.shareText}>Invite</Text></Pressable>
        </View>
        <View style={styles.preview}>
          {cameraEnabled && localTrack ? <VideoTrack trackRef={localTrack} style={styles.previewVideo} objectFit="cover" mirror /> : <View style={styles.previewOff}><Ionicons name="videocam-off-outline" size={18} color={colors.white} /></View>}
          <Text style={styles.previewLabel}>{cameraEnabled ? participantName : "Camera off"}</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{personality.title}</Text>
          <Text style={styles.status}>{statusText}</Text>
          <Text style={styles.code}>Room code: {roomCode}</Text>
        </View>
      </View>
      <View style={styles.meters}>
        <View style={styles.meter}><Text style={styles.meterLabel}>Your voice</Text><View style={styles.track}><View style={[styles.fill, { width: `${Math.round(inputLevel * 100)}%` }]} /></View></View>
        <View style={styles.meter}><Text style={styles.meterLabel}>Pandit Ji</Text><View style={styles.track}><View style={[styles.fill, styles.guideFill, { width: `${Math.round(outputLevel * 100)}%` }]} /></View></View>
      </View>
      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Family in room</Text><Text style={styles.sectionSub}>Native camera tiles, no website screen</Text></View>
      {remoteTiles.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.remoteRow}>
          {remoteTiles.map((participant) => (
            <View key={participant.identity} style={styles.remoteCard}>
              {participant.trackRef ? (
                <VideoTrack trackRef={participant.trackRef} style={styles.remoteVideo} objectFit="cover" />
              ) : (
                <View style={styles.remotePlaceholder}>
                  <Ionicons name="person-circle-outline" size={34} color={colors.white} />
                  <Text style={styles.remotePlaceholderText}>Camera off</Text>
                </View>
              )}
              <Text style={styles.remoteName}>{participant.name || "Guest"}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.empty}><Ionicons name="people-outline" size={28} color={colors.gray400} /><Text style={styles.emptyTitle}>Waiting for family to join</Text><Text style={styles.emptyBody}>Share the live puja link and every joining devotee will appear here.</Text></View>
      )}
    </View>
  );
}

export function PanditVideoScreen({
  personality,
  participantName,
  languageCode,
  onMinimize,
  onSessionStateChange,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const supportsVideo = canGuideUseVideo(personality);
  const room = useRef(new Room({ adaptiveStream: true, dynacast: true })).current;
  const roomCode = useRef(roomId()).current;
  const liveSessionRef = useRef<GeminiLiveSession | null>(null);
  const callStartedRef = useRef(false);
  const mutedRef = useRef(false);
  const userActiveRef = useRef(false);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeakerPromptRef = useRef<string>("");
  const lastSpeakerPromptAtRef = useRef(0);
  const mountedRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);
  const resumeOnForegroundRef = useRef(false);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomReady, setRoomReady] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [statusText, setStatusText] = useState("Opening your live puja room...");
  const [error, setError] = useState<string | null>(null);
  const [avatarVideoFailed, setAvatarVideoFailed] = useState(false);
  const [inputLevel, setInputLevel] = useState(0.08);
  const [outputLevel, setOutputLevel] = useState(0.08);
  const [activity, setActivity] = useState<"idle" | "listening" | "speaking">("idle");
  const [participantVersion, setParticipantVersion] = useState(0);

  const configureCallAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
  }, []);

  const restoreDefaultAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (silenceRef.current) clearTimeout(silenceRef.current);
    silenceRef.current = null;
    if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    speakingTimeoutRef.current = null;
    try { toggleRecording(false); } catch {}
    try { tearDown(); } catch {}
    void restoreDefaultAudioMode().catch(() => null);
    if (mountedRef.current) { setInputLevel(0.08); setOutputLevel(0.08); setActivity("idle"); }
    userActiveRef.current = false;
  }, [restoreDefaultAudioMode]);

  const resetLivePujaSession = useCallback(
    (nextError?: string, nextStatus?: string) => {
      callStartedRef.current = false;
      mutedRef.current = false;
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      stopAudio();

      if (!mountedRef.current) {
        return;
      }

      setCallStarted(false);
      setMuted(false);
      setConnecting(false);

      if (nextError) {
        setError(nextError);
      }

      setStatusText(nextStatus || (roomReady ? "Room ready. Start live puja." : "Opening your live puja room..."));
    },
    [roomReady, stopAudio]
  );

  const markPanditListening = useCallback(() => {
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }

    if (!mountedRef.current || !callStartedRef.current) {
      return;
    }

    setActivity(mutedRef.current ? "idle" : "listening");
    setStatusText(mutedRef.current ? "Muted" : "Pandit Ji is listening...");
    setOutputLevel(0.08);
  }, []);

  const markPanditSpeaking = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }

    setActivity("speaking");
    setStatusText("Pandit Ji is speaking...");
    setOutputLevel((level) => Math.max(level, 0.78));

    speakingTimeoutRef.current = setTimeout(() => {
      markPanditListening();
    }, 900);
  }, [markPanditListening]);

  const ensureCameraPermission = useCallback(async () => {
    if (Platform.OS !== "android") {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera access",
        message: "Smart Murti needs camera access so family members can appear in the live puja room.",
        buttonPositive: "Allow",
        buttonNegative: "Not now",
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const loadRoom = useCallback(async () => {
    try {
      setRoomLoading(true); setRoomError(null); setStatusText("Opening your live puja room...");
      const cameraGranted = await ensureCameraPermission();
      if (!cameraGranted) {
        setCameraEnabled(false);
      }
      const creds = await fetchLiveKitRoomToken(roomCode, participantName);
      if (!mountedRef.current) return;
      setRoomToken(creds.token); setServerUrl(creds.serverUrl);
    } catch (e) {
      if (!mountedRef.current) return;
      setRoomError(e instanceof Error ? e.message : "Could not open the live room.");
      setStatusText("Could not join the live room");
    } finally {
      if (mountedRef.current) setRoomLoading(false);
    }
  }, [ensureCameraPermission, participantName, roomCode]);

  useEffect(() => { mountedRef.current = true; void loadRoom(); return () => { mountedRef.current = false; liveSessionRef.current?.close(); stopAudio(); room.disconnect(); }; }, [loadRoom, room, stopAudio]);
  useEffect(() => { if (roomReady) void room.localParticipant.setCameraEnabled(cameraEnabled).catch((e) => setRoomError(e instanceof Error ? e.message : "Could not update camera.")); }, [cameraEnabled, room, roomReady]);
  useEffect(() => {
    const syncParticipants = () => setParticipantVersion((version) => version + 1);

    room.on(RoomEvent.ParticipantConnected, syncParticipants);
    room.on(RoomEvent.ParticipantDisconnected, syncParticipants);
    room.on(RoomEvent.TrackSubscribed, syncParticipants);
    room.on(RoomEvent.TrackUnsubscribed, syncParticipants);

    return () => {
      room.off(RoomEvent.ParticipantConnected, syncParticipants);
      room.off(RoomEvent.ParticipantDisconnected, syncParticipants);
      room.off(RoomEvent.TrackSubscribed, syncParticipants);
      room.off(RoomEvent.TrackUnsubscribed, syncParticipants);
    };
  }, [room]);
  useEffect(() => {
    onSessionStateChange?.({
      active: callStarted || connecting,
      status:
        error ||
        roomError ||
        statusText ||
        (callStarted ? "Live puja active" : "Opening your live puja room..."),
    });
  }, [callStarted, connecting, error, onSessionStateChange, roomError, statusText]);

  useEffect(() => {
    const handleActiveSpeakersChanged = (speakers: Array<{ name?: string; isLocal?: boolean }>) => {
      if (!callStartedRef.current || !liveSessionRef.current || activity === "speaking") {
        return;
      }

      const primarySpeaker = speakers.find((speaker) => speaker.name)?.name?.trim();
      if (!primarySpeaker) {
        return;
      }

      const now = Date.now();
      if (
        primarySpeaker === lastSpeakerPromptRef.current &&
        now - lastSpeakerPromptAtRef.current < 5000
      ) {
        return;
      }

      lastSpeakerPromptRef.current = primarySpeaker;
      lastSpeakerPromptAtRef.current = now;
      liveSessionRef.current.sendTextTurn(
        `[Speaker: ${primarySpeaker}] is currently speaking in the live puja room. If you respond, address ${primarySpeaker} by name.`
      );
    };

    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
    };
  }, [activity, room]);

  const remoteParticipants = useMemo(
    () =>
      Array.from(room.remoteParticipants.values()).map((participant) => ({
        identity: participant.identity,
        name: participant.name || participant.identity || "Guest",
      })),
    [participantVersion, room]
  );

  useExpoTwoWayAudioEventListener("onMicrophoneData", useCallback((event) => {
    if (!liveSessionRef.current || !callStartedRef.current || mutedRef.current || !event.data?.length) return;
    const chunk = Buffer.from(event.data).toString("base64");
    if (chunk) liveSessionRef.current.sendAudioChunk(chunk, 16000);
  }, []));
  useExpoTwoWayAudioEventListener("onInputVolumeLevelData", useCallback((event) => {
    const level = clampAudioLevel(Number(event.data) || 0); setInputLevel(level);
    if (!callStartedRef.current || mutedRef.current) return;
    if (level > 0.08) {
      if (!userActiveRef.current) { userActiveRef.current = true; }
      if (silenceRef.current) clearTimeout(silenceRef.current);
      silenceRef.current = null;
    } else if (userActiveRef.current && !silenceRef.current) {
      silenceRef.current = setTimeout(() => { userActiveRef.current = false; silenceRef.current = null; }, 420);
    }
  }, []));
  useExpoTwoWayAudioEventListener("onOutputVolumeLevelData", useCallback((event) => {
    const level = clampAudioLevel(Number(event.data) || 0); setOutputLevel(level);
    if (level > 0.06) {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }
      setActivity("speaking");
      setStatusText("Pandit Ji is speaking...");
    }
  }, []));
  useExpoTwoWayAudioEventListener("onAudioInterruption", useCallback((event) => setError(`Audio was interrupted: ${event.data}`), []));

  const startPuja = useCallback(async () => {
    try {
      if (!roomReady) throw new Error("Join the live room before starting the puja.");
      setError(null); setConnecting(true); setStatusText("Connecting to Pandit Ji...");
      const permission = await requestMicrophonePermissionsAsync();
      if (!permission.granted) throw new Error("Microphone permission is required for the live puja.");
      await configureCallAudioMode();
      await initialize(); bypassVoiceProcessing(false);
      const guide = await getGuideSessionConfig(personality.personality_id, languageCode);
      const session = await createGeminiLiveSession({
        systemInstruction: `${guide.systemInstruction}\n\nLIVE PUJA MODE:\nYou are leading a live family puja with ${participantName}. Speak in short, devotional voice responses.`,
        apiKey: guide.geminiApiKey,
        voiceName: guide.voiceName,
        responseModalities: ["AUDIO"],
        startupRetries: 2,
        callbacks: {
          onReady: () => setStatusText("Puja session connected"),
          onAudioChunk: (base64Chunk) => {
            markPanditSpeaking();
            playPCMData(
              downsamplePcm16(new Uint8Array(Buffer.from(base64Chunk, "base64")), 24000, 16000)
            );
          },
          onInterrupted: () => { markPanditListening(); },
          onTurnComplete: () => { markPanditListening(); },
          onError: (message) => setError(message),
          onClose: () => { if (mountedRef.current && callStartedRef.current) { setError("Live puja session ended unexpectedly. Tap Start to reconnect."); setCallStarted(false); callStartedRef.current = false; stopAudio(); } },
        },
      });
      liveSessionRef.current = session; callStartedRef.current = true; mutedRef.current = false;
      setMuted(false); setCallStarted(true); setActivity("listening");
      toggleRecording(true); setStatusText("Pandit Ji is listening...");
      session.sendTextTurn(buildLiveOpeningTurn(guide.openingLine || personality.first_message_prompt?.trim(), participantName, "puja"));
    } catch (e) {
      resetLivePujaSession(
        e instanceof Error ? e.message : "Could not start the live puja.",
        roomReady ? "Room ready. Start live puja." : "Opening your live puja room..."
      );
    } finally { if (mountedRef.current) setConnecting(false); }
  }, [configureCallAudioMode, languageCode, markPanditListening, markPanditSpeaking, participantName, personality.first_message_prompt, personality.personality_id, resetLivePujaSession, roomReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (
        previousState === "active" &&
        nextState !== "active" &&
        callStartedRef.current
      ) {
        resumeOnForegroundRef.current = true;
        if (mountedRef.current) {
          setStatusText("Live puja will reconnect when you return.");
        }
      }

      if (
        previousState !== "active" &&
        nextState === "active" &&
        resumeOnForegroundRef.current
      ) {
        resumeOnForegroundRef.current = false;
        if (mountedRef.current) {
          setStatusText("Reconnecting your live puja...");
        }

        if (liveSessionRef.current) {
          liveSessionRef.current.close();
          liveSessionRef.current = null;
        }

        callStartedRef.current = false;
        setCallStarted(false);

        if (roomReady) {
          void startPuja();
        } else if (mountedRef.current) {
          setStatusText("Rejoining the family room...");
        }
      }
    });

    return () => subscription.remove();
  }, [roomReady, startPuja]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current; mutedRef.current = next; setMuted(next);
    try { toggleRecording(!next); } catch {}
    if (next && userActiveRef.current) { userActiveRef.current = false; }
    setStatusText(next ? "Muted" : "Pandit Ji is listening...");
  }, []);
  const shareInvite = useCallback(async () => { const link = buildLivePujaInviteLink(roomCode); await Share.share({ title: `${personality.title} live puja`, message: `Join our Smart Murti live puja room: ${link}`, url: link }); }, [personality.title, roomCode]);
  const handleBack = useCallback(() => {
    if ((callStartedRef.current || connecting) && onMinimize) {
      onMinimize();
      return;
    }

    onClose();
  }, [connecting, onClose, onMinimize]);
  const leave = useCallback(() => { callStartedRef.current = false; mutedRef.current = false; setCallStarted(false); setMuted(false); setConnecting(false); setError(null); liveSessionRef.current?.close(); liveSessionRef.current = null; stopAudio(); room.disconnect(); onClose(); }, [onClose, room, stopAudio]);

  if (!supportsVideo) return <SafeAreaView style={styles.safe} edges={["top","left","right"]}><View style={styles.center}><Text style={styles.centerTitle}>Video not available</Text><Text style={styles.centerBody}>Only Pandit Ji and Astrologer support native video right now.</Text><Pressable onPress={onClose} style={styles.primary}><Text style={styles.primaryText}>Go Back</Text></Pressable></View></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={["top","left","right"]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{personality.title}</Text>
          <Text style={styles.headerSub}>Native live puja room</Text>
        </View>
        {(callStarted || connecting) && onMinimize ? (
          <Pressable onPress={onMinimize} style={styles.minimize}>
            <Ionicons name="remove" size={20} color={colors.gray900} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.content}>
        {roomToken && serverUrl ? (
          <LiveKitRoom
            room={room}
            serverUrl={serverUrl}
            token={roomToken}
            connect
            audio={false}
            video
            onConnected={() => {
              setRoomReady(true);
              setRoomError(null);
              setStatusText("Room ready. Start live puja.");
            }}
            onDisconnected={() => {
              setRoomReady(false);
              if (callStartedRef.current) {
                setRoomError("The family room disconnected. Rejoin the room, then start the live puja again.");
                resetLivePujaSession(
                  "The family room disconnected. Rejoin the room, then start the live puja again.",
                  "Live room disconnected"
                );
                return;
              }

              setStatusText("Live room disconnected");
            }}
            onError={(e) => {
              const message = e.message || "Could not keep the live room connected.";
              setRoomError(message);
              if (callStartedRef.current) {
                resetLivePujaSession(message, "Live room issue. Start the puja again once the room is stable.");
              }
            }}
          >
            <RoomView personality={personality} participantName={participantName} roomCode={roomCode} remoteParticipants={remoteParticipants} roomReady={roomReady} roomLoading={roomLoading} statusText={statusText} activity={activity} cameraEnabled={cameraEnabled} inputLevel={inputLevel} outputLevel={outputLevel} avatarVideoFailed={avatarVideoFailed} onAvatarVideoFailed={() => setAvatarVideoFailed(true)} onShareInvite={() => void shareInvite()} />
          </LiveKitRoom>
        ) : (
          <View style={styles.centerCard}>{roomLoading ? <><ActivityIndicator color={colors.purple900} /><Text style={styles.centerBody}>Opening the live puja room...</Text></> : <><Text style={styles.centerTitle}>Could not open the room</Text><Text style={styles.centerBody}>{roomError || "Please try again in a moment."}</Text><Pressable onPress={() => void loadRoom()} style={styles.primary}><Text style={styles.primaryText}>Retry room</Text></Pressable></>}</View>
        )}
        {error || roomError ? <View style={styles.error}><Text style={styles.errorText}>{[error, roomError].filter(Boolean).join("\n")}</Text></View> : null}
      </View>
      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {!callStarted ? (
          <Pressable onPress={() => void startPuja()} style={[styles.start, (connecting || roomLoading || !roomReady) && styles.disabled]} disabled={connecting || roomLoading || !roomReady}>
            {connecting ? <ActivityIndicator color={colors.white} /> : <Ionicons name="play" size={18} color={colors.white} />}
            <Text style={styles.startText}>{connecting ? "Connecting..." : roomLoading ? "Joining room..." : roomReady ? "Start Live Puja" : "Opening room..."}</Text>
          </Pressable>
        ) : (
          <View style={styles.controlRow}>
            <Pressable onPress={toggleMute} style={[styles.round, muted && styles.roundAlt]}><Ionicons name={muted ? "mic-off" : "mic"} size={20} color={colors.white} /></Pressable>
            <Pressable onPress={() => setCameraEnabled((v) => !v)} style={[styles.round, !cameraEnabled && styles.roundAlt]}><Ionicons name={cameraEnabled ? "videocam" : "videocam-off"} size={20} color={colors.white} /></Pressable>
            <Pressable onPress={() => void shareInvite()} style={styles.round}><Ionicons name="share-social" size={20} color={colors.white} /></Pressable>
            <Pressable onPress={leave} style={styles.end}><Ionicons name="call" size={22} color={colors.white} /></Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.softPaper },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 12 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(106,74,44,0.08)" },
  headerCopy: { flex: 1 },
  headerTitle: { color: colors.gray900, fontFamily: fonts.bodyBold, fontSize: 18 },
  headerSub: { color: colors.gray500, fontFamily: fonts.body, fontSize: 13 },
  minimize: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(106,74,44,0.08)" },
  content: { flex: 1, paddingHorizontal: 18, paddingBottom: 104, gap: 14 },
  card: { flex: 1, borderRadius: 24, backgroundColor: colors.white, padding: 14, gap: 14, borderWidth: 1, borderColor: "rgba(106,74,44,0.08)" },
  stage: { height: 360, borderRadius: 22, overflow: "hidden", backgroundColor: "#241A14", justifyContent: "flex-end" },
  stageMedia: { ...StyleSheet.absoluteFillObject }, hidden: { opacity: 0 }, overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(31,23,17,0.24)" },
  topRow: { position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  chip: { borderRadius: 999, backgroundColor: "rgba(255,255,255,0.16)", paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  chipText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 },
  share: { borderRadius: 999, backgroundColor: "rgba(31,23,17,0.42)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  shareText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 },
  preview: { position: "absolute", top: 64, right: 14, width: 108, height: 152, borderRadius: 16, overflow: "hidden", backgroundColor: "rgba(17,24,39,0.6)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  previewVideo: { width: "100%", height: "100%" }, previewOff: { flex: 1, alignItems: "center", justifyContent: "center" }, previewLabel: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: "rgba(17,24,39,0.72)", color: colors.white, fontFamily: fonts.bodyBold, fontSize: 11 },
  copy: { padding: 18, gap: 4 }, title: { color: colors.white, fontFamily: fonts.heading, fontSize: 30 }, status: { color: "#FDE68A", fontFamily: fonts.bodyBold, fontSize: 14 }, code: { color: "rgba(255,255,255,0.82)", fontFamily: fonts.body, fontSize: 13 },
  meters: { borderRadius: 18, backgroundColor: "#FCF7EF", padding: 14, gap: 12 }, meter: { gap: 6 }, meterLabel: { color: colors.gray700, fontFamily: fonts.bodyBold, fontSize: 12 }, track: { height: 8, borderRadius: 999, backgroundColor: colors.gray200, overflow: "hidden" }, fill: { height: "100%", backgroundColor: colors.purple900, borderRadius: 999 }, guideFill: { backgroundColor: colors.divineSaffron },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }, sectionTitle: { color: colors.gray900, fontFamily: fonts.bodyBold, fontSize: 16 }, sectionSub: { color: colors.gray500, fontFamily: fonts.body, fontSize: 12, maxWidth: 180 },
  remoteRow: { gap: 10, paddingRight: 6 }, remoteCard: { width: 148, height: 184, borderRadius: 18, overflow: "hidden", backgroundColor: colors.gray900 }, remoteVideo: { width: "100%", height: "100%" }, remoteName: { position: "absolute", left: 10, right: 10, bottom: 10, color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 },
  remotePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#3A2C25" }, remotePlaceholderText: { color: "rgba(255,255,255,0.78)", fontFamily: fonts.bodyBold, fontSize: 12 },
  empty: { borderRadius: 18, backgroundColor: colors.gray50, paddingHorizontal: 18, paddingVertical: 20, alignItems: "center", gap: 8 }, emptyTitle: { color: colors.gray900, fontFamily: fonts.bodyBold, fontSize: 15 }, emptyBody: { color: colors.gray500, fontFamily: fonts.body, fontSize: 13, lineHeight: 20, textAlign: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 12 }, centerCard: { flex: 1, borderRadius: 24, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 12 }, centerTitle: { color: colors.gray900, fontFamily: fonts.heading, fontSize: 28, textAlign: "center" }, centerBody: { color: colors.gray500, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, textAlign: "center" },
  error: { borderRadius: 16, backgroundColor: colors.errorBg, borderWidth: 1, borderColor: colors.errorBorder, padding: 14 }, errorText: { color: colors.errorText, fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 20 },
  controls: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 12, backgroundColor: "rgba(251,245,234,0.96)", borderTopWidth: 1, borderTopColor: colors.gray100 },
  start: { height: 56, borderRadius: 28, backgroundColor: colors.divineSaffron, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }, startText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }, controlRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 16 }, round: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.purple900, alignItems: "center", justifyContent: "center" }, roundAlt: { backgroundColor: colors.gray500 }, end: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#B2564E", alignItems: "center", justifyContent: "center", transform: [{ rotate: "135deg" }] },
  primary: { height: 54, borderRadius: 22, backgroundColor: colors.purple900, paddingHorizontal: 18, alignItems: "center", justifyContent: "center" }, primaryText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }, disabled: { opacity: 0.7 }, pressed: { opacity: 0.85 },
});

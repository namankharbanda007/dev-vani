import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    ParticipantTile,
    RoomAudioRenderer,
    RoomContext,
    useTracks,
} from "@livekit/components-react";
import {
    Video as VideoIcon,
    MessageSquare,
    Users,
    Send,
    AudioLines,
    PhoneOff,
    VideoOff,
    MicOff,
    Mic,
    User,
    UserPlus,
    CheckCircle2,
    Sparkles,
    Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Room as LiveKitRoomInstance, Track } from "livekit-client";

import { useGroupCall } from "../hooks/useGroupCall";
import { useWebRTC } from "../hooks/useWebRTC";

export const getSharedAudioContext = () => {
    if (!(window as any).sharedAudioCtx) {
        (window as any).sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return (window as any).sharedAudioCtx as AudioContext;
};

interface CallScreenProps {
    participants: string[];
    roomId: string;
    inviteToken?: string;
    onLeave: () => void;
    isOriginalHost?: boolean;
    userAvatarUrl?: string | null;
    userProfile?: {
        name: string;
        dateOfBirth: string | null;
        zodiacSign: string | null;
        birthPlace: string | null;
        birthTime: string | null;
        rashi: string | null;
    };
}

const getDefaultAvatar = (name: string) => {
    const seed = encodeURIComponent(name || "user");
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=c084fc,f59e0b,ec4899&backgroundType=gradientLinear`;
};

function FamilyPresenceGridInner() {
    const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);

    if (tracks.length === 0) {
        return (
            <div className="flex min-h-[148px] items-center justify-center rounded-[24px] border border-dashed border-[#d9c9b0] bg-white/65 px-4 text-center text-sm text-[#7a6651]">
                Family video tiles will appear here as soon as the room finishes connecting.
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tracks.map((trackRef, index) => {
                const typedTrackRef = trackRef as any;
                const participantIdentity =
                    typedTrackRef?.participant?.identity ||
                    typedTrackRef?.participant?.sid ||
                    `participant-${index}`;
                const source =
                    typedTrackRef?.publication?.source ||
                    typedTrackRef?.source ||
                    "camera";

                return (
                    <ParticipantTile
                        key={`${participantIdentity}-${source}`}
                        trackRef={trackRef}
                        className="family-participant-tile !h-[148px] !overflow-hidden !rounded-[24px] !border !border-[#eadfcf] !bg-[#2d241c] !shadow-sm [&_.lk-participant-metadata]:!bg-black/55 [&_.lk-participant-name]:!text-xs [&_.lk-participant-name]:!font-medium [&_.lk-placeholder]:!bg-[#5e4b3a]"
                    />
                );
            })}
        </div>
    );
}

function FamilyPresenceGrid({ room }: { room: LiveKitRoomInstance | null }) {
    if (!room) {
        return (
            <div className="flex min-h-[148px] items-center justify-center rounded-[24px] border border-dashed border-[#d9c9b0] bg-white/65 px-4 text-center text-sm text-[#7a6651]">
                Preparing the family room...
            </div>
        );
    }

    return (
        <RoomContext.Provider value={room}>
            <RoomAudioRenderer room={room} />
            <FamilyPresenceGridInner />
        </RoomContext.Provider>
    );
}

export default function CallScreen({ participants, roomId, inviteToken = "", onLeave, isOriginalHost = false, userAvatarUrl, userProfile }: CallScreenProps) {
    const PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isAI: boolean; avatarUrl?: string }[]>([]);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showInviteToast, setShowInviteToast] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [outboundStream, setOutboundStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const mixerContextRef = useRef<AudioContext | null>(null);
    const mixedAiInputStreamRef = useRef<MediaStream | null>(null);
    const aiInputDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const p2pOutputDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const peerSourcesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());
    const localAiSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const localP2pSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const aiSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const [isAiActiveGlobally, setIsAiActiveGlobally] = useState<boolean>(false);
    const [isHost, setIsHost] = useState(false);
    const [sharedAgentActivity, setSharedAgentActivity] = useState<string>("idle");
    const [joinAnnouncements, setJoinAnnouncements] = useState<string[]>([]);

    const localName = useMemo(() => participants[0]?.trim() || "Guest", [participants]);
    const resolvedAvatarUrl = userAvatarUrl || getDefaultAvatar(participants[0] || "User");

    const chatEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const { room, connected, remoteParticipants, broadcastEvent, connectionError, roomPhase, activeSpeakerIds, localIdentity } = useWebRTC(roomId, localName, outboundStream, inviteToken);

    const activeCallUsers = useMemo(
        () => [
            { name: localName || "You", type: "local" as const, id: "local", stream: localStream },
            ...remoteParticipants.map((participant) => ({
                name: participant.name || "User",
                type: "remote" as const,
                id: participant.id,
                stream: participant.stream,
            })),
        ],
        [localName, localStream, remoteParticipants]
    );

    const allParticipantNames = useMemo(() => {
        const names = new Set<string>();
        names.add(localName);
        remoteParticipants.forEach((p) => {
            if (p.name) {
                names.add(p.name.trim());
            } else {
                names.add("User");
            }
        });
        return Array.from(names);
    }, [localName, remoteParticipants]);

    const { sessionStatus, connect, disconnect, agentActivity, aiOutputStream } = useGroupCall({
        participants: allParticipantNames,
        personalityId: PANDIT_PERSONALITY_ID,
        contextType: "pandit",
        isGuestHost: !userProfile,
    });

    const aiAudioRef = useRef<HTMLAudioElement>(null);
    const speakingVideoRef = useRef<HTMLVideoElement>(null);
    const listeningVideoRef = useRef<HTMLVideoElement>(null);
    const prevParticipantsLengthRef = useRef(remoteParticipants.length);
    const activeRemoteSpeakerId = useMemo(
        () => activeSpeakerIds.find((speakerId) => speakerId !== localIdentity) || null,
        [activeSpeakerIds, localIdentity]
    );
    const activeRemoteSpeakerName = useMemo(
        () => remoteParticipants.find((participant) => participant.id === activeRemoteSpeakerId)?.name || null,
        [activeRemoteSpeakerId, remoteParticipants]
    );

    useEffect(() => {
        if (remoteParticipants.length > prevParticipantsLengthRef.current) {
            const newGuest = remoteParticipants[remoteParticipants.length - 1];
            setJoinAnnouncements((prev) => [
                ...prev.slice(-2),
                `${newGuest?.name?.trim() || "A family member"} joined the room.`,
            ]);

            if (isHost && isAiActiveGlobally) {
                broadcastEvent("AI_STATE", { status: "STARTED" });
                broadcastEvent("AI_ACTIVITY", { activity: agentActivity });
            }
        }
        prevParticipantsLengthRef.current = remoteParticipants.length;
    }, [agentActivity, broadcastEvent, isAiActiveGlobally, isHost, remoteParticipants]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

            if (detail.event === "AI_STATE") {
                if (detail.payload.status === "STARTED") {
                    setIsAiActiveGlobally(true);
                } else if (detail.payload.status === "STOPPED") {
                    setIsAiActiveGlobally(false);
                }
            }

            if (detail.event === "AI_ACTIVITY" && !isHost) {
                setSharedAgentActivity(detail.payload.activity);
            }

            if (detail.event === "CHAT_MESSAGE") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        sender: detail.payload.sender,
                        text: detail.payload.text,
                        time: detail.payload.time,
                        isAI: false,
                        avatarUrl: detail.payload.avatarUrl,
                    },
                ]);
            }
        };

        window.addEventListener("livekit-data", handler);
        return () => window.removeEventListener("livekit-data", handler);
    }, [isHost]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    const handleStartPuja = async () => {
        const connectedToAi = await connect(mixedAiInputStreamRef.current);
        if (!connectedToAi) return;

        setIsHost(true);
        setIsAiActiveGlobally(true);
        broadcastEvent("AI_STATE", { status: "STARTED" });
    };

    useEffect(() => {
        if (sessionStatus === "DISCONNECTED" && isHost && isAiActiveGlobally) {
            setIsAiActiveGlobally(false);
            setIsHost(false);
            broadcastEvent("AI_STATE", { status: "STOPPED" });
        }
    }, [sessionStatus, broadcastEvent, isAiActiveGlobally, isHost]);

    useEffect(() => {
        if (isHost && isAiActiveGlobally) {
            setSharedAgentActivity(agentActivity);
            broadcastEvent("AI_ACTIVITY", { activity: agentActivity });
        }
    }, [agentActivity, isHost, isAiActiveGlobally, broadcastEvent]);

    useEffect(() => {
        if (joinAnnouncements.length === 0) return;

        const timer = window.setTimeout(() => {
            setJoinAnnouncements((prev) => prev.slice(1));
        }, 5000);

        return () => window.clearTimeout(timer);
    }, [joinAnnouncements]);

    useEffect(() => {
        if (!speakingVideoRef.current || !listeningVideoRef.current) return;

        const isActive = sessionStatus === "CONNECTED" || isAiActiveGlobally;

        if (isActive && (sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking")) {
            speakingVideoRef.current.play().catch((e) => console.error("Speaking play error:", e));
            listeningVideoRef.current.pause();
        } else {
            listeningVideoRef.current.play().catch((e) => console.error("Listening play error:", e));
            speakingVideoRef.current.pause();
        }
    }, [sessionStatus, isAiActiveGlobally, sharedAgentActivity]);

    useEffect(() => {
        let isMounted = true;
        let activeStream: MediaStream | null = null;
        setCameraError(null);

        const setupMediaAndAudio = async () => {
            let stream: MediaStream | null = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch (err: any) {
                console.error("Camera access error:", err);
                if (isMounted) setCameraError(err.message || "Camera access denied");

                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (audioErr: any) {
                    console.error("Audio fallback error:", audioErr);
                }
            }

            if (!isMounted) {
                if (stream) stream.getTracks().forEach((track) => track.stop());
                return;
            }

            if (stream) {
                activeStream = stream;
                setLocalStream(stream);
            } else {
                setLocalStream(null);
            }

            try {
                const ctx = getSharedAudioContext();
                if (ctx.state === "suspended") void ctx.resume();
                mixerContextRef.current = ctx;

                const aiInputDest = ctx.createMediaStreamDestination();
                mixedAiInputStreamRef.current = aiInputDest.stream;
                aiInputDestRef.current = aiInputDest;

                const p2pOutputDest = ctx.createMediaStreamDestination();
                p2pOutputDestRef.current = p2pOutputDest;

                const outputStream = new MediaStream();
                if (stream && stream.getVideoTracks().length > 0) outputStream.addTrack(stream.getVideoTracks()[0]);
                outputStream.addTrack(p2pOutputDest.stream.getAudioTracks()[0]);
                setOutboundStream(outputStream);

                if (stream && stream.getAudioTracks().length > 0) {
                    const localAiSource = ctx.createMediaStreamSource(stream);
                    const localP2pSource = ctx.createMediaStreamSource(stream);
                    localAiSource.connect(aiInputDest);
                    localP2pSource.connect(p2pOutputDest);
                    localAiSourceRef.current = localAiSource;
                    localP2pSourceRef.current = localP2pSource;
                }
            } catch (e) {
                console.error("Web Audio setup error:", e);
                if (stream) setOutboundStream(stream);
            }
        };

        setupMediaAndAudio();

        return () => {
            isMounted = false;
            if (activeStream) activeStream.getTracks().forEach((track) => track.stop());
            p2pOutputDestRef.current = null;
            aiInputDestRef.current = null;
            peerSourcesRef.current.forEach((source) => source.disconnect());
            peerSourcesRef.current.clear();
            if (aiSourceRef.current) {
                aiSourceRef.current.disconnect();
                aiSourceRef.current = null;
            }
            if (localAiSourceRef.current) {
                localAiSourceRef.current.disconnect();
                localAiSourceRef.current = null;
            }
            if (localP2pSourceRef.current) {
                localP2pSourceRef.current.disconnect();
                localP2pSourceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach((track) => {
            track.enabled = !isVideoOff;
        });
    }, [isVideoOff, localStream]);

    useEffect(() => {
        if (aiAudioRef.current && aiOutputStream) {
            aiAudioRef.current.srcObject = aiOutputStream;
        }

        const ctx = mixerContextRef.current;
        const p2pOutputDest = p2pOutputDestRef.current;
        if (!ctx || !p2pOutputDest || !aiOutputStream) return;

        if (aiSourceRef.current) {
            try {
                aiSourceRef.current.disconnect();
            } catch {
                // ignore disconnect race
            }
            aiSourceRef.current = null;
        }

        if (aiOutputStream.getAudioTracks().length > 0) {
            try {
                const aiSource = ctx.createMediaStreamSource(aiOutputStream);
                aiSource.connect(p2pOutputDest);
                aiSourceRef.current = aiSource;
                console.log("AI audio routed to P2P and local speakers");
            } catch (e) {
                console.error("Failed to connect AI output:", e);
            }
        }
    }, [aiOutputStream]);

    useEffect(() => {
        const ctx = mixerContextRef.current;
        const aiInputDest = aiInputDestRef.current;
        if (!ctx || !aiInputDest || !isHost) return;

        const remoteIds = new Set(remoteParticipants.map((p) => p.id));

        peerSourcesRef.current.forEach((source, id) => {
            if (!remoteIds.has(id) || (activeRemoteSpeakerId && id !== activeRemoteSpeakerId)) {
                try {
                    source.disconnect();
                } catch {
                    // ignore disconnect race
                }
                peerSourcesRef.current.delete(id);
            }
        });

        remoteParticipants.forEach((participant) => {
            if (activeRemoteSpeakerId && participant.id !== activeRemoteSpeakerId) {
                return;
            }

            if (!peerSourcesRef.current.has(participant.id) && participant.stream.getAudioTracks().length > 0) {
                try {
                    const peerSource = ctx.createMediaStreamSource(participant.stream);
                    peerSource.connect(aiInputDest);
                    peerSourcesRef.current.set(participant.id, peerSource);
                    console.log(`Remote peer ${participant.id} audio piped to AI input`);
                } catch (e) {
                    console.error(`Failed to connect remote peer ${participant.id} audio: `, e);
                }
            }
        });
    }, [remoteParticipants, isHost, activeRemoteSpeakerId]);

    useEffect(() => {
        const localAiSource = localAiSourceRef.current;
        const aiInputDest = aiInputDestRef.current;
        if (!localAiSource || !aiInputDest || !isHost) return;

        try {
            localAiSource.disconnect(aiInputDest);
        } catch {
            // Ignore disconnect races while LiveKit updates the active speaker list.
        }

        if (!activeRemoteSpeakerId) {
            try {
                localAiSource.connect(aiInputDest);
            } catch {
                // Ignore duplicate connection races.
            }
        }
    }, [activeRemoteSpeakerId, isHost]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const senderName = participants[0] || "User";

        const newMsg = {
            id: Date.now(),
            sender: senderName,
            text: chatMessage,
            time,
            isAI: false,
            avatarUrl: resolvedAvatarUrl,
        };

        setMessages((prev) => [...prev, newMsg]);
        broadcastEvent("CHAT_MESSAGE", { sender: senderName, text: chatMessage, time, avatarUrl: resolvedAvatarUrl });
        setChatMessage("");
    };

    const copyInviteLink = async () => {
        const url = `${window.location.origin}/pandit?room=${encodeURIComponent(roomId)}${inviteToken ? `&invite=${encodeURIComponent(inviteToken)}` : ""}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join my Live Puja",
                    text: "Join me for a live puja session with Smart Pandit.",
                    url,
                });
                return;
            } catch {
                // fallback to clipboard
            }
        }

        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setShowInviteToast(true);
        setTimeout(() => setLinkCopied(false), 3000);
        setTimeout(() => setShowInviteToast(false), 5000);
    };

    const roomActive = sessionStatus === "CONNECTED" || isAiActiveGlobally;

    useEffect(() => {
        if (!roomActive) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [roomActive]);

    return (
        <div className="relative flex min-h-screen w-full overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(233,202,160,0.35),_transparent_35%),linear-gradient(180deg,#f7f1e6_0%,#efe6d6_100%)] p-2 lg:p-4">
            <div className="relative z-10 flex min-h-[900px] w-full flex-col overflow-hidden rounded-[20px] border border-white/70 bg-[#fffaf2]/90 shadow-[0_30px_80px_rgba(77,55,24,0.15)] backdrop-blur-xl transition-all duration-300 lg:rounded-[32px]">
                <header className="shrink-0 border-b border-[#eadfcf] bg-white/70 px-4 py-4 lg:px-8 lg:py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <img src="/assets/landing/logo.png" alt="SmartMurti Logo" className="h-7 object-contain lg:h-9" />
                            <div className="hidden h-10 w-px bg-[#eadfcf] sm:block" />
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a27f47]">Live Family Puja</p>
                                <h1 className="font-lora text-xl text-[#26190f] lg:text-2xl">Smart Pandit Room</h1>
                                <p className="text-sm text-[#7a6651]">Room {roomId.slice(0, 8)} · {activeCallUsers.length} family members present</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="/home"
                                className="inline-flex items-center gap-2 rounded-full border border-[#e6dac6] bg-white px-4 py-2 text-sm font-semibold text-[#5b4936] transition hover:border-[#d6c4a7] hover:bg-[#fff8ee]"
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </a>
                            <button
                                className="inline-flex items-center gap-2 rounded-full bg-[#f3ead8] px-4 py-2 text-sm font-semibold text-[#7a5a22] transition hover:bg-[#ebddc2]"
                                onClick={copyInviteLink}
                            >
                                {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                {linkCopied ? "Copied invite" : "Invite family"}
                            </button>
                            <div className="flex items-center gap-3 rounded-full border border-[#eadfcf] bg-white px-2 py-1.5 shadow-sm">
                                <img src={resolvedAvatarUrl} alt="User" className="h-8 w-8 rounded-full border border-[#eadfcf] object-cover" />
                                <span className="pr-2 text-sm font-medium text-[#4a3929]">{participants[0] || "You"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#eadfcf] bg-[#fff8ee] px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#aa7b2b]">Purpose</p>
                            <p className="mt-1 text-sm text-[#5c4734]">Gather your family, speak naturally, and let Smart Pandit guide one calm ritual flow.</p>
                        </div>
                        <div className="rounded-2xl border border-[#eadfcf] bg-[#fff8ee] px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#aa7b2b]">Status</p>
                            <p className="mt-1 text-sm text-[#5c4734]">
                                {roomActive ? "Puja is active now." : isOriginalHost ? "Start when your family is ready." : "Waiting for the host to begin."}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#eadfcf] bg-[#fff8ee] px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#aa7b2b]">Guidance</p>
                            <p className="mt-1 text-sm text-[#5c4734]">
                                {activeRemoteSpeakerName
                                    ? `${activeRemoteSpeakerName} has the floor. Everyone else should pause for a clean Pandit response.`
                                    : "One speaker at a time. Smart Pandit listens to the active speaker so the ritual does not get confused."}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="w-full flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                        <section className="min-w-0">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a27f47]">Family Presence</p>
                                    <h2 className="mt-1 font-lora text-2xl text-[#26190f]">Pandit, family, and ritual flow</h2>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white px-4 py-2 text-sm font-medium text-[#5f4d3a] shadow-sm">
                                    <Users className="h-4 w-4 text-[#aa7b2b]" />
                                    {activeCallUsers.length} in room
                                </div>
                            </div>

                            <div className="scrollbar-hide mb-4 flex gap-3 overflow-x-auto pb-2">
                                <div className="min-w-[min(100%,840px)] flex-1">
                                    <FamilyPresenceGrid room={room} />
                                </div>

                                {!connected && (
                                    <div className="flex h-[108px] w-[148px] shrink-0 flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#d6c7b0] bg-white/60 text-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-transparent border-t-[#aa7b2b]" />
                                        <span className="px-2 text-xs font-semibold text-[#7d6852]">
                                            {roomPhase === "reconnecting" ? "Reconnecting family network" : "Family network syncing"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-[#2b1f17]/10 bg-[#1d1712] shadow-[0_25px_60px_rgba(38,25,15,0.25)] md:min-h-[520px] xl:min-h-[640px]">
                                {sessionStatus === "DISCONNECTED" && !isAiActiveGlobally && isOriginalHost && (
                                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-black/80 text-white">
                                        <div className="mb-8 flex h-12 w-16 items-center justify-center rounded-2xl border border-[#20bd5c]/30 bg-[#20bd5c]/20 shadow-[0_0_30px_rgba(32,189,92,0.2)]">
                                            <VideoIcon className="h-6 w-6 text-[#25D366]" />
                                        </div>
                                        <h2 className="mb-3 text-center font-lora text-2xl font-bold">Ready to start the puja?</h2>
                                        <p className="mb-10 max-w-sm text-center text-sm text-gray-300">Ensure your camera and microphone are ready. Smart Pandit is waiting for the family to begin.</p>
                                        <button
                                            onClick={handleStartPuja}
                                            className="flex items-center gap-2 rounded-full bg-[#1da851] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#1da851]/20 transition-all hover:bg-[#199446]"
                                        >
                                            <Mic className="h-4 w-4" /> Start Live Puja
                                        </button>
                                    </div>
                                )}

                                {sessionStatus === "DISCONNECTED" && !isAiActiveGlobally && !isOriginalHost && (
                                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-black/80 text-white">
                                        <div className="mb-8 flex h-12 w-16 items-center justify-center rounded-2xl border border-[#20bd5c]/30 bg-[#20bd5c]/20 shadow-[0_0_30px_rgba(32,189,92,0.2)]">
                                            <VideoIcon className="h-6 w-6 text-[#25D366]" />
                                        </div>
                                        <h2 className="mb-3 text-center font-lora text-2xl font-bold">Ashram preparation</h2>
                                        <p className="mb-10 max-w-sm text-center text-sm text-gray-300">Please wait while the host starts the puja. Keep your microphone and camera ready.</p>
                                    </div>
                                )}

                                {sessionStatus === "DISCONNECTED" && isAiActiveGlobally && (
                                    <div className="absolute right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-white shadow-lg backdrop-blur-md">
                                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                        <p className="text-xs font-medium">Host started the puja</p>
                                    </div>
                                )}

                                {sessionStatus === "CONNECTING" && (
                                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-md">
                                        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-r-emerald-500 border-t-emerald-500" />
                                        <p className="text-lg font-medium text-emerald-100">Connecting to the ashram...</p>
                                        <p className="mt-2 text-sm text-gray-400">Initializing group context for {allParticipantNames.join(", ")}</p>
                                    </div>
                                )}

                                {roomPhase === "reconnecting" && (
                                    <div className="absolute left-6 top-20 z-40 rounded-2xl border border-amber-300/25 bg-black/55 px-4 py-3 text-sm font-medium text-amber-50 shadow-xl backdrop-blur-md">
                                        Family network is reconnecting. Keep the puja open and we will restore everyone automatically.
                                    </div>
                                )}

                                {roomActive && activeRemoteSpeakerName && (
                                    <div className="absolute left-6 top-20 z-40 rounded-2xl border border-emerald-300/25 bg-black/55 px-4 py-3 text-sm font-medium text-emerald-50 shadow-xl backdrop-blur-md">
                                        Speaking floor: {activeRemoteSpeakerName}. Smart Pandit is focusing on this voice.
                                    </div>
                                )}

                                {connectionError && (
                                    <div className="absolute left-6 top-20 z-40 max-w-md rounded-2xl border border-red-300/25 bg-red-950/70 px-4 py-3 text-sm font-medium text-red-50 shadow-xl backdrop-blur-md">
                                        Room issue: {connectionError}
                                    </div>
                                )}

                                {joinAnnouncements.length > 0 && (
                                    <div className="absolute right-4 top-20 z-40 flex max-w-sm flex-col gap-2">
                                        {joinAnnouncements.map((note, index) => (
                                            <div
                                                key={`${note}-${index}`}
                                                className="rounded-2xl border border-white/15 bg-black/55 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-md"
                                            >
                                                {note}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <video
                                    ref={speakingVideoRef}
                                    src="/assets/Video_Project_2_optimized.mp4"
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${(roomActive && (sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking")) ? "z-10 opacity-100" : "-z-10 opacity-0"}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                />
                                <video
                                    ref={listeningVideoRef}
                                    src="/assets/Silently_paying_attention_optimized.mp4"
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${(!roomActive || sharedAgentActivity === "listening" || sharedAgentActivity === "idle") ? "z-0 opacity-100" : "-z-10 opacity-0"}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                />

                                <audio ref={aiAudioRef} autoPlay playsInline className="hidden" />

                                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-black/80 to-transparent" />

                                <div className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                                    <Sparkles className="h-4 w-4 text-[#f2c56c]" />
                                    {sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking" ? "Smart Pandit is guiding the ritual" : "Smart Pandit is listening"}
                                </div>

                                <div className={`absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors ${sharedAgentActivity === "listening" || sharedAgentActivity === "idle" ? "border-blue-500/50 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : sharedAgentActivity === "speaking" ? "border-green-500/50 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-gray-500/50 bg-gray-500/20"}`}>
                                    <Mic className={`h-5 w-5 ${sharedAgentActivity === "speaking" ? "text-green-400" : "text-blue-400"}`} />
                                </div>

                                <div className="absolute bottom-24 left-6 right-6 z-20 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div className="max-w-xl rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f2c56c]">Ritual Flow</p>
                                        <p className="mt-2 text-lg font-medium text-white">
                                            {roomActive
                                                ? "Stay present. Smart Pandit will guide each step and respond to your family naturally."
                                                : "Settle your family, check your camera and microphone, then begin the live puja when ready."}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/35 p-2.5 shadow-2xl backdrop-blur-md">
                                    <button
                                        onClick={() => setIsVideoOff(!isVideoOff)}
                                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isVideoOff ? "bg-white text-gray-900" : "bg-white/20 text-white hover:bg-white/30"}`}
                                    >
                                        {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
                                    </button>
                                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                                        <AudioLines className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newMuted = !isMuted;
                                            setIsMuted(newMuted);
                                            localStream?.getAudioTracks().forEach((t) => {
                                                t.enabled = !newMuted;
                                            });
                                        }}
                                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isMuted ? "bg-white text-gray-900" : "bg-white/20 text-white hover:bg-white/30"}`}
                                    >
                                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                    </button>
                                    <button
                                        onClick={onLeave}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
                                    >
                                        <PhoneOff className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-[24px] border border-[#eadfcf] bg-white/80 p-5 shadow-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a27f47]">Before you continue</p>
                                    <p className="mt-2 text-sm leading-6 text-[#5a4632]">
                                        Keep one calm speaker at a time, invite relatives before the main chant begins, and let Smart Pandit handle the sequence of the puja.
                                    </p>
                                    {cameraError && (
                                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            Camera issue: {cameraError}. Audio will continue, and your family can still stay in the ritual room.
                                        </div>
                                    )}
                                </div>
                                <div className="rounded-[24px] border border-[#eadfcf] bg-white/80 p-5 shadow-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a27f47]">Live session signal</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex flex-1 items-center justify-center gap-1 opacity-70">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`w-1.5 rounded-full ${agentActivity === "speaking" ? "bg-green-500" : "bg-[#aa7b2b]"}`}
                                                    animate={{
                                                        height:
                                                            agentActivity === "speaking" || agentActivity === "thinking"
                                                                ? ["12px", `${24 + (i % 4) * 6}px`, "12px"]
                                                                : "6px",
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 0.5 + (i % 3) * 0.2,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-[#2a211a] px-3 py-2 text-xs font-semibold text-white">
                                            <div className={`h-2.5 w-2.5 rounded-full ${roomActive ? "bg-emerald-400 animate-pulse" : "bg-white/50"}`} />
                                            {roomActive ? "Live now" : "Standby"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <aside className="flex min-h-[580px] flex-col overflow-hidden rounded-[28px] border border-[#eadfcf] bg-white/82 shadow-sm">
                            <div className="border-b border-[#efe3d2] px-5 py-5">
                                <div className="flex items-center gap-3">
                                    <img src="/assets/Pandit Performing Aarti.jpg" alt="Pandit Ji" className="h-11 w-11 rounded-full border border-[#f1d8aa] object-cover" />
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#aa7b2b]">Guidance Rail</p>
                                        <h3 className="font-lora text-xl text-[#26190f]">Smart Pandit Notes</h3>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-[#65513e]">
                                    Keep family coordination here. This panel is intentionally light so the ritual stays at the center.
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-b border-[#efe3d2] px-5 py-4 text-sm">
                                <div className="flex items-center gap-2 text-[#5d4a36]">
                                    <MessageSquare className="h-4 w-4 text-[#aa7b2b]" />
                                    Family chat
                                </div>
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${roomActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
                                    <span className={`h-2 w-2 rounded-full ${roomActive ? "bg-emerald-500" : "bg-stone-400"}`} />
                                    {activeCallUsers.length} in room
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                                {messages.length === 0 ? (
                                    <div className="rounded-[22px] border border-dashed border-[#dfd1bb] bg-[#fff8ee] p-5 text-sm leading-6 text-[#715d48]">
                                        Use this rail for short family coordination, like letting late relatives know the puja has started or asking everyone to stay unmuted when speaking.
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="flex gap-3">
                                            {msg.isAI ? (
                                                <img src="/assets/Pandit Performing Aarti.jpg" alt="Pandit Ji" className="mt-1 h-8 w-8 shrink-0 rounded-full border border-[#f1d8aa] object-cover" />
                                            ) : (
                                                <img src={msg.avatarUrl || getDefaultAvatar(msg.sender)} alt={msg.sender} className="mt-1 h-8 w-8 shrink-0 rounded-full border border-[#eadfcf] object-cover" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center justify-between gap-2 text-xs text-[#8a7865]">
                                                    <span className="font-medium">{msg.sender}</span>
                                                    <span>{msg.time}</span>
                                                </div>
                                                <div className={`rounded-2xl p-3 text-sm leading-6 shadow-sm ${msg.isAI ? "border border-[#f1e6d5] bg-[#fff8ee] text-[#594634]" : "bg-[#8f5d23] text-white"}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="border-t border-[#efe3d2] bg-white/90 px-5 py-4">
                                <form className="relative" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Send a short note to your family..."
                                        className="w-full rounded-2xl border border-[#e3d5bf] bg-[#fffdf9] py-3.5 pl-4 pr-12 text-sm font-medium text-[#4c3a29] shadow-sm transition-all focus:border-[#cda96a] focus:outline-none focus:ring-2 focus:ring-[#e8d2a7]/40"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatMessage.trim()}
                                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#8f5d23] text-white shadow-md transition-colors hover:bg-[#7b4f1e] disabled:bg-stone-300"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </aside>
                    </div>

                    <AnimatePresence>
                        {showInviteToast && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#26190f] px-6 py-3 text-white shadow-2xl"
                            >
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                <span className="text-sm font-medium">Invite link copied. Share it with your family.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="pointer-events-none absolute top-0 right-0 z-0 h-1/2 w-1/3 rounded-full bg-[#f0c680]/20 blur-[160px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-1/2 w-1/2 rounded-full bg-[#d6b48b]/25 blur-[160px]" />
        </div>
    );
}

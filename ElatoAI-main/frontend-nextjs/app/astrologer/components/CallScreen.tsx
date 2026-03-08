import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Bell, Video as VideoIcon, MessageSquare, Users, FolderOpen, Calendar, Settings, Sun, Moon, Maximize2, Send, ImageIcon, AudioLines, PhoneOff, VideoOff, MicOff, Mic, User, Copy, UserPlus, CheckCircle2, Star } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import { useGroupCall } from '../../pandit/hooks/useGroupCall';
import { useWebRTC } from '../../pandit/hooks/useWebRTC';
import { useMicrophoneVolume } from '../../pandit/hooks/useMicrophoneVolume';

// Keep track of audio contexts to prevent memory leaks
export const getSharedAudioContext = () => {
    if (!(window as any).sharedAudioCtx) {
        (window as any).sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return (window as any).sharedAudioCtx as AudioContext;
};

interface CallScreenProps {
    participants: string[];
    roomId: string;
    onLeave: () => void;
    isOriginalHost?: boolean;
    userAvatarUrl?: string | null;
}

// Helper component for remote video
const RemoteVideo = ({ stream }: { stream: MediaStream | undefined | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !stream) return;
        try {
            video.srcObject = stream;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.warn("Autoplay blocked:", e));
            }
        } catch (e) {
            console.error("Failed to assign RemoteVideo stream", e);
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-900" />;
};

// Generate a default avatar using DiceBear API
const getDefaultAvatar = (name: string) => {
    const seed = encodeURIComponent(name || 'user');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=c084fc,f59e0b,ec4899&backgroundType=gradientLinear`;
};

export default function CallScreen({ participants, roomId, onLeave, isOriginalHost = false, userAvatarUrl }: CallScreenProps) {
    // Use The Astrologer personality
    const ASTROLOGER_PERSONALITY_ID = "dc2af2af-7839-4787-ad00-3213371be71e";

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // UI States
    const [activeTab, setActiveTab] = useState('ASTROLOGER');
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isAI: boolean; avatarUrl?: string }[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [showMuhurtaWidget, setShowMuhurtaWidget] = useState(true);

    // Family Meet States
    const [linkCopied, setLinkCopied] = useState(false);
    const [showInviteToast, setShowInviteToast] = useState(false);

    // Camera/Audio States
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [outboundStream, setOutboundStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Audio Mixing Refs
    const mixerContextRef = useRef<AudioContext | null>(null);
    const mixedAiInputStreamRef = useRef<MediaStream | null>(null);
    const aiInputDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const p2pOutputDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const peerSourcesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());
    const aiSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // Shared State
    const [isAiActiveGlobally, setIsAiActiveGlobally] = useState<boolean>(false);
    const [isHost, setIsHost] = useState(false);
    const [sharedAgentActivity, setSharedAgentActivity] = useState<string>("idle");

    const localName = useMemo(() => participants.join(", "), [participants]);

    // Notification state
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const notifications = [
        { id: 1, text: "⭐ Your daily horoscope is ready!", time: "2 min ago", read: false },
        { id: 2, text: "🌙 Mercury retrograde starts tomorrow", time: "1 hr ago", read: false },
        { id: 3, text: "🔮 Your birth chart analysis is complete", time: "3 hrs ago", read: true },
    ];
    const unreadCount = notifications.filter(n => !n.read).length;

    // Resolve avatar URL with fallback
    const resolvedAvatarUrl = userAvatarUrl || getDefaultAvatar(participants[0] || 'User');

    // Chat auto-scroll ref
    const chatEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 1. Initialize WebRTC
    const { connected, remoteParticipants, broadcastEvent, channel, debugLogs } = useWebRTC(roomId, localName, outboundStream);

    // 2. Consolidate users
    const activeCallUsers = useMemo(() => [
        { name: localName || "You", type: 'local', id: 'local', stream: localStream },
        ...remoteParticipants.map(participant => ({
            name: participant.name || "User",
            type: 'remote',
            id: participant.id,
            stream: participant.stream
        }))
    ], [localName, localStream, remoteParticipants]);

    // 3. Compute participant names
    const allParticipantNames = useMemo(() => {
        const names = new Set<string>();
        participants.forEach(p => names.add(p));
        remoteParticipants.forEach(p => {
            if (p.name) {
                p.name.split(',').forEach(n => names.add(n.trim()));
            } else {
                names.add("User");
            }
        });
        return Array.from(names);
    }, [participants, remoteParticipants]);

    // 4. Initialize AI Group Call
    const { sessionStatus, connect, disconnect, agentActivity, aiOutputStream, sendMessageToAI } = useGroupCall({
        participants: allParticipantNames,
        personalityId: ASTROLOGER_PERSONALITY_ID,
        contextType: 'astrologer'
    });

    const videoGridRef = useRef<HTMLDivElement>(null);
    const aiAudioRef = useRef<HTMLAudioElement>(null);
    const speakingVideoRef = useRef<HTMLVideoElement>(null);
    const listeningVideoRef = useRef<HTMLVideoElement>(null);

    // Notify AI when a guest joins late
    const prevParticipantsLengthRef = useRef(remoteParticipants.length);
    useEffect(() => {
        if (remoteParticipants.length > prevParticipantsLengthRef.current) {
            const newParticipants = remoteParticipants.slice(prevParticipantsLengthRef.current);
            newParticipants.forEach(p => {
                if (isHost && sessionStatus === "CONNECTED" && sendMessageToAI) {
                    sendMessageToAI(`[System] A new participant "${p.name}" has just joined the session. Welcome them warmly and ask about their zodiac sign or birth details.`);
                }
            });
        }
        prevParticipantsLengthRef.current = remoteParticipants.length;
    }, [remoteParticipants, isHost, sessionStatus, sendMessageToAI]);

    // Listen for LiveKit data events
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (!detail) return;

            if (detail.event === 'AI_STATE') {
                if (detail.payload.status === "STARTED") {
                    setIsAiActiveGlobally(true);
                } else if (detail.payload.status === "STOPPED") {
                    setIsAiActiveGlobally(false);
                }
            }
            if (detail.event === 'AI_ACTIVITY' && !isHost) {
                setSharedAgentActivity(detail.payload.activity);
            }
            if (detail.event === 'ACTIVE_SPEAKER') {
                if (isHost && sessionStatus === "CONNECTED" && sendMessageToAI) {
                    sendMessageToAI(`[Speaker: ${detail.payload.name}] is now speaking. Address them by name in your response.`);
                }
            }
            if (detail.event === 'CHAT_MESSAGE') {
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    sender: detail.payload.sender,
                    text: detail.payload.text,
                    time: detail.payload.time,
                    isAI: false,
                    avatarUrl: detail.payload.avatarUrl,
                }]);
            }
        };

        window.addEventListener('livekit-data', handler);
        return () => window.removeEventListener('livekit-data', handler);
    }, [isHost, sessionStatus, sendMessageToAI]);

    // Track active speaking for this client
    const handleActiveSpeakerChange = useCallback((isSpeaking: boolean) => {
        if (isSpeaking && !isMuted && channel) {
            broadcastEvent('ACTIVE_SPEAKER', { name: localName });
            if (isHost && sessionStatus === "CONNECTED" && sendMessageToAI) {
                sendMessageToAI(`[Speaker: ${localName}] is now speaking. Address them by name in your response.`);
            }
        }
    }, [isMuted, channel, broadcastEvent, localName, isHost, sessionStatus, sendMessageToAI]);

    useMicrophoneVolume(localStream, handleActiveSpeakerChange);

    // Start/Stop the AI session
    const handleStartSession = useCallback(async () => {
        if (!mixedAiInputStreamRef.current) {
            console.error("No mixed audio stream available yet");
            return;
        }
        setIsHost(true);
        setIsAiActiveGlobally(true);
        broadcastEvent('AI_STATE', { status: "STARTED" });
        await connect(mixedAiInputStreamRef.current);
    }, [connect, broadcastEvent]);

    const handleStopSession = useCallback(async () => {
        await disconnect();
        setIsHost(false);
        setIsAiActiveGlobally(false);
        broadcastEvent('AI_STATE', { status: "STOPPED" });
    }, [disconnect, broadcastEvent]);

    // Host broadcasts activity
    useEffect(() => {
        if (isHost && isAiActiveGlobally) {
            setSharedAgentActivity(agentActivity);
            broadcastEvent('AI_ACTIVITY', { activity: agentActivity });
        }
    }, [agentActivity, isHost, isAiActiveGlobally, broadcastEvent]);

    // Video playback control
    useEffect(() => {
        if (!speakingVideoRef.current || !listeningVideoRef.current) return;
        const isActive = sessionStatus === "CONNECTED" || isAiActiveGlobally;
        if (isActive && (sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking")) {
            speakingVideoRef.current.play().catch(e => console.error("Speaking play error:", e));
            listeningVideoRef.current.pause();
        } else {
            listeningVideoRef.current.play().catch(e => console.error("Listening play error:", e));
            speakingVideoRef.current.pause();
        }
    }, [sessionStatus, isAiActiveGlobally, sharedAgentActivity]);

    // Device Setup & Web Audio Bootstrap — runs ONCE on mount
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
                if (stream) stream.getTracks().forEach(track => track.stop());
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
                if (ctx.state === 'suspended') void ctx.resume();
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
                    const localSource = ctx.createMediaStreamSource(stream);
                    localSource.connect(aiInputDest);
                    localSource.connect(p2pOutputDest);
                }
            } catch (e) {
                console.error("Web Audio setup error:", e);
                if (stream) setOutboundStream(stream);
            }
        };

        setupMediaAndAudio();

        return () => {
            isMounted = false;
            if (activeStream) activeStream.getTracks().forEach(track => track.stop());
            if (p2pOutputDestRef.current) p2pOutputDestRef.current = null;
            if (aiInputDestRef.current) aiInputDestRef.current = null;
            peerSourcesRef.current.forEach(source => source.disconnect());
            peerSourcesRef.current.clear();
            if (aiSourceRef.current) {
                aiSourceRef.current.disconnect();
                aiSourceRef.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Toggle video track on/off without recreating media pipeline
    useEffect(() => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !isVideoOff;
        });
    }, [isVideoOff, localStream]);

    // Mix AI Output
    useEffect(() => {
        if (aiAudioRef.current && aiOutputStream) {
            aiAudioRef.current.srcObject = aiOutputStream;
        }

        const ctx = mixerContextRef.current;
        const p2pDest = p2pOutputDestRef.current;

        if (ctx && p2pDest && aiOutputStream && aiOutputStream.getAudioTracks().length > 0) {
            if (aiSourceRef.current) {
                aiSourceRef.current.disconnect();
            }
            try {
                const newAiSource = ctx.createMediaStreamSource(aiOutputStream);
                newAiSource.connect(p2pDest);
                aiSourceRef.current = newAiSource;
            } catch (e) {
                console.error("Failed to connect AI audio to P2P:", e);
            }
        }
    }, [aiOutputStream]);

    // Mix remote peers into AI input (with cleanup of stale peers)
    useEffect(() => {
        const ctx = mixerContextRef.current;
        const aiInputDest = aiInputDestRef.current;
        if (!ctx || !aiInputDest || !isHost) return;

        // Current participant IDs
        const remoteIds = new Set(remoteParticipants.map(p => p.id));

        // Cleanup dropped peers
        peerSourcesRef.current.forEach((source, id) => {
            if (!remoteIds.has(id)) {
                try { source.disconnect(); } catch (e) { }
                peerSourcesRef.current.delete(id);
            }
        });

        // Add new remote peer audio to the AI input mixer
        remoteParticipants.forEach(participant => {
            if (!peerSourcesRef.current.has(participant.id) && participant.stream.getAudioTracks().length > 0) {
                try {
                    const peerSource = ctx.createMediaStreamSource(participant.stream);
                    peerSource.connect(aiInputDest);
                    peerSourcesRef.current.set(participant.id, peerSource);
                } catch (e) {
                    console.error(`Failed to connect remote peer ${participant.id} audio: `, e);
                }
            }
        });
    }, [remoteParticipants, isHost]);

    const handleVideoRef = useCallback((node: HTMLVideoElement | null) => {
        if (node) {
            node.srcObject = localStream;
        }
    }, [localStream]);

    // Handle Sending Chat Messages — broadcast via LiveKit
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const senderName = participants[0] || 'User';

        const newMsg = {
            id: Date.now(),
            sender: senderName,
            text: chatMessage,
            time,
            isAI: false,
            avatarUrl: resolvedAvatarUrl,
        };

        setMessages(prev => [...prev, newMsg]);
        broadcastEvent('CHAT_MESSAGE', {
            sender: senderName,
            text: chatMessage,
            time,
            avatarUrl: resolvedAvatarUrl,
        });

        setChatMessage('');
    };

    // Invite Link Logic
    const copyInviteLink = () => {
        const url = `${window.location.origin}/astrologer?room=${roomId}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setShowInviteToast(true);
        setTimeout(() => setLinkCopied(false), 3000);
        setTimeout(() => setShowInviteToast(false), 5000);
    };

    return (
        <div className="min-h-screen w-full bg-[#E0E4F4] relative flex p-2 lg:p-[2vh] overflow-y-auto">

            {/* Main App Container */}
            <div className="w-full min-h-[900px] bg-[#f2f1f9]/90 backdrop-blur-2xl rounded-[16px] lg:rounded-[32px] shadow-2xl border border-white/40 flex flex-col relative z-10 transition-all duration-300">

                {/* TOP HEADER BAR */}
                <header className="h-[60px] lg:h-[80px] w-full flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/landing/logo.png"
                            alt="SmartMurti Logo"
                            className="h-6 lg:h-8 object-contain"
                        />
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-500">
                        {[
                            { label: 'PANDIT', href: '/pandit' },
                            { label: 'ASTROLOGER', href: '/astrologer' },
                            { label: 'LOVE ADVISOR', href: '#' },
                            { label: 'MAHURAT', href: '#' },
                            { label: 'PUJA', href: '#' },
                            { label: 'SERVICE', href: '#' },
                        ].map(tab => (
                            <a
                                key={tab.label}
                                href={tab.href}
                                className={`relative px-1 py-2 transition-colors ${activeTab === tab.label ? 'text-gray-900' : 'hover:text-gray-700'}`}
                            >
                                {tab.label}
                                {activeTab === tab.label && (
                                    <motion.div layoutId="nav-indicator-astro" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900" />
                                )}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-amber-100 transition-colors" onClick={copyInviteLink}>
                            {linkCopied ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {linkCopied ? 'Copied!' : 'Invite Family'}
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 transition-all border border-gray-100" onClick={() => alert("Search functionality coming soon")}>
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 relative transition-all border border-gray-100"
                                onClick={() => { setShowNotifications(!showNotifications); setShowAvatarMenu(false); }}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 border-b border-gray-100">
                                            <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {notifications.map((n) => (
                                                <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 ${!n.read ? 'bg-amber-50/40' : ''}`}>
                                                    <p className="text-sm text-gray-700">{n.text}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                                            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium w-full text-center" onClick={() => setShowNotifications(false)}>Mark all as read</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Avatar */}
                        <div className="relative">
                            <button
                                className="w-10 h-10 rounded-full overflow-hidden shadow-sm border-2 border-white cursor-pointer hover:border-amber-300 transition-all"
                                onClick={() => { setShowAvatarMenu(!showAvatarMenu); setShowNotifications(false); }}
                            >
                                <img src={resolvedAvatarUrl} alt="User" className="w-full h-full object-cover" />
                            </button>
                            <AnimatePresence>
                                {showAvatarMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                                            <img src={resolvedAvatarUrl} alt="User" className="w-8 h-8 rounded-full object-cover border border-amber-200" />
                                            <p className="font-semibold text-sm text-gray-800 truncate">{participants[0] || 'User'}</p>
                                        </div>
                                        <a href="/home/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors">
                                            <Settings className="w-4 h-4 inline mr-2" />Profile & Settings
                                        </a>
                                        <a href="/home" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors border-t border-gray-50">
                                            <User className="w-4 h-4 inline mr-2" />Go to Home
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 w-full flex max-lg:flex-col overflow-y-auto overflow-x-hidden lg:overflow-hidden p-4 lg:p-6 pt-2 gap-4 lg:gap-6">

                    {/* LEFT SIDEBAR */}
                    <aside className="hidden lg:flex w-[60px] shrink-0 flex-col items-center gap-4 py-4 z-20">
                        <div className="flex flex-col gap-4 w-full items-center bg-white/60 p-2 rounded-full shadow-sm shadow-black/5 pb-6">
                            <button className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center shadow-md">
                                <VideoIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isChatOpen ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white text-gray-500'}`}
                                title="Toggle Chat"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button
                                onClick={copyInviteLink}
                                className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors"
                                title="Invite Family"
                            >
                                <Users className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors" onClick={() => alert("Astrology tools coming soon")}>
                                <Star className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowMuhurtaWidget(!showMuhurtaWidget)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showMuhurtaWidget ? 'bg-amber-100 text-amber-600' : 'hover:bg-white text-gray-500'}`}
                                title="Toggle Muhurtas"
                            >
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors" onClick={() => alert("Settings coming soon")}>
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-auto flex flex-col gap-2 w-full items-center bg-white/60 p-2 rounded-full shadow-sm shadow-black/5">
                            <button className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center shadow-md">
                                <Sun className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
                                <Moon className="w-4 h-4" />
                            </button>
                        </div>
                    </aside>

                    {/* CENTER STAGE */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="mb-4">
                            <h1 className="text-3xl lg:text-4xl font-lora font-medium text-gray-900 tracking-tight">Your Stars, Your Destiny. ✨</h1>
                        </div>
                        <div className="flex-1 flex max-xl:flex-col flex-row gap-4 min-h-[400px] relative">

                            {/* Participant Ticker Column */}
                            <div className="w-full xl:w-[220px] shrink-0 flex max-xl:flex-row flex-col gap-4 max-xl:overflow-x-auto overflow-y-auto pb-2 xl:pb-4 scrollbar-hide">
                                {activeCallUsers.map((user, i) => (
                                    <div key={i} className="relative w-[140px] xl:w-full shrink-0 aspect-[4/3] rounded-[16px] xl:rounded-[24px] overflow-hidden bg-gray-200 shadow-sm border border-black/5 group">
                                        {user.type === 'local' ? (
                                            isVideoOff ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                                    <User className="w-12 h-12 opacity-50" />
                                                </div>
                                            ) : cameraError ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-red-500 p-2 text-center text-xs">
                                                    <VideoOff className="w-6 h-6 mb-1" />
                                                    <span>{cameraError}</span>
                                                </div>
                                            ) : (
                                                <video ref={handleVideoRef} autoPlay playsInline muted className="w-full h-full object-cover bg-gray-900" style={{ transform: 'scaleX(-1)' }} />
                                            )
                                        ) : (
                                            <RemoteVideo stream={user.stream!} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-2 xl:bottom-3 left-2 xl:left-3 text-white font-medium text-xs xl:text-sm drop-shadow-md truncate max-w-[90%] flex items-center gap-1.5">
                                            {user.type === 'remote' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>}
                                            {user.name} {user.type === 'local' && "(You)"}
                                        </div>
                                    </div>
                                ))}

                                {!connected && (
                                    <div className="relative w-[140px] xl:w-full shrink-0 aspect-[4/3] rounded-[16px] xl:rounded-[24px] overflow-hidden bg-white/40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 opacity-50">
                                        <div className="w-6 h-6 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin"></div>
                                        <span className="text-xs font-bold text-gray-500 text-center px-2">Network Syncing</span>
                                    </div>
                                )}

                                {/* Connection Debug Logs */}
                                <div className="hidden xl:flex w-full mt-4 flex-col gap-1 bg-black/80 rounded-xl p-3 max-h-[200px] overflow-y-auto text-[10px] font-mono shadow-inner border border-white/10 shrink-0">
                                    <div className="sticky top-0 bg-black text-gray-400 font-bold mb-1 pb-1 border-b border-gray-800">Connection Logs ({roomId.slice(0, 8)})</div>
                                    {debugLogs.length === 0 ? (
                                        <div className="text-gray-600 italic">Waiting for connection...</div>
                                    ) : (
                                        debugLogs.map((log, i) => (
                                            <div key={i} className="text-emerald-400 break-words leading-tight">{log}</div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Main AI Video Stage */}
                            <div className="max-xl:flex-none max-xl:h-[400px] flex-1 w-full max-xl:mx-auto max-w-[800px] aspect-square xl:aspect-auto relative rounded-[24px] xl:rounded-[32px] overflow-hidden bg-gray-900 shadow-lg border border-white/10 group">

                                {sessionStatus === "DISCONNECTED" && !isAiActiveGlobally && isOriginalHost && (
                                    <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/90 via-black/40 to-black/80 flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                            <Star className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h2 className="text-2xl font-lora font-bold mb-3">Ready for your Reading?</h2>
                                        <p className="text-gray-400 mb-10 max-w-sm text-center text-sm">Ensure your camera and microphone are ready.<br />The Astrologer awaits.</p>
                                        <button
                                            onClick={handleStartSession}
                                            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                                        >
                                            <Mic className="w-4 h-4" /> Start Astrology Session
                                        </button>
                                    </div>
                                )}

                                {sessionStatus === "DISCONNECTED" && !isAiActiveGlobally && !isOriginalHost && (
                                    <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/90 via-black/40 to-black/80 flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                            <Star className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h2 className="text-2xl font-lora font-bold mb-3">Awaiting the Stars</h2>
                                        <p className="text-gray-400 mb-10 max-w-sm text-center text-sm">Please wait while the Host starts the session.<br />Ensure your camera and microphone are ready.</p>
                                    </div>
                                )}

                                {sessionStatus === "DISCONNECTED" && isAiActiveGlobally && (
                                    <div className="absolute top-4 right-4 z-40 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex flex-row items-center justify-center text-white gap-2 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                                        <p className="font-medium text-xs text-white">Host started the session</p>
                                    </div>
                                )}

                                {sessionStatus === "CONNECTING" && (
                                    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-amber-500 border-r-amber-500 animate-spin mb-4"></div>
                                        <p className="font-medium text-lg text-amber-100">Aligning the Stars...</p>
                                        <p className="text-sm text-gray-400 mt-2">Initializing session for {participants.join(", ")}</p>
                                    </div>
                                )}

                                {/* Speaking Video */}
                                <video
                                    ref={speakingVideoRef}
                                    src="/assets/landing-2/Make_the_pandit_talk_delpmaspu_.mp4"
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${((sessionStatus === "CONNECTED" || isAiActiveGlobally) && (sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking")) ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                />
                                {/* Listening/Idle Video */}
                                <video
                                    ref={listeningVideoRef}
                                    src="/assets/landing-2/Pandit_trying_to_listen_delpmaspu_.mp4"
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(!(sessionStatus === "CONNECTED" || isAiActiveGlobally) || sharedAgentActivity === "listening" || sharedAgentActivity === "idle") ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                {/* Speaking indicator */}
                                <AnimatePresence>
                                    {(sessionStatus === "CONNECTED" || isAiActiveGlobally) && sharedAgentActivity === "speaking" && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ type: "spring" }}
                                            className="absolute top-1/4 right-1/4 bg-white text-gray-900 font-bold px-4 py-2 rounded-2xl rounded-tr-sm shadow-xl z-20"
                                        >
                                            ✨ Reading...
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Activity indicator */}
                                <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white z-20 transition-colors ${sharedAgentActivity === 'listening' || sharedAgentActivity === 'idle' ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-500/50' : sharedAgentActivity === 'speaking' ? 'bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                                    {sharedAgentActivity === 'listening' || sharedAgentActivity === 'idle' ? <Mic className="w-5 h-5 text-blue-400" /> : <Mic className="w-5 h-5 text-amber-400" />}
                                </div>

                                <audio ref={aiAudioRef} autoPlay playsInline className="hidden" />

                                {/* Controls Overlay */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 p-2.5 rounded-full shadow-2xl z-30 transition-opacity">
                                    <button
                                        onClick={() => setIsVideoOff(!isVideoOff)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                    >
                                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                                    </button>
                                    <button className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
                                        <AudioLines className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newMuted = !isMuted;
                                            setIsMuted(newMuted);
                                            localStream?.getAudioTracks().forEach(t => t.enabled = !newMuted);
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                    >
                                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={onLeave}
                                        className="w-12 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 transition-all"
                                    >
                                        <PhoneOff className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Area */}
                        <div className="h-auto xl:h-[80px] shrink-0 w-full mt-3 flex max-xl:flex-col flex-row gap-4">
                            <div className="flex-1 bg-white/60 backdrop-blur rounded-[16px] xl:rounded-[24px] p-4 xl:p-5 shadow-sm border border-white/60 flex flex-col justify-between">
                                <div className="flex items-center justify-between pointer-events-none pb-2 xl:pb-0">
                                    <h3 className="font-bold text-gray-900 text-sm tracking-wide">ASTROLOGY INSIGHTS</h3>
                                    <span className="text-xs text-gray-400 font-mono">⭐ live</span>
                                </div>
                                <p className="text-gray-700 font-medium text-sm xl:text-base">
                                    Welcome! Share your birth date, time, and place for an accurate reading. The stars have much to reveal today.
                                </p>
                            </div>

                            <div className="w-full xl:w-[320px] bg-white/60 backdrop-blur rounded-[16px] xl:rounded-[24px] p-4 xl:p-5 shadow-sm border border-white/60 flex items-center justify-between gap-4">
                                <div className="flex gap-2">
                                    <button className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow">Transcription</button>
                                    <button className="bg-white text-gray-600 border border-gray-200 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-gray-50">Subtitle</button>
                                </div>

                                {sessionStatus === "CONNECTED" && (
                                    <div className="flex-1 max-w-xs mx-auto flex items-center justify-center gap-1 opacity-50">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-1.5 rounded-full ${agentActivity === 'speaking' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                animate={{
                                                    height: agentActivity === 'speaking' || agentActivity === 'thinking'
                                                        ? ["12px", `${24 + (i % 4) * 6}px`, "12px"]
                                                        : "6px"
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.5 + (i % 3) * 0.2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="w-10 h-10 rounded-full bg-gray-900 text-red-500 flex items-center justify-center shadow-md">
                                    <div className={`w-3 h-3 rounded-full bg-red-500 ${sessionStatus === "CONNECTED" ? "animate-pulse" : ""}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Invite Toast */}
                        <AnimatePresence>
                            {showInviteToast && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 pointer-events-none"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                                    <span className="font-medium text-sm">Session link copied! Share with family.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* RIGHT SIDEBAR (Chat) */}
                    {isChatOpen && (
                        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-4 max-lg:h-[500px] transition-all">

                            {/* Expert Profile Banner */}
                            <div className="w-full flex justify-end gap-2 mb-2 pr-2">
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm border border-white border-b-black/5 pr-4 pl-2 cursor-pointer hover:bg-white transition-colors">
                                    <img src="/assets/Pandit Performing Aarti.jpg" alt="Astrologer" className="w-8 h-8 rounded-full border border-amber-200 object-cover" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold leading-tight">AI Astrologer</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Container */}
                            <div className="flex-1 bg-white/60 backdrop-blur rounded-[32px] overflow-hidden shadow-sm border border-white/60 flex flex-col relative h-full">
                                <div className="p-5 flex items-center justify-between bg-white/40 border-b border-black/5">
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">LIVE SESSION CHAT <MessageSquare className="w-4 h-4 text-indigo-500" /></h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`w-2 h-2 rounded-full ${sessionStatus === 'CONNECTED' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            <span className={`text-xs font-medium ${sessionStatus === 'CONNECTED' ? 'text-green-600' : 'text-gray-500'}`}>
                                                {activeCallUsers.length} People in call
                                            </span>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-500 transition-colors" onClick={() => setIsChatOpen(false)}>
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-5 pb-24 flex flex-col gap-5 scrollbar-hide">

                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.isAI ? 'gap-3' : 'gap-3'}`}>
                                            {msg.isAI ? (
                                                <img src="/assets/Pandit Performing Aarti.jpg" alt="Astrologer" className="w-8 h-8 rounded-full bg-amber-100 object-cover shrink-0 mt-1 border border-amber-200" />
                                            ) : (
                                                <img
                                                    src={msg.avatarUrl || getDefaultAvatar(msg.sender)}
                                                    alt={msg.sender}
                                                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-purple-200"
                                                />
                                            )}
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-xs text-gray-500 mb-1 font-medium">
                                                    {msg.sender} <span className="float-right ml-4">{msg.time}</span>
                                                </span>
                                                <div className={`${msg.isAI ? 'bg-white text-gray-700 border border-black/[0.03] rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tl-sm'} p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />

                                    {/* Zodiac Widget */}
                                    {showMuhurtaWidget && (
                                        <div className="flex flex-col items-end w-full pl-4 relative mt-4">
                                            <div className="bg-white rounded-[24px] p-4 shadow-lg shadow-black/5 w-full border border-amber-100 mt-1 relative z-10">
                                                <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-amber-500" /> TODAY&apos;S STARS
                                                </h4>
                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-xl shadow-inner border border-amber-50">♈</div>
                                                    <div className="w-12 h-12 bg-[#fff1cc] rounded-xl flex items-center justify-center text-xl shadow-inner border border-yellow-50">♉</div>
                                                    <div className="w-12 h-12 bg-[#e4d6ff] rounded-xl flex items-center justify-center text-xl shadow-inner border border-indigo-50">♊</div>
                                                    <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center text-xl shadow-inner border border-green-50">♋</div>
                                                </div>
                                                <div className="bg-amber-50 text-amber-900 p-4 rounded-xl text-center cursor-pointer hover:bg-amber-100 transition-colors border border-amber-200 max-w-full">
                                                    <p className="text-xs mb-2 font-medium">View Your Zodiac Reading</p>
                                                    <button className="bg-white border border-amber-200 text-amber-700 w-full rounded-lg py-2 font-bold text-sm shadow-sm hover:shadow transition-shadow">Read Now</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Chat Input */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-black/5 pb-6">
                                    <form className="relative" onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type a message to the group..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all font-medium text-gray-700"
                                        />
                                        <button type="submit" disabled={!chatMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 disabled:bg-gray-400 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                                            <Send className="w-4 h-4 ml-0.5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-indigo-400/10 blur-[150px] pointer-events-none z-0 rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-400/20 blur-[150px] pointer-events-none z-0 rounded-full" />
        </div>
    );
}

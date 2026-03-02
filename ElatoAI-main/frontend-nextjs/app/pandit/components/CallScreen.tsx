import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bell, Video as VideoIcon, MessageSquare, Users, FolderOpen, Calendar, Settings, Sun, Moon, Maximize2, Send, ImageIcon, AudioLines, PhoneOff, VideoOff, MicOff, Mic, User, Copy, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGroupCall } from '../hooks/useGroupCall';
import { useWebRTC } from '../hooks/useWebRTC';

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
}

// Helper component to explicitly attach incoming WebRTC React Refs to standard HTML5 video elements.
const RemoteVideo = ({ stream }: { stream: MediaStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.warn("Blocked by browser autoplay policy, attempting muted play... ", e);
                // On some strict browsers, we must fall back to muted or require a tap
                // but usually WebRTC streams are exempt if the user granted mic access.
            });
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-900" />;
};

// Mock users for the realistic UI feel
const mockUsers = [
    { name: "You", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Rahul Sharma", img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Priya Patel", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Amit Kumar", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" },
];

export default function CallScreen({ participants, roomId, onLeave }: CallScreenProps) {
    // Group Call Voice Connection
    // We use the same personality ID for the Pandit as the demo session
    const PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // UI States
    const [activeTab, setActiveTab] = useState('PANDIT');
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: "Pandit Ji", text: "Namaste! We will begin the Ganesh Puja shortly. Please prepare your thali.", time: "07:23 AM", isHost: true },
        { id: 2, sender: "You", text: "Yes, absolutely! 🙏", time: "07:34 AM", isHost: false }
    ]);
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

    // Shared State: Who is the host?
    const [isAiActiveGlobally, setIsAiActiveGlobally] = useState<boolean>(false);
    const [isHost, setIsHost] = useState(false); // Did THIS user start the AI?

    const { sessionStatus, connect, disconnect, agentActivity, aiOutputStream } = useGroupCall({
        participants,
        personalityId: PANDIT_PERSONALITY_ID
    });

    const [sharedAgentActivity, setSharedAgentActivity] = useState<string>("idle");

    // Initialize WebRTC P2P Mesh Network Connections
    // We send the `outboundStream` (Local Mic + AI Voice)
    const { connected, remoteParticipants, broadcastEvent, channel, debugLogs } = useWebRTC(roomId, outboundStream);
    // Real webcam feed
    const localVideoRef = useRef<HTMLVideoElement>(null);

    // Refs for the Pandit Video looping
    const speakingVideoRef = useRef<HTMLVideoElement>(null);
    const listeningVideoRef = useRef<HTMLVideoElement>(null);

    // Listen for AI shared state changes from other peers
    useEffect(() => {
        if (!channel) return;

        channel.on('broadcast', { event: 'AI_STATE' }, ({ payload }) => {
            if (payload.status === "STARTED") {
                setIsAiActiveGlobally(true);
            } else if (payload.status === "STOPPED") {
                setIsAiActiveGlobally(false);
            }
        });

        channel.on('broadcast', { event: 'AI_ACTIVITY' }, ({ payload }) => {
            if (!isHost) {
                setSharedAgentActivity(payload.activity);
            }
        });
    }, [channel, isHost]);

    // Cleanup AI on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    // Handle "Start Live Puja" click (Become Host)
    const handleStartPuja = () => {
        // Pass the LIVE mixed audio stream ref at call-time (it's been populated by the Device Setup effect)
        connect(mixedAiInputStreamRef.current);
        setIsHost(true);
        setIsAiActiveGlobally(true);
        broadcastEvent('AI_STATE', { status: "STARTED" });
    };

    // Auto-stop AI broadcast if we disconnect
    useEffect(() => {
        if (sessionStatus === "DISCONNECTED" && isHost && isAiActiveGlobally) {
            setIsAiActiveGlobally(false);
            setIsHost(false);
            broadcastEvent('AI_STATE', { status: "STOPPED" });
        }
    }, [sessionStatus, broadcastEvent, isAiActiveGlobally, isHost]);

    // Broadcast and apply agent activity changes if Host
    useEffect(() => {
        if (isHost && isAiActiveGlobally) {
            setSharedAgentActivity(agentActivity);
            broadcastEvent('AI_ACTIVITY', { activity: agentActivity });
        }
    }, [agentActivity, isHost, isAiActiveGlobally, broadcastEvent]);

    // Video playback control based on sharedAgentActivity (synced for everyone)
    useEffect(() => {
        if (!speakingVideoRef.current || !listeningVideoRef.current) return;

        // If Host is connected, sessionStatus = "CONNECTED". For guests, sessionStatus is always "DISCONNECTED" but isAiActiveGlobally is true.
        const isActive = sessionStatus === "CONNECTED" || isAiActiveGlobally;

        if (isActive && (sharedAgentActivity === "speaking" || sharedAgentActivity === "thinking")) {
            speakingVideoRef.current.play().catch(e => console.error("Speaking play error:", e));
            listeningVideoRef.current.pause();
        } else {
            listeningVideoRef.current.play().catch(e => console.error("Listening play error:", e));
            speakingVideoRef.current.pause();
        }
    }, [sessionStatus, isAiActiveGlobally, sharedAgentActivity]);

    // Device Setup & Web Audio Bootstrap
    useEffect(() => {
        let isMounted = true;
        let activeStream: MediaStream | null = null;
        let audioCtx: AudioContext | null = null;
        setCameraError(null);

        const setupMediaAndAudio = async () => {
            let stream: MediaStream | null = null;

            if (!isVideoOff) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                } catch (err: any) {
                    console.error("Camera access error:", err);
                    if (isMounted) setCameraError(err.message || "Camera access denied");

                    // Fallback to audio only
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    } catch (audioErr: any) {
                        console.error("Audio fallback error:", audioErr);
                    }
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
                audioCtx = ctx;
                mixerContextRef.current = ctx;

                // Create the Input Mixer (Pipes everything to AI)
                const aiInputDest = ctx.createMediaStreamDestination();
                mixedAiInputStreamRef.current = aiInputDest.stream;
                aiInputDestRef.current = aiInputDest;

                // Create the Output Mixer (Pipes Your Mic + AI Audio back to WebRTC peers)
                const p2pOutputDest = ctx.createMediaStreamDestination();
                p2pOutputDestRef.current = p2pOutputDest;

                // Create a single, stable outbound stream
                const outputStream = new MediaStream();
                if (stream && stream.getVideoTracks().length > 0) outputStream.addTrack(stream.getVideoTracks()[0]);
                outputStream.addTrack(p2pOutputDest.stream.getAudioTracks()[0]);

                setOutboundStream(outputStream);

                // Attach the local mic to both mixers
                if (stream && stream.getAudioTracks().length > 0) {
                    // Important constraint check: Chrome fails if the stream's audio track is silent/blocked
                    const localSource = ctx.createMediaStreamSource(stream);
                    localSource.connect(aiInputDest);
                    localSource.connect(p2pOutputDest);
                }
            } catch (e) {
                console.error("Web Audio setup error:", e);
                if (stream) setOutboundStream(stream); // fallback
            }
        };

        setupMediaAndAudio();

        return () => {
            isMounted = false;
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
            if (p2pOutputDestRef.current) p2pOutputDestRef.current = null;
            if (aiInputDestRef.current) aiInputDestRef.current = null;
            // Disconnect all peer sources
            peerSourcesRef.current.forEach(source => source.disconnect());
            peerSourcesRef.current.clear();
            if (aiSourceRef.current) {
                aiSourceRef.current.disconnect();
                aiSourceRef.current = null;
            }
        };
    }, [isVideoOff]);

    // Mix AI Output back into P2P and Local Speakers
    useEffect(() => {
        const ctx = mixerContextRef.current;
        const p2pOutputDest = p2pOutputDestRef.current;
        if (!ctx || !p2pOutputDest || !aiOutputStream) return;

        // Disconnect previous AI source if it exists
        if (aiSourceRef.current) {
            try { aiSourceRef.current.disconnect(); } catch (e) { }
            aiSourceRef.current = null;
        }

        if (aiOutputStream.getAudioTracks().length > 0) {
            try {
                const aiSource = ctx.createMediaStreamSource(aiOutputStream);
                aiSource.connect(p2pOutputDest);  // Send AI audio to all WebRTC peers
                aiSource.connect(ctx.destination); // Play AI audio locally through speakers
                aiSourceRef.current = aiSource;
                console.log("✅ AI audio routed to P2P and local speakers");
            } catch (e) {
                console.error("Failed to connect AI output:", e);
            }
        }
    }, [aiOutputStream]);

    // Mix Remote Peer audio into the AI Input (so the AI hears everyone)
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
                    console.log(`✅ Remote peer ${participant.id} audio piped to AI input`);
                } catch (e) {
                    console.error(`Failed to connect remote peer ${participant.id} audio:`, e);
                }
            }
        });
    }, [remoteParticipants, isHost]);

    const handleVideoRef = useCallback((node: HTMLVideoElement | null) => {
        if (node) {
            node.srcObject = localStream;
        }
    }, [localStream]);

    // Handle Sending Chat Messages
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: "You",
            text: chatMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isHost: false
        };

        setMessages([...messages, newMsg]);
        setChatMessage('');

        // Simulate response for demo purposes
        if (messages.length === 2 && !chatMessage.toLowerCase().includes("ignore")) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: "Pandit Ji",
                    text: "Excellent. Let us begin with the Shanti Mantra.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isHost: true
                }]);
            }, 1000);
        }
    };

    // Family Meet - Invite Link Logic
    const copyInviteLink = () => {
        const url = `${window.location.origin}/pandit?room=${roomId}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setShowInviteToast(true);
        setTimeout(() => setLinkCopied(false), 3000);
        setTimeout(() => setShowInviteToast(false), 5000);
    };

    // Consolidate local user and actual WebRTC remote participants
    const activeCallUsers = [
        { name: participants[0] || "You", type: 'local', stream: localStream },
        ...remoteParticipants.map(participant => ({
            name: `User (${participant.id.slice(0, 4)})`,
            type: 'remote',
            stream: participant.stream
        }))
    ];

    return (
        <div className="min-h-screen w-full bg-[#E5E0F4] relative flex p-2 lg:p-[2vh] overflow-y-auto">

            {/* The main App Window Container with Glassmorphism / neumorphism */}
            <div className="w-full min-h-[900px] bg-[#f4f2f9]/90 backdrop-blur-2xl rounded-[16px] lg:rounded-[32px] shadow-2xl border border-white/40 flex flex-col relative z-10 transition-all duration-300">

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
                        {['PANDIT', 'ASTROLOGER', 'LOVE ADVISOR', 'MAHURAT', 'PUJA', 'SERVICE'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-1 py-2 transition-colors ${activeTab === tab ? 'text-gray-900' : 'hover:text-gray-700'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors" onClick={copyInviteLink}>
                            {linkCopied ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {linkCopied ? 'Copied!' : 'Invite Family'}
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 transition-all border border-gray-100" onClick={() => alert("Search functionality coming soon")}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 relative transition-all border border-gray-100" onClick={() => alert("Notifications coming soon")}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-purple-100 overflow-hidden shadow-sm border-2 border-white cursor-pointer hover:opacity-90 transition-opacity">
                            <img src={mockUsers[0].img} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 w-full flex max-lg:flex-col overflow-y-auto overflow-x-hidden lg:overflow-hidden p-4 lg:p-6 pt-2 gap-4 lg:gap-6">

                    {/* LEFT SIDEBAR NAVIGATION */}
                    <aside className="hidden lg:flex w-[60px] shrink-0 flex-col items-center gap-4 py-4 z-20">
                        <div className="flex flex-col gap-4 w-full items-center bg-white/60 p-2 rounded-full shadow-sm shadow-black/5 pb-6">
                            <button className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center shadow-md hint-tooltip" title="Video Layout">
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
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors" onClick={() => alert("Puja Samagri checklist coming soon")}>
                                <FolderOpen className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowMuhurtaWidget(!showMuhurtaWidget)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showMuhurtaWidget ? 'bg-orange-100 text-orange-600' : 'hover:bg-white text-gray-500'}`}
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

                    {/* CENTER STAGE (Videos & Guidelines) */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="mb-4">
                            <h1 className="text-3xl lg:text-4xl font-lora font-medium text-gray-900 tracking-tight">Your Pujas Made Easy.</h1>
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

                                {/* Webrtc Loading Status (Connecting to signaling server) */}
                                {!connected && (
                                    <div className="relative w-[140px] xl:w-full shrink-0 aspect-[4/3] rounded-[16px] xl:rounded-[24px] overflow-hidden bg-white/40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 group cursor-pointer opacity-50">
                                        <div className="w-6 h-6 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin"></div>
                                        <span className="text-xs font-bold text-gray-500 text-center px-2">Network Syncing</span>
                                    </div>
                                )}

                                {/* Connection Debug Logs (Temporary for development) */}
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

                                {sessionStatus === "DISCONNECTED" && !isAiActiveGlobally && (
                                    <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/90 via-black/40 to-black/80 flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-12 rounded-2xl bg-[#20bd5c]/20 border border-[#20bd5c]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(32,189,92,0.2)]">
                                            <VideoIcon className="w-6 h-6 text-[#25D366]" />
                                        </div>
                                        <h2 className="text-2xl font-lora font-bold mb-3">Ready to join the Puja?</h2>
                                        <p className="text-gray-400 mb-10 max-w-sm text-center text-sm">Ensure your camera and microphone are ready.<br />The Pandit is waiting.</p>
                                        <button
                                            onClick={handleStartPuja}
                                            className="px-8 py-3.5 bg-[#1da851] hover:bg-[#199446] text-white font-bold rounded-full shadow-lg shadow-[#1da851]/20 transition-all flex items-center gap-2"
                                        >
                                            <Mic className="w-4 h-4" /> Start Live Puja
                                        </button>
                                    </div>
                                )}

                                {sessionStatus === "DISCONNECTED" && isAiActiveGlobally && (
                                    <div className="absolute top-4 right-4 z-40 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex flex-row items-center justify-center text-white gap-2 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <p className="font-medium text-xs text-white">Host started the Puja</p>
                                    </div>
                                )}

                                {sessionStatus === "CONNECTING" && (
                                    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 animate-spin mb-4"></div>
                                        <p className="font-medium text-lg text-emerald-100">Connecting to Ashram...</p>
                                        <p className="text-sm text-gray-400 mt-2">Initializing group context for {participants.join(", ")}</p>
                                    </div>
                                )}

                                {/* Speaking Video */}
                                <video
                                    ref={speakingVideoRef}
                                    src="/assets/Video_Project_2_optimized.mp4"
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
                                    src="/assets/Silently_paying_attention_optimized.mp4"
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(!(sessionStatus === "CONNECTED" || isAiActiveGlobally) || sharedAgentActivity === "listening" || sharedAgentActivity === "idle") ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                />

                                {/* Gradient overlays */}
                                <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                {/* Floating Namaste indicator shown briefly after connect */}
                                <AnimatePresence>
                                    {(sessionStatus === "CONNECTED" || isAiActiveGlobally) && sharedAgentActivity === "speaking" && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ type: "spring" }}
                                            className="absolute top-1/4 right-1/4 bg-white text-gray-900 font-bold px-4 py-2 rounded-2xl rounded-tr-sm shadow-xl z-20"
                                        >
                                            Namaste!
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white z-20 transition-colors ${sharedAgentActivity === 'listening' || sharedAgentActivity === 'idle' ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-500/50' : sharedAgentActivity === 'speaking' ? 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                                    {sharedAgentActivity === 'listening' || sharedAgentActivity === 'idle' ? <Mic className="w-5 h-5 text-blue-400" /> : <Mic className="w-5 h-5 text-green-400" />}
                                </div>

                                {/* Internal Controls Overlay */}
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
                                        onClick={() => setIsMuted(!isMuted)}
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

                        {/* Bottom Guidelines & Transcription Area */}
                        <div className="h-auto xl:h-[80px] shrink-0 w-full mt-3 flex max-xl:flex-col flex-row gap-4">
                            <div className="flex-1 bg-white/60 backdrop-blur rounded-[16px] xl:rounded-[24px] p-4 xl:p-5 shadow-sm border border-white/60 flex flex-col justify-between">
                                <div className="flex items-center justify-between pointer-events-none pb-2 xl:pb-0">
                                    <h3 className="font-bold text-gray-900 text-sm tracking-wide">PUJA GUIDELINES</h3>
                                    <span className="text-xs text-gray-400 font-mono">cite: 8</span>
                                </div>
                                <p className="text-gray-700 font-medium text-sm xl:text-base">
                                    Namaste! We will perform Ganesh Puja shortly. Keep your space sacred for new beginnings. This time is highly auspicious.
                                </p>
                            </div>

                            <div className="w-full xl:w-[320px] bg-white/60 backdrop-blur rounded-[16px] xl:rounded-[24px] p-4 xl:p-5 shadow-sm border border-white/60 flex items-center justify-between gap-4">
                                <div className="flex gap-2">
                                    <button className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow">Transcription</button>
                                    <button className="bg-white text-gray-600 border border-gray-200 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-gray-50">Subtitle</button>
                                </div>

                                {/* Voice visualizer indication */}
                                {sessionStatus === "CONNECTED" && (
                                    <div className="flex-1 max-w-xs mx-auto flex items-center justify-center gap-1 opacity-50">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-1.5 rounded-full ${agentActivity === 'speaking' ? 'bg-green-500' : 'bg-blue-500'}`}
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

                        {/* Invite Toast Notification */}
                        <AnimatePresence>
                            {showInviteToast && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 pointer-events-none"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    <span className="font-medium text-sm">Meeting link copied to clipboard. Share with family!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* RIGHT SIDEBAR (Chat & Muhurtas) */}
                    {isChatOpen && (
                        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-4 max-lg:h-[500px] transition-all">

                            {/* Top Expert Profiles Banner */}
                            <div className="w-full flex justify-end gap-2 mb-2 pr-2">
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm border border-white border-b-black/5 pr-4 pl-2 cursor-pointer hover:bg-white transition-colors">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=64&h=64" alt="Expert" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold leading-tight">Language Coach</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Container */}
                            <div className="flex-1 bg-white/60 backdrop-blur rounded-[32px] overflow-hidden shadow-sm border border-white/60 flex flex-col relative h-full">
                                <div className="p-5 flex items-center justify-between bg-white/40 border-b border-black/5">
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">LIVE PUJA CHAT <MessageSquare className="w-4 h-4 text-indigo-500" /></h3>
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

                                    {messages.map((msg, i) => (
                                        <div key={msg.id} className={`flex ${msg.isHost ? 'gap-3' : 'flex-col items-end w-full pl-8'}`}>
                                            {msg.isHost && <img src="/assets/murtis/pandit.png" alt="Pandit" className="w-8 h-8 rounded-full bg-orange-100 object-cover shrink-0 mt-1 border border-orange-200" />}
                                            <div className="flex flex-col w-full">
                                                <span className={`text-xs text-gray-500 mb-1 font-medium ${!msg.isHost && 'text-right'}`}>
                                                    {msg.sender} <span className={msg.isHost ? "float-right ml-4" : "ml-2"}>{msg.time}</span>
                                                </span>
                                                <div className={`${msg.isHost ? 'bg-white text-gray-700 border border-black/[0.03] rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm self-end max-w-[90%]'} p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Optional Muhurta Card injected into Chat (Toggleable) */}
                                    {showMuhurtaWidget && (
                                        <div className="flex flex-col items-end w-full pl-4 relative mt-4">
                                            <div className="bg-white rounded-[24px] p-4 shadow-lg shadow-black/5 w-full border border-orange-100 mt-1 relative z-10">
                                                <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-orange-500" /> PUJA MUHURTAS
                                                </h4>
                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-xl shadow-inner border border-orange-50">🏺</div>
                                                    <div className="w-12 h-12 bg-[#fff1cc] rounded-xl flex items-center justify-center text-xl shadow-inner border border-yellow-50">🪔</div>
                                                    <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-xl shadow-inner border border-orange-50">🥥</div>
                                                    <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center text-xl shadow-inner border border-green-50">🪷</div>
                                                </div>
                                                <div className="bg-orange-50 text-orange-900 p-4 rounded-xl text-center cursor-pointer hover:bg-orange-100 transition-colors border border-orange-200 max-w-full">
                                                    <p className="text-xs mb-2 font-medium">View Today's Auspicious Times</p>
                                                    <button className="bg-white border border-orange-200 text-orange-700 w-full rounded-lg py-2 font-bold text-sm shadow-sm hover:shadow transition-shadow">View Now</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Chat Input Area */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-black/5 pb-6">
                                    <form className="relative" onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type a message to the group..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium text-gray-700"
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

            {/* Decorative backdrop blobs mimicking realistic environment */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-400/10 blur-[150px] pointer-events-none z-0 rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-400/20 blur-[150px] pointer-events-none z-0 rounded-full" />
        </div>
    );
}

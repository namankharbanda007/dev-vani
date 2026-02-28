import { useState, useEffect, useRef } from "react";
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    PhoneOff,
    Maximize2,
    Minimize2,
    MessageSquare,
    Settings,
    FolderOpen,
    Calendar,
    Sun,
    Moon,
    Search,
    Bell,
    User,
    Users,
    Image as ImageIcon,
    Paperclip,
    AudioLines,
    Send,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGroupCall } from "../hooks/useGroupCall";

interface CallScreenProps {
    participants: string[];
    onLeave: () => void;
}

// Mock users for the realistic UI feel
const mockUsers = [
    { name: "Priya", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" },
    { name: "Rohan & Saira", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=150&h=150" },
    { name: "Sharma Family", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=150&h=150" }
];

export default function CallScreen({ participants, onLeave }: CallScreenProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState("PANDIT");
    const [chatMessage, setChatMessage] = useState("");

    // Real webcam feed
    const localVideoRef = useRef<HTMLVideoElement>(null);

    // Group Call Voice Connection
    // We use the same personality ID for the Pandit as the demo session
    const PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";

    const {
        sessionStatus,
        isAgentSpeaking,
        agentActivity,
        connect,
        disconnect
    } = useGroupCall({ participants, personalityId: PANDIT_PERSONALITY_ID });

    // Refs for the Pandit Video looping
    const speakingVideoRef = useRef<HTMLVideoElement>(null);
    const listeningVideoRef = useRef<HTMLVideoElement>(null);

    // Initialize the Voice Connection exactly once on mount
    // EDIT: Removed auto-connect on mount to require explicit user action.
    useEffect(() => {
        // The hook handles cleanup on unmount
        return () => {
            disconnect();
        };
    }, [disconnect]);

    // Video playback control based on agent activity
    useEffect(() => {
        if (!speakingVideoRef.current || !listeningVideoRef.current) return;

        if (sessionStatus === "CONNECTED" && (agentActivity === "speaking" || agentActivity === "thinking")) {
            speakingVideoRef.current.play().catch(e => console.error("Speaking play error:", e));
            listeningVideoRef.current.pause();
        } else {
            listeningVideoRef.current.play().catch(e => console.error("Listening play error:", e));
            speakingVideoRef.current.pause();
        }
    }, [sessionStatus, agentActivity]);

    useEffect(() => {
        let stream: MediaStream | null = null;
        if (!isVideoOff) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((s) => {
                    stream = s;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = s;
                    }
                })
                .catch(console.error);
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isVideoOff]);

    // Determine standard profile images based on names entered to create a diverse layout
    const assignedMockUsers = participants.map((name, index) => {
        // Check if the primary user is the first name, assign webcam
        if (index === 0) return { name, type: 'webcam' };

        // Assign mock avatars for the rest based on index to simulate other family members joining
        return { name, type: 'mock', img: mockUsers[index % mockUsers.length].img };
    });

    return (
        <div className="h-screen w-full bg-[#E5E0F4] relative flex overflow-hidden p-[2vh]">

            {/* The main App Window Container with Glassmorphism / neumorphism */}
            <div className="w-full h-full bg-[#f4f2f9]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/40 overflow-hidden flex flex-col relative z-10 transition-all duration-300">

                {/* TOP HEADER BAR */}
                <header className="h-[80px] w-full flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-lora font-bold text-gray-900 tracking-tight flex items-center gap-1">
                            स्मार्टmurti <span className="text-xs font-sans text-gray-500 font-normal mt-1">.com</span>
                        </span>
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
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 transition-all">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 relative transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-purple-100 overflow-hidden shadow-sm border-2 border-white">
                            <img src={mockUsers[0].img} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 w-full flex overflow-hidden p-6 pt-2 gap-6">

                    {/* LEFT SIDEBAR NAVIGATION */}
                    <aside className="w-[60px] shrink-0 flex flex-col items-center gap-4 py-4">
                        <div className="flex flex-col gap-4 w-full items-center bg-white/60 p-2 rounded-full shadow-sm shadow-black/5 pb-6">
                            <button className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center shadow-md">
                                <VideoIcon className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
                                <Users className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
                                <FolderOpen className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-full hover:bg-white text-gray-500 flex items-center justify-center transition-colors">
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
                            <h1 className="text-4xl font-lora font-medium text-gray-900 tracking-tight">Your Pujas Made Easy.</h1>
                        </div>

                        <div className="flex-1 flex gap-4 min-h-0 relative">

                            {/* Participant Ticker Column */}
                            <div className="w-[220px] shrink-0 flex flex-col gap-4 overflow-y-auto pb-4 scrollbar-hide">
                                {assignedMockUsers.map((user, i) => (
                                    <div key={i} className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-gray-200 shadow-sm border border-black/5 group">
                                        {user.type === 'webcam' ? (
                                            isVideoOff ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                                    <User className="w-12 h-12 opacity-50" />
                                                </div>
                                            ) : (
                                                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover bg-gray-900" style={{ transform: 'scaleX(-1)' }} />
                                            )
                                        ) : (
                                            <img src={user.img!} alt={user.name} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-3 left-3 text-white font-medium text-sm drop-shadow-md truncate max-w-[90%]">
                                            {user.name} {i === 0 && "(You)"}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main AI Video Stage */}
                            <div className="w-full max-w-[850px] aspect-[16/10] flex-1 relative rounded-[32px] overflow-hidden bg-gray-900 shadow-lg border border-white/10 group mx-auto shrink-0">

                                {sessionStatus === "DISCONNECTED" && (
                                    <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/90 via-black/40 to-black/80 flex flex-col items-center justify-center text-white">
                                        <div className="w-16 h-12 rounded-2xl bg-[#20bd5c]/20 border border-[#20bd5c]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(32,189,92,0.2)]">
                                            <VideoIcon className="w-6 h-6 text-[#25D366]" />
                                        </div>
                                        <h2 className="text-2xl font-lora font-bold mb-3">Ready to joining the Puja?</h2>
                                        <p className="text-gray-400 mb-10 max-w-sm text-center text-sm">Ensure your camera and microphone are ready.<br />The Pandit is waiting.</p>
                                        <button
                                            onClick={() => connect()}
                                            className="px-8 py-3.5 bg-[#1da851] hover:bg-[#199446] text-white font-bold rounded-full shadow-lg shadow-[#1da851]/20 transition-all flex items-center gap-2"
                                        >
                                            <Mic className="w-4 h-4" /> Start Live Puja
                                        </button>
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
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(sessionStatus === "CONNECTED" && (agentActivity === "speaking" || agentActivity === "thinking")) ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                />
                                {/* Listening/Idle Video */}
                                <video
                                    ref={listeningVideoRef}
                                    src="/assets/Silently_paying_attention_optimized.mp4"
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(sessionStatus !== "CONNECTED" || agentActivity === "listening") ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                />

                                {/* Gradient overlays */}
                                <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                {/* Floating Namaste indicator shown briefly after connect */}
                                <AnimatePresence>
                                    {sessionStatus === "CONNECTED" && agentActivity === "speaking" && (
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

                                <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white z-20 transition-colors ${agentActivity === 'listening' ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-500/50' : agentActivity === 'speaking' ? 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                                    {agentActivity === 'listening' ? <Mic className="w-5 h-5 text-blue-400" /> : <Mic className="w-5 h-5 text-green-400" />}
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
                        <div className="h-[120px] shrink-0 w-full mt-4 flex gap-4">
                            <div className="flex-1 bg-white/60 backdrop-blur rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col justify-between">
                                <div className="flex items-center justify-between pointer-events-none">
                                    <h3 className="font-bold text-gray-900 text-sm tracking-wide">PUJA GUIDELINES</h3>
                                    <span className="text-xs text-gray-400 font-mono">cite: 8</span>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    Namaste! We will perform Ganesh Puja shortly. Keep your space sacred for new beginnings. This time is highly auspicious.
                                </p>
                            </div>

                            <div className="w-[320px] bg-white/60 backdrop-blur rounded-[24px] p-5 shadow-sm border border-white/60 flex items-center justify-between gap-4">
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
                    </div>

                    {/* RIGHT SIDEBAR (Chat & Muhurtas) */}
                    <div className="w-[350px] shrink-0 flex flex-col gap-4">

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
                        <div className="flex-1 bg-white/60 backdrop-blur rounded-[32px] overflow-hidden shadow-sm border border-white/60 flex flex-col relative">
                            <div className="p-5 flex items-center justify-between bg-white/40 border-b border-black/5">
                                <div>
                                    <h3 className="font-bold text-gray-900">LIVE PUJA CHAT</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs text-green-600 font-medium">{participants.length + 64} People in chat</span>
                                    </div>
                                </div>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-500 transition-colors">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 pb-32 flex flex-col gap-5 scrollbar-hide">

                                <div className="flex gap-3">
                                    <img src={mockUsers[0].img} alt="Participant" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 mb-1 font-medium">{participants[0] || 'User'} (Host) <span className="float-right ml-4">07:23 AM</span></span>
                                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-700 shadow-sm border border-black/[0.03]">
                                            Is the space sacred? We are preparing to keep your space sacred for new beginnings. Perform Ganesh Puja.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end w-full pl-8">
                                    <span className="text-[10px] text-gray-400 font-medium mb-1">You <span className="ml-2">07:34 AM</span></span>
                                    <div className="bg-gray-900 text-white p-3.5 rounded-2xl rounded-tr-sm text-sm shadow-sm">
                                        Yes, absolutely! 🙏
                                        <span className="text-[9px] text-gray-400 float-right mt-1 ml-3 hidden">✓✓</span>
                                    </div>
                                </div>

                                {/* Simulated AI Card injected into Chat */}
                                <div className="flex flex-col items-end w-full pl-4 relative">
                                    <span className="text-[10px] text-gray-400 font-medium mb-1 mr-1">You <span className="ml-2">07:48 AM</span></span>

                                    <div className="bg-white rounded-[24px] p-4 shadow-lg shadow-black/5 w-full border border-white/60 mt-1 relative z-10">
                                        <h4 className="font-bold text-gray-900 text-sm mb-4">PUJA CALENDAR & MUHURTAS</h4>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-xl shadow-inner">🏺</div>
                                            <div className="w-12 h-12 bg-[#fff1cc] rounded-xl flex items-center justify-center text-xl shadow-inner">🪔</div>
                                            <div className="w-12 h-12 bg-[#ffe4d6] rounded-xl flex items-center justify-center text-xl shadow-inner">🥥</div>
                                            <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center text-xl shadow-inner">🪷</div>
                                        </div>
                                        <div className="bg-gray-900 text-white p-4 rounded-xl text-center cursor-pointer hover:bg-gray-800 transition-colors">
                                            <p className="text-xs mb-2 text-gray-300">View Today's Auspicious Times</p>
                                            <button className="bg-white text-gray-900 w-full rounded-lg py-2 font-bold text-sm">View Now</button>
                                        </div>
                                    </div>

                                    {/* Floating Muhurta Widget connected to card visually */}
                                    <div className="absolute top-1/2 -translate-y-1/2 -right-16 bg-white/90 backdrop-blur rounded-[20px] p-3 shadow-xl border border-white/50 w-24 z-20 hidden 2xl:block">
                                        <p className="text-[10px] font-bold text-center text-gray-500 mb-2 leading-tight">DAILY MUHURTAS</p>
                                        <div className="flex justify-between px-1">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-4 h-4 rounded-full bg-gray-900"></div>
                                                <span className="text-[9px] text-gray-400 font-bold">21</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-md"></div>
                                                <span className="text-[9px] text-gray-900 font-bold border-b border-black">22</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                                <span className="text-[9px] text-gray-400 font-bold">23</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Chat Input Area */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-black/5">
                                <div className="flex gap-2 mb-3 px-1">
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:text-gray-900 transition-colors"><FolderOpen className="w-3 h-3" /> Files</button>
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:text-gray-900 transition-colors"><ImageIcon className="w-3 h-3" /> Images</button>
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:text-gray-900 transition-colors"><AudioLines className="w-3 h-3" /> Audio</button>
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:text-gray-900 transition-colors"><VideoIcon className="w-3 h-3" /> Video</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Got it, thanks 🚀"
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium text-gray-700"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors">
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {/* Decorative backdrop blobs mimicking realistic environment */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-400/10 blur-[150px] pointer-events-none z-0 rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-400/20 blur-[150px] pointer-events-none z-0 rounded-full" />
        </div>
    );
}

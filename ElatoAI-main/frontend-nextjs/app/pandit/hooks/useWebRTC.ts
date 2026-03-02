import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// WebRTC STUN servers to bypass NAT matching
const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export interface RemoteParticipant {
    id: string; // the remote user's realtime presence ID
    name: string; // the synchronized remote user name
    stream: MediaStream;
}

export function useWebRTC(roomId: string, localName: string, localStream: MediaStream | null) {
    // Memoize the supabase client so it doesn't trigger re-renders or effect cleanups
    const supabase = useMemo(() => createClient(), []);

    const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
    const [connected, setConnected] = useState(false);
    const [channelState, setChannelState] = useState<RealtimeChannel | null>(null);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = useCallback((msg: string) => {
        console.log(msg);
        setDebugLogs(prev => [...prev.slice(-15), msg]); // keep last 15
    }, []);

    // Track the latest localStream without re-triggering main connection effects
    const localStreamRef = useRef<MediaStream | null>(null);
    useEffect(() => {
        localStreamRef.current = localStream;

        // If localStream becomes available (e.g. camera permissions granted later),
        // add tracks to any existing peer connections that don't already have them.
        if (localStream) {
            Object.values(peerConnectionsRef.current).forEach(pc => {
                const senders = pc.getSenders();
                localStream.getTracks().forEach(track => {
                    if (!senders.find(s => s.track === track)) {
                        try {
                            pc.addTrack(track, localStream);
                        } catch (e) {
                            console.error("Error adding delayed track to peer connection:", e);
                        }
                    }
                });
            });
        }
    }, [localStream]);

    // We use a React ref so we don't trigger re-renders on every connection state change
    const channelRef = useRef<RealtimeChannel | null>(null);
    const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});

    // Expose the channel so we can broadcast app-level events (like AI speaking status)
    const broadcastEvent = useCallback((event: string, payload: any) => {
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: event,
                payload: payload
            });
        }
    }, []);

    // My unique presence ID generated when joining the room
    const myIdRef = useRef<string>(Math.random().toString(36).substring(2, 15));

    // Handle removing a participant
    const removeParticipant = useCallback((id: string) => {
        setRemoteParticipants((prev) => prev.filter((p) => p.id !== id));
        if (peerConnectionsRef.current[id]) {
            peerConnectionsRef.current[id].close();
            delete peerConnectionsRef.current[id];
        }
    }, []);

    // Track negotiation state per peer to prevent collision/glare
    const negotiationStateRef = useRef<Record<string, { makingOffer: boolean, ignoreOffer: boolean, isSettingRemoteAnswerPending: boolean }>>({});

    // Create a new RTCPeerConnection for a specific remote user
    const createPeerConnection = useCallback((remoteId: string, isInitiator: boolean) => {
        if (peerConnectionsRef.current[remoteId]) return peerConnectionsRef.current[remoteId];

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionsRef.current[remoteId] = pc;
        negotiationStateRef.current[remoteId] = { makingOffer: false, ignoreOffer: false, isSettingRemoteAnswerPending: false };

        // Add local tracks to the connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                if (localStreamRef.current) pc.addTrack(track, localStreamRef.current);
            });
        }

        // When the remote peer sends us ICE candidates, forward them via Supabase
        pc.onicecandidate = (event) => {
            if (event.candidate && channelRef.current) {
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'ice-candidate',
                    payload: { candidate: event.candidate, to: remoteId, from: myIdRef.current }
                });
            }
        };

        // Perfect Negotiation: Automatic renegotiation mechanism
        pc.onnegotiationneeded = async () => {
            addLog(`🔄 Negotiation needed for ${remoteId.slice(0, 4)}`);
            try {
                negotiationStateRef.current[remoteId].makingOffer = true;
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'offer',
                    payload: { offer, to: remoteId, from: myIdRef.current }
                });
            } catch (e: any) {
                addLog(`❌ Renegotiation error: ${e?.message}`);
            } finally {
                negotiationStateRef.current[remoteId].makingOffer = false;
            }
        };

        // When we start receiving the actual remote media streams
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            setRemoteParticipants(prev => {
                // Check if we already have this participant
                if (prev.find(p => p.id === remoteId)) return prev;
                addLog(`🎥 Received Video/Audio track from ${remoteId.slice(0, 4)}`);
                const remoteName = remoteNamesRef.current[remoteId] || "User";
                return [...prev, { id: remoteId, name: remoteName, stream }];
            });
        };

        // Handle disconnections gracefully
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                removeParticipant(remoteId);
            }
        };

        // If we are the initiating party (we joined second), create the Offer
        // Note: the `onnegotiationneeded` event usually handles this, but creating an initial empty offer 
        // forces the connection to start even if no local camera is active yet.
        if (isInitiator) {
            addLog(`⏳ Creating initial OFFER for ${remoteId.slice(0, 4)}...`);
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer).then(() => {
                    addLog(`📤 Sending initial OFFER to ${remoteId.slice(0, 4)}`);
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'offer',
                        payload: { offer, to: remoteId, from: myIdRef.current }
                    });
                });
            }).catch(e => addLog(`❌ Error creating offer: ${e.message}`));
        }

        return pc;
    }, [removeParticipant]);

    const remoteNamesRef = useRef<Record<string, string>>({});

    useEffect(() => {
        if (!roomId) return;

        // 1. Initialize Supabase Realtime Channel
        const channel = supabase.channel(`webrtc-room-${roomId}`, {
            config: {
                presence: { key: myIdRef.current },
                broadcast: { self: false }
            }
        });

        channelRef.current = channel;
        setChannelState(channel);

        // Track presence explicitly with the localName after subscribing
        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ name: localName });
                setConnected(true);
                addLog(`✅ Supabase Subscribed! Tracking presence as ${localName}.`);
            }
        });

        // 2. Listen for Presence Sync (when users join/leave/update)
        channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const onlineUsers = Object.keys(state);
            addLog(`👥 Presence Sync. Online users: ${onlineUsers.length}`);

            // Extract remote names from the presence state
            for (const [userId, presences] of Object.entries(state)) {
                if (presences.length > 0 && (presences[0] as any).name) {
                    remoteNamesRef.current[userId] = (presences[0] as any).name;
                }
            }

            // Update existing participants with their synchronized names if they arrived late
            setRemoteParticipants(prev => prev.map(p => ({
                ...p,
                name: remoteNamesRef.current[p.id] || p.name
            })));

            // If someone new is online, and we aren't already connected to them, WE initiate the WebRTC offer.
            onlineUsers.forEach(userId => {
                if (userId !== myIdRef.current && !peerConnectionsRef.current[userId]) {
                    // Strict Lexicographical Ordering to resolve glare/collisions
                    const isInitiator = myIdRef.current > userId;
                    if (isInitiator) {
                        addLog(`🚀 Found user ${remoteNamesRef.current[userId] || userId.slice(0, 4)}, I am initiator.`);
                    } else {
                        addLog(`⏳ Found user ${remoteNamesRef.current[userId] || userId.slice(0, 4)}, awaiting their offer.`);
                    }
                    createPeerConnection(userId, isInitiator);
                }
            });
        });

        channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
            if (leftPresences) {
                leftPresences.forEach((presence: any) => {
                    addLog(`👋 User ${presence.key.slice(0, 4)} left the room.`);
                    removeParticipant(presence.key);
                });
            }
        });

        // 3. Perfect Negotiation: Listen for WebRTC Signaling Data via Broadcast
        channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
            const { offer, to, from } = payload;
            if (to !== myIdRef.current) return; // Only process offers meant for me

            // Determine polite/impolite role based on lexicographical UUID order
            const polite = myIdRef.current < from;

            const pc = peerConnectionsRef.current[from] || createPeerConnection(from, false);
            const state = negotiationStateRef.current[from] || { makingOffer: false, ignoreOffer: false, isSettingRemoteAnswerPending: false };

            const offerCollision = (offer.type === "offer") && (state.makingOffer || pc.signalingState !== "stable");

            state.ignoreOffer = !polite && offerCollision;
            if (state.ignoreOffer) {
                addLog(`🛡️ Ignored colliding OFFER from ${from.slice(0, 4)} (I am impolite)`);
                return;
            }

            addLog(`📥 Accept OFFER from ${from.slice(0, 4)}`);

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                addLog(`📤 Sending ANSWER to ${from.slice(0, 4)}`);
                channel.send({
                    type: 'broadcast',
                    event: 'answer',
                    payload: { answer, to: from, from: myIdRef.current }
                });
            } catch (err: any) {
                addLog(`❌ Failed to accept offer: ${err?.message}`);
            }
        });

        channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
            const { answer, to, from } = payload;
            if (to !== myIdRef.current) return;

            const pc = peerConnectionsRef.current[from];
            if (pc) {
                try {
                    addLog(`📥 Received ANSWER from ${from.slice(0, 4)}`);
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err: any) {
                    addLog(`❌ Failed to accept answer: ${err?.message}`);
                }
            }
        });

        channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            const { candidate, to, from } = payload;
            if (to !== myIdRef.current) return;

            const pc = peerConnectionsRef.current[from];
            if (pc) {
                // If remote description isn't set yet, the ICE candidate will fail. Better to queue them in production, 
                // but since browsers usually queue them internally we can safely attempt passing it directly.
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding ice candidate:", e);
                }
            }
        });

        // 4. Subscribe to the channel and track presence
        channel.subscribe(async (status, err) => {
            if (status === 'SUBSCRIBED') {
                addLog("✅ Supabase Subscribed! Tracking presence.");
                setConnected(true);
                try {
                    await channel.track({ online_at: new Date().toISOString() });
                } catch (e: any) {
                    addLog(`❌ Presence fault: ${e?.message}`);
                }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                addLog(`❌ Channel Error [${status}]: ${err}`);
            }
        });

        return () => {
            setConnected(false);
            setChannelState(null);
            if (channelRef.current) {
                channelRef.current.unsubscribe().then(() => {
                    if (channelRef.current) supabase.removeChannel(channelRef.current);
                });
            }
            // Cleanup all peer connections
            Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
            peerConnectionsRef.current = {};
            setRemoteParticipants([]);
        };
    }, [roomId, createPeerConnection, removeParticipant, supabase]);

    return {
        connected,
        remoteParticipants,
        broadcastEvent,
        channel: channelState,
        debugLogs
    };
}

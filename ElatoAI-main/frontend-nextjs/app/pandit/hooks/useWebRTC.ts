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
    stream: MediaStream;
}

export function useWebRTC(roomId: string, localStream: MediaStream | null) {
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

    // Create a new RTCPeerConnection for a specific remote user
    const createPeerConnection = useCallback((remoteId: string, isInitiator: boolean) => {
        if (peerConnectionsRef.current[remoteId]) return peerConnectionsRef.current[remoteId];

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionsRef.current[remoteId] = pc;

        // Add local tracks to the connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                // Ensure we don't add duplicate tracks if the API permits, but usually getting tracks and adding them is safe
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

        // When we start receiving the actual remote media streams
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            setRemoteParticipants(prev => {
                // Check if we already have this participant
                if (prev.find(p => p.id === remoteId)) return prev;
                return [...prev, { id: remoteId, stream }];
            });
        };

        // Handle disconnections gracefully
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                removeParticipant(remoteId);
            }
        };

        // If we are the initiating party (we joined second), create the Offer
        if (isInitiator) {
            addLog(`⏳ Creating OFFER for ${remoteId.slice(0, 4)}...`);
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

        // 2. Listen for Presence Sync (when users join/leave)
        channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const onlineUsers = Object.keys(state);
            addLog(`👥 Presence Sync. Online users: ${onlineUsers.length}`);

            // If someone new is online, and we aren't already connected to them, WE initiate the WebRTC offer.
            onlineUsers.forEach(userId => {
                if (userId !== myIdRef.current && !peerConnectionsRef.current[userId]) {
                    addLog(`🚀 Found new user ${userId.slice(0, 4)}, I will initiate.`);
                    // We saw them first via presence, so we act as the initiator
                    createPeerConnection(userId, true);
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

        // 3. Listen for WebRTC Signaling Data via Broadcast
        channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
            const { offer, to, from } = payload;
            if (to !== myIdRef.current) return; // Only process offers meant for me

            addLog(`📥 Received OFFER from ${from.slice(0, 4)}`);

            // They initiated the offer, so we are NOT the initiator.
            const pc = createPeerConnection(from, false);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            addLog(`📤 Sending ANSWER to ${from.slice(0, 4)}`);
            channel.send({
                type: 'broadcast',
                event: 'answer',
                payload: { answer, to: from, from: myIdRef.current }
            });
        });

        channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
            const { answer, to, from } = payload;
            if (to !== myIdRef.current) return;

            addLog(`📥 Received ANSWER from ${from.slice(0, 4)}`);

            const pc = peerConnectionsRef.current[from];
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
                addLog(`⚠️ Ignored ANSWER from ${from.slice(0, 4)}`);
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

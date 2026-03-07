import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Room,
    RoomEvent,
    Track,
    RemoteParticipant,
    RemoteTrackPublication,
    LocalParticipant,
    ConnectionState,
    type RemoteTrack,
} from 'livekit-client';

export interface RemoteParticipantInfo {
    id: string;
    name: string;
    stream: MediaStream;
}

/**
 * useWebRTC — now powered by LiveKit Cloud SFU.
 *
 * Maintains the SAME external API so CallScreen.tsx needs minimal changes:
 *   { connected, remoteParticipants, broadcastEvent, channel, debugLogs }
 */
export function useWebRTC(roomId: string, localName: string, localStream: MediaStream | null) {
    const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipantInfo[]>([]);
    const [connected, setConnected] = useState(false);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    // We keep the channel/broadcastEvent API for app-level events (AI state, active speaker).
    // These now go through LiveKit's data channel instead of Supabase broadcast.
    const roomRef = useRef<Room | null>(null);

    const addLog = useCallback((msg: string) => {
        console.log(`[LiveKit] ${msg}`);
        setDebugLogs(prev => [...prev.slice(-20), msg]);
    }, []);

    // Track latest localStream via ref (used in track publishing)
    const localStreamRef = useRef<MediaStream | null>(null);
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // Broadcast app-level events through LiveKit DataChannel
    const broadcastEvent = useCallback((event: string, payload: any) => {
        const room = roomRef.current;
        if (room && room.state === ConnectionState.Connected) {
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify({ event, payload }));
            room.localParticipant.publishData(data, { reliable: true });
        }
    }, []);

    // Helper: build a MediaStream from a RemoteParticipant's published tracks
    const buildStreamForParticipant = useCallback((participant: RemoteParticipant): MediaStream => {
        const stream = new MediaStream();
        participant.trackPublications.forEach((pub) => {
            if (pub.track && pub.isSubscribed) {
                stream.addTrack(pub.track.mediaStreamTrack);
            }
        });
        return stream;
    }, []);

    // Refresh the remoteParticipants state from the Room
    const refreshParticipants = useCallback((room: Room) => {
        const participants: RemoteParticipantInfo[] = [];
        room.remoteParticipants.forEach((participant) => {
            const stream = buildStreamForParticipant(participant);
            if (stream.getTracks().length > 0) {
                participants.push({
                    id: participant.identity,
                    name: participant.name || participant.identity,
                    stream,
                });
            }
        });
        setRemoteParticipants(participants);
    }, [buildStreamForParticipant]);

    useEffect(() => {
        if (!roomId || !localName) return;

        let cancelled = false;
        const room = new Room({
            adaptiveStream: true,
            dynacast: true,
        });
        roomRef.current = room;

        // --- Event handlers ---

        room.on(RoomEvent.Connected, () => {
            if (cancelled) return;
            addLog('✅ Connected to LiveKit room');
            setConnected(true);
        });

        room.on(RoomEvent.Disconnected, () => {
            if (cancelled) return;
            addLog('❌ Disconnected from LiveKit room');
            setConnected(false);
            setRemoteParticipants([]);
        });

        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            if (cancelled) return;
            addLog(`🎥 Track subscribed: ${track.kind} from ${participant.name || participant.identity}`);
            refreshParticipants(room);
        });

        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            if (cancelled) return;
            addLog(`📴 Track unsubscribed: ${track.kind} from ${participant.name || participant.identity}`);
            refreshParticipants(room);
        });

        room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
            if (cancelled) return;
            addLog(`👤 Participant joined: ${participant.name || participant.identity}`);
        });

        room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
            if (cancelled) return;
            addLog(`👋 Participant left: ${participant.name || participant.identity}`);
            refreshParticipants(room);
        });

        // Listen for app-level data messages (replaces Supabase broadcast)
        room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
            if (cancelled) return;
            try {
                const decoder = new TextDecoder();
                const message = JSON.parse(decoder.decode(payload));
                // Dispatch a custom event so CallScreen can listen
                window.dispatchEvent(new CustomEvent('livekit-data', { detail: message }));
            } catch (e) {
                // ignore malformed messages
            }
        });

        // --- Connect ---
        const connectToRoom = async () => {
            try {
                addLog('⏳ Fetching LiveKit token...');
                const res = await fetch(`/api/livekit-token?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(localName)}`);
                const data = await res.json();

                if (data.error) {
                    addLog(`❌ Token error: ${data.error}`);
                    return;
                }

                const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://smart-murti-u1cpnjeh.livekit.cloud';

                addLog('⏳ Connecting to LiveKit Cloud...');
                await room.connect(livekitUrl, data.token);

                if (cancelled) {
                    room.disconnect();
                    return;
                }

                // Publish local tracks
                if (localStreamRef.current) {
                    const tracks = localStreamRef.current.getTracks();
                    for (const track of tracks) {
                        try {
                            await room.localParticipant.publishTrack(track, {
                                name: track.kind,
                                simulcast: track.kind === 'video',
                            });
                            addLog(`📤 Published ${track.kind} track`);
                        } catch (e: any) {
                            addLog(`⚠️ Failed to publish ${track.kind}: ${e?.message}`);
                        }
                    }
                }

                // Also refresh any participants that connected before us
                refreshParticipants(room);
            } catch (e: any) {
                addLog(`❌ Connection failed: ${e?.message}`);
            }
        };

        connectToRoom();

        return () => {
            cancelled = true;
            setConnected(false);
            setRemoteParticipants([]);
            room.disconnect();
            roomRef.current = null;
        };
    }, [roomId, localName, addLog, refreshParticipants]);

    // When localStream changes (e.g. camera toggled), update published tracks
    useEffect(() => {
        const room = roomRef.current;
        if (!room || room.state !== ConnectionState.Connected) return;

        const updateTracks = async () => {
            const localParticipant = room.localParticipant;

            // Unpublish all existing tracks first
            const existingPubs = Array.from(localParticipant.trackPublications.values());
            for (const pub of existingPubs) {
                if (pub.track) {
                    try {
                        await localParticipant.unpublishTrack(pub.track.mediaStreamTrack);
                    } catch (e) { /* ignore */ }
                }
            }

            // Publish new tracks
            if (localStream) {
                for (const track of localStream.getTracks()) {
                    try {
                        await localParticipant.publishTrack(track, {
                            name: track.kind,
                            simulcast: track.kind === 'video',
                        });
                    } catch (e: any) {
                        console.error(`Failed to re-publish ${track.kind}:`, e);
                    }
                }
            }
        };

        updateTracks();
    }, [localStream]);

    // Expose a fake "channel" object so CallScreen's event listener code can work
    // The actual data flows through LiveKit's DataChannel via broadcastEvent + window events
    const channel = useMemo(() => {
        return {
            on: (type: string, filter: any, callback: any) => {
                // Bridge LiveKit data events to the old Supabase-style API
                const handler = (e: Event) => {
                    const detail = (e as CustomEvent).detail;
                    if (detail && detail.event === filter?.event) {
                        callback({ payload: detail.payload });
                    }
                };
                window.addEventListener('livekit-data', handler);
                // Return cleanup function
                return () => window.removeEventListener('livekit-data', handler);
            },
        };
    }, []);

    return {
        connected,
        remoteParticipants,
        broadcastEvent,
        channel: channel as any,
        debugLogs,
    };
}

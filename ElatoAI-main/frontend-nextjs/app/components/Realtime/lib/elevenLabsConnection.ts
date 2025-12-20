
import { RefObject } from "react";

// Helpers
const workletCode = `
class PCMProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const channelData = input[0]; // Mono
            this.port.postMessage(channelData);
        }
        return true;
    }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

/**
 * Resamples audio data from a source sample rate to a target sample rate.
 * Uses linear interpolation.
 */
function resampleAudio(audioData: Float32Array, sourceSampleRate: number, targetSampleRate: number): Float32Array {
    if (sourceSampleRate === targetSampleRate) return audioData;

    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
        const index = i * ratio;
        const low = Math.floor(index);
        const high = Math.min(Math.ceil(index), audioData.length - 1);
        const weight = index - low;
        result[i] = audioData[low] * (1 - weight) + audioData[high] * weight;
    }
    return result;
}

function floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        // Simple clipping
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToFloat32(base64: string) {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    // PCM 16 LE to Float32
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
    }
    return float32Array;
}

export async function createElevenLabsConnection(
    audioContext: AudioContext,
    signedUrl: string,
    onRemoteEvent: (event: any) => void,
    onSpeakingStateChange?: (isSpeaking: boolean) => void,
    onDisconnect?: () => void
) {
    let ws: WebSocket | null = null;
    let mediaStream: MediaStream | null = null;
    let workletNode: AudioWorkletNode | null = null;
    let nextStartTime = 0;
    let speakingTimeout: NodeJS.Timeout | null = null;

    try {
        // 1. Setup Audio Context & Mic Permissions FIRST
        await audioContext.resume();
        console.log(`AudioContext Sample Rate: ${audioContext.sampleRate}`);

        try {
            await audioContext.audioWorklet.addModule('data:text/javascript;base64,' + btoa(workletCode));
        } catch (e) {
            console.warn("Worklet might already be added or failed:", e);
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
            },
        });

        // 2. Connect to WebSocket
        ws = new WebSocket(signedUrl);

        // Define helpers inside to access closure variables
        function playAudioChunk(audioData: Float32Array) {
            if (!audioContext) return;

            // Notify speaking state
            if (onSpeakingStateChange) {
                onSpeakingStateChange(true);
                if (speakingTimeout) clearTimeout(speakingTimeout);
                speakingTimeout = setTimeout(() => {
                    onSpeakingStateChange(false);
                }, 1000); // 1s hangover
            }

            // ElevenLabs output is typically 16k or higher depending on settings, assume matches context or handled by browser decode?
            // Actually ElevenLabs sends PCM 16k usually unless specified.
            // Let's assume we decode raw PCM 16k to float which we do in base64ToFloat32.
            // Then we play it. The BufferSource handles sample rate mismatch if we specify buffer sample rate correctly.
            // Let's assume 16000 for ElevenLabs default.
            const buffer = audioContext.createBuffer(1, audioData.length, 16000); // 16kHz
            buffer.getChannelData(0).set(audioData);

            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);

            if (nextStartTime < audioContext.currentTime) {
                nextStartTime = audioContext.currentTime;
            }
            source.start(nextStartTime);
            nextStartTime += buffer.duration;
        }

        // Event Handlers
        ws.onopen = () => {
            console.log("ElevenLabs WebSocket Connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'audio' && data.audio_event?.audio_base_64) {
                const pcmData = base64ToFloat32(data.audio_event.audio_base_64);
                playAudioChunk(pcmData);
            } else if (data.type === 'agent_response' || data.type === 'user_transcript') {
                // Forward events
                onRemoteEvent(data);
            }
        };

        ws.onerror = (err) => console.error("ElevenLabs WS Error", err);
        ws.onclose = () => {
            console.log("ElevenLabs WS Closed");
            if (onDisconnect) onDisconnect();
        };

        // 3. Audio Processing Setup
        const source = audioContext.createMediaStreamSource(mediaStream);
        workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

        workletNode.port.onmessage = (event) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                const inputData = event.data; // Float32Array at audioContext.sampleRate

                // Resample to 16000 if necessary
                const resampledData = resampleAudio(inputData, audioContext!.sampleRate, 16000);

                const pcm16 = floatTo16BitPCM(resampledData);
                const base64Audio = arrayBufferToBase64(pcm16);

                ws.send(JSON.stringify({
                    user_audio_chunk: base64Audio
                }));
            }
        };

        source.connect(workletNode);

    } catch (error) {
        console.error("Failed to create ElevenLabs connection", error);
        mediaStream?.getTracks().forEach(track => track.stop());
        throw error;
    }

    function sendTextMessage(text: string) {
        // Not implemented for ElevenLabs raw WS yet (usually audio only, unless you send specific event)
    }

    return {
        disconnect: () => {
            ws?.close();
            mediaStream?.getTracks().forEach(track => track.stop());
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
            workletNode?.disconnect();
        },
        sendTextMessage
    };
}

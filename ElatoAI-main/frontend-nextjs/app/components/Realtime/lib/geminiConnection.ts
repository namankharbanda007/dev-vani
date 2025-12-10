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

function floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
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

// Gemini Multimodal Live API Configuration
const HOST = "generativelanguage.googleapis.com";
const URI = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export async function createGeminiConnection(
    apiKey: string,
    systemPrompt: string,
    voice: string,
    onRemoteEvent: (event: any) => void,
    onSpeakingStateChange?: (isSpeaking: boolean) => void
) {
    let ws: WebSocket | null = null;
    let audioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;
    let workletNode: AudioWorkletNode | null = null;
    let nextStartTime = 0;
    let speakingTimeout: NodeJS.Timeout | null = null;

    try {
        const url = `${URI}?key=${apiKey}`;
        ws = new WebSocket(url);

        // Audio Context Setup (Input & Output)
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 24000,
        });

        await audioContext.audioWorklet.addModule('data:text/javascript;base64,' + btoa(workletCode));

        // Input: 16kHz Mono
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
            },
        });

        const source = audioContext.createMediaStreamSource(mediaStream);
        workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

        workletNode.port.onmessage = (event) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                const pcm16 = floatTo16BitPCM(event.data);
                const base64Audio = arrayBufferToBase64(pcm16);

                ws.send(JSON.stringify({
                    realtime_input: {
                        media_chunks: [{
                            mime_type: "audio/pcm",
                            data: base64Audio
                        }]
                    }
                }));
            }
        };

        source.connect(workletNode);

        // WebSocket Event Handlers
        ws.onopen = () => {
            console.log("Gemini WebSocket Connected");
            // Send Initial Setup
            const setupMessage = {
                setup: {
                    model: MODEL,
                    generation_config: {
                        response_modalities: ["AUDIO"],
                        speech_config: {
                            voice_config: {
                                prebuilt_voice_config: {
                                    voice_name: voice || "Fenrir"
                                }
                            }
                        }
                    },
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    }
                }
            };
            if (ws) {
                ws.send(JSON.stringify(setupMessage));
            }
        };

        ws.onmessage = async (event) => {
            let data;
            if (event.data instanceof Blob) {
                data = JSON.parse(await event.data.text());
            } else {
                data = JSON.parse(event.data as string);
            }

            if (data.serverContent?.modelTurn?.parts) {
                for (const part of data.serverContent.modelTurn.parts) {
                    if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                        const pcmData = base64ToFloat32(part.inlineData.data);
                        playAudioChunk(pcmData);
                    }
                }
            }

            // Forward other events if needed
            onRemoteEvent(data);
        };

        ws.onerror = (err) => console.error("Gemini WS Error", err);
        ws.onclose = () => console.log("Gemini WS Closed");

    } catch (error) {
        console.error("Failed to create Gemini connection", error);
        throw error;
    }

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

        // Gemini output is 24kHz typically
        const buffer = audioContext.createBuffer(1, audioData.length, 24000);
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

    return {
        disconnect: () => {
            ws?.close();
            mediaStream?.getTracks().forEach(track => track.stop());
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
            workletNode?.disconnect();
        }
    };
}

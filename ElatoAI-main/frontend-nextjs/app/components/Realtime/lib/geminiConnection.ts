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

// Gemini Multimodal Live API Configuration
const HOST = "generativelanguage.googleapis.com";
const URI = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
const MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

// Worklet module cache — avoid re-adding on every connection (~50-100ms saved)
let workletModuleAdded = false;

export async function createGeminiConnection(
    audioContext: AudioContext,
    apiKey: string,
    systemPrompt: string,
    voice: string,
    initialMessage: string,
    onRemoteEvent: (event: any) => void,
    onSpeakingStateChange?: (isSpeaking: boolean) => void,
    onDisconnect?: () => void,
    onTurnComplete?: () => void,
    externalStream?: MediaStream | null,
    externalDestination?: MediaStreamAudioDestinationNode
) {
    let ws: WebSocket | null = null;
    let finalMediaStream: MediaStream | null = null;
    let workletNode: AudioWorkletNode | null = null;
    let nextStartTime = 0;
    let speakingTimeout: NodeJS.Timeout | null = null;

    try {
        // 1. Setup Audio Context & Mic Permissions FIRST (prevents WS timeout while waiting)
        await audioContext.resume();
        console.log(`AudioContext Sample Rate: ${audioContext.sampleRate}`);

        try {
            if (!workletModuleAdded) {
                await audioContext.audioWorklet.addModule('data:text/javascript;base64,' + btoa(workletCode));
                workletModuleAdded = true;
            }
        } catch (e) {
            console.warn("Worklet might already be added or failed:", e);
        }

        if (externalStream) {
            finalMediaStream = externalStream;
        } else {
            finalMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                },
            });
        }

        // 2. Connect to WebSocket
        const url = `${URI}?key=${apiKey}`;
        ws = new WebSocket(url);

        // Define helpers inside to access closure variables
        function playAudioChunk(audioData: Float32Array) {
            if (!audioContext) return;

            // Notify speaking state
            if (onSpeakingStateChange) {
                onSpeakingStateChange(true);
                if (speakingTimeout) clearTimeout(speakingTimeout);
                speakingTimeout = setTimeout(() => {
                    onSpeakingStateChange(false);
                }, 800); // 800ms hangover — bridges natural pauses within sentences
            }

            // Gemini output is 24kHz typically
            const buffer = audioContext.createBuffer(1, audioData.length, 24000);
            buffer.getChannelData(0).set(audioData);

            const source = audioContext.createBufferSource();
            source.buffer = buffer;

            // Connect to external destination if provided, otherwise the user's speakers
            if (externalDestination) {
                source.connect(externalDestination);
            } else {
                source.connect(audioContext.destination);
            }

            if (nextStartTime < audioContext.currentTime) {
                nextStartTime = audioContext.currentTime;
            }
            source.start(nextStartTime);
            nextStartTime += buffer.duration;
        }

        // Track whether setup is complete — we defer the initial message until ACK
        let setupComplete = false;

        // Event Handlers - Assigned IMMEDIATELY
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
                // NOTE: initial message is now deferred until setup ACK (see onmessage)
            }
        };

        ws.onmessage = async (event) => {
            let data;
            if (event.data instanceof Blob) {
                data = JSON.parse(await event.data.text());
            } else {
                data = JSON.parse(event.data as string);
            }

            // Detect setup complete ACK — now safe to send initial message
            if (data.setupComplete && !setupComplete) {
                setupComplete = true;
                console.log("Gemini setup ACK received");
                if (initialMessage && ws && ws.readyState === WebSocket.OPEN) {
                    const msg = {
                        client_content: {
                            turns: [{
                                role: "user",
                                parts: [{ text: initialMessage }]
                            }],
                            turn_complete: true
                        }
                    };
                    ws.send(JSON.stringify(msg));
                }
                return; // setup ACK has no audio data
            }

            if (data.serverContent?.modelTurn?.parts) {
                for (const part of data.serverContent.modelTurn.parts) {
                    if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                        const pcmData = base64ToFloat32(part.inlineData.data);
                        playAudioChunk(pcmData);
                    }
                }
            }

            // Detect turn complete — AI is done speaking, user's turn
            if (data.serverContent?.turnComplete) {
                if (speakingTimeout) clearTimeout(speakingTimeout);
                if (onSpeakingStateChange) onSpeakingStateChange(false);
                if (onTurnComplete) onTurnComplete();
            }

            // Forward other events if needed
            onRemoteEvent(data);
        };

        ws.onerror = (err) => console.error("Gemini WS Error", err);
        ws.onclose = () => {
            console.log("Gemini WS Closed");
            if (onDisconnect) onDisconnect();
        };

        // 3. Audio Processing Setup
        const source = audioContext.createMediaStreamSource(finalMediaStream);
        workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

        workletNode.port.onmessage = (event) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                const inputData = event.data; // Float32Array at audioContext.sampleRate

                // Resample to 16000 if necessary
                const resampledData = resampleAudio(inputData, audioContext!.sampleRate, 16000);

                const pcm16 = floatTo16BitPCM(resampledData);
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

    } catch (error) {
        console.error("Failed to create Gemini connection", error);
        // Ensure cleanup if we fail during setup (only kill tracks we created ourselves)
        if (!externalStream) {
            finalMediaStream?.getTracks().forEach(track => track.stop());
        }
        throw error;
    }

    function sendTextMessage(text: string) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = {
                client_content: {
                    turns: [{
                        role: "user",
                        parts: [{ text: text }]
                    }],
                    turn_complete: true
                }
            };
            ws.send(JSON.stringify(message));
        }
    }

    return {
        disconnect: () => {
            ws?.close();
            // We only stop tracks if we grabbed the mic ourselves (not passed externally)
            if (!externalStream) {
                finalMediaStream?.getTracks().forEach(track => track.stop());
            }
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
            workletNode?.disconnect();
        },
        sendTextMessage
    };
}

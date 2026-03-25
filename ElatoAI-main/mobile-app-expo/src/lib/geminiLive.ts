const GEMINI_LIVE_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_LIVE_URI =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";
const GEMINI_LIVE_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

export type GeminiLiveSessionCallbacks = {
  onAudioChunk?: (base64Pcm24k: string) => void;
  onTextChunk?: (text: string) => void;
  onOutputTranscriptionChunk?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onReady?: () => void;
  onClose?: () => void;
  onError?: (message: string) => void;
};

export type GeminiLiveSession = {
  sendTextTurn: (text: string) => void;
  sendAudioChunk: (base64Pcm: string, sampleRate?: number) => void;
  startActivity: () => void;
  endActivity: () => void;
  close: () => void;
};

function decodeArrayBufferPayload(rawData: ArrayBuffer | ArrayBufferView) {
  if (rawData instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(rawData));
  }

  return new TextDecoder().decode(
    new Uint8Array(rawData.buffer, rawData.byteOffset, rawData.byteLength)
  );
}

async function parseWebSocketMessage(rawData: unknown) {
  if (typeof rawData === "string") {
    return JSON.parse(rawData);
  }

  if (rawData instanceof ArrayBuffer || ArrayBuffer.isView(rawData)) {
    return JSON.parse(decodeArrayBufferPayload(rawData));
  }

  if (typeof Blob !== "undefined" && rawData instanceof Blob) {
    return JSON.parse(await rawData.text());
  }

  if (
    rawData &&
    typeof rawData === "object" &&
    ("setupComplete" in rawData || "serverContent" in rawData || "error" in rawData)
  ) {
    return rawData;
  }

  if (rawData && typeof rawData === "object" && "data" in rawData) {
    const nested = (rawData as { data?: unknown }).data;

    if (typeof nested === "string") {
      return JSON.parse(nested);
    }

    if (nested instanceof ArrayBuffer || ArrayBuffer.isView(nested)) {
      return JSON.parse(decodeArrayBufferPayload(nested));
    }

    if (typeof Blob !== "undefined" && nested instanceof Blob) {
      return JSON.parse(await nested.text());
    }

    if (
      nested &&
      typeof nested === "object" &&
      ("setupComplete" in nested || "serverContent" in nested || "error" in nested)
    ) {
      return nested;
    }
  }

  throw new Error("Gemini live returned an unreadable payload.");
}

export async function createGeminiLiveSession({
  systemInstruction,
  voiceName,
  responseModalities = ["AUDIO"],
  enableOutputTranscription = false,
  startupRetries = 1,
  callbacks,
}: {
  systemInstruction: string;
  voiceName?: string | null;
  responseModalities?: Array<"AUDIO" | "TEXT">;
  enableOutputTranscription?: boolean;
  startupRetries?: number;
  callbacks?: GeminiLiveSessionCallbacks;
}): Promise<GeminiLiveSession> {
  if (!GEMINI_LIVE_API_KEY) {
    throw new Error("Gemini API key is not configured for live calls.");
  }

  const shouldRetryStartupError = (message: string) =>
    /closed before it was ready|timed out during startup|unable to connect/i.test(message);

  const connectOnce = () =>
    new Promise<GeminiLiveSession>((resolve, reject) => {
      const ws = new WebSocket(`${GEMINI_LIVE_URI}?key=${GEMINI_LIVE_API_KEY}`);
      let setupComplete = false;
      let closed = false;

      const failSetup = (message: string) => {
        if (setupComplete || closed) {
          callbacks?.onError?.(message);
          return;
        }

        closed = true;
        reject(new Error(message));

        try {
          ws.close();
        } catch {}
      };

      const ensureSessionReady = () => {
        if (closed || !setupComplete || ws.readyState !== WebSocket.OPEN) {
          return false;
        }

        return true;
      };

      ws.onopen = () => {
        const generationConfig: {
          response_modalities: Array<"AUDIO" | "TEXT">;
          speech_config?: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: string;
              };
            };
          };
          output_audio_transcription?: Record<string, never>;
        } = {
          response_modalities: responseModalities,
        };

        if (responseModalities.includes("AUDIO")) {
          generationConfig.speech_config = {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: voiceName?.trim() || "Fenrir",
              },
            },
          };

          if (enableOutputTranscription) {
            generationConfig.output_audio_transcription = {};
          }
        }

        ws.send(
          JSON.stringify({
            setup: {
              model: GEMINI_LIVE_MODEL,
              generation_config: generationConfig,
              system_instruction: {
                parts: [{ text: systemInstruction }],
              },
            },
          })
        );
      };

      ws.onmessage = async (event) => {
        try {
          const payload = await parseWebSocketMessage(event.data);

          if (payload.setupComplete && !setupComplete) {
            setupComplete = true;
            callbacks?.onReady?.();

            resolve({
              sendTextTurn: (text: string) => {
                if (!ensureSessionReady() || !text.trim()) {
                  return;
                }

                ws.send(
                  JSON.stringify({
                    client_content: {
                      turns: [
                        {
                          role: "user",
                          parts: [{ text }],
                        },
                      ],
                      turn_complete: true,
                    },
                  })
                );
              },
              sendAudioChunk: (base64Pcm: string, sampleRate = 16000) => {
                if (!ensureSessionReady() || !base64Pcm) {
                  return;
                }

                ws.send(
                  JSON.stringify({
                    realtime_input: {
                      media_chunks: [
                        {
                          mime_type: `audio/pcm;rate=${sampleRate}`,
                          data: base64Pcm,
                        },
                      ],
                    },
                  })
                );
              },
              startActivity: () => {
                if (!ensureSessionReady()) {
                  return;
                }

                ws.send(
                  JSON.stringify({
                    realtime_input: {
                      activity_start: {},
                    },
                  })
                );
              },
              endActivity: () => {
                if (!ensureSessionReady()) {
                  return;
                }

                ws.send(
                  JSON.stringify({
                    realtime_input: {
                      activity_end: {},
                    },
                  })
                );
              },
              close: () => {
                if (closed) {
                  return;
                }

                closed = true;

                try {
                  ws.close();
                } catch {}
              },
            });
            return;
          }

          if (payload.error) {
            const message =
              payload.error.message || payload.error.status || "Gemini live returned an error.";

            if (!setupComplete) {
              failSetup(message);
              return;
            }

            callbacks?.onError?.(message);
            return;
          }

          const serverContent = payload?.serverContent;
          if (!serverContent) {
            return;
          }

          if (serverContent.interrupted) {
            callbacks?.onInterrupted?.();
          }

          const parts = serverContent?.modelTurn?.parts;
          if (Array.isArray(parts)) {
            parts.forEach((part: { inlineData?: { mimeType?: string; data?: string }; text?: string }) => {
              if (
                part?.inlineData?.mimeType?.startsWith?.("audio/pcm") &&
                typeof part.inlineData.data === "string"
              ) {
                callbacks?.onAudioChunk?.(part.inlineData.data);
              }

              if (typeof part?.text === "string" && part.text.trim()) {
                callbacks?.onTextChunk?.(part.text);
              }
            });
          }

          const outputTranscription = serverContent?.outputTranscription?.text;
          if (typeof outputTranscription === "string" && outputTranscription.trim()) {
            callbacks?.onOutputTranscriptionChunk?.(outputTranscription);
          }

          if (serverContent.turnComplete) {
            callbacks?.onTurnComplete?.();
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to read Gemini live response.";

          if (!setupComplete) {
            failSetup(message);
            return;
          }

          callbacks?.onError?.(message);
        }
      };

      ws.onerror = (errorEvent: Event) => {
        const detail =
          (errorEvent as any)?.message ||
          (errorEvent as any)?.error?.message ||
          "";
        const message = detail
          ? `Unable to connect to Gemini live audio: ${detail}`
          : "Unable to connect to Gemini live audio.";

        if (!setupComplete) {
          failSetup(message);
          return;
        }

        callbacks?.onError?.(message);
      };

      ws.onclose = (closeEvent: CloseEvent) => {
        if (closed) {
          callbacks?.onClose?.();
          return;
        }

        closed = true;

        if (!setupComplete) {
          const code = closeEvent?.code ?? "unknown";
          const reason = closeEvent?.reason?.trim() || "no reason provided";
          reject(
            new Error(
              `Gemini live session closed before it was ready (code ${code}: ${reason}).`
            )
          );
          return;
        }

        callbacks?.onClose?.();
      };
    });

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= startupRetries) {
    try {
      return await connectOnce();
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Gemini live session failed during startup.");

      if (attempt >= startupRetries || !shouldRetryStartupError(lastError.message)) {
        throw lastError;
      }

      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
    }
  }

  throw lastError ?? new Error("Gemini live session failed during startup.");
}

const GEMINI_LIVE_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_LIVE_URI =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const GEMINI_LIVE_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

export type GeminiLiveSessionCallbacks = {
  onAudioChunk?: (base64Pcm24k: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onReady?: () => void;
  onClose?: () => void;
  onError?: (message: string) => void;
};

export type GeminiLiveSession = {
  sendTextTurn: (text: string) => void;
  sendAudioChunk: (base64Pcm: string, sampleRate?: number) => void;
  endAudioStream: () => void;
  close: () => void;
};

async function parseWebSocketMessage(rawData: unknown) {
  if (typeof rawData === "string") {
    return JSON.parse(rawData);
  }

  if (rawData instanceof ArrayBuffer) {
    return JSON.parse(new TextDecoder().decode(new Uint8Array(rawData)));
  }

  if (ArrayBuffer.isView(rawData)) {
    return JSON.parse(
      new TextDecoder().decode(
        new Uint8Array(rawData.buffer, rawData.byteOffset, rawData.byteLength)
      )
    );
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

    if (nested instanceof ArrayBuffer) {
      return JSON.parse(new TextDecoder().decode(new Uint8Array(nested)));
    }

    if (ArrayBuffer.isView(nested)) {
      return JSON.parse(
        new TextDecoder().decode(
          new Uint8Array(nested.buffer, nested.byteOffset, nested.byteLength)
        )
      );
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
  callbacks,
}: {
  systemInstruction: string;
  voiceName?: string | null;
  callbacks?: GeminiLiveSessionCallbacks;
}): Promise<GeminiLiveSession> {
  if (!GEMINI_LIVE_API_KEY) {
    throw new Error("Gemini API key is not configured for live calls.");
  }

  return new Promise<GeminiLiveSession>((resolve, reject) => {
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

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          setup: {
            model: GEMINI_LIVE_MODEL,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voiceName?.trim() || "Fenrir",
                  },
                },
              },
            },
            realtimeInputConfig: {
              activityHandling: "START_OF_ACTIVITY_INTERRUPTS",
              turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY",
              automaticActivityDetection: {
                disabled: false,
                startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
                endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
                prefixPaddingMs: 20,
                silenceDurationMs: 120,
              },
            },
            systemInstruction: {
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
              if (!setupComplete || ws.readyState !== WebSocket.OPEN) {
                return;
              }

              ws.send(
                JSON.stringify({
                  clientContent: {
                    turns: [
                      {
                        role: "user",
                        parts: [{ text }],
                      },
                    ],
                    turnComplete: true,
                  },
                })
              );
            },
            sendAudioChunk: (base64Pcm: string, sampleRate = 16000) => {
              if (!setupComplete || ws.readyState !== WebSocket.OPEN || !base64Pcm) {
                return;
              }

              ws.send(
                JSON.stringify({
                  realtimeInput: {
                    audio: {
                      data: base64Pcm,
                      mimeType: `audio/pcm;rate=${sampleRate}`,
                    },
                  },
                })
              );
            },
            endAudioStream: () => {
              if (!setupComplete || ws.readyState !== WebSocket.OPEN) {
                return;
              }

              ws.send(
                JSON.stringify({
                  realtimeInput: {
                    audioStreamEnd: true,
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
          parts.forEach((part: any) => {
            if (
              part?.inlineData?.mimeType?.startsWith?.("audio/pcm") &&
              typeof part.inlineData.data === "string"
            ) {
              callbacks?.onAudioChunk?.(part.inlineData.data);
            }
          });
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

    ws.onerror = () => {
      const message = "Unable to connect to Gemini live audio.";
      if (!setupComplete) {
        failSetup(message);
        return;
      }

      callbacks?.onError?.(message);
    };

    ws.onclose = () => {
      if (closed) {
        callbacks?.onClose?.();
        return;
      }

      closed = true;

      if (!setupComplete) {
        reject(new Error("Gemini live session closed before it was ready."));
        return;
      }

      callbacks?.onClose?.();
    };
  });
}

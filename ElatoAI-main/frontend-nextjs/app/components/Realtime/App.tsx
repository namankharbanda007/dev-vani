"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// UI components
import BottomToolbar from "./components/BottomToolbar";

// Types
import { AgentConfig, SessionStatus } from "@/app/components/Realtime/types";

// Context providers & hooks
import { useTranscript } from "@/app/components/Realtime/contexts/TranscriptContext";
import { useEvent } from "@/app/components/Realtime/contexts/EventContext";
import { useHandleServerEvent } from "./hooks/useHandleServerEvent";

// Utilities
import { createRealtimeConnection } from "./lib/realtimeConnection";
import { createGeminiConnection } from "./lib/geminiConnection";
import { createElevenLabsConnection } from "./lib/elevenLabsConnection";
import { toast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Transcript from "./components/Transcript";
import ActiveCallView from "./components/ActiveCallView"; // Import new view
import ChatInterface from "./components/ChatInterface"; // Import ChatInterface
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getPersonalityById } from "@/db/personalities";
import { createClient } from "@/utils/supabase/client";

interface AppProps {
  personalityIdState: string;
  isDoctor: boolean;
  userData: any;
  isGuest?: boolean;
  guestName?: string;
  guestDob?: string;
  onStateChange?: (state: { sessionStatus: string; isAgentSpeaking: boolean; agentActivity: 'speaking' | 'listening' | 'thinking' }) => void;
  autoConnect?: boolean;
  disconnectRef?: React.MutableRefObject<(() => void) | null>;
  pendingAction?: 'call' | 'chat' | null;
  onActionHandled?: () => void;
  children?: React.ReactNode;
}

function App({ personalityIdState, isDoctor, userData, isGuest = false, guestName, guestDob, onStateChange, autoConnect = false, disconnectRef, pendingAction, onActionHandled, children }: AppProps) {
  const supabase = createClient();

  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } =
    useTranscript();
  const { logClientEvent, logServerEvent } = useEvent();

  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [selectedAgentConfigSet, setSelectedAgentConfigSet] =
    useState<AgentConfig[] | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>("");
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [agentActivity, setAgentActivity] = useState<'speaking' | 'listening' | 'thinking'>('thinking');

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [personality, setPersonality] = useState<IPersonality | null>(null);

  useEffect(() => {
    const fetchPersonality = async () => {
      if (personalityIdState) {
        const personalityData = await getPersonalityById(supabase, personalityIdState);
        setPersonality(personalityData);
      }
    };

    fetchPersonality();
  }, [personalityIdState, supabase]);


  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const geminiDisconnectRef = useRef<(() => void) | null>(null);
  const intentionalDisconnectRef = useRef<boolean>(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatus>("DISCONNECTED");

  const [isEventsPaneExpanded, setIsEventsPaneExpanded] =
    useState<boolean>(true);
  const [isPTTActive, setIsPTTActive] = useState<boolean>(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState<boolean>(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] =
    useState<boolean>(true);

  const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      logClientEvent(eventObj, eventNameSuffix);
      dcRef.current.send(JSON.stringify(eventObj));
    } else {
      // For Gemini, we might not use this same event structure or data channel
      // But if we wanted to support it, we'd wrap it.
      // For now, logging error defaults to OAI logic.
      if (personality?.provider !== 'gemini') {
        logClientEvent(
          { attemptedEvent: eventObj.type },
          "error.data_channel_not_open"
        );
        console.error(
          "Failed to send message - no data channel available",
          eventObj
        );
      }
    }
  };

  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    selectedAgentName,
    selectedAgentConfigSet,
    sendClientEvent,
    setSelectedAgentName,
  });

  useEffect(() => {
    if (selectedAgentName && sessionStatus === "DISCONNECTED") {
      connectToRealtime();
    }
  }, [selectedAgentName]);

  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      updateSession(true);
    }
  }, [sessionStatus]);

  // Broadcast state to parent
  useEffect(() => {
    onStateChange?.({ sessionStatus, isAgentSpeaking, agentActivity });
  }, [sessionStatus, isAgentSpeaking, agentActivity, onStateChange]);

  // Auto-connect for guest demo
  useEffect(() => {
    if (autoConnect && sessionStatus === "DISCONNECTED") {
      const timer = setTimeout(() => {
        connectToRealtime();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoConnect]);

  // Expose disconnect to parent via ref
  useEffect(() => {
    if (disconnectRef) {
      disconnectRef.current = () => disconnectFromRealtime(true);
    }
  });

  // Handle pending actions from character card buttons
  useEffect(() => {
    if (!pendingAction || !personality) return;

    if (pendingAction === 'call') {
      // Auto-connect voice call
      if (sessionStatus === 'DISCONNECTED') {
        connectToRealtime();
        setIsSheetOpen(true);
      }
    } else if (pendingAction === 'chat') {
      // Open chat
      setIsChatOpen(true);
    }

    onActionHandled?.();
  }, [pendingAction, personality]);

  // Usage Tracking Heartbeat
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (sessionStatus === "CONNECTED" && !isGuest) {
      // 1. Initial check (optional, but good to catch limit immediately)
      // For now we just start tracking.

      const UPDATE_INTERVAL_MS = 10000; // Update every 10 seconds
      let lastUpdate = Date.now();

      intervalId = setInterval(async () => {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastUpdate) / 1000);
        lastUpdate = now;

        if (deltaSeconds > 0) {
          try {
            const response = await fetch("/api/user/usage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ seconds: deltaSeconds }),
            });

            if (!response.ok) {
              const data = await response.json();
              if (response.status === 403) { // Limit exceeded
                console.warn("Usage limit exceeded, disconnecting...");
                toast({
                  title: "Limit Reached",
                  description: data.message || "You have reached your monthly usage limit.",
                  variant: "destructive",
                });
                disconnectFromRealtime();
              }
            }
          } catch (err) {
            console.error("Failed to report usage:", err);
          }
        }
      }, UPDATE_INTERVAL_MS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionStatus]);

  const fetchSessionData = async (): Promise<any> => {
    logClientEvent({ url: "/session" }, "fetch_session_token_request");
    let url = "/api/session";
    if (isGuest) {
      const params = new URLSearchParams({
        guest: "true",
        personalityId: personalityIdState,
      });
      if (guestName) params.set("guestName", guestName);
      if (guestDob) params.set("guestDob", guestDob);
      url = `/api/session?${params.toString()}`;
    }

    console.log("[App] Fetching session data from:", url);
    const tokenResponse = await fetch(url);
    console.log("[App] Session API response status:", tokenResponse.status);
    const data = await tokenResponse.json();
    console.log("[App] Session API response data:", JSON.stringify(data));
    logServerEvent(data, "fetch_session_token_response");

    if (!tokenResponse.ok) {
      console.error("[App] Session API returned error:", data);
    }

    return data;
  };

  const connectToRealtime = async () => {
    if (sessionStatus !== "DISCONNECTED") return;

    // Create AudioContext synchronously to capture user gesture
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Resume immediately to prevent browser suspension policy blocking
    void audioContext.resume();

    setSessionStatus("CONNECTING");

    try {
      const sessionData = await fetchSessionData();

      // If the API returned an error, show it immediately
      if (sessionData.error) {
        console.error("[App] Session API error:", sessionData.error, sessionData.details);
        audioContext.close();
        setSessionStatus("DISCONNECTED");
        toast({
          description: `Failed to connect: ${sessionData.error}`,
          variant: "destructive"
        });
        return;
      }

      // Determine provider: use API-returned provider (works for guests) or client-side personality state
      const provider = sessionData.provider || personality?.provider;
      console.log("[App] Provider determined:", provider, "| sessionData.provider:", sessionData.provider, "| personality?.provider:", personality?.provider, "| isGuest:", isGuest);
      console.log("[App] Has gemini_api_key:", !!sessionData.gemini_api_key);

      if (provider === 'gemini') {
        if (!sessionData.gemini_api_key) {
          audioContext.close(); // Clean up if failing
          setSessionStatus("DISCONNECTED");
          toast({
            description: "Connection configuration invalid.",
            variant: "destructive"
          });
          return;
        }

        // Generate the initial system instructions or greeting
        const firstMsg = isDoctor
          ? "Ask the doctor if everything is good and how you can help them and their patient."
          : createFirstMessage();

        const geminiConnection = await createGeminiConnection(
          audioContext, // Pass the context created with user gesture
          sessionData.gemini_api_key,
          sessionData.system_prompt || "",
          sessionData.voice, // mapped voice
          firstMsg,       // Pass initial message to trigger greeting
          (event) => {
            // Handle remote events from Gemini if needed
            console.log("Gemini Event:", event);
          },
          (speaking) => {
            setIsAgentSpeaking(speaking);
            if (speaking) {
              setAgentActivity('speaking');
            } else {
              // When speaking stops via hangover timeout, set to thinking
              // (turnComplete callback will set to listening if appropriate)
              setAgentActivity(prev => prev === 'speaking' ? 'thinking' : prev);
            }
          },
          () => {
            console.log("Gemini connection disconnected");
            setSessionStatus("DISCONNECTED");
            if (!intentionalDisconnectRef.current) {
              toast({ description: "Connection lost", variant: "destructive" });
            }
            intentionalDisconnectRef.current = false;
          },
          () => {
            // onTurnComplete: AI finished speaking, now listening
            setAgentActivity('listening');
          }
        );

        geminiDisconnectRef.current = geminiConnection.disconnect;

        // Force state to "Speaking" immediately because we expect an initial greeting.
        setIsAgentSpeaking(true);
        setAgentActivity('speaking');
        setSessionStatus("CONNECTED");
        toast({ description: "Connected" });


      } else if (provider === 'elevenlabs') {
        if (!sessionData.signed_url) {
          audioContext.close();
          setSessionStatus("DISCONNECTED");
          toast({ description: "Failed to connect", variant: "destructive" });
          return;
        }

        const elevenLabsConnection = await createElevenLabsConnection(
          audioContext,
          sessionData.signed_url,
          (event) => {
            // Handle remote events
            if (event.type === 'agent_response') {
              setIsAgentSpeaking(true);
            }
          },
          (speaking) => {
            setIsAgentSpeaking(speaking);
          },
          () => {
            console.log("ElevenLabs disconnected");
            setSessionStatus("DISCONNECTED");
            if (!intentionalDisconnectRef.current) {
              // Only show if not intentional
            }
            intentionalDisconnectRef.current = false;
          }
        );

        geminiDisconnectRef.current = elevenLabsConnection.disconnect;
        setIsAgentSpeaking(true); // Assuming immediate interaction
        setSessionStatus("CONNECTED");
        toast({ description: "Connected" });

      } else {
        // OpenAI Logic
        if (!sessionData.client_secret?.value) {
          logClientEvent(sessionData, "error.no_ephemeral_key");
          setSessionStatus("DISCONNECTED");
          toast({
            description: "Your API key is likely invalid. Please add it to your env variables.",
          });
          return;
        }

        const EPHEMERAL_KEY = sessionData.client_secret.value;

        if (!audioElementRef.current) {
          audioElementRef.current = document.createElement("audio");
        }
        audioElementRef.current.autoplay = isAudioPlaybackEnabled;

        const { pc, dc } = await createRealtimeConnection(
          EPHEMERAL_KEY,
          audioElementRef
        );
        pcRef.current = pc;
        dcRef.current = dc;

        dc.addEventListener("open", () => {
          logClientEvent({}, "data_channel.open");
        });
        dc.addEventListener("close", () => {
          logClientEvent({}, "data_channel.close");
        });
        dc.addEventListener("error", (err: any) => {
          logClientEvent({ error: err }, "data_channel.error");
        });
        dc.addEventListener("message", (e: MessageEvent) => {
          handleServerEventRef.current(JSON.parse(e.data));
        });

        setDataChannel(dc);
      }
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      setSessionStatus("DISCONNECTED");
      toast({ description: "Failed to connect", variant: "destructive" });
    }
  };

  const disconnectFromRealtime = (intentional: boolean = false) => {
    intentionalDisconnectRef.current = intentional;
    if (geminiDisconnectRef.current) {
      geminiDisconnectRef.current();
      geminiDisconnectRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      pcRef.current.close();
      pcRef.current = null;
    }
    setDataChannel(null);
    setSessionStatus("DISCONNECTED");
    setIsPTTUserSpeaking(false);
    setIsAgentSpeaking(false);

    logClientEvent({}, "disconnected");
  };

  const sendSimulatedUserMessage = (text: string) => {
    const id = uuidv4().slice(0, 32);
    addTranscriptMessage(id, "user", text, true);

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          id,
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      },
      "(simulated user text message)"
    );
    sendClientEvent(
      { type: "response.create" },
      "(trigger response after simulated user text message)"
    );
  };

  const createFirstMessage = () => {
    if (isGuest && guestName) {
      return `My name is ${guestName}${guestDob ? ` and my date of birth is ${guestDob}` : ''}. Please greet me warmly by my name and give me personalized spiritual guidance.`;
    }
    return personality?.first_message_prompt
      ? `Always start the conversation following these instructions from the user: ${personality?.first_message_prompt}`
      : "The user is initiating a new chat here. Say something!";
  }

  const updateSession = (shouldTriggerResponse: boolean = false) => {
    sendClientEvent(
      { type: "input_audio_buffer.clear" },
      "clear audio buffer on session update"
    );

    const currentAgent = selectedAgentConfigSet?.find(
      (a) => a.name === selectedAgentName
    );

    const turnDetection = isPTTActive
      ? null
      : {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 200,
        create_response: true,
      };

    const tools = currentAgent?.tools || [];

    const sessionUpdateEvent = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: turnDetection,
        tools,
      },
    };

    sendClientEvent(sessionUpdateEvent);

    if (shouldTriggerResponse) {
      sendSimulatedUserMessage(isDoctor ? "Ask the doctor if everything is good and how you can help them and their patient." : createFirstMessage());
    }
  };

  const onToggleConnection = () => {
    // Only connect if we're disconnected
    if (sessionStatus === "DISCONNECTED") {
      connectToRealtime();
      setIsSheetOpen(true);
    } else {
      // If already connected or connecting, disconnect
      disconnectFromRealtime(true);
      setSessionStatus("DISCONNECTED");
      setIsSheetOpen(false);
    }
  };

  const cancelAssistantSpeech = async () => {
    const mostRecentAssistantMessage = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");

    if (!mostRecentAssistantMessage) {
      console.warn("can't cancel, no recent assistant message found");
      return;
    }
    if (mostRecentAssistantMessage.status === "DONE") {
      console.log("No truncation needed, message is DONE");
      return;
    }

    sendClientEvent({
      type: "conversation.item.truncate",
      item_id: mostRecentAssistantMessage?.itemId,
      content_index: 0,
      audio_end_ms: Date.now() - mostRecentAssistantMessage.createdAtMs,
    });
    sendClientEvent(
      { type: "response.cancel" },
      "(cancel due to user interruption)"
    );
  };

  const handleSendTextMessage = () => {
    if (!userText.trim()) return;
    cancelAssistantSpeech();

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: userText.trim() }],
        },
      },
      "(send user text message)"
    );
    setUserText("");

    sendClientEvent({ type: "response.create" }, "trigger response");
  };

  useEffect(() => {
    const storedPushToTalkUI = localStorage.getItem("pushToTalkUI");
    if (storedPushToTalkUI) {
      setIsPTTActive(storedPushToTalkUI === "true");
    }
    const storedLogsExpanded = localStorage.getItem("logsExpanded");
    if (storedLogsExpanded) {
      setIsEventsPaneExpanded(storedLogsExpanded === "true");
    }
    const storedAudioPlaybackEnabled = localStorage.getItem(
      "audioPlaybackEnabled"
    );
    if (storedAudioPlaybackEnabled) {
      setIsAudioPlaybackEnabled(storedAudioPlaybackEnabled === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pushToTalkUI", isPTTActive.toString());
  }, [isPTTActive]);

  useEffect(() => {
    localStorage.setItem("logsExpanded", isEventsPaneExpanded.toString());
  }, [isEventsPaneExpanded]);

  useEffect(() => {
    localStorage.setItem(
      "audioPlaybackEnabled",
      isAudioPlaybackEnabled.toString()
    );
  }, [isAudioPlaybackEnabled]);

  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaybackEnabled) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay may be blocked by browser:", err);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaybackEnabled]);

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);

    // If sheet is closed, disconnect
    if (!open && (sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING")) {
      disconnectFromRealtime(true);
      setSessionStatus("DISCONNECTED");
    }
  };

  if (!personality) {
    return null;
  }

  // Determine ACTIVE CALL STATE
  const activeCallState = sessionStatus === 'CONNECTING' ? 'connecting'
    : isAgentSpeaking ? 'speaking'
      : 'listening';

  return (
    <>
      {/* Only show BottomToolbar when not in card-action mode (i.e. guest/external usage) */}
      {(isGuest || autoConnect) && (
        <div className="inline-block">
          <BottomToolbar
            sessionStatus={sessionStatus}
            onToggleConnection={onToggleConnection}
            isDoctor={isDoctor}
            personality={personality}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
          />
        </div>
      )}

      {/* Voice Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="h-[80vh] md:h-full p-0"
          style={{ maxWidth: isMobile ? "100%" : "50%" }}
        >
          <div className="flex flex-col h-full bg-black">
            <div className="flex-1 overflow-hidden relative">
              {sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING" ? (
                <ActiveCallView
                  personality={personality}
                  state={activeCallState}
                  onEndCall={() => {
                    disconnectFromRealtime(true);
                    setIsSheetOpen(false);
                  }}
                />
              ) : (
                <Transcript
                  userText={userText}
                  setUserText={setUserText}
                  onSendMessage={handleSendTextMessage}
                  canSend={false}
                  personality={personality}
                  userId={userData?.id || 'guest'}
                  isDoctor={isDoctor}
                  supabase={supabase}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Chat Sheet */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="h-[80vh] md:h-full p-0 sm:max-w-md w-full"
          style={{ zIndex: 100 }}
        >
          {personality && (
            <ChatInterface
              personality={personality}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { SessionStatus } from "@/app/components/Realtime/types";
import { Paperclip, PhoneCall, Play, Stethoscope, MessageSquare } from "lucide-react";
import { Loader2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import styles from "./BottomToolbar.module.css";

interface BottomToolbarProps {
  sessionStatus: SessionStatus;
  onToggleConnection: () => void;
  isDoctor: boolean;
  personality: IPersonality;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

function BottomToolbar({
  sessionStatus,
  onToggleConnection,
  isDoctor,
  personality,
  onToggleChat,
  isChatOpen,
}: BottomToolbarProps) {
  const isConnected = sessionStatus === "CONNECTED";
  const isConnecting = sessionStatus === "CONNECTING";

  function getConnectionButtonIcon() {
    if (isConnected) return <X className="flex-shrink-0 h-4 w-4 md:h-4 md:w-4" size={12} />;
    if (isConnecting) return <Loader2 className="flex-shrink-0 h-4 w-4 md:h-4 md:w-4" size={12} />;
    return isDoctor ? <Stethoscope className="flex-shrink-0 h-4 w-4 md:h-4 md:w-4" size={12} /> : <PhoneCall className="flex-shrink-0 h-4 w-4 md:h-4 md:w-4" size={12} />;
  }

  function getConnectionButtonLabel() {
    if (isConnected) return "Disconnect";
    if (isConnecting) return "Connecting...";
    return "Connect now";
  }

  function getConnectionButtonLabelForDoctor() {
    if (isConnected) return "Submit";
    if (isConnecting) return "Connecting...";
    return "Doctor chat";
  }

  const isDisabled = isConnecting;

  function getConnectionButtonClasses() {
    const baseClasses = "text-white text-base p-2 w-fit rounded-full shadow-lg flex flex-row items-center justify-center gap-2 px-4";
    // const cursorClass = isDisabled ? "cursor-not-allowed" : "cursor-pointer";

    if (isDisabled) {
      return `bg-gray-600 hover:bg-gray-700 ${baseClasses}`;
    }

    if (isConnected) {
      // Connected -> label "Disconnect" -> red
      return `bg-red-600 hover:bg-red-700 ${baseClasses}`;
    }
    // Disconnected or connecting -> label is either "Connect" or "Connecting" -> black
    return `bg-black hover:bg-gray-900 ${baseClasses}`;
  }

  return (
    <div className="flex gap-4 items-center">
      {onToggleChat && (
        <button
          onClick={onToggleChat}
          className={`p-3 rounded-full shadow-lg flex items-center justify-center transition-all ${isChatOpen
              ? "bg-white text-black"
              : "bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
            }`}
          title="Chat"
        >
          <MessageSquare size={20} />
        </button>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {(!isConnected && !isDisabled) ? (
              <button
                onClick={() => {
                  onToggleConnection();
                }}
                className={styles.button}
                disabled={isDisabled}
              >
                <div>
                  <span>
                    {getConnectionButtonIcon()}
                    {isDoctor ? getConnectionButtonLabelForDoctor() : getConnectionButtonLabel()}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  onToggleConnection();
                }}
                className={getConnectionButtonClasses()}
                disabled={isDisabled}
              >
                {getConnectionButtonIcon()}
                {isDoctor ? getConnectionButtonLabelForDoctor() : getConnectionButtonLabel()}
              </button>
            )}
          </TooltipTrigger>
          {isDisabled && (
            <TooltipContent>
              <p>Connecting...</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

    </div>
  );
}

export default BottomToolbar;

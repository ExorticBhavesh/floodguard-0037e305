import { User, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedAvatar } from "./AnimatedAvatar";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isSpeaking?: boolean;
  isLoadingAudio?: boolean;
  onSpeak?: () => void;
  onStopSpeaking?: () => void;
}

export function ChatMessage({ 
  role, 
  content, 
  isStreaming,
  isSpeaking,
  isLoadingAudio,
  onSpeak,
  onStopSpeaking
}: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      {isAssistant ? (
        <AnimatedAvatar 
          isSpeaking={isSpeaking || false} 
          size="sm" 
          className="flex-shrink-0 shadow-glow"
        />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl relative group",
          isAssistant
            ? "bg-card border border-border rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        <div className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          isAssistant ? "text-foreground" : "text-primary-foreground"
        )}>
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm" />
          )}
        </div>

        {/* Speak button for assistant messages */}
        {isAssistant && !isStreaming && content && (
          <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-0 rounded-full shadow-md"
              onClick={isSpeaking ? onStopSpeaking : onSpeak}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

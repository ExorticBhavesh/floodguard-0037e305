import { User, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedAvatar, detectEmotion, AvatarEmotion } from "./AnimatedAvatar";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

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

  const emotion: AvatarEmotion = useMemo(() => {
    if (isStreaming) return "thinking";
    if (!content) return "neutral";
    return detectEmotion(content);
  }, [content, isStreaming]);

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
          emotion={emotion}
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
          "max-w-[85%] px-4 py-3 rounded-2xl relative group",
          isAssistant
            ? "bg-card border border-border rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        <div className={cn(
          "text-sm leading-relaxed",
          isAssistant ? "text-foreground" : "text-primary-foreground"
        )}>
          {isAssistant ? (
            <div className="prose prose-sm prose-invert max-w-none 
              prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1.5
              prose-h2:text-base prose-h3:text-sm
              prose-p:text-sm prose-p:leading-relaxed prose-p:my-1.5
              prose-ul:my-1.5 prose-li:my-0.5 prose-li:text-sm
              prose-strong:text-primary prose-strong:font-semibold
              prose-table:text-xs prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1
              prose-table:border prose-th:border prose-td:border prose-th:border-border prose-td:border-border
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:text-sm
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
            ">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{content}</span>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm" />
          )}
        </div>

        {/* Speak button */}
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

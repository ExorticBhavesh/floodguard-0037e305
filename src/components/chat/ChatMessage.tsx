import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
          isAssistant
            ? "bg-gradient-primary shadow-glow"
            : "bg-secondary"
        )}
      >
        {isAssistant ? (
          <Bot className="w-5 h-5 text-primary-foreground" />
        ) : (
          <User className="w-5 h-5 text-secondary-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl",
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
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    isSupported: isSpeechSupported,
    error: speechError,
    interimTranscript,
    startListening,
    stopListening,
  } = useSpeechToText({
    onResult: (transcript) => {
      setInput((prev) => {
        const newText = prev ? `${prev} ${transcript}` : transcript;
        return newText;
      });
    },
    continuous: true,
  });

  // Show speech errors
  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = input.trim();
    if (textToSend && !isLoading && !disabled) {
      if (isListening) {
        stopListening();
      }
      onSend(textToSend);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input, interimTranscript]);

  const displayText = isListening && interimTranscript 
    ? `${input}${input ? " " : ""}${interimTranscript}`
    : input;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex items-end gap-2 p-2 bg-card border rounded-2xl shadow-card transition-colors",
        isListening ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}>
        {/* Microphone button */}
        {isSpeechSupported && (
          <Button
            type="button"
            variant={isListening ? "default" : "ghost"}
            size="icon"
            onClick={handleMicClick}
            disabled={isLoading || disabled}
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl transition-all",
              isListening && "bg-destructive hover:bg-destructive/90 animate-pulse"
            )}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... speak now" : "Ask about flood safety, evacuation, or emergencies..."}
            disabled={isLoading || disabled}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-2 min-h-[40px] max-h-[120px]",
              isListening && "placeholder:text-primary"
            )}
          />
          
          {/* Live transcription indicator */}
          {isListening && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!displayText.trim() || isLoading || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Listening status */}
      {isListening && (
        <p className="text-xs text-primary text-center mt-2 animate-pulse">
          🎤 Listening... Click the mic button or press Enter to send
        </p>
      )}
    </form>
  );
}

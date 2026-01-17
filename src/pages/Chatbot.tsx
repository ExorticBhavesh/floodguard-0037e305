import { useRef, useEffect, useState } from "react";
import { Trash2, Shield, Waves, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { AnimatedAvatar } from "@/components/chat/AnimatedAvatar";
import { useFloodChat } from "@/hooks/useFloodChat";
import { useTTS } from "@/hooks/useTTS";

export default function Chatbot() {
  const { messages, isLoading, sendMessage, clearMessages } = useFloodChat();
  const { speak, stop, isSpeaking, isLoading: isLoadingAudio } = useTTS();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const lastSpokenRef = useRef<number>(-1);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!autoSpeak || isLoading) return;
    
    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;
    
    if (
      lastMessage?.role === "assistant" && 
      lastMessage.content && 
      lastIndex > lastSpokenRef.current
    ) {
      lastSpokenRef.current = lastIndex;
      setSpeakingIndex(lastIndex);
      speak(lastMessage.content);
    }
  }, [messages, isLoading, autoSpeak, speak]);

  // Reset speaking index when audio stops
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingIndex(null);
    }
  }, [isSpeaking]);

  const handleSpeak = (content: string, index: number) => {
    setSpeakingIndex(index);
    speak(content);
  };

  const handleStopSpeaking = () => {
    stop();
    setSpeakingIndex(null);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-8 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-hero" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <AnimatedAvatar isSpeaking={isSpeaking} size="lg" className="shadow-glow" />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                FloodGuard AI
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Voice Enabled
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Your 24/7 flood safety & evacuation assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto-speak toggle */}
            <Button
              variant={autoSpeak ? "default" : "ghost"}
              size="sm"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className="gap-2"
              title={autoSpeak ? "Auto-speak is ON" : "Auto-speak is OFF"}
            >
              {autoSpeak ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {autoSpeak ? "Voice On" : "Voice Off"}
              </span>
            </Button>

            {hasMessages && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  stop();
                  clearMessages();
                  lastSpokenRef.current = -1;
                }}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm rounded-3xl border border-border overflow-hidden shadow-lg">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {!hasMessages ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Welcome State with Animated Avatar */}
                <div className="relative mb-8">
                  <AnimatedAvatar isSpeaking={false} size="lg" className="shadow-glow animate-float" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md">
                    <Waves className="w-4 h-4 text-primary" />
                  </div>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Welcome to FloodGuard AI
                </h2>
                <p className="text-muted-foreground mb-2 max-w-md">
                  I'm here to help you with flood safety information, evacuation procedures, and emergency preparedness.
                </p>
                <p className="text-sm text-primary mb-8 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  I can speak! Ask me anything.
                </p>

                {/* Quick Actions */}
                <div className="w-full max-w-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Quick Topics
                  </p>
                  <QuickActions onSelect={sendMessage} disabled={isLoading} />
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
                    isSpeaking={speakingIndex === i && isSpeaking}
                    isLoadingAudio={speakingIndex === i && isLoadingAudio}
                    onSpeak={() => handleSpeak(msg.content, i)}
                    onStopSpeaking={handleStopSpeaking}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background/50">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              For life-threatening emergencies, always call <span className="font-semibold text-destructive">911</span> immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

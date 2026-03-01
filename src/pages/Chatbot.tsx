import { useRef, useEffect } from "react";
import { Trash2, Waves, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { AnimatedAvatar } from "@/components/chat/AnimatedAvatar";
import { VoiceSettings } from "@/components/chat/VoiceSettings";
import { useFloodChat } from "@/hooks/useFloodChat";
import { useTTS } from "@/hooks/useTTS";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function Chatbot() {
  const { messages, isLoading, sendMessage, clearMessages } = useFloodChat();
  const { 
    speak, 
    stop, 
    isSpeaking, 
    isLoading: isLoadingAudio, 
    settings, 
    updateSettings,
    useFallbackMode,
    resetToElevenLabs
  } = useTTS();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speakingIndexRef = useRef<number | null>(null);
  const lastSpokenRef = useRef<number>(-1);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!settings.autoSpeak || isLoading) return;
    
    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;
    
    if (
      lastMessage?.role === "assistant" && 
      lastMessage.content && 
      lastIndex > lastSpokenRef.current
    ) {
      lastSpokenRef.current = lastIndex;
      speakingIndexRef.current = lastIndex;
      speak(lastMessage.content);
    }
  }, [messages, isLoading, settings.autoSpeak, speak]);

  // Reset speaking index when audio stops
  useEffect(() => {
    if (!isSpeaking) {
      speakingIndexRef.current = null;
    }
  }, [isSpeaking]);

  const handleSpeak = (content: string, index: number) => {
    speakingIndexRef.current = index;
    speak(content);
  };

  const handleStopSpeaking = () => {
    stop();
    speakingIndexRef.current = null;
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-8 relative overflow-hidden scroll-smooth">
      <AnimatedBackground variant="chat" />

      <div className="container mx-auto px-4 relative z-10 h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <AnimatedAvatar isSpeaking={isSpeaking} emotion="happy" size="lg" className="shadow-glow" />
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
            {/* Quick auto-speak toggle */}
            <Button
              variant={settings.autoSpeak ? "default" : "ghost"}
              size="sm"
              onClick={() => updateSettings({ autoSpeak: !settings.autoSpeak })}
              className="gap-2"
              title={settings.autoSpeak ? "Auto-speak is ON" : "Auto-speak is OFF"}
            >
              {settings.autoSpeak ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {settings.autoSpeak ? "Voice On" : "Voice Off"}
              </span>
            </Button>

            {/* Voice Settings */}
            <VoiceSettings
              settings={settings}
              onSettingsChange={updateSettings}
              useFallbackMode={useFallbackMode}
              onResetToElevenLabs={resetToElevenLabs}
            />

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
        <div className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 overflow-hidden shadow-lg">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {!hasMessages ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Welcome State with Animated Avatar */}
                <div className="relative mb-8">
                  <AnimatedAvatar isSpeaking={false} emotion="happy" size="lg" className="shadow-glow animate-float" />
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
                    isSpeaking={speakingIndexRef.current === i && isSpeaking}
                    isLoadingAudio={speakingIndexRef.current === i && isLoadingAudio}
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

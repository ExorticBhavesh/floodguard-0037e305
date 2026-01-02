import { useRef, useEffect } from "react";
import { Bot, Trash2, Shield, Waves, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { useFloodChat } from "@/hooks/useFloodChat";

export default function Chatbot() {
  const { messages, isLoading, sendMessage, clearMessages } = useFloodChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Bot className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-risk-low rounded-full flex items-center justify-center border-2 border-background">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                FloodGuard AI
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Powered by AI
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Your 24/7 flood safety & evacuation assistant
              </p>
            </div>
          </div>
          
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm rounded-3xl border border-border overflow-hidden shadow-lg">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {!hasMessages ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Welcome State */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
                    <Shield className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md">
                    <Waves className="w-4 h-4 text-primary" />
                  </div>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Welcome to FloodGuard AI
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  I'm here to help you with flood safety information, evacuation procedures, and emergency preparedness. Ask me anything!
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

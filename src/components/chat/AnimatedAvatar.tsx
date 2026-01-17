import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedAvatar({ isSpeaking, size = "md", className }: AnimatedAvatarProps) {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthState, setMouthState] = useState(0);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthState(prev => (prev + 1) % 4);
    }, 120);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const eyeScale = {
    sm: "scale-75",
    md: "scale-100",
    lg: "scale-150",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {/* Gradient background with glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent animate-gradient-shift" />
      
      {/* Animated rings */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        isSpeaking && "animate-pulse"
      )}>
        <div className={cn(
          "absolute rounded-full border-2 border-primary-foreground/30 transition-all duration-300",
          isSpeaking ? "w-[120%] h-[120%] opacity-50" : "w-[90%] h-[90%] opacity-20"
        )} />
        <div className={cn(
          "absolute rounded-full border border-primary-foreground/20 transition-all duration-500",
          isSpeaking ? "w-[140%] h-[140%] opacity-40" : "w-[80%] h-[80%] opacity-10"
        )} />
      </div>

      {/* Face container */}
      <div className={cn("absolute inset-0 flex flex-col items-center justify-center", eyeScale[size])}>
        {/* Eyes */}
        <div className="flex gap-3 mb-1">
          {/* Left eye */}
          <div className="relative">
            <div className={cn(
              "w-3 h-3 bg-primary-foreground rounded-full transition-all duration-100",
              blinkState && "scale-y-[0.1]"
            )}>
              {/* Eye shine */}
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-primary/50 rounded-full" />
            </div>
          </div>
          
          {/* Right eye */}
          <div className="relative">
            <div className={cn(
              "w-3 h-3 bg-primary-foreground rounded-full transition-all duration-100",
              blinkState && "scale-y-[0.1]"
            )}>
              {/* Eye shine */}
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-primary/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Mouth */}
        <div className="mt-1 relative">
          {isSpeaking ? (
            <div
              className={cn(
                "bg-primary-foreground rounded-full transition-all duration-100",
                mouthState === 0 && "w-2 h-1",
                mouthState === 1 && "w-3 h-2 rounded-full",
                mouthState === 2 && "w-2 h-3 rounded-full",
                mouthState === 3 && "w-3 h-1.5 rounded-full"
              )}
            />
          ) : (
            <div className="w-4 h-1 bg-primary-foreground/80 rounded-full" />
          )}
        </div>
      </div>

      {/* Sound waves when speaking */}
      {isSpeaking && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <div className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-ping" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-ping" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-ping" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Sparkle effect */}
      <div className="absolute top-1 right-1 w-2 h-2">
        <div className="absolute inset-0 bg-primary-foreground/80 rounded-full animate-sparkle" />
      </div>
    </div>
  );
}

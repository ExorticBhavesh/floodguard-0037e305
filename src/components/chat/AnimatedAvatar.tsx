import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AvatarEmotion = "neutral" | "happy" | "concerned" | "alert" | "thinking";

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  emotion?: AvatarEmotion;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Emotion color themes
const emotionColors: Record<AvatarEmotion, { gradient: string; ring: string; glow: string }> = {
  neutral: {
    gradient: "from-primary via-primary/80 to-accent",
    ring: "border-primary-foreground/30",
    glow: "shadow-primary/20",
  },
  happy: {
    gradient: "from-emerald-500 via-emerald-400 to-teal-400",
    ring: "border-emerald-200/50",
    glow: "shadow-emerald-400/30",
  },
  concerned: {
    gradient: "from-amber-500 via-amber-400 to-yellow-400",
    ring: "border-amber-200/50",
    glow: "shadow-amber-400/30",
  },
  alert: {
    gradient: "from-red-500 via-red-400 to-orange-400",
    ring: "border-red-200/50",
    glow: "shadow-red-400/30",
  },
  thinking: {
    gradient: "from-violet-500 via-purple-400 to-indigo-400",
    ring: "border-violet-200/50",
    glow: "shadow-violet-400/30",
  },
};

export function AnimatedAvatar({ 
  isSpeaking, 
  emotion = "neutral", 
  size = "md", 
  className 
}: AnimatedAvatarProps) {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthState, setMouthState] = useState(0);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  const colors = emotionColors[emotion];

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

  // Subtle eye movement for "thinking" emotion
  useEffect(() => {
    if (emotion !== "thinking") {
      setEyePosition({ x: 0, y: 0 });
      return;
    }

    const moveInterval = setInterval(() => {
      setEyePosition({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 1,
      });
    }, 800);

    return () => clearInterval(moveInterval);
  }, [emotion]);

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

  // Get emotion-specific eye and mouth styles
  const getEyebrowStyle = () => {
    switch (emotion) {
      case "happy":
        return "rotate-[-5deg]";
      case "concerned":
        return "rotate-[10deg] translate-y-[-1px]";
      case "alert":
        return "rotate-[15deg] translate-y-[-2px]";
      case "thinking":
        return "rotate-[-3deg] translate-y-[1px]";
      default:
        return "";
    }
  };

  const getMouthShape = () => {
    if (isSpeaking) {
      return (
        <div
          className={cn(
            "bg-white rounded-full transition-all duration-100",
            mouthState === 0 && "w-2 h-1",
            mouthState === 1 && "w-3 h-2 rounded-full",
            mouthState === 2 && "w-2 h-3 rounded-full",
            mouthState === 3 && "w-3 h-1.5 rounded-full"
          )}
        />
      );
    }

    switch (emotion) {
      case "happy":
        return (
          <div className="relative w-5 h-2.5 overflow-hidden">
            <div className="absolute inset-0 border-2 border-white rounded-b-full border-t-0" />
          </div>
        );
      case "concerned":
        return (
          <div className="w-3 h-3 border-2 border-white rounded-full" />
        );
      case "alert":
        return (
          <div className="w-4 h-2 bg-white rounded-full" />
        );
      case "thinking":
        return (
          <div className="w-3 h-0.5 bg-white/80 rounded-full transform -rotate-6" />
        );
      default:
        return (
          <div className="w-4 h-1 bg-white/80 rounded-full" />
        );
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden transition-shadow duration-300",
        sizeClasses[size],
        `shadow-lg ${colors.glow}`,
        className
      )}
    >
      {/* Gradient background with glow */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-all duration-500",
        colors.gradient,
        emotion === "alert" && "animate-pulse"
      )} />
      
      {/* Animated rings */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        isSpeaking && "animate-pulse"
      )}>
        <div className={cn(
          "absolute rounded-full border-2 transition-all duration-300",
          colors.ring,
          isSpeaking ? "w-[120%] h-[120%] opacity-50" : "w-[90%] h-[90%] opacity-20"
        )} />
        <div className={cn(
          "absolute rounded-full border transition-all duration-500",
          colors.ring,
          isSpeaking ? "w-[140%] h-[140%] opacity-40" : "w-[80%] h-[80%] opacity-10"
        )} />
      </div>

      {/* Face container */}
      <div className={cn("absolute inset-0 flex flex-col items-center justify-center", eyeScale[size])}>
        {/* Eyebrows (only shown for certain emotions) */}
        {(emotion === "concerned" || emotion === "alert") && (
          <div className="flex gap-3 mb-0.5">
            <div className={cn(
              "w-2.5 h-0.5 bg-white/70 rounded-full transition-transform",
              getEyebrowStyle()
            )} />
            <div className={cn(
              "w-2.5 h-0.5 bg-white/70 rounded-full transition-transform",
              emotion === "concerned" ? "rotate-[-10deg] translate-y-[-1px]" : "rotate-[-15deg] translate-y-[-2px]"
            )} />
          </div>
        )}

        {/* Eyes */}
        <div className="flex gap-3 mb-1">
          {/* Left eye */}
          <div className="relative">
            <div 
              className={cn(
                "w-3 h-3 bg-white rounded-full transition-all duration-100",
                blinkState && "scale-y-[0.1]",
                emotion === "happy" && "scale-y-[0.6] translate-y-[1px]"
              )}
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) ${blinkState ? 'scaleY(0.1)' : ''} ${emotion === 'happy' ? 'scaleY(0.6) translateY(1px)' : ''}`
              }}
            >
              {/* Eye shine */}
              <div className={cn(
                "absolute top-0.5 left-0.5 w-1 h-1 rounded-full transition-colors",
                emotion === "alert" ? "bg-red-900/50" : "bg-primary/50"
              )} />
              
              {/* Alert eye effect */}
              {emotion === "alert" && !blinkState && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-900/30 rounded-full" />
                </div>
              )}
            </div>
          </div>
          
          {/* Right eye */}
          <div className="relative">
            <div 
              className={cn(
                "w-3 h-3 bg-white rounded-full transition-all duration-100",
                blinkState && "scale-y-[0.1]",
                emotion === "happy" && "scale-y-[0.6] translate-y-[1px]"
              )}
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) ${blinkState ? 'scaleY(0.1)' : ''} ${emotion === 'happy' ? 'scaleY(0.6) translateY(1px)' : ''}`
              }}
            >
              {/* Eye shine */}
              <div className={cn(
                "absolute top-0.5 left-0.5 w-1 h-1 rounded-full transition-colors",
                emotion === "alert" ? "bg-red-900/50" : "bg-primary/50"
              )} />
              
              {/* Alert eye effect */}
              {emotion === "alert" && !blinkState && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-900/30 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mouth */}
        <div className="mt-1 relative flex items-center justify-center">
          {getMouthShape()}
        </div>
      </div>

      {/* Sound waves when speaking */}
      {isSpeaking && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-ping" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-ping" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-ping" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Emotion indicator icons */}
      {emotion === "alert" && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center animate-bounce">
          <span className="text-[8px]">!</span>
        </div>
      )}

      {emotion === "thinking" && (
        <div className="absolute -top-1 -right-1 flex gap-0.5">
          <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Sparkle effect */}
      {emotion !== "alert" && (
        <div className="absolute top-1 right-1 w-2 h-2">
          <div className="absolute inset-0 bg-white/80 rounded-full animate-sparkle" />
        </div>
      )}
    </div>
  );
}

// Helper function to detect emotion from message content
export function detectEmotion(content: string): AvatarEmotion {
  const lowerContent = content.toLowerCase();
  
  // Alert keywords
  if (
    lowerContent.includes("danger") ||
    lowerContent.includes("emergency") ||
    lowerContent.includes("evacuate") ||
    lowerContent.includes("immediately") ||
    lowerContent.includes("critical") ||
    lowerContent.includes("warning") ||
    lowerContent.includes("flood warning") ||
    lowerContent.includes("seek shelter") ||
    lowerContent.includes("life-threatening")
  ) {
    return "alert";
  }
  
  // Concerned keywords
  if (
    lowerContent.includes("caution") ||
    lowerContent.includes("careful") ||
    lowerContent.includes("risk") ||
    lowerContent.includes("monitor") ||
    lowerContent.includes("watch") ||
    lowerContent.includes("advisory") ||
    lowerContent.includes("prepare") ||
    lowerContent.includes("potential")
  ) {
    return "concerned";
  }
  
  // Happy/positive keywords
  if (
    lowerContent.includes("safe") ||
    lowerContent.includes("great") ||
    lowerContent.includes("good news") ||
    lowerContent.includes("all clear") ||
    lowerContent.includes("no flooding") ||
    lowerContent.includes("low risk") ||
    lowerContent.includes("you're welcome") ||
    lowerContent.includes("glad to help") ||
    lowerContent.includes("happy to")
  ) {
    return "happy";
  }
  
  return "neutral";
}

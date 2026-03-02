import { useState } from "react";

interface SOSButtonProps {
  onPress: () => void;
  isActive: boolean;
}

export function SOSButton({ onPress, isActive }: SOSButtonProps) {
  const [pressing, setPressing] = useState(false);

  const handlePress = () => {
    setPressing(true);
    // Trigger haptic if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
    onPress();
    setTimeout(() => setPressing(false), 300);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pulsing rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full animate-signal" style={{
              border: "2px solid hsl(0 100% 60% / 0.3)",
              width: "128px",
              height: "128px",
            }} />
            <div className="absolute inset-0 rounded-full animate-signal" style={{
              border: "2px solid hsl(0 100% 60% / 0.2)",
              width: "128px",
              height: "128px",
              animationDelay: "0.5s",
            }} />
            <div className="absolute inset-0 rounded-full animate-signal" style={{
              border: "2px solid hsl(0 100% 60% / 0.1)",
              width: "128px",
              height: "128px",
              animationDelay: "1s",
            }} />
          </>
        )}

        {/* Main button */}
        <button
          onClick={handlePress}
          className={`sos-button ${pressing ? "scale-90" : ""} ${isActive ? "animate-glow-pulse" : ""}`}
          style={{
            animation: isActive ? "sosPulse 1.5s ease-in-out infinite" : undefined,
          }}
        >
          <span className="text-3xl font-black text-destructive-foreground tracking-wider select-none">
            SOS
          </span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        {isActive ? (
          <span className="text-destructive font-medium animate-pulse">
            Broadcasting SOS to nearby nodes...
          </span>
        ) : (
          "Tap to broadcast emergency signal via mesh network"
        )}
      </p>
    </div>
  );
}

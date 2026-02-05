import { useEffect, useState, useMemo, useCallback } from "react";

interface AnimatedBackgroundProps {
  variant?: "hero" | "dashboard" | "alerts" | "chat";
  isWarningActive?: boolean;
  warningLevel?: "low" | "medium" | "high" | "critical";
}

export function AnimatedBackground({ 
  variant = "hero", 
  isWarningActive = false,
  warningLevel = "low"
}: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [rainDrops, setRainDrops] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [floodLevel, setFloodLevel] = useState(0);

  // Generate rain drops
  useEffect(() => {
    const drops = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
    }));
    setRainDrops(drops);
  }, []);

  // Lightning effect for high/critical warnings
  useEffect(() => {
    if (!isWarningActive || (warningLevel !== "high" && warningLevel !== "critical")) return;
    
    const triggerLightning = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 150);
      setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 100);
      }, 200);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        triggerLightning();
      }
    }, warningLevel === "critical" ? 3000 : 6000);

    return () => clearInterval(interval);
  }, [isWarningActive, warningLevel]);

  // Flood level animation
  useEffect(() => {
    if (!isWarningActive) {
      setFloodLevel(0);
      return;
    }
    
    const targetLevel = warningLevel === "critical" ? 25 : warningLevel === "high" ? 15 : warningLevel === "medium" ? 8 : 3;
    const interval = setInterval(() => {
      setFloodLevel(prev => {
        const diff = targetLevel - prev;
        return prev + diff * 0.05;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isWarningActive, warningLevel]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.02);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const orbColors = useMemo(() => {
    if (isWarningActive && (warningLevel === "high" || warningLevel === "critical")) {
      return {
        primary: "hsl(0 72% 51% / 0.35)",
        secondary: "hsl(38 92% 50% / 0.3)",
        tertiary: "hsl(220 70% 30% / 0.25)",
      };
    }
    
    switch (variant) {
      case "dashboard":
        return {
          primary: "hsl(200 98% 50% / 0.35)",
          secondary: "hsl(152 82% 39% / 0.25)",
          tertiary: "hsl(38 92% 50% / 0.2)",
        };
      case "alerts":
        return {
          primary: "hsl(0 72% 51% / 0.25)",
          secondary: "hsl(38 92% 50% / 0.3)",
          tertiary: "hsl(200 98% 50% / 0.2)",
        };
      case "chat":
        return {
          primary: "hsl(200 98% 50% / 0.3)",
          secondary: "hsl(152 82% 39% / 0.25)",
          tertiary: "hsl(280 70% 50% / 0.15)",
        };
      default:
        return {
          primary: "hsl(200 98% 50% / 0.4)",
          secondary: "hsl(200 80% 60% / 0.3)",
          tertiary: "hsl(152 82% 39% / 0.25)",
        };
    }
  }, [variant, isWarningActive, warningLevel]);

  const showWeatherEffects = isWarningActive && (warningLevel === "medium" || warningLevel === "high" || warningLevel === "critical");

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Lightning Flash Overlay */}
      {lightningFlash && (
        <div 
          className="absolute inset-0 z-50 transition-opacity"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.9) 0%, rgba(200,200,255,0.4) 40%, transparent 70%)',
            opacity: 1,
          }}
        />
      )}

      {/* Base gradient - darker during storms */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: showWeatherEffects 
            ? 'linear-gradient(180deg, hsl(220 30% 8%) 0%, hsl(220 25% 15%) 50%, hsl(200 30% 20%) 100%)'
            : 'var(--gradient-hero)',
        }}
      />
      
      {/* Storm clouds layer */}
      {showWeatherEffects && (
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={`cloud-${i}`}
              className="absolute rounded-full blur-[80px] animate-pulse"
              style={{
                width: `${300 + i * 100}px`,
                height: `${150 + i * 50}px`,
                left: `${i * 20 - 10}%`,
                top: `${-5 + i * 3}%`,
                background: `radial-gradient(ellipse, hsl(220 20% ${20 + i * 5}% / 0.8) 0%, transparent 70%)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Rain Effect */}
      {showWeatherEffects && (
        <div className="absolute inset-0 overflow-hidden">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-[2px] bg-gradient-to-b from-transparent via-blue-300/60 to-blue-400/80"
              style={{
                left: `${drop.left}%`,
                top: '-20px',
                height: `${20 + Math.random() * 30}px`,
                animation: `rainFall ${drop.duration}s linear infinite`,
                animationDelay: `${drop.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Rain splash effect at bottom */}
      {showWeatherEffects && (
        <div className="absolute bottom-0 left-0 right-0 h-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={`splash-${i}`}
              className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-300/50"
              style={{
                left: `${i * 5 + Math.random() * 3}%`,
                animation: `splash 0.6s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Flooding water effect */}
      {isWarningActive && floodLevel > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
          style={{
            height: `${floodLevel}%`,
            background: `linear-gradient(180deg, 
              hsl(200 80% 40% / 0.3) 0%, 
              hsl(200 70% 35% / 0.5) 30%,
              hsl(200 60% 30% / 0.7) 100%)`,
          }}
        >
          {/* Water surface waves */}
          <div 
            className="absolute top-0 left-0 right-0 h-8"
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: '600px 100%',
              animation: 'waveMove 3s linear infinite',
            }}
          />
          {/* Second wave layer */}
          <div 
            className="absolute top-2 left-0 right-0 h-6"
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0,60 Q150,30 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`,
              backgroundSize: '800px 100%',
              animation: 'waveMove 4s linear infinite reverse',
            }}
          />
          {/* Floating debris during critical */}
          {warningLevel === "critical" && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`debris-${i}`}
                  className="absolute rounded bg-amber-900/40"
                  style={{
                    width: `${10 + i * 5}px`,
                    height: `${4 + i * 2}px`,
                    top: `${10 + i * 8}%`,
                    left: `${i * 15}%`,
                    animation: `floatDebris ${8 + i * 2}s linear infinite`,
                    animationDelay: `${i * 1.5}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Morphing blob 1 - Large primary */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full blur-[120px] transition-all duration-[3000ms] ease-out"
        style={{ 
          top: '-15%',
          left: '-10%',
          background: `radial-gradient(circle, ${orbColors.primary} 0%, transparent 70%)`,
          transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px) scale(${1 + Math.sin(time) * 0.1})`,
          opacity: (showWeatherEffects ? 0.3 : 0.6) + Math.sin(time * 0.5) * 0.2,
        }}
      />

      {/* Morphing blob 2 - Bottom right */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[100px] transition-all duration-[4000ms] ease-out"
        style={{ 
          bottom: '-20%',
          right: '-15%',
          background: `radial-gradient(circle, ${orbColors.secondary} 0%, transparent 60%)`,
          transform: `translate(${-mousePosition.x * 0.8}px, ${-mousePosition.y * 0.8}px) scale(${1 + Math.cos(time * 0.8) * 0.15})`,
          opacity: (showWeatherEffects ? 0.2 : 0.5) + Math.cos(time * 0.7) * 0.2,
        }}
      />

      {/* Morphing blob 3 - Center accent */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px] transition-all duration-[2500ms] ease-out"
        style={{ 
          top: '35%',
          right: '15%',
          background: `radial-gradient(circle, ${orbColors.tertiary} 0%, transparent 70%)`,
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) rotate(${time * 10}deg)`,
          opacity: (showWeatherEffects ? 0.2 : 0.4) + Math.sin(time * 1.2) * 0.15,
        }}
      />

      {/* Floating orb 4 - Small accent */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[60px] transition-all duration-[2000ms] ease-out"
        style={{ 
          top: '60%',
          left: '20%',
          background: `radial-gradient(circle, hsl(200 98% 60% / 0.2) 0%, transparent 70%)`,
          transform: `translate(${Math.sin(time) * 40}px, ${Math.cos(time * 0.7) * 30}px)`,
        }}
      />

      {/* Animated grid pattern - hidden during storms */}
      {!showWeatherEffects && (
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        />
      )}

      {/* Diagonal lines overlay */}
      {!showWeatherEffects && (
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              hsl(var(--primary)) 0px,
              hsl(var(--primary)) 1px,
              transparent 1px,
              transparent 60px
            )`,
            animation: 'diagonalMove 20s linear infinite',
          }}
        />
      )}

      {/* Floating particles - fewer during storms */}
      <div className="absolute inset-0">
        {[...Array(showWeatherEffects ? 6 : 12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              background: `hsl(var(--primary) / ${0.2 + (i % 4) * 0.1})`,
              left: `${8 + i * 8}%`,
              top: `${10 + (i % 5) * 18}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3) * 2}s`,
              boxShadow: `0 0 ${10 + i * 2}px hsl(var(--primary) / 0.3)`,
            }}
          />
        ))}
      </div>

      {/* Glowing ring - dimmed during storms */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full border border-primary/10 transition-all duration-[3000ms]"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 0.5) * 0.2}) rotate(${time * 5}deg)`,
          boxShadow: `inset 0 0 60px hsl(var(--primary) / 0.05), 0 0 40px hsl(var(--primary) / 0.05)`,
          opacity: showWeatherEffects ? 0.2 : 0.5,
        }}
      />

      {/* Second glowing ring */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full border border-primary/5 transition-all duration-[4000ms]"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${1.2 + Math.cos(time * 0.3) * 0.15}) rotate(${-time * 8}deg)`,
          boxShadow: `inset 0 0 40px hsl(var(--primary) / 0.03)`,
          opacity: showWeatherEffects ? 0.15 : 0.4,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect - stronger during storms */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: showWeatherEffects
            ? 'radial-gradient(ellipse at center, transparent 0%, hsl(220 30% 5% / 0.7) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 100%)',
        }}
      />

      {/* Warning pulse overlay for critical */}
      {warningLevel === "critical" && isWarningActive && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(0 72% 51% / 0.05) 0%, transparent 70%)',
            animationDuration: '2s',
          }}
        />
      )}
    </div>
  );
}

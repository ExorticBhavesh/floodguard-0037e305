import { useEffect, useState, useMemo } from "react";

interface AnimatedBackgroundProps {
  variant?: "hero" | "dashboard" | "alerts" | "chat";
}

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

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
    switch (variant) {
      case "dashboard":
        return {
          primary: "hsl(170 100% 44% / 0.15)",
          secondary: "hsl(152 82% 39% / 0.1)",
          tertiary: "hsl(38 92% 50% / 0.08)",
        };
      case "alerts":
        return {
          primary: "hsl(0 72% 51% / 0.12)",
          secondary: "hsl(38 92% 50% / 0.1)",
          tertiary: "hsl(170 100% 44% / 0.08)",
        };
      case "chat":
        return {
          primary: "hsl(170 100% 44% / 0.12)",
          secondary: "hsl(152 82% 39% / 0.1)",
          tertiary: "hsl(280 70% 50% / 0.06)",
        };
      default:
        return {
          primary: "hsl(170 100% 44% / 0.15)",
          secondary: "hsl(170 80% 50% / 0.1)",
          tertiary: "hsl(0 100% 60% / 0.05)",
        };
    }
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Morphing blob 1 - Large primary */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full blur-[120px] transition-all duration-[3000ms] ease-out"
        style={{ 
          top: '-15%',
          left: '-10%',
          background: `radial-gradient(circle, ${orbColors.primary} 0%, transparent 70%)`,
          transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px) scale(${1 + Math.sin(time) * 0.1})`,
          opacity: 0.6 + Math.sin(time * 0.5) * 0.2,
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
          opacity: 0.5 + Math.cos(time * 0.7) * 0.2,
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
          opacity: 0.4 + Math.sin(time * 1.2) * 0.15,
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

      {/* Animated grid pattern */}
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

      {/* Diagonal lines overlay */}
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

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
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

      {/* Glowing ring */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full border border-primary/10 transition-all duration-[3000ms]"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 0.5) * 0.2}) rotate(${time * 5}deg)`,
          boxShadow: `inset 0 0 60px hsl(var(--primary) / 0.05), 0 0 40px hsl(var(--primary) / 0.05)`,
          opacity: 0.5,
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
          opacity: 0.4,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 100%)',
        }}
      />
    </div>
  );
}

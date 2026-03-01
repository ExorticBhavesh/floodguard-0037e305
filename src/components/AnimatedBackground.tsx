import { useMemo } from "react";

interface AnimatedBackgroundProps {
  variant?: "hero" | "dashboard" | "alerts" | "chat";
}

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  const orbColors = useMemo(() => {
    switch (variant) {
      case "dashboard":
        return {
          primary: "hsl(174 62% 47% / 0.08)",
          secondary: "hsl(160 60% 45% / 0.06)",
        };
      case "alerts":
        return {
          primary: "hsl(25 75% 55% / 0.06)",
          secondary: "hsl(174 62% 47% / 0.05)",
        };
      case "chat":
        return {
          primary: "hsl(174 62% 47% / 0.07)",
          secondary: "hsl(222 47% 11% / 0.03)",
        };
      default:
        return {
          primary: "hsl(174 62% 47% / 0.1)",
          secondary: "hsl(174 50% 55% / 0.06)",
        };
    }
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Soft blob 1 */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[160px]"
        style={{ 
          top: '-20%',
          right: '-10%',
          background: `radial-gradient(circle, ${orbColors.primary} 0%, transparent 70%)`,
        }}
      />

      {/* Soft blob 2 */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px]"
        style={{ 
          bottom: '-15%',
          left: '-5%',
          background: `radial-gradient(circle, ${orbColors.secondary} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.5) 100%)',
        }}
      />
    </div>
  );
}

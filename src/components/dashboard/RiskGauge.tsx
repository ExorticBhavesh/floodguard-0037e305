import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from "lucide-react";

interface RiskGaugeProps {
  riskLevel: "low" | "medium" | "high" | "critical";
  probability: number;
  className?: string;
}

export function RiskGauge({ riskLevel, probability, className }: RiskGaugeProps) {
  const [animatedProbability, setAnimatedProbability] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProbability(probability);
    }, 100);
    return () => clearTimeout(timer);
  }, [probability]);

  const riskConfig = {
    low: { 
      color: "text-risk-low", 
      bg: "bg-risk-low",
      gradient: "from-risk-low to-emerald-400",
      label: "LOW RISK",
      icon: Shield,
      description: "Conditions are stable"
    },
    medium: { 
      color: "text-risk-medium", 
      bg: "bg-risk-medium",
      gradient: "from-risk-medium to-amber-400",
      label: "MODERATE",
      icon: TrendingUp,
      description: "Monitor conditions"
    },
    high: { 
      color: "text-risk-high", 
      bg: "bg-risk-high",
      gradient: "from-risk-high to-orange-400",
      label: "HIGH RISK",
      icon: TrendingUp,
      description: "Prepare for action"
    },
    critical: { 
      color: "text-risk-critical", 
      bg: "bg-risk-critical",
      gradient: "from-risk-critical to-red-400",
      label: "CRITICAL",
      icon: AlertTriangle,
      description: "Immediate action needed"
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  
  // Calculate rotation for gauge needle (0-180 degrees)
  const rotation = (animatedProbability / 100) * 180 - 90;

  return (
    <div className={cn("pro-card p-5 overflow-hidden", className)}>
      {/* Background glow for critical/high */}
      {(riskLevel === "critical" || riskLevel === "high") && (
        <div className={cn(
          "absolute inset-0 opacity-10 blur-2xl",
          config.bg
        )} />
      )}
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-lg", config.bg, "bg-opacity-20")}>
              <Icon className={cn("w-4 h-4", config.color)} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Risk Level
            </span>
          </div>
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            config.bg, "bg-opacity-15", config.color,
            riskLevel === "critical" && "animate-pulse"
          )}>
            {config.label}
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex justify-center mb-4">
          <div className="relative w-36 h-20 overflow-hidden">
            {/* Background arc */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 60">
              <path
                d="M 10 55 A 50 50 0 0 1 110 55"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Colored progress arc */}
              <path
                d="M 10 55 A 50 50 0 0 1 110 55"
                fill="none"
                className={config.color}
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(animatedProbability / 100) * 157} 157`}
                style={{ transition: "stroke-dasharray 1s ease-out" }}
              />
            </svg>
            
            {/* Center needle */}
            <div 
              className="absolute bottom-0 left-1/2 origin-bottom"
              style={{ 
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transition: "transform 1s ease-out"
              }}
            >
              <div className={cn("w-0.5 h-12 rounded-t-full", config.bg)} />
              <div className={cn("w-3 h-3 rounded-full -mt-1 -ml-[5px]", config.bg)} />
            </div>
          </div>
        </div>

        {/* Probability Display */}
        <div className="text-center">
          <div className={cn("text-4xl font-bold tabular-nums", config.color)}>
            {animatedProbability}
            <span className="text-lg">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
        </div>

        {/* Risk level indicators */}
        <div className="flex justify-between mt-4 px-2">
          {["low", "medium", "high", "critical"].map((level) => (
            <div
              key={level}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                level === riskLevel ? "scale-150 ring-2 ring-offset-2 ring-offset-card" : "opacity-30",
                riskConfig[level as keyof typeof riskConfig].bg
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

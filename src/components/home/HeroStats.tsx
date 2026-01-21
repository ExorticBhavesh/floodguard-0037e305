import { Zap, Radio, Globe, Shield, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const stats: StatItem[] = [
  { 
    label: "Prediction Accuracy", 
    value: "94%", 
    subValue: "+2.3% this month",
    icon: TrendingUp, 
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  { 
    label: "Response Time", 
    value: "<5s", 
    subValue: "Avg. alert delivery",
    icon: Clock, 
    color: "text-risk-low",
    bgColor: "bg-risk-low/10"
  },
  { 
    label: "Coverage Area", 
    value: "500km²", 
    subValue: "Gujarat region",
    icon: Globe, 
    color: "text-risk-medium",
    bgColor: "bg-risk-medium/10"
  },
  { 
    label: "Active Monitoring", 
    value: "24/7", 
    subValue: "Real-time sensors",
    icon: Shield, 
    color: "text-risk-high",
    bgColor: "bg-risk-high/10"
  },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
      {stats.map((stat, i) => (
        <div 
          key={stat.label} 
          className="group relative p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-scale-in overflow-hidden"
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            
            <div className="text-2xl font-bold tracking-tight mb-0.5">{stat.value}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            
            {stat.subValue && (
              <div className="text-[10px] text-muted-foreground/70 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.subValue}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

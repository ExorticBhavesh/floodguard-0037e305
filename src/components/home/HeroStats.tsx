import { TrendingUp, Clock, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
}

const stats: StatItem[] = [
  { label: "Prediction Accuracy", value: "94%", icon: TrendingUp },
  { label: "Response Time", value: "<5s", icon: Clock },
  { label: "Coverage Area", value: "500km²", icon: Globe },
  { label: "Active Monitoring", value: "24/7", icon: Shield },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
      {stats.map((stat, i) => (
        <div 
          key={stat.label} 
          className="group p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-lg transition-all duration-300 animate-scale-in text-center"
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        >
          <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center mx-auto mb-3">
            <stat.icon className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold tracking-tight mb-1">{stat.value}</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  Trophy, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Target,
  Flame,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  progress: number;
  color: string;
  completed: boolean;
}

export function EngagementStats() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "early-warning",
      icon: AlertTriangle,
      title: "Early Warning",
      description: "24+ hours advance notice",
      progress: 100,
      color: "text-risk-medium",
      completed: true,
    },
    {
      id: "accuracy",
      icon: Target,
      title: "Precision Master",
      description: "94% prediction accuracy",
      progress: 94,
      color: "text-primary",
      completed: false,
    },
    {
      id: "streak",
      icon: Flame,
      title: "Safety Streak",
      description: "30 days zero incidents",
      progress: 73,
      color: "text-risk-high",
      completed: false,
    },
  ]);

  const stats = [
    { label: "Predictions Today", value: "47", icon: TrendingUp, color: "text-primary" },
    { label: "Alerts Sent", value: "12", icon: AlertTriangle, color: "text-risk-medium" },
    { label: "Avg Accuracy", value: "94%", icon: Target, color: "text-risk-low" },
  ];

  return (
    <div className="pro-card p-5 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Performance
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-2 rounded-lg bg-muted/30">
                <Icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Achievements
          </p>
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg transition-colors",
                  achievement.completed 
                    ? "bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20" 
                    : "bg-muted/30"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg",
                  achievement.completed ? "bg-amber-500/20" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    achievement.completed ? "text-amber-500" : achievement.color
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium truncate">{achievement.title}</p>
                    {achievement.completed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-medium">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xs font-bold",
                    achievement.completed ? "text-amber-500" : "text-muted-foreground"
                  )}>
                    {achievement.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

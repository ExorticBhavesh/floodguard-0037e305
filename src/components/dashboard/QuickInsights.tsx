import { TrendingUp, TrendingDown, Minus, Sparkles, Brain, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightItem {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  color: string;
}

interface QuickInsightsProps {
  rainfall: number;
  waterLevel: number;
  humidity: number;
}

export function QuickInsights({ rainfall, waterLevel, humidity }: QuickInsightsProps) {
  // Generate insights based on current values
  const insights: InsightItem[] = [
    {
      id: "flood-risk",
      title: "Flood Risk Index",
      value: calculateRiskIndex(rainfall, waterLevel, humidity).toFixed(0),
      change: rainfall > 50 ? 15 : rainfall > 25 ? 5 : -3,
      trend: rainfall > 50 ? "up" : rainfall > 25 ? "up" : "down",
      icon: Target,
      color: rainfall > 50 ? "text-risk-critical" : rainfall > 25 ? "text-risk-medium" : "text-risk-low",
    },
    {
      id: "ml-confidence",
      title: "Model Confidence",
      value: `${Math.min(98, 85 + Math.floor(Math.random() * 10))}%`,
      change: 2.3,
      trend: "up",
      icon: Brain,
      color: "text-primary",
    },
    {
      id: "response-time",
      title: "Avg Response",
      value: "2.3s",
      change: -0.5,
      trend: "down",
      icon: Zap,
      color: "text-risk-low",
    },
  ];

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };

  return (
    <div className="pro-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Quick Insights
        </span>
      </div>

      {/* Insights Grid */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const Trend = TrendIcon[insight.trend];
          
          return (
            <div
              key={insight.id}
              className="group p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-default"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "p-2 rounded-lg bg-background shadow-sm group-hover:scale-110 transition-transform",
                  )}>
                    <Icon className={cn("w-4 h-4", insight.color)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{insight.title}</p>
                    <p className={cn("text-lg font-bold", insight.color)}>{insight.value}</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  insight.trend === "up" && insight.id === "flood-risk" 
                    ? "bg-risk-critical/10 text-risk-critical" 
                    : insight.trend === "up" 
                    ? "bg-risk-low/10 text-risk-low"
                    : insight.trend === "down" && insight.id === "response-time"
                    ? "bg-risk-low/10 text-risk-low"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Trend className="w-3 h-3" />
                  <span>{Math.abs(insight.change)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Badge */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Brain className="w-3.5 h-3.5 text-primary" />
          <span>Powered by FloodGuard AI</span>
        </div>
      </div>
    </div>
  );
}

function calculateRiskIndex(rainfall: number, waterLevel: number, humidity: number): number {
  // Weighted risk calculation
  const rainfallWeight = 0.4;
  const waterLevelWeight = 0.4;
  const humidityWeight = 0.2;
  
  const rainfallScore = Math.min(100, (rainfall / 150) * 100);
  const waterLevelScore = Math.min(100, (waterLevel / 10) * 100);
  const humidityScore = Math.min(100, (humidity / 100) * 100);
  
  return rainfallScore * rainfallWeight + 
         waterLevelScore * waterLevelWeight + 
         humidityScore * humidityWeight;
}

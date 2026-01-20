import { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Gauge,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain,
  Activity,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFloodPrediction, PredictionResult, PredictionFactor } from "@/hooks/useFloodPrediction";

interface PredictionPanelProps {
  rainfall: number;
  riverLevel: number;
  humidity?: number;
  elevation?: number;
  soilMoisture?: number;
  autoPredict?: boolean;
  lat?: number;
  lon?: number;
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case "critical": return "text-risk-critical";
    case "high": return "text-risk-high";
    case "medium": return "text-risk-medium";
    default: return "text-risk-low";
  }
}

function getRiskBgColor(risk: string): string {
  switch (risk) {
    case "critical": return "bg-risk-critical";
    case "high": return "bg-risk-high";
    case "medium": return "bg-risk-medium";
    default: return "bg-risk-low";
  }
}

function getStatusIcon(status: "safe" | "warning" | "danger") {
  switch (status) {
    case "danger": return <XCircle className="w-3.5 h-3.5 text-risk-critical" />;
    case "warning": return <AlertTriangle className="w-3.5 h-3.5 text-risk-medium" />;
    default: return <CheckCircle2 className="w-3.5 h-3.5 text-risk-low" />;
  }
}

export function PredictionPanel({
  rainfall,
  riverLevel,
  humidity = 70,
  elevation = 25,
  soilMoisture = 50,
  autoPredict = true,
  lat,
  lon,
}: PredictionPanelProps) {
  const { prediction, isLoading, predict } = useFloodPrediction();
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);

  // Auto-predict when inputs change
  useEffect(() => {
    if (!autoPredict) return;
    
    const timer = setTimeout(() => {
      predict({
        rainfall,
        riverLevel,
        humidity,
        elevation,
        soilMoisture,
        lat,
        lon,
      });
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [rainfall, riverLevel, humidity, elevation, soilMoisture, autoPredict, lat, lon, predict]);

  useEffect(() => {
    if (prediction) {
      setLastPrediction(prediction);
    }
  }, [prediction]);

  const displayPrediction = prediction || lastPrediction;

  return (
    <div className="pro-card p-5">
      {/* Header */}
      <div className="section-header mb-5">
        <div className="section-icon bg-gradient-primary text-primary-foreground">
          <Brain className="w-4 h-4" />
        </div>
        <div>
          <h3 className="section-title">ML Flood Prediction</h3>
          <p className="text-xs text-muted-foreground">Real-time risk analysis</p>
        </div>
        <Badge variant="outline" className="ml-auto gap-1 text-xs">
          <Activity className="w-3 h-3" />
          {isLoading ? "Analyzing..." : "Live"}
        </Badge>
      </div>

      {isLoading && !displayPrediction ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-sm">Analyzing flood risk...</p>
        </div>
      ) : displayPrediction ? (
        <div className="space-y-5">
          {/* Main Risk Display */}
          <div className={`p-4 rounded-xl border transition-all ${
            displayPrediction.riskLevel === "critical"
              ? "bg-risk-critical/8 border-risk-critical/25 animate-pulse"
              : displayPrediction.riskLevel === "high"
              ? "bg-risk-high/8 border-risk-high/25"
              : displayPrediction.riskLevel === "medium"
              ? "bg-risk-medium/8 border-risk-medium/25"
              : "bg-risk-low/8 border-risk-low/25"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRiskBgColor(displayPrediction.riskLevel)} shadow-sm`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Predicted Risk</p>
                  <p className={`text-2xl font-bold ${getRiskColor(displayPrediction.riskLevel)}`}>
                    {displayPrediction.riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{displayPrediction.probability}%</p>
                <p className="text-xs text-muted-foreground">Probability</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="stat-card p-3 text-center">
              <Gauge className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-lg font-bold">{displayPrediction.predictedWaterLevel}m</p>
              <p className="text-xs text-muted-foreground">Predicted Level</p>
            </div>
            <div className="stat-card p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1.5 text-risk-medium" />
              <p className="text-lg font-bold">{displayPrediction.confidenceScore}%</p>
              <p className="text-xs text-muted-foreground">Confidence</p>
            </div>
            <div className="stat-card p-3 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1.5 text-risk-high" />
              <p className="text-lg font-bold">{displayPrediction.timeToFlood || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Time to Event</p>
            </div>
          </div>

          {/* Contributing Factors */}
          <div>
            <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Contributing Factors
            </h4>
            <div className="space-y-2">
              {displayPrediction.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {getStatusIcon(factor.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium">{factor.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {factor.contribution.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={factor.contribution * 4} 
                      className="h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-lg border ${
            displayPrediction.evacuationAdvised 
              ? "bg-risk-critical/5 border-risk-critical/20" 
              : "bg-muted/40 border-border/50"
          }`}>
            <p className="text-xs font-semibold mb-1 flex items-center gap-1.5">
              {displayPrediction.evacuationAdvised && (
                <AlertTriangle className="w-3.5 h-3.5 text-risk-critical" />
              )}
              Recommendation
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {displayPrediction.recommendation}
            </p>
          </div>

          {/* Model Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
            <span>Model: FloodGuard-RF-v2.1</span>
            <span>Updated: Just now</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Adjust parameters to see predictions</p>
        </div>
      )}
    </div>
  );
}

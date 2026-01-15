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
    case "danger": return <XCircle className="w-4 h-4 text-risk-critical" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-risk-medium" />;
    default: return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
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
    <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-primary shadow-glow">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg">ML Flood Prediction</h3>
            <p className="text-xs text-muted-foreground">Real-time risk analysis</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Activity className="w-3 h-3" />
          {isLoading ? "Analyzing..." : "Live"}
        </Badge>
      </div>

      {isLoading && !displayPrediction ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Analyzing flood risk...</p>
        </div>
      ) : displayPrediction ? (
        <div className="space-y-6">
          {/* Main Risk Display */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            displayPrediction.riskLevel === "critical"
              ? "bg-risk-critical/10 border-risk-critical/30 animate-pulse"
              : displayPrediction.riskLevel === "high"
              ? "bg-risk-high/10 border-risk-high/30"
              : displayPrediction.riskLevel === "medium"
              ? "bg-risk-medium/10 border-risk-medium/30"
              : "bg-risk-low/10 border-risk-low/30"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getRiskBgColor(displayPrediction.riskLevel)} shadow-lg`}>
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Predicted Risk</p>
                  <p className={`text-3xl font-bold ${getRiskColor(displayPrediction.riskLevel)}`}>
                    {displayPrediction.riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{displayPrediction.probability}%</p>
                <p className="text-sm text-muted-foreground">Probability</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Gauge className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{displayPrediction.predictedWaterLevel}m</p>
              <p className="text-xs text-muted-foreground">Predicted Level</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-risk-medium" />
              <p className="text-2xl font-bold">{displayPrediction.confidenceScore}%</p>
              <p className="text-xs text-muted-foreground">Confidence</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-risk-high" />
              <p className="text-2xl font-bold">{displayPrediction.timeToFlood || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Time to Event</p>
            </div>
          </div>

          {/* Contributing Factors */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Contributing Factors
            </h4>
            <div className="space-y-3">
              {displayPrediction.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-3">
                  {getStatusIcon(factor.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{factor.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {factor.contribution.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={factor.contribution * 4} 
                      className="h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-4 rounded-xl border ${
            displayPrediction.evacuationAdvised 
              ? "bg-risk-critical/5 border-risk-critical/20" 
              : "bg-muted/50 border-border"
          }`}>
            <p className="text-sm font-medium mb-1 flex items-center gap-2">
              {displayPrediction.evacuationAdvised && (
                <AlertTriangle className="w-4 h-4 text-risk-critical" />
              )}
              Recommendation
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayPrediction.recommendation}
            </p>
          </div>

          {/* Model Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Model: FloodGuard-RF-v2.1</span>
            <span>Updated: Just now</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Adjust parameters to see predictions</p>
        </div>
      )}
    </div>
  );
}

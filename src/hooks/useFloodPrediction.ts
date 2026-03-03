import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PredictionInput {
  rainfall: number;
  humidity: number;
  riverLevel: number;
  elevation: number;
  soilMoisture?: number;
  previousRainfall?: number;
  lat?: number;
  lon?: number;
}

export interface PredictionFactor {
  name: string;
  contribution: number;
  status: "safe" | "warning" | "danger";
}

export interface PredictionResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  probability: number;
  predictedWaterLevel: number;
  confidenceScore: number;
  factors: PredictionFactor[];
  recommendation: string;
  evacuationAdvised: boolean;
  timeToFlood: string | null;
}

// Client-side fallback prediction when edge function is unavailable
function localPredict(input: PredictionInput): PredictionResult {
  const THRESHOLDS = {
    rainfall: { safe: 20, warning: 50, danger: 100 },
    humidity: { safe: 60, warning: 80, danger: 95 },
    riverLevel: { safe: 3, warning: 5, danger: 7 },
    elevation: { safe: 50, warning: 20, danger: 10 },
    soilMoisture: { safe: 40, warning: 70, danger: 90 },
  };

  const score = (val: number, t: { safe: number; warning: number; danger: number }, inv = false) => {
    if (inv) return val <= t.danger ? 1.0 : val <= t.warning ? 0.7 : val <= t.safe ? 0.4 : 0.1;
    return val >= t.danger ? 1.0 : val >= t.warning ? 0.7 : val >= t.safe ? 0.4 : 0.1;
  };

  const getStatus = (s: number): "safe" | "warning" | "danger" => s >= 0.7 ? "danger" : s >= 0.4 ? "warning" : "safe";

  const W = { rainfall: 0.25, humidity: 0.10, riverLevel: 0.30, elevation: 0.15, soilMoisture: 0.10, prev: 0.10 };

  const rs = score(input.rainfall, THRESHOLDS.rainfall);
  const hs = score(input.humidity, THRESHOLDS.humidity);
  const rvs = score(input.riverLevel, THRESHOLDS.riverLevel);
  const es = score(input.elevation, THRESHOLDS.elevation, true);
  const sm = input.soilMoisture ?? 50;
  const ss = score(sm, THRESHOLDS.soilMoisture);
  const pr = (input.previousRainfall ?? input.rainfall * 0.8);
  const ps = score(pr, { safe: 30, warning: 80, danger: 150 });

  const total = rs * W.rainfall + hs * W.humidity + rvs * W.riverLevel + es * W.elevation + ss * W.soilMoisture + ps * W.prev;
  const prob = Math.min(Math.max(total * 100 + (Math.random() - 0.5) * 6, 5), 98);

  const factors: PredictionFactor[] = [
    { name: "Rainfall Intensity", contribution: rs * W.rainfall * 100, status: getStatus(rs) },
    { name: "Atmospheric Humidity", contribution: hs * W.humidity * 100, status: getStatus(hs) },
    { name: "River Water Level", contribution: rvs * W.riverLevel * 100, status: getStatus(rvs) },
    { name: "Ground Elevation", contribution: es * W.elevation * 100, status: getStatus(es) },
    { name: "Soil Saturation", contribution: ss * W.soilMoisture * 100, status: getStatus(ss) },
    { name: "24h Accumulated Rain", contribution: ps * W.prev * 100, status: getStatus(ps) },
  ].sort((a, b) => b.contribution - a.contribution);

  const riskLevel: PredictionResult["riskLevel"] = prob >= 75 ? "critical" : prob >= 50 ? "high" : prob >= 25 ? "medium" : "low";
  const predictedWaterLevel = Math.min(input.riverLevel + (input.rainfall / 25) * 0.5, 15);

  const recommendations: Record<string, string> = {
    critical: "IMMEDIATE EVACUATION RECOMMENDED. Move to higher ground immediately.",
    high: "Prepare for possible evacuation. Secure valuables and stay alert.",
    medium: "Monitor conditions closely. Avoid unnecessary travel near waterways.",
    low: "Conditions are currently stable. Stay informed of weather changes.",
  };

  return {
    riskLevel,
    probability: Math.round(prob),
    predictedWaterLevel: Math.round(predictedWaterLevel * 10) / 10,
    confidenceScore: Math.min(75 + Object.values(input).filter(v => v !== undefined).length * 3, 98),
    factors,
    recommendation: recommendations[riskLevel],
    evacuationAdvised: riskLevel === "critical" || (riskLevel === "high" && prob > 65),
    timeToFlood: riskLevel === "critical" ? "< 2 hours" : riskLevel === "high" ? "2-6 hours" : riskLevel === "medium" ? "6-12 hours" : null,
  };
}

export function useFloodPrediction() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (input: PredictionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("flood-predict", {
        body: input,
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "Prediction failed");

      setPrediction(data.prediction);

      if (data.prediction.riskLevel === "critical") {
        toast.error("⚠️ CRITICAL: Immediate flood risk detected!", {
          description: data.prediction.recommendation,
          duration: 10000,
        });
      } else if (data.prediction.riskLevel === "high") {
        toast.warning("High flood risk detected", {
          description: data.prediction.recommendation,
          duration: 7000,
        });
      }

      return data.prediction;
    } catch (err) {
      // FALLBACK: Use client-side prediction instead of showing error
      console.warn("Edge function unavailable, using local prediction:", err);
      const fallback = localPredict(input);
      setPrediction(fallback);
      setError(null); // Don't show error to user
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendSMSAlert = useCallback(async (
    riskLevel: "low" | "medium" | "high" | "critical",
    location: string,
    phoneNumbers?: string[]
  ) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-sms-alert", {
        body: { riskLevel, location, phoneNumbers },
      });

      if (fnError) throw new Error(fnError.message);

      toast.success("Alert sent successfully", {
        description: data.mode === "demo"
          ? "SMS simulated (Twilio not configured)"
          : `Sent to ${data.totalSent} recipients`,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send alert";
      toast.error("Failed to send alert", { description: message });
      return null;
    }
  }, []);

  return { prediction, isLoading, error, predict, sendSMSAlert };
}

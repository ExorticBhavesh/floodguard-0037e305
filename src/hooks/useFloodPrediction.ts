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

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Prediction failed");
      }

      setPrediction(data.prediction);

      // Show toast for high-risk predictions
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
      const message = err instanceof Error ? err.message : "Prediction failed";
      setError(message);
      toast.error("Prediction failed", { description: message });
      return null;
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
        body: {
          riskLevel,
          location,
          phoneNumbers,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

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

  return {
    prediction,
    isLoading,
    error,
    predict,
    sendSMSAlert,
  };
}

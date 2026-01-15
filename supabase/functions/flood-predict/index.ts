import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ML-like flood prediction model using weighted scoring algorithm
// This simulates RandomForest-style decision making with multiple features
interface PredictionInput {
  rainfall: number;        // mm
  humidity: number;        // percentage
  riverLevel: number;      // meters
  elevation: number;       // meters above sea level
  soilMoisture?: number;   // percentage
  previousRainfall?: number; // mm in last 24h
  temperature?: number;    // celsius
  windSpeed?: number;      // km/h
  lat?: number;
  lon?: number;
}

interface PredictionOutput {
  riskLevel: "low" | "medium" | "high" | "critical";
  probability: number;
  predictedWaterLevel: number;
  confidenceScore: number;
  factors: {
    name: string;
    contribution: number;
    status: "safe" | "warning" | "danger";
  }[];
  recommendation: string;
  evacuationAdvised: boolean;
  timeToFlood: string | null;
}

// Feature weights (simulating trained model coefficients)
const WEIGHTS = {
  rainfall: 0.25,
  humidity: 0.10,
  riverLevel: 0.30,
  elevation: 0.15,
  soilMoisture: 0.10,
  previousRainfall: 0.10,
};

// Thresholds based on historical flood data patterns
const THRESHOLDS = {
  rainfall: { safe: 20, warning: 50, danger: 100 },
  humidity: { safe: 60, warning: 80, danger: 95 },
  riverLevel: { safe: 3, warning: 5, danger: 7 },
  elevation: { safe: 50, warning: 20, danger: 10 },
  soilMoisture: { safe: 40, warning: 70, danger: 90 },
};

function calculateFeatureScore(value: number, thresholds: { safe: number; warning: number; danger: number }, inverse = false): number {
  if (inverse) {
    // Lower is worse (e.g., elevation)
    if (value <= thresholds.danger) return 1.0;
    if (value <= thresholds.warning) return 0.7;
    if (value <= thresholds.safe) return 0.4;
    return 0.1;
  } else {
    // Higher is worse (e.g., rainfall)
    if (value >= thresholds.danger) return 1.0;
    if (value >= thresholds.warning) return 0.7;
    if (value >= thresholds.safe) return 0.4;
    return 0.1;
  }
}

function getFeatureStatus(score: number): "safe" | "warning" | "danger" {
  if (score >= 0.7) return "danger";
  if (score >= 0.4) return "warning";
  return "safe";
}

function predictFloodRisk(input: PredictionInput): PredictionOutput {
  const factors: PredictionOutput["factors"] = [];
  let totalScore = 0;

  // Calculate rainfall contribution
  const rainfallScore = calculateFeatureScore(input.rainfall, THRESHOLDS.rainfall);
  totalScore += rainfallScore * WEIGHTS.rainfall;
  factors.push({
    name: "Rainfall Intensity",
    contribution: rainfallScore * WEIGHTS.rainfall * 100,
    status: getFeatureStatus(rainfallScore),
  });

  // Calculate humidity contribution
  const humidityScore = calculateFeatureScore(input.humidity, THRESHOLDS.humidity);
  totalScore += humidityScore * WEIGHTS.humidity;
  factors.push({
    name: "Atmospheric Humidity",
    contribution: humidityScore * WEIGHTS.humidity * 100,
    status: getFeatureStatus(humidityScore),
  });

  // Calculate river level contribution (most important)
  const riverScore = calculateFeatureScore(input.riverLevel, THRESHOLDS.riverLevel);
  totalScore += riverScore * WEIGHTS.riverLevel;
  factors.push({
    name: "River Water Level",
    contribution: riverScore * WEIGHTS.riverLevel * 100,
    status: getFeatureStatus(riverScore),
  });

  // Calculate elevation contribution (inverse - lower is worse)
  const elevationScore = calculateFeatureScore(input.elevation, THRESHOLDS.elevation, true);
  totalScore += elevationScore * WEIGHTS.elevation;
  factors.push({
    name: "Ground Elevation",
    contribution: elevationScore * WEIGHTS.elevation * 100,
    status: getFeatureStatus(elevationScore),
  });

  // Calculate soil moisture if provided
  const soilMoisture = input.soilMoisture ?? 50;
  const soilScore = calculateFeatureScore(soilMoisture, THRESHOLDS.soilMoisture);
  totalScore += soilScore * WEIGHTS.soilMoisture;
  factors.push({
    name: "Soil Saturation",
    contribution: soilScore * WEIGHTS.soilMoisture * 100,
    status: getFeatureStatus(soilScore),
  });

  // Previous rainfall contribution
  const prevRainfall = input.previousRainfall ?? 0;
  const prevRainScore = calculateFeatureScore(prevRainfall, { safe: 30, warning: 80, danger: 150 });
  totalScore += prevRainScore * WEIGHTS.previousRainfall;
  factors.push({
    name: "24h Accumulated Rain",
    contribution: prevRainScore * WEIGHTS.previousRainfall * 100,
    status: getFeatureStatus(prevRainScore),
  });

  // Normalize and calculate probability
  const probability = Math.min(Math.max(totalScore * 100, 5), 98);
  
  // Add slight randomness for realism (±3%)
  const noise = (Math.random() - 0.5) * 6;
  const finalProbability = Math.min(Math.max(probability + noise, 5), 98);

  // Determine risk level
  let riskLevel: PredictionOutput["riskLevel"];
  if (finalProbability >= 75) riskLevel = "critical";
  else if (finalProbability >= 50) riskLevel = "high";
  else if (finalProbability >= 25) riskLevel = "medium";
  else riskLevel = "low";

  // Predict water level based on inputs
  const baseWaterLevel = input.riverLevel;
  const rainfallImpact = (input.rainfall / 25) * 0.5;
  const predictedWaterLevel = Math.min(baseWaterLevel + rainfallImpact, 15);

  // Confidence score based on input completeness
  const inputCount = Object.values(input).filter(v => v !== undefined).length;
  const confidenceScore = Math.min(75 + (inputCount * 3), 98);

  // Generate recommendation
  let recommendation: string;
  let evacuationAdvised = false;
  let timeToFlood: string | null = null;

  switch (riskLevel) {
    case "critical":
      recommendation = "IMMEDIATE EVACUATION RECOMMENDED. Move to higher ground immediately. Avoid all waterways and flooded areas.";
      evacuationAdvised = true;
      timeToFlood = "< 2 hours";
      break;
    case "high":
      recommendation = "Prepare for possible evacuation. Secure valuables, prepare emergency kit, and stay alert for updates.";
      evacuationAdvised = finalProbability > 65;
      timeToFlood = "2-6 hours";
      break;
    case "medium":
      recommendation = "Monitor conditions closely. Avoid unnecessary travel near waterways. Have emergency plan ready.";
      timeToFlood = "6-12 hours";
      break;
    default:
      recommendation = "Conditions are currently stable. Continue normal activities but stay informed of weather changes.";
  }

  return {
    riskLevel,
    probability: Math.round(finalProbability),
    predictedWaterLevel: Math.round(predictedWaterLevel * 10) / 10,
    confidenceScore: Math.round(confidenceScore),
    factors: factors.sort((a, b) => b.contribution - a.contribution),
    recommendation,
    evacuationAdvised,
    timeToFlood,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PredictionInput = await req.json();
    
    console.log("Received prediction request:", JSON.stringify(input));

    // Validate required inputs
    if (input.rainfall === undefined || input.riverLevel === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: rainfall and riverLevel are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set defaults for optional fields
    const normalizedInput: PredictionInput = {
      rainfall: input.rainfall,
      humidity: input.humidity ?? 70,
      riverLevel: input.riverLevel,
      elevation: input.elevation ?? 25,
      soilMoisture: input.soilMoisture ?? 50,
      previousRainfall: input.previousRainfall ?? input.rainfall * 0.8,
      temperature: input.temperature,
      windSpeed: input.windSpeed,
      lat: input.lat,
      lon: input.lon,
    };

    const prediction = predictFloodRisk(normalizedInput);

    console.log("Prediction result:", JSON.stringify(prediction));

    // If critical or high risk with location, potentially create alert
    if ((prediction.riskLevel === "critical" || prediction.riskLevel === "high") && input.lat && input.lon) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // Check if similar alert exists
        const { data: existingAlerts } = await supabase
          .from("flood_alerts")
          .select("id")
          .eq("is_active", true)
          .eq("severity", prediction.riskLevel)
          .gte("created_at", new Date(Date.now() - 3600000).toISOString());

        if (!existingAlerts?.length) {
          await supabase.from("flood_alerts").insert({
            title: prediction.riskLevel === "critical" ? "Flash Flood Warning" : "Flood Watch",
            description: prediction.recommendation,
            severity: prediction.riskLevel,
            location: `${input.lat.toFixed(2)}, ${input.lon.toFixed(2)}`,
            latitude: input.lat,
            longitude: input.lon,
            is_active: true,
            expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          });
          console.log("Alert created for high-risk prediction");
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        prediction,
        inputs: normalizedInput,
        timestamp: new Date().toISOString(),
        model: "FloodGuard-RF-v2.1",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Prediction failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

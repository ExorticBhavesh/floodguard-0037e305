import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEATHER_API_KEY = Deno.env.get("WEATHER_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!WEATHER_API_KEY) {
      throw new Error("WEATHER_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body for location
    const { lat, lon, city } = await req.json();
    
    let weatherUrl: string;
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      // Default to Ahmedabad, India
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad,IN&appid=${WEATHER_API_KEY}&units=metric`;
    }

    console.log("Fetching weather data...");
    
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error("Weather API error:", weatherResponse.status, errorText);
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log("Weather data received:", JSON.stringify(weatherData, null, 2));

    // Analyze weather conditions for flood risk
    const rain = weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0;
    const humidity = weatherData.main?.humidity || 0;
    const weatherCondition = weatherData.weather?.[0]?.main || "";
    const description = weatherData.weather?.[0]?.description || "";
    const location = weatherData.name || "Unknown Location";
    const coords = weatherData.coord;

    // Determine severity based on conditions
    let severity: "low" | "medium" | "high" | "critical" = "low";
    let shouldCreateAlert = false;
    let title = "";
    let alertDescription = "";

    if (rain > 50 || weatherCondition === "Thunderstorm") {
      severity = "critical";
      shouldCreateAlert = true;
      title = "Flash Flood Warning";
      alertDescription = `Severe weather alert: ${description}. Heavy rainfall of ${rain}mm detected. Seek higher ground immediately.`;
    } else if (rain > 20 || (humidity > 90 && weatherCondition === "Rain")) {
      severity = "high";
      shouldCreateAlert = true;
      title = "Flood Watch";
      alertDescription = `High flood risk: ${description}. Rainfall: ${rain}mm, Humidity: ${humidity}%. Stay alert and avoid low-lying areas.`;
    } else if (rain > 5 || weatherCondition === "Rain") {
      severity = "medium";
      shouldCreateAlert = true;
      title = "Flood Advisory";
      alertDescription = `Moderate conditions: ${description}. Rainfall: ${rain}mm. Monitor for changing conditions.`;
    } else if (humidity > 80) {
      severity = "low";
      title = "Weather Monitor";
      alertDescription = `Current conditions: ${description}. Humidity: ${humidity}%. Normal monitoring active.`;
    }

    // Create or update alert in database if conditions warrant
    if (shouldCreateAlert && severity !== "low") {
      const { error: insertError } = await supabase.from("flood_alerts").insert({
        title,
        description: alertDescription,
        severity,
        location,
        latitude: coords?.lat,
        longitude: coords?.lon,
        is_active: true,
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
      });

      if (insertError) {
        console.error("Error inserting alert:", insertError);
      } else {
        console.log("Alert created successfully");
      }
    }

    return new Response(
      JSON.stringify({
        weather: {
          location,
          temperature: weatherData.main?.temp,
          humidity,
          rain,
          condition: weatherCondition,
          description,
          wind: weatherData.wind?.speed,
        },
        floodRisk: {
          severity,
          shouldAlert: shouldCreateAlert,
          title,
          description: alertDescription,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Weather alerts function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

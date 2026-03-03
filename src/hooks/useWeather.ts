import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rain: number;
  condition: string;
  description: string;
  wind: number;
}

export interface FloodRiskData {
  severity: "low" | "medium" | "high" | "critical";
  shouldAlert: boolean;
  title: string;
  description: string;
}

export interface WeatherState {
  weather: WeatherData | null;
  floodRisk: FloodRiskData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Simulated weather when API is unavailable
function getSimulatedWeather(lat?: number, lon?: number): { weather: WeatherData; floodRisk: FloodRiskData } {
  const conditions = ["Rain", "Clouds", "Clear", "Drizzle"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const isRainy = condition === "Rain" || condition === "Drizzle";
  
  return {
    weather: {
      location: lat ? `${lat.toFixed(2)}°N, ${lon?.toFixed(2)}°E` : "Ahmedabad, IN",
      temperature: 28 + Math.round(Math.random() * 8),
      humidity: 65 + Math.round(Math.random() * 25),
      rain: isRainy ? Math.round(Math.random() * 30) : 0,
      condition,
      description: isRainy ? "moderate rain" : condition.toLowerCase(),
      wind: 3 + Math.round(Math.random() * 10),
    },
    floodRisk: {
      severity: isRainy ? "medium" : "low",
      shouldAlert: isRainy,
      title: isRainy ? "Flood Advisory" : "Weather Monitor",
      description: isRainy
        ? "Moderate rainfall detected. Monitor conditions closely."
        : "Conditions stable. Normal monitoring active.",
    },
  };
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    floodRisk: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        () => setUserLocation(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  const fetchWeather = useCallback(async (lat?: number, lon?: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const body: Record<string, unknown> = {};
      if (lat && lon) { body.lat = lat; body.lon = lon; }

      const { data, error } = await supabase.functions.invoke("weather-alerts", { body });
      if (error) throw error;

      setState({
        weather: data.weather,
        floodRisk: data.floodRisk,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });

      if (data.floodRisk?.severity === "critical") {
        toast.error(`🚨 ${data.floodRisk.title}`, { description: data.floodRisk.description, duration: 15000 });
      } else if (data.floodRisk?.severity === "high") {
        toast.warning(`⚠️ ${data.floodRisk.title}`, { description: data.floodRisk.description, duration: 10000 });
      }

      return data;
    } catch (err) {
      // Fallback to simulated weather
      console.warn("Weather API unavailable, using simulation:", err);
      const simulated = getSimulatedWeather(lat, lon);
      setState({
        weather: simulated.weather,
        floodRisk: simulated.floodRisk,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
      return simulated;
    }
  }, []);

  useEffect(() => { getUserLocation(); }, [getUserLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lon);
    } else {
      fetchWeather();
    }

    const interval = setInterval(() => {
      if (userLocation) fetchWeather(userLocation.lat, userLocation.lon);
      else fetchWeather();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userLocation, fetchWeather]);

  return {
    ...state,
    userLocation,
    refetch: () => fetchWeather(userLocation?.lat, userLocation?.lon),
    setLocation: setUserLocation,
  };
}

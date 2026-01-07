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

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    floodRisk: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Get user's geolocation
  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Fallback to default location
          setUserLocation(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  const fetchWeather = useCallback(async (lat?: number, lon?: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const body: Record<string, unknown> = {};
      if (lat && lon) {
        body.lat = lat;
        body.lon = lon;
      }

      const { data, error } = await supabase.functions.invoke("weather-alerts", {
        body,
      });

      if (error) throw error;

      setState({
        weather: data.weather,
        floodRisk: data.floodRisk,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });

      // Show notification for high/critical risk
      if (data.floodRisk?.severity === "critical") {
        toast.error(`🚨 ${data.floodRisk.title}`, {
          description: data.floodRisk.description,
          duration: 15000,
        });
      } else if (data.floodRisk?.severity === "high") {
        toast.warning(`⚠️ ${data.floodRisk.title}`, {
          description: data.floodRisk.description,
          duration: 10000,
        });
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      console.error("Weather fetch error:", err);
      return null;
    }
  }, []);

  // Fetch weather on mount and when location changes
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lon);
    } else {
      fetchWeather();
    }

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      if (userLocation) {
        fetchWeather(userLocation.lat, userLocation.lon);
      } else {
        fetchWeather();
      }
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

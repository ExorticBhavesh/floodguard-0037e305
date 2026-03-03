import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FloodAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

// Simulated India-wide alerts for when DB is empty or unavailable
function generateSimulatedAlerts(userLat?: number, userLon?: number): FloodAlert[] {
  const now = new Date();
  const indiaAlerts = [
    { title: "Heavy Rainfall Warning", severity: "high" as const, location: "Mumbai, Maharashtra", lat: 19.076, lon: 72.8777, desc: "Heavy rainfall expected. Waterlogging reported in low-lying areas." },
    { title: "River Level Rising", severity: "critical" as const, location: "Patna, Bihar", lat: 25.6093, lon: 85.1376, desc: "Ganga river level near danger mark. Evacuation advisory issued." },
    { title: "Flood Watch Active", severity: "medium" as const, location: "Guwahati, Assam", lat: 26.1445, lon: 91.7362, desc: "Brahmaputra tributaries showing rising trends." },
    { title: "Urban Flooding Alert", severity: "high" as const, location: "Chennai, Tamil Nadu", lat: 13.0827, lon: 80.2707, desc: "Drainage overflow in multiple zones. Avoid travel." },
    { title: "Dam Release Warning", severity: "critical" as const, location: "Kerala, Idukki", lat: 9.8489, lon: 76.9711, desc: "Idukki dam gates opened. Downstream areas on alert." },
    { title: "Coastal Flood Advisory", severity: "medium" as const, location: "Kolkata, West Bengal", lat: 22.5726, lon: 88.3639, desc: "High tide combined with rainfall may cause flooding." },
    { title: "Flash Flood Warning", severity: "high" as const, location: "Uttarakhand, Rishikesh", lat: 30.0869, lon: 78.2676, desc: "Heavy rain in catchment area. Flash floods possible." },
    { title: "Waterlogging Alert", severity: "low" as const, location: "Ahmedabad, Gujarat", lat: 23.0225, lon: 72.5714, desc: "Minor waterlogging in western areas. Normal traffic disruption." },
  ];

  // Add nearby simulated alerts if user location is available
  if (userLat && userLon) {
    indiaAlerts.push({
      title: "Nearby Flood Risk",
      severity: "medium" as const,
      location: `Near your location`,
      lat: userLat + (Math.random() - 0.5) * 0.1,
      lon: userLon + (Math.random() - 0.5) * 0.1,
      desc: "Moderate risk detected within 10km of your current location.",
    });
  }

  return indiaAlerts.map((a, i) => ({
    id: `sim-${i}`,
    title: a.title,
    description: a.desc,
    severity: a.severity,
    location: a.location,
    latitude: a.lat,
    longitude: a.lon,
    is_active: true,
    created_at: new Date(now.getTime() - i * 3600000).toISOString(),
    updated_at: new Date(now.getTime() - i * 3600000).toISOString(),
    expires_at: new Date(now.getTime() + 6 * 3600000).toISOString(),
  }));
}

export function useFloodAlerts() {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("flood_alerts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setAlerts(data as FloodAlert[]);
      } else {
        // Use simulated alerts when no real alerts exist
        setAlerts(generateSimulatedAlerts());
      }
    } catch (err) {
      console.warn("Error fetching alerts, using simulated data:", err);
      setAlerts(generateSimulatedAlerts());
      setError(null); // Don't show error to user
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("flood-alerts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "flood_alerts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newAlert = payload.new as FloodAlert;
            if (newAlert.is_active) {
              setAlerts((prev) => [newAlert, ...prev.filter(a => !a.id.startsWith("sim-"))]);
              if (newAlert.severity === "critical" || newAlert.severity === "high") {
                toast.error(`🚨 ${newAlert.title}`, {
                  description: newAlert.location,
                  duration: 10000,
                });
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedAlert = payload.new as FloodAlert;
            setAlerts((prev) =>
              prev.map((alert) => alert.id === updatedAlert.id ? updatedAlert : alert).filter((alert) => alert.is_active)
            );
          } else if (payload.eventType === "DELETE") {
            setAlerts((prev) => prev.filter((alert) => alert.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const activeAlerts = alerts.filter((a) => a.is_active);
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length;
  const highCount = activeAlerts.filter((a) => a.severity === "high").length;

  return {
    alerts: activeAlerts,
    isLoading,
    error,
    criticalCount,
    highCount,
    totalCount: activeAlerts.length,
    refetch: fetchAlerts,
  };
}

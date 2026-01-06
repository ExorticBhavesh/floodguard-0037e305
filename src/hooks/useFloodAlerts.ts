import { useEffect, useState } from "react";
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

export function useFloodAlerts() {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from("flood_alerts")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAlerts(data as FloodAlert[]);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("flood-alerts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "flood_alerts",
        },
        (payload) => {
          console.log("Real-time alert update:", payload);

          if (payload.eventType === "INSERT") {
            const newAlert = payload.new as FloodAlert;
            if (newAlert.is_active) {
              setAlerts((prev) => [newAlert, ...prev]);
              
              // Show notification for new critical/high alerts
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
              prev.map((alert) =>
                alert.id === updatedAlert.id ? updatedAlert : alert
              ).filter((alert) => alert.is_active)
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setAlerts((prev) => prev.filter((alert) => alert.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
  };
}

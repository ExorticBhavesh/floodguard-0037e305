import { useState, useEffect } from "react";
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Loader2,
  Shield,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFloodAlerts, FloodAlert } from "@/hooks/useFloodAlerts";

interface LocationBasedAlertsProps {
  maxDistance?: number; // in km
  maxAlerts?: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function LocationBasedAlerts({ maxDistance = 100, maxAlerts = 3 }: LocationBasedAlertsProps) {
  const { latitude, longitude, locationName, isLoading: locationLoading, error: locationError, refetch: refetchLocation } = useGeolocation();
  const { alerts, isLoading: alertsLoading } = useFloodAlerts();
  const [nearbyAlerts, setNearbyAlerts] = useState<(FloodAlert & { distance: number })[]>([]);

  useEffect(() => {
    if (latitude && longitude && alerts.length > 0) {
      // Filter and sort alerts by distance
      const alertsWithDistance = alerts
        .filter(alert => alert.latitude && alert.longitude)
        .map(alert => ({
          ...alert,
          distance: calculateDistance(
            latitude, 
            longitude, 
            alert.latitude!, 
            alert.longitude!
          )
        }))
        .filter(alert => alert.distance <= maxDistance)
        .sort((a, b) => {
          // Sort by severity first, then by distance
          const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
          if (severityDiff !== 0) return severityDiff;
          return a.distance - b.distance;
        })
        .slice(0, maxAlerts);

      setNearbyAlerts(alertsWithDistance);
    }
  }, [latitude, longitude, alerts, maxDistance, maxAlerts]);

  const isLoading = locationLoading || alertsLoading;

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="font-semibold">Detecting Location...</h3>
            <p className="text-xs text-muted-foreground">Finding nearby flood warnings</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="text-center py-4">
          <Navigation className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="font-medium mb-1">Location Access Required</h3>
          <p className="text-sm text-muted-foreground mb-4">{locationError}</p>
          <Button variant="outline" size="sm" onClick={refetchLocation} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Nearby Alerts</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{locationName || "Your Location"}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refetchLocation}
          className="h-8 w-8"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Alerts List */}
      {nearbyAlerts.length === 0 ? (
        <div className="text-center py-6">
          <Shield className="w-12 h-12 mx-auto mb-3 text-risk-low opacity-60" />
          <h4 className="font-medium text-risk-low mb-1">All Clear</h4>
          <p className="text-sm text-muted-foreground">
            No flood warnings within {maxDistance}km of your location
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {nearbyAlerts.map(alert => {
            const severityConfig = {
              low: { bg: "bg-risk-low/10", border: "border-risk-low/30", text: "text-risk-low" },
              medium: { bg: "bg-risk-medium/10", border: "border-risk-medium/30", text: "text-risk-medium" },
              high: { bg: "bg-risk-high/10", border: "border-risk-high/30", text: "text-risk-high" },
              critical: { bg: "bg-risk-critical/10", border: "border-risk-critical/30", text: "text-risk-critical" },
            };
            const config = severityConfig[alert.severity];

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl ${config.bg} border ${config.border} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 ${config.text} mt-0.5 flex-shrink-0`} />
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold ${config.text} uppercase`}>
                      {alert.severity}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {alert.distance.toFixed(1)}km away
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

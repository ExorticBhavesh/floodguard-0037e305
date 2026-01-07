import { AlertTriangle, Bell, Shield, Zap, Radio, RefreshCw, MapPin, Navigation } from "lucide-react";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";

export default function Alerts() {
  const { alerts, isLoading, error, criticalCount, highCount, totalCount } = useFloodAlerts();
  const { locationName, hasLocation, refetch: refetchLocation } = useGeolocation();

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-risk-critical/5" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-risk-critical/5 rounded-full blur-[200px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-risk-high/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-risk-critical to-risk-high flex items-center justify-center shadow-xl p-4">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                {criticalCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-risk-critical text-white text-sm font-bold flex items-center justify-center animate-pulse shadow-lg">
                    {criticalCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Flood Alert{" "}
                  <span className="bg-gradient-to-r from-risk-critical to-risk-high bg-clip-text text-transparent">
                    Center
                  </span>
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Radio className="w-3.5 h-3.5 text-risk-low animate-pulse" />
                    Real-time monitoring
                  </span>
                  {hasLocation && locationName && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1.5 text-sm text-primary">
                        <MapPin className="w-3.5 h-3.5" />
                        {locationName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!hasLocation && (
                <Button variant="outline" size="sm" onClick={refetchLocation} className="gap-2">
                  <Navigation className="w-4 h-4" />
                  Enable Location
                </Button>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="mb-8">
            <PushNotificationToggle />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-risk-critical/20 to-risk-critical/5 border border-risk-critical/20">
              <div className="text-3xl font-bold text-risk-critical">{criticalCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Critical</div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-risk-high/20 to-risk-high/5 border border-risk-high/20">
              <div className="text-3xl font-bold text-risk-high">{highCount}</div>
              <div className="text-sm text-muted-foreground mt-1">High Risk</div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <div className="text-3xl font-bold text-primary">{totalCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Active</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-risk-low" />
              </span>
              <span className="text-sm font-semibold text-risk-low">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-risk-high/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-risk-high" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unable to Load Alerts</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-3xl bg-risk-low/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-risk-low" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-risk-low">All Clear</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-lg">
                No active flood alerts in your area. Stay prepared and keep monitoring for updates.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Quick Safety Tips</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { tip: "Never drive through flooded roads - \"Turn Around, Don't Drown\"", icon: "🚗" },
                { tip: "Move to higher ground immediately when warned", icon: "⛰️" },
                { tip: "Keep emergency supplies ready and accessible", icon: "🎒" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/50">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm leading-relaxed">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

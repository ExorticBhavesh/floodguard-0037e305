import { AlertTriangle, Bell, Shield, Zap, Radio, RefreshCw, MapPin, Navigation, Download } from "lucide-react";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { ExportDropdown } from "@/components/ExportDropdown";
import { exportAlertsToCSV, exportAlertsToPDF } from "@/lib/exportUtils";

export default function Alerts() {
  const { alerts, isLoading, error, criticalCount, highCount, totalCount } = useFloodAlerts();
  const { locationName, hasLocation, refetch: refetchLocation } = useGeolocation();

  return (
    <div className="min-h-screen pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-risk-critical/3 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-risk-critical to-risk-high flex items-center justify-center shadow-md">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                {criticalCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-risk-critical text-white text-xs font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {criticalCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Flood Alert{" "}
                  <span className="gradient-text">Center</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Radio className="w-3 h-3 text-risk-low animate-pulse" />
                    Real-time
                  </span>
                  {hasLocation && locationName && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <MapPin className="w-3 h-3" />
                        {locationName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {alerts.length > 0 && (
                <ExportDropdown
                  onExportCSV={() => exportAlertsToCSV(alerts)}
                  onExportPDF={() => exportAlertsToPDF(alerts)}
                  label="Export"
                  size="sm"
                />
              )}
              {!hasLocation && (
                <Button variant="outline" size="sm" onClick={refetchLocation} className="gap-2">
                  <Navigation className="w-4 h-4" />
                  Enable Location
                </Button>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="mb-6">
            <PushNotificationToggle />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="stat-card text-center">
              <div className="stat-value text-risk-critical">{criticalCount}</div>
              <div className="stat-label">Critical</div>
            </div>
            <div className="stat-card text-center">
              <div className="stat-value text-risk-high">{highCount}</div>
              <div className="stat-label">High Risk</div>
            </div>
            <div className="stat-card text-center">
              <div className="stat-value text-primary">{totalCount}</div>
              <div className="stat-label">Total Active</div>
            </div>
            <div className="stat-card flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
              </span>
              <span className="text-sm font-medium text-risk-low">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-risk-high/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-risk-high" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Unable to Load Alerts</h3>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-xl bg-risk-low/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-risk-low" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-risk-low">All Clear</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                No active flood alerts in your area. Stay prepared and keep monitoring.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="pro-card p-6">
            <div className="section-header">
              <div className="section-icon">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="section-title">Quick Safety Tips</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { tip: "Never drive through flooded roads - \"Turn Around, Don't Drown\"", icon: "🚗" },
                { tip: "Move to higher ground immediately when warned", icon: "⛰️" },
                { tip: "Keep emergency supplies ready and accessible", icon: "🎒" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

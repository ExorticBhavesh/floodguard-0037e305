import { AlertTriangle, Bell, Shield, Zap, Radio, RefreshCw } from "lucide-react";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Alerts() {
  const { alerts, isLoading, error, criticalCount, highCount, totalCount } = useFloodAlerts();

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-risk-critical/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-risk-critical to-risk-high flex items-center justify-center shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              {criticalCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-risk-critical text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {criticalCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Flood Alert{" "}
                <span className="bg-gradient-to-r from-risk-critical to-risk-high bg-clip-text text-transparent">
                  Center
                </span>
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring • Auto-updated every second
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-risk-critical">{criticalCount}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-risk-high">{highCount}</div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{totalCount}</div>
              <div className="text-xs text-muted-foreground">Total Active</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-2">
              <Radio className="w-4 h-4 text-risk-low animate-pulse" />
              <span className="text-sm font-medium text-risk-low">Live</span>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-risk-high opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Alerts</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="w-20 h-20 mx-auto mb-4 text-risk-low opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-risk-low">All Clear</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
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
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Quick Safety Tips</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Never drive through flooded roads - "Turn Around, Don't Drown"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Move to higher ground immediately when warned</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Keep emergency supplies ready and accessible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

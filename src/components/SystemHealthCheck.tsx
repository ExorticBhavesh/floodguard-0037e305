import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Server, 
  Database, 
  Cloud, 
  Brain, 
  Bell,
  RefreshCw,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface HealthStatus {
  name: string;
  status: "healthy" | "degraded" | "error" | "checking";
  latency?: number;
  message?: string;
  icon: React.ComponentType<any>;
}

export function SystemHealthCheck() {
  const [services, setServices] = useState<HealthStatus[]>([
    { name: "API Gateway", status: "checking", icon: Server },
    { name: "Database", status: "checking", icon: Database },
    { name: "Weather Service", status: "checking", icon: Cloud },
    { name: "ML Prediction", status: "checking", icon: Brain },
    { name: "Alert System", status: "checking", icon: Bell },
  ]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();

    // Check API Gateway / Supabase connection
    try {
      const apiStart = Date.now();
      const { error } = await supabase.from("flood_alerts").select("id").limit(1);
      const apiLatency = Date.now() - apiStart;
      
      setServices(prev => prev.map(s => 
        s.name === "API Gateway" 
          ? { ...s, status: error ? "error" : "healthy", latency: apiLatency, message: error?.message }
          : s
      ));
    } catch (e) {
      setServices(prev => prev.map(s => 
        s.name === "API Gateway" 
          ? { ...s, status: "error", message: "Connection failed" }
          : s
      ));
    }

    // Check Database
    try {
      const dbStart = Date.now();
      const { count, error } = await supabase.from("flood_alerts").select("*", { count: "exact", head: true });
      const dbLatency = Date.now() - dbStart;
      
      setServices(prev => prev.map(s => 
        s.name === "Database" 
          ? { ...s, status: error ? "error" : "healthy", latency: dbLatency, message: error ? error.message : `${count || 0} records` }
          : s
      ));
    } catch (e) {
      setServices(prev => prev.map(s => 
        s.name === "Database" 
          ? { ...s, status: "error", message: "Query failed" }
          : s
      ));
    }

    // Check Weather Service
    try {
      const weatherStart = Date.now();
      const { data, error } = await supabase.functions.invoke("weather-alerts", {
        body: { city: "Ahmedabad" },
      });
      const weatherLatency = Date.now() - weatherStart;
      
      setServices(prev => prev.map(s => 
        s.name === "Weather Service" 
          ? { 
              ...s, 
              status: error ? "error" : "healthy", 
              latency: weatherLatency,
              message: error ? error.message : data?.weather?.condition || "Active" 
            }
          : s
      ));
    } catch (e) {
      setServices(prev => prev.map(s => 
        s.name === "Weather Service" 
          ? { ...s, status: "degraded", message: "Service unavailable" }
          : s
      ));
    }

    // Check ML Prediction
    try {
      const mlStart = Date.now();
      const { data, error } = await supabase.functions.invoke("flood-predict", {
        body: { rainfall: 25, riverLevel: 4, humidity: 70, elevation: 20 },
      });
      const mlLatency = Date.now() - mlStart;
      
      setServices(prev => prev.map(s => 
        s.name === "ML Prediction" 
          ? { 
              ...s, 
              status: error ? "error" : "healthy", 
              latency: mlLatency,
              message: error ? error.message : `Model v2.1 active` 
            }
          : s
      ));
    } catch (e) {
      setServices(prev => prev.map(s => 
        s.name === "ML Prediction" 
          ? { ...s, status: "degraded", message: "Model offline" }
          : s
      ));
    }

    // Check Alert System
    try {
      const alertStart = Date.now();
      const { data, error } = await supabase.functions.invoke("send-sms-alert", {
        body: { riskLevel: "low", location: "Test", phoneNumbers: [] },
      });
      const alertLatency = Date.now() - alertStart;
      
      setServices(prev => prev.map(s => 
        s.name === "Alert System" 
          ? { 
              ...s, 
              status: error ? "error" : "healthy", 
              latency: alertLatency,
              message: error ? error.message : data?.mode === "demo" ? "Demo mode" : "Live" 
            }
          : s
      ));
    } catch (e) {
      setServices(prev => prev.map(s => 
        s.name === "Alert System" 
          ? { ...s, status: "degraded", message: "Alert service offline" }
          : s
      ));
    }

    setLastCheck(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status: HealthStatus["status"]) => {
    switch (status) {
      case "healthy": return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
      case "degraded": return <Wifi className="w-4 h-4 text-risk-medium" />;
      case "error": return <XCircle className="w-4 h-4 text-risk-critical" />;
      default: return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: HealthStatus["status"]) => {
    switch (status) {
      case "healthy": return <Badge className="bg-risk-low/10 text-risk-low border-risk-low/20">Healthy</Badge>;
      case "degraded": return <Badge className="bg-risk-medium/10 text-risk-medium border-risk-medium/20">Degraded</Badge>;
      case "error": return <Badge className="bg-risk-critical/10 text-risk-critical border-risk-critical/20">Error</Badge>;
      default: return <Badge variant="outline">Checking...</Badge>;
    }
  };

  const healthyCount = services.filter(s => s.status === "healthy").length;
  const overallStatus = healthyCount === services.length ? "healthy" : healthyCount >= 3 ? "degraded" : "error";

  return (
    <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            overallStatus === "healthy" 
              ? "bg-risk-low/10 border border-risk-low/20" 
              : overallStatus === "degraded"
              ? "bg-risk-medium/10 border border-risk-medium/20"
              : "bg-risk-critical/10 border border-risk-critical/20"
          }`}>
            <Server className={`w-5 h-5 ${
              overallStatus === "healthy" ? "text-risk-low" : 
              overallStatus === "degraded" ? "text-risk-medium" : "text-risk-critical"
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-lg">System Health</h3>
            <p className="text-xs text-muted-foreground">
              {lastCheck ? `Last check: ${lastCheck.toLocaleTimeString()}` : "Checking..."}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkHealth}
          disabled={isChecking}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-xl mb-6 ${
        overallStatus === "healthy" 
          ? "bg-risk-low/10 border border-risk-low/20" 
          : overallStatus === "degraded"
          ? "bg-risk-medium/10 border border-risk-medium/20"
          : "bg-risk-critical/10 border border-risk-critical/20"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {overallStatus === "healthy" ? (
              <CheckCircle2 className="w-8 h-8 text-risk-low" />
            ) : overallStatus === "degraded" ? (
              <Wifi className="w-8 h-8 text-risk-medium" />
            ) : (
              <XCircle className="w-8 h-8 text-risk-critical" />
            )}
            <div>
              <p className="font-bold">
                {overallStatus === "healthy" ? "All Systems Operational" :
                 overallStatus === "degraded" ? "Partial Service Degradation" :
                 "Service Disruption"}
              </p>
              <p className="text-sm text-muted-foreground">
                {healthyCount}/{services.length} services healthy
              </p>
            </div>
          </div>
          {getStatusBadge(overallStatus)}
        </div>
      </div>

      {/* Service List */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(service.status)}
              <div className="flex items-center gap-2">
                <service.icon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">{service.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {service.latency && (
                <span className="text-xs text-muted-foreground">
                  {service.latency}ms
                </span>
              )}
              {service.message && (
                <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                  {service.message}
                </span>
              )}
              {getStatusBadge(service.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

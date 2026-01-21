import { useState, useEffect } from "react";
import { 
  Cpu, 
  Wifi, 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "online" | "degraded" | "offline" | "checking";
  latency?: number;
  uptime: number;
}

export function SystemStatusMini() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: "api", name: "API Gateway", icon: Server, status: "checking", uptime: 99.9 },
    { id: "ml", name: "ML Engine", icon: Cpu, status: "checking", uptime: 99.7 },
    { id: "db", name: "Database", icon: Database, status: "checking", uptime: 99.99 },
    { id: "weather", name: "Weather API", icon: Cloud, status: "checking", uptime: 98.5 },
  ]);

  useEffect(() => {
    // Simulate service checks
    const timer = setTimeout(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        status: Math.random() > 0.1 ? "online" : "degraded",
        latency: Math.floor(20 + Math.random() * 80),
      })));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const allOnline = services.every(s => s.status === "online");
  const someIssues = services.some(s => s.status === "degraded" || s.status === "offline");

  const StatusIcon = ({ status }: { status: ServiceStatus["status"] }) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="w-3.5 h-3.5 text-risk-low" />;
      case "degraded":
        return <AlertCircle className="w-3.5 h-3.5 text-risk-medium" />;
      case "offline":
        return <AlertCircle className="w-3.5 h-3.5 text-risk-critical" />;
      case "checking":
        return <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />;
    }
  };

  return (
    <div className="pro-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            System Status
          </span>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
          allOnline ? "bg-risk-low/10 text-risk-low" : someIssues ? "bg-risk-medium/10 text-risk-medium" : "bg-muted text-muted-foreground"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            allOnline ? "bg-risk-low" : someIssues ? "bg-risk-medium animate-pulse" : "bg-muted-foreground"
          )} />
          {allOnline ? "All Systems Go" : someIssues ? "Minor Issues" : "Checking..."}
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 gap-2">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{service.name}</p>
                {service.latency && (
                  <p className="text-[10px] text-muted-foreground">{service.latency}ms</p>
                )}
              </div>
              <StatusIcon status={service.status} />
            </div>
          );
        })}
      </div>

      {/* Uptime Summary */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Avg. Uptime (30d)</span>
          <span className="font-bold text-risk-low">99.52%</span>
        </div>
      </div>
    </div>
  );
}

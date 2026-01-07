import { AlertTriangle, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { FloodAlert } from "@/hooks/useFloodAlerts";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface AlertCardProps {
  alert: FloodAlert;
}

const severityConfig = {
  low: {
    bg: "bg-gradient-to-br from-risk-low/15 to-risk-low/5",
    border: "border-risk-low/30 hover:border-risk-low/50",
    text: "text-risk-low",
    badge: "bg-risk-low",
    label: "Low Risk",
    pulse: false,
    icon: "🟢",
  },
  medium: {
    bg: "bg-gradient-to-br from-risk-medium/15 to-risk-medium/5",
    border: "border-risk-medium/30 hover:border-risk-medium/50",
    text: "text-risk-medium",
    badge: "bg-risk-medium",
    label: "Medium Risk",
    pulse: false,
    icon: "🟡",
  },
  high: {
    bg: "bg-gradient-to-br from-risk-high/15 to-risk-high/5",
    border: "border-risk-high/30 hover:border-risk-high/50",
    text: "text-risk-high",
    badge: "bg-risk-high",
    label: "High Risk",
    pulse: true,
    icon: "🟠",
  },
  critical: {
    bg: "bg-gradient-to-br from-risk-critical/15 to-risk-critical/5",
    border: "border-risk-critical/30 hover:border-risk-critical/50",
    text: "text-risk-critical",
    badge: "bg-risk-critical",
    label: "Critical",
    pulse: true,
    icon: "🔴",
  },
};

export function AlertCard({ alert }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  
  const openInMaps = () => {
    if (alert.latitude && alert.longitude) {
      window.open(
        `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`,
        "_blank"
      );
    }
  };
  
  return (
    <div
      className={`relative p-6 rounded-3xl ${config.bg} border-2 ${config.border} transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group`}
    >
      {/* Pulse indicator for critical/high */}
      {config.pulse && (
        <div className="absolute top-5 right-5">
          <span className="relative flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.badge} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-4 w-4 ${config.badge}`} />
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${config.bg} border ${config.border.split(' ')[0]}`}>
          <AlertTriangle className={`w-6 h-6 ${config.text}`} />
        </div>
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${config.badge} shadow-sm`}>
              {config.label}
            </span>
            <span className="text-lg">{config.icon}</span>
          </div>
          <h3 className="font-bold text-xl leading-tight">{alert.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-5 leading-relaxed">
        {alert.description}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{alert.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        
        {alert.latitude && alert.longitude && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={openInMaps}
            className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Navigation className="w-4 h-4" />
            View on Map
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

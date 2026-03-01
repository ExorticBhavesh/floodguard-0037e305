import { AlertTriangle, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { FloodAlert } from "@/hooks/useFloodAlerts";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface AlertCardProps {
  alert: FloodAlert;
}

const severityConfig = {
  low: {
    bg: "bg-risk-low/6",
    border: "border-risk-low/15 hover:border-risk-low/30",
    text: "text-risk-low",
    badge: "bg-risk-low/15 text-risk-low",
    label: "Low Risk",
    pulse: false,
  },
  medium: {
    bg: "bg-risk-medium/6",
    border: "border-risk-medium/15 hover:border-risk-medium/30",
    text: "text-risk-medium",
    badge: "bg-risk-medium/15 text-risk-medium",
    label: "Moderate",
    pulse: false,
  },
  high: {
    bg: "bg-risk-high/6",
    border: "border-risk-high/15 hover:border-risk-high/30",
    text: "text-risk-high",
    badge: "bg-risk-high/15 text-risk-high",
    label: "High Risk",
    pulse: true,
  },
  critical: {
    bg: "bg-risk-critical/6",
    border: "border-risk-critical/15 hover:border-risk-critical/30",
    text: "text-risk-critical",
    badge: "bg-risk-critical/15 text-risk-critical",
    label: "Critical",
    pulse: true,
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
      className={`relative p-5 rounded-2xl ${config.bg} border ${config.border} transition-all duration-300 hover:shadow-md group`}
    >
      {/* Pulse indicator for critical/high */}
      {config.pulse && (
        <div className="absolute top-4 right-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.text === 'text-risk-critical' ? 'bg-risk-critical' : 'bg-risk-high'} opacity-50`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.text === 'text-risk-critical' ? 'bg-risk-critical' : 'bg-risk-high'}`} />
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-xl ${config.bg}`}>
          <AlertTriangle className={`w-5 h-5 ${config.text}`} />
        </div>
        <div className="flex-1 pr-6">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1.5 ${config.badge}`}>
            {config.label}
          </span>
          <h3 className="font-semibold text-base leading-tight">{alert.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {alert.description}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-medium">{alert.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        
        {alert.latitude && alert.longitude && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={openInMaps}
            className="gap-1.5 h-7 px-2.5 text-xs text-accent hover:text-accent hover:bg-accent/10 rounded-lg"
          >
            <Navigation className="w-3.5 h-3.5" />
            View on Map
          </Button>
        )}
      </div>
    </div>
  );
}

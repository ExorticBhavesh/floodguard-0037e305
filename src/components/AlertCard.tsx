import { AlertTriangle, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { FloodAlert } from "@/hooks/useFloodAlerts";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface AlertCardProps {
  alert: FloodAlert;
}

const severityConfig = {
  low: {
    bg: "bg-risk-low/8",
    border: "border-risk-low/20 hover:border-risk-low/40",
    text: "text-risk-low",
    badge: "bg-risk-low",
    label: "Low Risk",
    pulse: false,
  },
  medium: {
    bg: "bg-risk-medium/8",
    border: "border-risk-medium/20 hover:border-risk-medium/40",
    text: "text-risk-medium",
    badge: "bg-risk-medium",
    label: "Medium Risk",
    pulse: false,
  },
  high: {
    bg: "bg-risk-high/8",
    border: "border-risk-high/20 hover:border-risk-high/40",
    text: "text-risk-high",
    badge: "bg-risk-high",
    label: "High Risk",
    pulse: true,
  },
  critical: {
    bg: "bg-risk-critical/8",
    border: "border-risk-critical/20 hover:border-risk-critical/40",
    text: "text-risk-critical",
    badge: "bg-risk-critical",
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
      className={`relative p-5 rounded-xl ${config.bg} border ${config.border} transition-all duration-200 hover:shadow-md group`}
    >
      {/* Pulse indicator for critical/high */}
      {config.pulse && (
        <div className="absolute top-4 right-4">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.badge} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${config.badge}`} />
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border.split(' ')[0]}`}>
          <AlertTriangle className={`w-5 h-5 ${config.text}`} />
        </div>
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${config.badge}`}>
              {config.label}
            </span>
          </div>
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
            className="gap-1.5 h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
          >
            <Navigation className="w-3.5 h-3.5" />
            View on Map
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

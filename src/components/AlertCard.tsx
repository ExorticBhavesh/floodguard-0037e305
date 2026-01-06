import { AlertTriangle, MapPin, Clock, Bell } from "lucide-react";
import { FloodAlert } from "@/hooks/useFloodAlerts";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: FloodAlert;
}

const severityConfig = {
  low: {
    bg: "bg-risk-low/10",
    border: "border-risk-low/30",
    text: "text-risk-low",
    badge: "bg-risk-low",
    label: "Low Risk",
    pulse: false,
  },
  medium: {
    bg: "bg-risk-medium/10",
    border: "border-risk-medium/30",
    text: "text-risk-medium",
    badge: "bg-risk-medium",
    label: "Medium Risk",
    pulse: false,
  },
  high: {
    bg: "bg-risk-high/10",
    border: "border-risk-high/30",
    text: "text-risk-high",
    badge: "bg-risk-high",
    label: "High Risk",
    pulse: true,
  },
  critical: {
    bg: "bg-risk-critical/10",
    border: "border-risk-critical/30",
    text: "text-risk-critical",
    badge: "bg-risk-critical",
    label: "Critical",
    pulse: true,
  },
};

export function AlertCard({ alert }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  
  return (
    <div
      className={`relative p-5 rounded-2xl ${config.bg} border ${config.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
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
        <div className={`p-2 rounded-xl ${config.bg} border ${config.border}`}>
          <AlertTriangle className={`w-5 h-5 ${config.text}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <h3 className="font-bold text-lg">{alert.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {alert.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{alert.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}

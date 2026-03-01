import { Activity, Wifi } from "lucide-react";

interface LiveStatusBadgeProps {
  totalAlerts: number;
  isConnected?: boolean;
}

export function LiveStatusBadge({ totalAlerts, isConnected = true }: LiveStatusBadgeProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 shadow-lg animate-fade-in">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-low" />
          </span>
          <span className="text-sm font-semibold text-risk-low">LIVE</span>
        </div>
        
        <div className="w-px h-4 bg-border" />
        
        {/* Connection status */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
          <span>Connected</span>
        </div>
        
        <div className="w-px h-4 bg-border" />
        
        {/* Alert count */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-medium">
            <span className="text-foreground">{totalAlerts}</span>
            <span className="text-muted-foreground ml-1">Active Alerts</span>
          </span>
        </div>
      </div>
    </div>
  );
}

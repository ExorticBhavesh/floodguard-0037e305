import { Activity, Wifi } from "lucide-react";

interface LiveStatusBadgeProps {
  totalAlerts: number;
  isConnected?: boolean;
}

export function LiveStatusBadge({ totalAlerts, isConnected = true }: LiveStatusBadgeProps) {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border/40 shadow-sm animate-fade-in">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <span className="text-sm font-semibold text-risk-low">LIVE</span>
        </div>
        
        <div className="w-px h-4 bg-border" />
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-accent' : 'text-muted-foreground'}`} />
          <span>Connected</span>
        </div>
        
        <div className="w-px h-4 bg-border" />
        
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm font-medium">
            <span className="text-foreground">{totalAlerts}</span>
            <span className="text-muted-foreground ml-1">Active</span>
          </span>
        </div>
      </div>
    </div>
  );
}

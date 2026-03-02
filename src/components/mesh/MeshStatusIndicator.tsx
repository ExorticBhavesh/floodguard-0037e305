import { Radio, WifiOff } from "lucide-react";

interface MeshStatusIndicatorProps {
  isActive: boolean;
  nodeCount: number;
  mode: "bluetooth" | "simulation";
}

export function MeshStatusIndicator({ isActive, nodeCount, mode }: MeshStatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {isActive ? (
          <>
            <Radio className="w-4 h-4 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </>
        ) : (
          <WifiOff className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
        {isActive ? `Mesh Active • ${nodeCount} nodes` : "No Nearby Devices"}
      </span>
      {mode === "simulation" && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-risk-medium/10 text-risk-medium font-medium">
          SIM
        </span>
      )}
    </div>
  );
}

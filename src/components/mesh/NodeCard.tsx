import type { MeshNode } from "@/services/simulationService";

interface NodeCardProps {
  node: MeshNode;
}

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map(level => (
        <div
          key={level}
          className={`signal-bar ${level <= strength ? "active" : ""}`}
          style={{ height: `${level * 25}%` }}
        />
      ))}
    </div>
  );
}

export function NodeCard({ node }: NodeCardProps) {
  const distanceLabel = node.distanceCategory === "very-close" ? "<10m" 
    : node.distanceCategory === "nearby" ? "10-30m" 
    : "30-50m";

  return (
    <div className="mesh-node-card animate-fade-in">
      {/* Status dot */}
      <div className="relative flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${
          node.status === "active" ? "bg-primary" : "bg-risk-medium"
        }`} />
        {node.status === "active" && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-50" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{node.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{node.id}</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground">~{node.distance}m</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium ${
            node.distanceCategory === "very-close" 
              ? "bg-primary/10 text-primary" 
              : node.distanceCategory === "nearby"
                ? "bg-risk-medium/10 text-risk-medium"
                : "bg-muted text-muted-foreground"
          }`}>
            {distanceLabel}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{node.rssi}dBm</span>
        </div>
      </div>

      {/* Signal strength */}
      <SignalBars strength={node.signalStrength} />
    </div>
  );
}

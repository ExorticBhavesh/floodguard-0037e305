import { useState } from "react";
import { 
  Radio, MapPin, Navigation, Wifi, WifiOff, Shield, 
  Users, AlertTriangle, Crosshair, ToggleLeft, ToggleRight 
} from "lucide-react";
import { useMeshNetwork } from "@/hooks/useMeshNetwork";
import { useGeolocation } from "@/hooks/useGeolocation";
import { SOSButton } from "@/components/mesh/SOSButton";
import { NodeCard } from "@/components/mesh/NodeCard";
import { MeshStatusIndicator } from "@/components/mesh/MeshStatusIndicator";
import { toast } from "sonner";

export function MeshDashboard() {
  const mesh = useMeshNetwork();
  const { latitude, longitude, hasLocation } = useGeolocation();
  const [offlineMode, setOfflineMode] = useState(false);
  const [rescueMode, setRescueMode] = useState(false);

  const handleSOS = () => {
    mesh.broadcastSOS();
    toast.success("SOS Broadcasted to Nearby Mesh Nodes", {
      description: `Signal sent to ${mesh.nodeStats.total} active nodes`,
      icon: "🚨",
    });
  };

  return (
    <div className="space-y-5">
      {/* SECTION A: Emergency Panel */}
      <section className="glass-card p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h2 className="text-lg font-bold">Emergency Panel</h2>
          <div className="ml-auto">
            <MeshStatusIndicator 
              isActive={mesh.isScanning} 
              nodeCount={mesh.nodeStats.total} 
              mode={mesh.mode} 
            />
          </div>
        </div>

        <div className="flex flex-col items-center py-4">
          <SOSButton onPress={handleSOS} isActive={mesh.sosActive} />
          
          {mesh.sosActive && (
            <div className="mt-4 text-center animate-fade-in">
              <p className="text-sm font-medium text-destructive">
                {mesh.sosBroadcastCount} nodes reached
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION B: Nearby Survivors */}
      <section className="glass-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Nearby Survivors</h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Active Nodes", value: mesh.nodeStats.total, color: "text-primary" },
            { label: "Very Close", value: mesh.nodeStats.veryClose, sub: "<10m", color: "text-primary" },
            { label: "Nearby", value: mesh.nodeStats.nearby, sub: "10-30m", color: "text-risk-medium" },
            { label: "Detectable", value: mesh.nodeStats.detectable, sub: "30-50m", color: "text-muted-foreground" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className={`text-xl font-bold ${stat.color} tabular-nums`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</div>
              {stat.sub && <div className="text-[9px] text-muted-foreground">{stat.sub}</div>}
            </div>
          ))}
        </div>

        {/* Node list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {mesh.nodes.map(node => (
            <NodeCard key={node.id} node={node} />
          ))}
          {mesh.nodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Scanning for nearby devices...</p>
            </div>
          )}
        </div>

        {/* Simulation mode banner */}
        {mesh.mode === "simulation" && (
          <div className="mt-4 p-3 rounded-xl bg-risk-medium/10 border border-risk-medium/20 flex items-center gap-2">
            <Radio className="w-4 h-4 text-risk-medium flex-shrink-0" />
            <p className="text-xs text-risk-medium font-medium">Simulation Mode Active — Real BLE requires Capacitor native build</p>
          </div>
        )}
      </section>

      {/* SECTION C: Location Panel */}
      <section className="glass-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Location</h2>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Latitude</div>
              <div className="text-sm font-mono font-semibold text-foreground mt-0.5">
                {hasLocation ? latitude.toFixed(6) : "—"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Longitude</div>
              <div className="text-sm font-mono font-semibold text-foreground mt-0.5">
                {hasLocation ? longitude.toFixed(6) : "—"}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Last Updated</div>
            <div className="text-sm font-mono text-foreground mt-0.5">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2">
              {offlineMode ? <WifiOff className="w-4 h-4 text-risk-medium" /> : <Wifi className="w-4 h-4 text-primary" />}
              <span className="text-sm font-medium">{offlineMode ? "Offline Mesh Mode" : "Online Mode"}</span>
            </div>
            <button onClick={() => setOfflineMode(!offlineMode)} className="text-primary">
              {offlineMode ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
          </div>

          {offlineMode && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 animate-fade-in">
              <Radio className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-primary font-medium">Operating via Local Bluetooth Mesh Network</p>
            </div>
          )}
        </div>
      </section>

      {/* Rescue Mode Toggle */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-risk-critical/10">
              <Shield className="w-4 h-4 text-risk-critical" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Rescue Team Mode</h3>
              <p className="text-[10px] text-muted-foreground">Show cluster density visualization</p>
            </div>
          </div>
          <button onClick={() => setRescueMode(!rescueMode)} className="text-primary">
            {rescueMode ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-muted-foreground" />}
          </button>
        </div>

        {rescueMode && (
          <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/30 animate-fade-in">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cluster Density</h4>
            <div className="flex items-end gap-2 h-24">
              {[3, 5, 2, 7, 4, 6, 1, 5, 3, 4].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${val * 14}%`,
                    background: val > 5 
                      ? "var(--gradient-emergency)" 
                      : val > 3 
                        ? "hsl(38 92% 50%)" 
                        : "hsl(170 100% 44%)",
                    opacity: 0.7 + val * 0.04,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              <span>Zone A</span>
              <span>Zone E</span>
              <span>Zone J</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

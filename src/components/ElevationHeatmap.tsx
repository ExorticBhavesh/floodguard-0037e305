import { Mountain, TrendingDown, TrendingUp, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ElevationPoint {
  id: string;
  name: string;
  elevation: number;
  lat: number;
  lon: number;
  floodSusceptibility: "very-high" | "high" | "medium" | "low";
  description: string;
}

// Simulated DEM/LiDAR data for Ahmedabad region
const elevationData: ElevationPoint[] = [
  {
    id: "1",
    name: "Sabarmati River Basin",
    elevation: 8,
    lat: 23.02,
    lon: 72.57,
    floodSusceptibility: "very-high",
    description: "Lowest point near river. First to flood during heavy rainfall.",
  },
  {
    id: "2",
    name: "Vasna Canal Zone",
    elevation: 12,
    lat: 23.00,
    lon: 72.56,
    floodSusceptibility: "very-high",
    description: "Canal overflow zone. High water accumulation risk.",
  },
  {
    id: "3",
    name: "Riverfront Gardens",
    elevation: 15,
    lat: 23.03,
    lon: 72.58,
    floodSusceptibility: "high",
    description: "Developed riverfront. Protected but still at risk during major floods.",
  },
  {
    id: "4",
    name: "Chandkheda Area",
    elevation: 18,
    lat: 23.10,
    lon: 72.60,
    floodSusceptibility: "high",
    description: "Low-lying suburban area with poor drainage.",
  },
  {
    id: "5",
    name: "Kankaria Lake Vicinity",
    elevation: 22,
    lat: 23.01,
    lon: 72.60,
    floodSusceptibility: "medium",
    description: "Moderate elevation. Lake overflow possible during extreme events.",
  },
  {
    id: "6",
    name: "Navrangpura",
    elevation: 28,
    lat: 23.04,
    lon: 72.55,
    floodSusceptibility: "medium",
    description: "Central area with moderate drainage infrastructure.",
  },
  {
    id: "7",
    name: "Vastrapur Lake Area",
    elevation: 32,
    lat: 23.03,
    lon: 72.52,
    floodSusceptibility: "low",
    description: "Well-developed area with good drainage systems.",
  },
  {
    id: "8",
    name: "Science City Ridge",
    elevation: 42,
    lat: 23.07,
    lon: 72.51,
    floodSusceptibility: "low",
    description: "Highest point in western Ahmedabad. Natural high ground.",
  },
];

function getSusceptibilityColor(level: string): string {
  switch (level) {
    case "very-high": return "bg-risk-critical text-white";
    case "high": return "bg-risk-high text-white";
    case "medium": return "bg-risk-medium text-white";
    default: return "bg-risk-low text-white";
  }
}

function getElevationBarColor(elevation: number): string {
  if (elevation < 12) return "bg-risk-critical";
  if (elevation < 20) return "bg-risk-high";
  if (elevation < 30) return "bg-risk-medium";
  return "bg-risk-low";
}

interface ElevationHeatmapProps {
  onPointSelect?: (point: ElevationPoint) => void;
}

export function ElevationHeatmap({ onPointSelect }: ElevationHeatmapProps) {
  const sortedData = [...elevationData].sort((a, b) => a.elevation - b.elevation);
  const maxElevation = Math.max(...elevationData.map(p => p.elevation));

  return (
    <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-risk-high/20 to-risk-critical/20 border border-risk-high/30">
            <Mountain className="w-5 h-5 text-risk-high" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Elevation Analysis</h3>
            <p className="text-xs text-muted-foreground">DEM/LiDAR flood susceptibility</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          8 zones analyzed
        </Badge>
      </div>

      {/* Visual Heatmap */}
      <div className="mb-6">
        <div className="flex items-end justify-between gap-1 h-32 mb-2">
          {sortedData.map((point) => (
            <div
              key={point.id}
              className="flex-1 group cursor-pointer transition-all hover:opacity-80"
              onClick={() => onPointSelect?.(point)}
            >
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t-lg ${getElevationBarColor(point.elevation)} transition-all group-hover:ring-2 ring-primary`}
                  style={{ height: `${(point.elevation / maxElevation) * 100}%`, minHeight: "20%" }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {point.elevation}m
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-8">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Low (High Risk)
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            High (Safe)
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        {[
          { label: "Very High Risk", level: "very-high" },
          { label: "High Risk", level: "high" },
          { label: "Medium Risk", level: "medium" },
          { label: "Low Risk", level: "low" },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${getSusceptibilityColor(item.level)}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Zone List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedData.map((point) => (
          <div
            key={point.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            onClick={() => onPointSelect?.(point)}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${getSusceptibilityColor(point.floodSusceptibility)}`}>
              {point.elevation}m
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{point.name}</p>
              <p className="text-xs text-muted-foreground truncate">{point.description}</p>
            </div>
            <Badge variant="outline" className={`text-xs shrink-0 ${
              point.floodSusceptibility === "very-high" || point.floodSusceptibility === "high"
                ? "border-risk-critical/30 text-risk-critical"
                : "border-risk-low/30 text-risk-low"
            }`}>
              {point.floodSusceptibility.replace("-", " ")}
            </Badge>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-risk-critical">
            {elevationData.filter(p => p.floodSusceptibility === "very-high" || p.floodSusceptibility === "high").length}
          </p>
          <p className="text-xs text-muted-foreground">High Risk Zones</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {Math.min(...elevationData.map(p => p.elevation))}m
          </p>
          <p className="text-xs text-muted-foreground">Lowest Point</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-risk-low">
            {Math.max(...elevationData.map(p => p.elevation))}m
          </p>
          <p className="text-xs text-muted-foreground">Highest Point</p>
        </div>
      </div>
    </div>
  );
}

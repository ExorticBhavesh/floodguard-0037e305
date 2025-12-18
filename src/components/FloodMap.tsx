import { MapPin } from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface FloodMapProps {
  riskLevel: RiskLevel;
}

function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "bg-risk-low";
    case "medium":
      return "bg-risk-medium";
    case "high":
      return "bg-risk-high";
    case "critical":
      return "bg-risk-critical";
  }
}

function getRiskOpacity(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "opacity-30";
    case "medium":
      return "opacity-40";
    case "high":
      return "opacity-50";
    case "critical":
      return "opacity-60";
  }
}

export function FloodMap({ riskLevel }: FloodMapProps) {
  const bgColor = getRiskColor(riskLevel);
  const opacity = getRiskOpacity(riskLevel);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Map background using OpenStreetMap embed */}
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=72.5%2C22.95%2C72.65%2C23.1&layer=mapnik"
        className="w-full h-full border-0"
        title="Flood Zone Map"
      />
      
      {/* Risk Overlay Zones */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Zone - Highest Risk */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${bgColor} ${opacity} animate-pulse-slow`}
        />
        
        {/* Secondary Zones */}
        <div 
          className={`absolute top-1/3 left-2/3 w-20 h-20 rounded-full ${bgColor} opacity-30`}
        />
        <div 
          className={`absolute top-2/3 left-1/3 w-24 h-24 rounded-full ${bgColor} opacity-25`}
        />
        
        {/* Zone Labels */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${bgColor} text-white`}>
            <MapPin className="w-3 h-3" />
            Zone A
          </div>
        </div>
        <div className="absolute top-[30%] left-[65%]">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${bgColor} text-white opacity-80`}>
            Zone B
          </div>
        </div>
        <div className="absolute top-[65%] left-[30%]">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${bgColor} text-white opacity-80`}>
            Zone C
          </div>
        </div>
      </div>
      
      {/* Location Marker */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-card/90 backdrop-blur-sm rounded text-xs font-medium border border-border">
        Sabarmati River, Gujarat
      </div>
    </div>
  );
}

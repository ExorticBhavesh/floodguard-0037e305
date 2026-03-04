import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Filter, AlertTriangle, Mountain, MapPin, Users, Clock, Shield, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

type RiskFilter = "all" | "high" | "medium" | "low";

// India bounds for map locking
const INDIA_BOUNDS: L.LatLngBoundsExpression = [[6.5, 68.0], [37.0, 97.5]];
const INDIA_CENTER: [number, number] = [22.5, 79.0];

// Extended flood zones across India
const floodZonesGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Sabarmati Riverfront Zone A", riskLevel: "high", elevation: 12, population: 45000, ward: "Ward 12", readinessScore: 42, forecastWindow: "6-12h", safetyNote: "Move to higher ground. Avoid riverfront walkways." }, geometry: { type: "Polygon", coordinates: [[[72.57, 23.03], [72.59, 23.03], [72.59, 23.05], [72.57, 23.05], [72.57, 23.03]]] } },
    { type: "Feature", properties: { name: "Vasna-Barrage Zone", riskLevel: "high", elevation: 8, population: 32000, ward: "Ward 8", readinessScore: 28, forecastWindow: "3-6h", safetyNote: "CRITICAL: Evacuation recommended." }, geometry: { type: "Polygon", coordinates: [[[72.55, 23.00], [72.58, 23.00], [72.58, 23.02], [72.55, 23.02], [72.55, 23.00]]] } },
    { type: "Feature", properties: { name: "Kankaria Lake Vicinity", riskLevel: "medium", elevation: 18, population: 28000, ward: "Ward 15", readinessScore: 62, forecastWindow: "12-24h", safetyNote: "Monitor water levels." }, geometry: { type: "Polygon", coordinates: [[[72.59, 23.00], [72.62, 23.00], [72.62, 23.02], [72.59, 23.02], [72.59, 23.00]]] } },
    { type: "Feature", properties: { name: "Chandkheda Low-lying Area", riskLevel: "high", elevation: 10, population: 55000, ward: "Ward 3", readinessScore: 35, forecastWindow: "6-12h", safetyNote: "Low-lying area prone to waterlogging." }, geometry: { type: "Polygon", coordinates: [[[72.58, 23.10], [72.62, 23.10], [72.62, 23.12], [72.58, 23.12], [72.58, 23.10]]] } },
    { type: "Feature", properties: { name: "Maninagar Safe Zone", riskLevel: "low", elevation: 35, population: 72000, ward: "Ward 22", readinessScore: 91, forecastWindow: "24h+", safetyNote: "Low risk area." }, geometry: { type: "Polygon", coordinates: [[[72.60, 22.98], [72.64, 22.98], [72.64, 23.00], [72.60, 23.00], [72.60, 22.98]]] } },
    { type: "Feature", properties: { name: "Naranpura Residential", riskLevel: "medium", elevation: 20, population: 48000, ward: "Ward 7", readinessScore: 58, forecastWindow: "12-24h", safetyNote: "Moderate drainage capacity." }, geometry: { type: "Polygon", coordinates: [[[72.55, 23.05], [72.58, 23.05], [72.58, 23.07], [72.55, 23.07], [72.55, 23.05]]] } },
    { type: "Feature", properties: { name: "Mumbai Dharavi", riskLevel: "high", elevation: 5, population: 700000, ward: "Ward M-East", readinessScore: 22, forecastWindow: "3-6h", safetyNote: "Extremely flood-prone. Seek shelter immediately." }, geometry: { type: "Polygon", coordinates: [[[72.85, 19.04], [72.87, 19.04], [72.87, 19.06], [72.85, 19.06], [72.85, 19.04]]] } },
    { type: "Feature", properties: { name: "Patna Riverfront", riskLevel: "high", elevation: 6, population: 120000, ward: "Patna Zone 1", readinessScore: 31, forecastWindow: "6-12h", safetyNote: "Ganga flooding risk. Monitor dam releases." }, geometry: { type: "Polygon", coordinates: [[[85.10, 25.60], [85.15, 25.60], [85.15, 25.63], [85.10, 25.63], [85.10, 25.60]]] } },
    { type: "Feature", properties: { name: "Chennai Marina Coast", riskLevel: "medium", elevation: 3, population: 95000, ward: "Chennai Zone 9", readinessScore: 55, forecastWindow: "12-24h", safetyNote: "Cyclone season risk. Watch for storm surges." }, geometry: { type: "Polygon", coordinates: [[[80.27, 13.05], [80.30, 13.05], [80.30, 13.08], [80.27, 13.08], [80.27, 13.05]]] } },
    { type: "Feature", properties: { name: "Kolkata Howrah Bridge Zone", riskLevel: "medium", elevation: 9, population: 180000, ward: "Kolkata Ward 60", readinessScore: 48, forecastWindow: "12-24h", safetyNote: "Hooghly tidal flooding risk." }, geometry: { type: "Polygon", coordinates: [[[88.33, 22.58], [88.36, 22.58], [88.36, 22.60], [88.33, 22.60], [88.33, 22.58]]] } },
    { type: "Feature", properties: { name: "Bangalore Varthur Lake", riskLevel: "low", elevation: 28, population: 65000, ward: "BBMP Ward 150", readinessScore: 72, forecastWindow: "24h+", safetyNote: "Urban flooding only during extreme rainfall." }, geometry: { type: "Polygon", coordinates: [[[77.73, 12.94], [77.76, 12.94], [77.76, 12.96], [77.73, 12.96], [77.73, 12.94]]] } },
  ],
};

function getZoneColor(riskLevel: string): string {
  switch (riskLevel) {
    case "high": return "#ef4444";
    case "medium": return "#eab308";
    default: return "#22c55e";
  }
}

function MapController({ center, bounds }: { center: [number, number]; bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useState(() => {
    map.setView(center, 5);
    map.setMaxBounds(bounds);
    map.setMinZoom(4);
    map.setMaxZoom(18);
  });
  return null;
}

export default function FloodMapPage() {
  const { latitude, longitude, hasLocation } = useGeolocation();
  const { alerts } = useFloodAlerts();
  const [activeFilter, setActiveFilter] = useState<RiskFilter>("all");
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Always center on India
  const center: [number, number] = hasLocation && latitude! > 6 && latitude! < 37 && longitude! > 68 && longitude! < 98
    ? [latitude!, longitude!]
    : INDIA_CENTER;

  const filteredFeatures = {
    ...floodZonesGeoJSON,
    features: floodZonesGeoJSON.features.filter((f) =>
      activeFilter === "all" ? true : f.properties?.riskLevel === activeFilter
    ),
  };

  const zoneStyle = (feature: any) => ({
    fillColor: getZoneColor(feature?.properties?.riskLevel || "low"),
    weight: 2,
    opacity: 1,
    color: getZoneColor(feature?.properties?.riskLevel || "low"),
    fillOpacity: 0.4,
  });

  const onEachZone = (feature: any, layer: any) => {
    layer.on({
      click: () => setSelectedZone(feature.properties),
      mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.7 }),
      mouseout: (e: any) => e.target.setStyle({ fillOpacity: 0.4 }),
    });
  };

  const filters: { key: RiskFilter; label: string; color: string; count: number }[] = [
    { key: "all", label: "All", color: "bg-primary", count: floodZonesGeoJSON.features.length },
    { key: "high", label: "High", color: "bg-risk-critical", count: floodZonesGeoJSON.features.filter(f => f.properties?.riskLevel === "high").length },
    { key: "medium", label: "Moderate", color: "bg-risk-medium", count: floodZonesGeoJSON.features.filter(f => f.properties?.riskLevel === "medium").length },
    { key: "low", label: "Low", color: "bg-risk-low", count: floodZonesGeoJSON.features.filter(f => f.properties?.riskLevel === "low").length },
  ];

  return (
    <div className="min-h-screen pt-14 relative overflow-hidden">
      <AnimatedBackground variant="dashboard" />

      <div className="relative z-10 h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary shadow-sm">
              <Map className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">India Flood Risk Map</h1>
              <p className="text-xs text-muted-foreground">India-only GIS • Ward-level micro-hotspots</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {filters.map((f) => (
              <Button
                key={f.key}
                variant={activeFilter === f.key ? "default" : "outline"}
                size="sm"
                className="gap-1 h-7 text-[10px] flex-shrink-0"
                onClick={() => setActiveFilter(f.key)}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${f.color}`} />
                {f.label}
                <Badge variant="secondary" className="ml-0.5 h-3.5 text-[9px] px-1">{f.count}</Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }} className="z-0" maxBounds={INDIA_BOUNDS} minZoom={4}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={center} bounds={INDIA_BOUNDS} />

            <GeoJSON
              key={`zones-${activeFilter}-${Date.now()}`}
              data={filteredFeatures}
              style={zoneStyle}
              onEachFeature={onEachZone}
            />

            {hasLocation && (
              <Circle
                center={[latitude!, longitude!]}
                radius={500}
                pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.3 }}
              >
                <Popup><p className="font-semibold text-sm">Your Location</p></Popup>
              </Circle>
            )}

            {alerts.filter(a => a.latitude && a.longitude).map((alert) => (
              <Marker key={alert.id} position={[Number(alert.latitude), Number(alert.longitude)]}>
                <Popup>
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <p className="text-xs">{alert.severity.toUpperCase()}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 p-3 bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-lg z-[1000]">
            <p className="text-xs font-semibold mb-2">Risk Legend</p>
            <div className="space-y-1.5">
              {[
                { level: "High Risk", color: "#ef4444" },
                { level: "Moderate", color: "#eab308" },
                { level: "Low Risk", color: "#22c55e" },
              ].map((item) => (
                <div key={item.level} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Zone Detail Panel */}
          {selectedZone && (
            <div className="absolute top-4 right-4 w-72 sm:w-80 p-4 bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-xl z-[1000] animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">{selectedZone.name}</h3>
                <button onClick={() => setSelectedZone(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Badge className="mb-3" style={{ backgroundColor: getZoneColor(selectedZone.riskLevel) }}>
                {selectedZone.riskLevel?.toUpperCase()} RISK
              </Badge>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /><span>{selectedZone.ward}</span></div>
                <div className="flex items-center gap-2"><Mountain className="w-3.5 h-3.5 text-muted-foreground" /><span>Elevation: {selectedZone.elevation}m ASL</span></div>
                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-muted-foreground" /><span>Population: {selectedZone.population?.toLocaleString()}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span>Forecast: {selectedZone.forecastWindow}</span></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Readiness: <strong className={
                    selectedZone.readinessScore >= 80 ? "text-risk-low" :
                    selectedZone.readinessScore >= 50 ? "text-risk-medium" : "text-risk-critical"
                  }>{selectedZone.readinessScore}/100</strong></span>
                </div>
              </div>

              {selectedZone.safetyNote && (
                <div className="mt-3 p-2.5 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
                  <p className="text-xs flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-risk-medium flex-shrink-0 mt-0.5" />
                    {selectedZone.safetyNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

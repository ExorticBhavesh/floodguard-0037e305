import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, AlertTriangle, Mountain } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// GeoJSON flood zones for Ahmedabad region (sample data)
const floodZonesGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sabarmati Riverfront Zone A",
        riskLevel: "high",
        elevation: 12,
        population: 45000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.57, 23.03], [72.59, 23.03], [72.59, 23.05], [72.57, 23.05], [72.57, 23.03]]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Vasna-Barrage Zone",
        riskLevel: "critical",
        elevation: 8,
        population: 32000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.55, 23.00], [72.58, 23.00], [72.58, 23.02], [72.55, 23.02], [72.55, 23.00]]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kankaria Lake Vicinity",
        riskLevel: "medium",
        elevation: 18,
        population: 28000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.59, 23.00], [72.62, 23.00], [72.62, 23.02], [72.59, 23.02], [72.59, 23.00]]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Chandkheda Low-lying Area",
        riskLevel: "high",
        elevation: 10,
        population: 55000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.58, 23.10], [72.62, 23.10], [72.62, 23.12], [72.58, 23.12], [72.58, 23.10]]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Maninagar Safe Zone",
        riskLevel: "low",
        elevation: 35,
        population: 72000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.60, 22.98], [72.64, 22.98], [72.64, 23.00], [72.60, 23.00], [72.60, 22.98]]],
      },
    },
  ],
};

// Elevation data points (simulated DEM/LiDAR data)
const elevationPoints = [
  { lat: 23.02, lon: 72.57, elevation: 10, label: "River Basin" },
  { lat: 23.05, lon: 72.58, elevation: 15, label: "Riverfront" },
  { lat: 23.00, lon: 72.60, elevation: 25, label: "Mid-City" },
  { lat: 22.99, lon: 72.62, elevation: 35, label: "High Ground" },
  { lat: 23.08, lon: 72.60, elevation: 12, label: "North Basin" },
];

interface FloodMapInteractiveProps {
  showElevation?: boolean;
  showFloodZones?: boolean;
  showAlerts?: boolean;
  height?: string;
  onZoneClick?: (zone: any) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

function getZoneColor(riskLevel: string): string {
  switch (riskLevel) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#eab308";
    default: return "#22c55e";
  }
}

function getElevationColor(elevation: number): string {
  if (elevation < 12) return "#ef4444";
  if (elevation < 20) return "#f97316";
  if (elevation < 30) return "#eab308";
  return "#22c55e";
}

export function FloodMapInteractive({
  showElevation = true,
  showFloodZones = true,
  showAlerts = true,
  height = "400px",
  onZoneClick,
}: FloodMapInteractiveProps) {
  const { latitude, longitude, hasLocation } = useGeolocation();
  const { alerts } = useFloodAlerts();
  const [selectedZone, setSelectedZone] = useState<any>(null);
  
  const center: [number, number] = hasLocation 
    ? [latitude, longitude] 
    : [23.02, 72.58]; // Default to Ahmedabad

  const handleZoneClick = (feature: any) => {
    setSelectedZone(feature.properties);
    onZoneClick?.(feature.properties);
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
      click: () => handleZoneClick(feature),
      mouseover: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.7 });
      },
      mouseout: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.4 });
      },
    });

    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm">${feature.properties.name}</h3>
        <p class="text-xs text-muted-foreground mt-1">
          Risk: <span class="font-semibold" style="color: ${getZoneColor(feature.properties.riskLevel)}">${feature.properties.riskLevel.toUpperCase()}</span>
        </p>
        <p class="text-xs">Elevation: ${feature.properties.elevation}m</p>
        <p class="text-xs">Population: ${feature.properties.population.toLocaleString()}</p>
      </div>
    `);
  };

  // Memoize geoJSON key to prevent re-render issues
  const geoJsonKey = useMemo(() => `flood-zones-${Date.now()}`, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} />

        {showFloodZones && (
          <GeoJSON
            key={geoJsonKey}
            data={floodZonesGeoJSON}
            style={zoneStyle}
            onEachFeature={onEachZone}
          />
        )}

        {showElevation && elevationPoints.map((point, i) => (
          <Circle
            key={`elevation-${i}`}
            center={[point.lat, point.lon]}
            radius={300}
            pathOptions={{
              color: getElevationColor(point.elevation),
              fillColor: getElevationColor(point.elevation),
              fillOpacity: 0.5,
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold text-sm">{point.label}</p>
                <p className="text-xs">Elevation: {point.elevation}m ASL</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {showAlerts && alerts.filter(alert => alert.latitude && alert.longitude).map((alert) => (
          <Marker
            key={`alert-${alert.id}`}
            position={[Number(alert.latitude), Number(alert.longitude)]}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                <p className="text-xs mt-1">
                  Severity: <span className="font-semibold">{alert.severity.toUpperCase()}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {hasLocation && (
          <Circle
            key="user-location"
            center={[latitude, longitude]}
            radius={200}
            pathOptions={{
              color: "#0ea5e9",
              fillColor: "#0ea5e9",
              fillOpacity: 0.3,
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold text-sm">Your Location</p>
                <p className="text-xs text-muted-foreground">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Circle>
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-lg z-[1000]">
        <p className="text-xs font-semibold mb-2">Risk Zones</p>
        <div className="space-y-1.5">
          {[
            { level: "Critical", color: "#ef4444" },
            { level: "High", color: "#f97316" },
            { level: "Medium", color: "#eab308" },
            { level: "Low", color: "#22c55e" },
          ].map((item) => (
            <div key={item.level} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-xs">{item.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Zone Info */}
      {selectedZone && (
        <div className="absolute top-4 right-4 p-4 bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-lg z-[1000] max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm">{selectedZone.name}</h4>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-xs">
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" style={{ color: getZoneColor(selectedZone.riskLevel) }} />
              Risk: <span className="font-semibold" style={{ color: getZoneColor(selectedZone.riskLevel) }}>
                {selectedZone.riskLevel.toUpperCase()}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mountain className="w-3 h-3 text-muted-foreground" />
              Elevation: {selectedZone.elevation}m ASL
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              Population: {selectedZone.population.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

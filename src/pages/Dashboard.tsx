import { useState, useEffect, useCallback, useMemo } from "react";
import { MeshDashboard } from "@/components/mesh/MeshDashboard";
import {
  Droplets, CloudRain, Waves, AlertTriangle, Bell,
  TrendingUp, MapPin, Gauge, ThermometerSun,
  RefreshCw, Layers, Map, Mountain, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line,
} from "recharts";
import { FloodMapInteractive } from "@/components/FloodMapInteractive";
import { FloodMap } from "@/components/FloodMap";
import { WeatherWidget } from "@/components/WeatherWidget";
import { LocationBasedAlerts } from "@/components/LocationBasedAlerts";
import { PredictionPanel } from "@/components/PredictionPanel";
import { ElevationHeatmap } from "@/components/ElevationHeatmap";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { useFloodPrediction } from "@/hooks/useFloodPrediction";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Badge } from "@/components/ui/badge";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { LiveDataFeed } from "@/components/dashboard/LiveDataFeed";
import { ExportDropdown } from "@/components/ExportDropdown";
import { exportPredictionToCSV, exportPredictionToPDF } from "@/lib/exportUtils";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { supabase } from "@/integrations/supabase/client";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface ChartDataPoint {
  time: string;
  level: number;
  predicted: number;
}

// Simulated live sensor data generator
function generateSensorData() {
  return {
    rainfall: Math.round(5 + Math.random() * 80),
    waterLevel: +(2 + Math.random() * 6).toFixed(1),
    humidity: Math.round(50 + Math.random() * 45),
    soilMoisture: Math.round(30 + Math.random() * 60),
    elevation: Math.round(8 + Math.random() * 35),
  };
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(generateSensorData);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const { alerts, criticalCount, refetch: refetchAlerts } = useFloodAlerts();
  const { prediction, isLoading: isPredicting, predict, sendSMSAlert } = useFloodPrediction();
  const { latitude, longitude, hasLocation, locationName } = useGeolocation();

  // Compute risk level from probability using specified thresholds
  const computedRiskLevel: RiskLevel = useMemo(() => {
    const prob = prediction?.probability ?? Math.round((sensorData.rainfall / 150) * 50 + (sensorData.waterLevel / 10) * 50);
    if (prob >= 85) return "critical";
    if (prob >= 50) return "medium";
    return "low";
  }, [prediction?.probability, sensorData.rainfall, sensorData.waterLevel]);

  // Generate chart data once
  useEffect(() => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      const baseLevel = 3 + Math.sin(i / 4) * 1.5;
      data.push({
        time: time.getHours().toString().padStart(2, "0") + ":00",
        level: Math.max(0, baseLevel + Math.random() * 0.8 - 0.4),
        predicted: Math.max(0, baseLevel + 0.3 + Math.random() * 0.5),
      });
    }
    setChartData(data);
  }, []);

  // Auto-refresh sensors every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateSensorData();
      setSensorData(newData);
      refetchAlerts();
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchAlerts]);

  // Auto-predict whenever sensor data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      predict({
        rainfall: sensorData.rainfall,
        riverLevel: sensorData.waterLevel,
        humidity: sensorData.humidity,
        elevation: sensorData.elevation,
        soilMoisture: sensorData.soilMoisture,
        lat: hasLocation ? latitude! : undefined,
        lon: hasLocation ? longitude! : undefined,
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [sensorData, hasLocation, latitude, longitude, predict]);

  const handleSendAlert = useCallback(async () => {
    // Retrieve emergency contact from stored profile
    const stored = localStorage.getItem("floodguard_profile");
    let emergencyContact: string | undefined;
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        emergencyContact = profile.emergencyContact;
        // Also try DB for latest
        if (profile.phone) {
          const { data } = await supabase
            .from("app_users")
            .select("emergency_contact")
            .eq("phone", profile.phone)
            .maybeSingle();
          if (data?.emergency_contact) emergencyContact = data.emergency_contact;
        }
      } catch {}
    }

    const location = hasLocation ? `${latitude!.toFixed(4)}, ${longitude!.toFixed(4)}` : locationName || "India";
    await sendSMSAlert(computedRiskLevel, location, emergencyContact ? [emergencyContact] : undefined);
  }, [computedRiskLevel, hasLocation, latitude, longitude, locationName, sendSMSAlert]);

  const handleManualRefresh = useCallback(() => {
    const newData = generateSensorData();
    setSensorData(newData);
    refetchAlerts();
    setLastRefresh(new Date());
    toast({ title: "Data Refreshed", description: "All sensors and predictions updated" });
  }, [refetchAlerts]);

  const sensorCards = [
    { icon: CloudRain, label: "Rainfall", value: `${sensorData.rainfall}mm`, color: "text-primary" },
    { icon: Waves, label: "River Level", value: `${sensorData.waterLevel}m`, color: "text-primary" },
    { icon: Gauge, label: "Humidity", value: `${sensorData.humidity}%`, color: "text-primary" },
    { icon: ThermometerSun, label: "Soil Moisture", value: `${sensorData.soilMoisture}%`, color: "text-risk-medium" },
    { icon: Mountain, label: "Elevation", value: `${sensorData.elevation}m`, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen pt-14 pb-6 relative overflow-hidden">
      <AnimatedBackground variant="dashboard" />

      {computedRiskLevel === "critical" && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-risk-critical/10 rounded-full blur-[180px] animate-pulse" />
        </div>
      )}

      <div className="px-4 relative z-10 max-w-5xl mx-auto">
        {/* Hero Header */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-primary shadow-sm">
                  <Droplets className="w-4 h-4 text-primary-foreground" />
                </div>
                National Flood Intelligence Grid
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-risk-low" />
                </span>
                Live Monitoring Active
              </span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{lastRefresh.toLocaleTimeString()}</span>
              {locationName && (
                <>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-primary flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />{locationName}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] gap-1 hidden sm:flex">
              <Brain className="w-3 h-3" /> AI Powered
            </Badge>
            {prediction && (
              <ExportDropdown
                onExportCSV={() => exportPredictionToCSV(prediction, hasLocation ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'India')}
                onExportPDF={() => exportPredictionToPDF(prediction, hasLocation ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'India')}
                label=""
                size="sm"
              />
            )}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleManualRefresh}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Live Sensor Feed - TOP - Horizontal scroll */}
        <div className="mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {sensorCards.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-28 sm:w-32 p-3 rounded-xl bg-card/80 border border-border/50 text-center hover:border-primary/30 transition-colors">
                <item.icon className={`w-4 h-4 mx-auto mb-1.5 ${item.color}`} />
                <div className="text-sm font-bold tabular-nums">{item.value}</div>
                <div className="text-[9px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 2-col, Mobile: stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Risk Gauge */}
            <RiskGauge
              riskLevel={computedRiskLevel}
              probability={prediction?.probability || Math.round((sensorData.rainfall / 150) * 50 + (sensorData.waterLevel / 10) * 50)}
            />

            {/* ML Prediction - auto from live sensors, no manual input */}
            <PredictionPanel
              rainfall={sensorData.rainfall}
              riverLevel={sensorData.waterLevel}
              humidity={sensorData.humidity}
              elevation={sensorData.elevation}
              soilMoisture={sensorData.soilMoisture}
              autoPredict={true}
              lat={hasLocation ? latitude! : undefined}
              lon={hasLocation ? longitude! : undefined}
            />

            {/* SMS Alert Button */}
            <Button
              className={`w-full gap-2 h-11 font-bold ${
                computedRiskLevel === "critical"
                  ? "bg-risk-critical hover:bg-risk-critical/90 animate-pulse"
                  : "bg-primary hover:bg-primary/90"
              }`}
              onClick={handleSendAlert}
            >
              <Bell className="w-4 h-4" />
              Send Emergency SMS Alert
            </Button>

            {/* Weather */}
            <WeatherWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Water Level Chart */}
            <div className="pro-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-xs font-semibold">Water Level Trends (24h)</h3>
                <span className="ml-auto text-[10px] text-risk-low font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />Live
                </span>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(170, 100%, 44%)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="hsl(170, 100%, 44%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 20%)" />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(210, 10%, 40%)" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(210, 10%, 40%)" domain={[0, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(210, 25%, 12%)", border: "1px solid hsl(210, 20%, 20%)", borderRadius: "8px", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="level" stroke="hsl(170, 100%, 44%)" strokeWidth={2} fill="url(#colorLevel)" name="Actual" />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Nearby Alerts */}
            <LocationBasedAlerts maxAlerts={3} maxDistance={100} />

            {/* India-wide Flood Alert Centre */}
            <div className="pro-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-risk-critical/10">
                  <AlertTriangle className="w-3.5 h-3.5 text-risk-critical" />
                </div>
                <h3 className="text-xs font-semibold">Flood Alert Centre (India)</h3>
                <Badge variant="outline" className="ml-auto text-[10px]">{alerts.length} Active</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {alerts.slice(0, 8).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.severity === "critical" ? "bg-risk-critical animate-pulse" :
                      alert.severity === "high" ? "bg-risk-high" :
                      alert.severity === "medium" ? "bg-risk-medium" : "bg-risk-low"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium truncate block">{alert.title}</span>
                      <span className="text-[10px] text-muted-foreground">{alert.location}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${
                      alert.severity === "critical" ? "text-risk-critical" :
                      alert.severity === "high" ? "text-risk-high" :
                      alert.severity === "medium" ? "text-risk-medium" : "text-risk-low"
                    }`}>{alert.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width: GIS Map / Quick View / Elevation tabs */}
        <div className="mt-4 space-y-4">
          <Tabs defaultValue="gis-map" className="w-full">
            <TabsList className="mb-2 h-9">
              <TabsTrigger value="gis-map" className="gap-1.5 text-xs">
                <Map className="w-3.5 h-3.5" />GIS Map
              </TabsTrigger>
              <TabsTrigger value="quick-view" className="gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5" />Quick View
              </TabsTrigger>
              <TabsTrigger value="elevation" className="gap-1.5 text-xs">
                <Mountain className="w-3.5 h-3.5" />Elevation Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gis-map" className="mt-0">
              <div className="pro-card p-3">
                <FloodMapInteractive showElevation={true} showFloodZones={true} showAlerts={true} height="350px" />
              </div>
            </TabsContent>
            <TabsContent value="quick-view" className="mt-0">
              <div className="pro-card p-3">
                <div className="h-52 rounded-lg overflow-hidden">
                  <FloodMap riskLevel={computedRiskLevel} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="elevation" className="mt-0">
              <ElevationHeatmap />
            </TabsContent>
          </Tabs>

          {/* Mesh Network */}
          <MeshDashboard />

          {/* Live Data Feed */}
          <LiveDataFeed />
        </div>
      </div>
    </div>
  );
}

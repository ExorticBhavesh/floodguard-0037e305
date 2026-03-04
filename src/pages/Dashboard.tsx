import { useState, useEffect, useCallback } from "react";
import { MeshDashboard } from "@/components/mesh/MeshDashboard";
import {
  Droplets, CloudRain, Waves, AlertTriangle, Bell,
  TrendingUp, Activity, MapPin, Gauge, ThermometerSun,
  RefreshCw, Layers, Map, Mountain, Download, Shield, Brain, Cpu, Satellite,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line,
} from "recharts";
import { FloodMap } from "@/components/FloodMap";
import { FloodMapInteractive } from "@/components/FloodMapInteractive";
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
import { SystemStatusMini } from "@/components/dashboard/SystemStatusMini";
import { ExportDropdown } from "@/components/ExportDropdown";
import { exportPredictionToCSV, exportPredictionToPDF } from "@/lib/exportUtils";
import { AnimatedBackground } from "@/components/AnimatedBackground";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface ChartDataPoint {
  time: string;
  level: number;
  predicted: number;
}

export default function Dashboard() {
  const [rainfall, setRainfall] = useState(25);
  const [waterLevel, setWaterLevel] = useState(4);
  const [humidity, setHumidity] = useState(70);
  const [soilMoisture, setSoilMoisture] = useState(50);
  const [elevation, setElevation] = useState(20);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const { alerts, criticalCount, highCount, refetch: refetchAlerts } = useFloodAlerts();
  const { prediction, isLoading: isPredicting, predict, sendSMSAlert } = useFloodPrediction();
  const { latitude, longitude, hasLocation, locationName } = useGeolocation();

  const riskLevel: RiskLevel = prediction?.riskLevel || "low";

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

  useEffect(() => {
    setChartData((prev) => {
      if (!prev.length) return prev;
      const newData = [...prev];
      newData[newData.length - 1] = {
        ...newData[newData.length - 1],
        level: waterLevel,
        predicted: prediction?.predictedWaterLevel || waterLevel + 0.3 + Math.random() * 0.5,
      };
      return newData;
    });
  }, [waterLevel, prediction?.predictedWaterLevel]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refetchAlerts();
      setLastRefresh(new Date());
      setHumidity(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
      setSoilMoisture(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)));
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetchAlerts]);

  const handleSendAlert = useCallback(async () => {
    const location = hasLocation ? `${latitude!.toFixed(4)}, ${longitude!.toFixed(4)}` : "Ahmedabad, Gujarat";
    await sendSMSAlert(riskLevel, location);
  }, [riskLevel, hasLocation, latitude, longitude, sendSMSAlert]);

  const handleManualRefresh = useCallback(() => {
    refetchAlerts();
    setLastRefresh(new Date());
    toast({ title: "Data Refreshed", description: "All sensors and predictions updated" });
  }, [refetchAlerts]);

  return (
    <div className="min-h-screen pt-14 pb-6 relative overflow-hidden">
      <AnimatedBackground variant="dashboard" />

      {riskLevel === "critical" && (
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
                onExportCSV={() => exportPredictionToCSV(prediction, hasLocation ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'Ahmedabad')}
                onExportPDF={() => exportPredictionToPDF(prediction, hasLocation ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'Ahmedabad')}
                label=""
                size="sm"
              />
            )}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleManualRefresh}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Live Sensor Feed - Horizontal scroll */}
        <div className="mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { icon: CloudRain, label: "Rainfall", value: `${rainfall}mm`, color: "text-primary" },
              { icon: Waves, label: "River Level", value: `${waterLevel.toFixed(1)}m`, color: "text-primary" },
              { icon: Gauge, label: "Humidity", value: `${humidity.toFixed(0)}%`, color: "text-primary" },
              { icon: ThermometerSun, label: "Soil Moisture", value: `${soilMoisture.toFixed(0)}%`, color: "text-risk-medium" },
              { icon: Mountain, label: "Elevation", value: `${elevation}m`, color: "text-primary" },
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-28 sm:w-32 p-3 rounded-xl bg-card/80 border border-border/50 text-center hover:border-primary/30 transition-colors">
                <item.icon className={`w-4 h-4 mx-auto mb-1.5 ${item.color}`} />
                <div className="text-sm font-bold tabular-nums">{item.value}</div>
                <div className="text-[9px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 2-col layout, Mobile: stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Risk Gauge */}
            <RiskGauge
              riskLevel={riskLevel}
              probability={prediction?.probability || Math.round((rainfall / 150) * 50 + (waterLevel / 10) * 50)}
            />

            {/* Sensor Controls */}
            <div className="pro-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-primary" />
                Data Input Panel
              </h3>
              <div className="space-y-3">
                {[
                  { icon: CloudRain, label: "Rainfall", value: rainfall, setter: setRainfall, max: 150, unit: "mm" },
                  { icon: Waves, label: "River Level", value: waterLevel, setter: setWaterLevel, max: 10, step: 0.1, unit: "m" },
                  { icon: Gauge, label: "Humidity", value: humidity, setter: setHumidity, max: 100, unit: "%" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium flex items-center gap-1"><item.icon className="w-3 h-3 text-primary" />{item.label}</label>
                      <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {typeof item.value === 'number' && item.step ? item.value.toFixed(1) : item.value}{item.unit}
                      </span>
                    </div>
                    <Slider value={[item.value]} onValueChange={(v) => item.setter(v[0])} max={item.max} step={item.step || 1} />
                  </div>
                ))}
              </div>
            </div>

            {/* ML Prediction */}
            <PredictionPanel
              rainfall={rainfall}
              riverLevel={waterLevel}
              humidity={humidity}
              elevation={elevation}
              soilMoisture={soilMoisture}
              autoPredict={true}
              lat={hasLocation ? latitude! : undefined}
              lon={hasLocation ? longitude! : undefined}
            />

            {/* SMS Alert Button */}
            <Button
              className={`w-full gap-2 h-11 font-bold ${
                riskLevel === "critical" || riskLevel === "high"
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

            {/* Elevation Analysis */}
            <ElevationHeatmap />

            {/* System Health */}
            <SystemStatusMini />
          </div>
        </div>

        {/* Full-width sections */}
        <div className="mt-4 space-y-4">
          {/* GIS Map */}
          <Tabs defaultValue="interactive-map" className="w-full">
            <TabsList className="mb-2 h-8">
              <TabsTrigger value="interactive-map" className="gap-1 text-[10px]">
                <Map className="w-3 h-3" />GIS Map
              </TabsTrigger>
              <TabsTrigger value="simple-map" className="gap-1 text-[10px]">
                <Layers className="w-3 h-3" />Quick View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="interactive-map" className="mt-0">
              <div className="pro-card p-3">
                <FloodMapInteractive showElevation={true} showFloodZones={true} showAlerts={true} height="350px" />
              </div>
            </TabsContent>
            <TabsContent value="simple-map" className="mt-0">
              <div className="pro-card p-3">
                <div className="h-52 rounded-lg overflow-hidden">
                  <FloodMap riskLevel={riskLevel} />
                </div>
              </div>
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

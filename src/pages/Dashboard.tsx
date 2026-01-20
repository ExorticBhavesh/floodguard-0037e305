import { useState, useEffect, useCallback } from "react";
import {
  Droplets,
  CloudRain,
  Waves,
  AlertTriangle,
  Bell,
  TrendingUp,
  Activity,
  MapPin,
  Zap,
  Gauge,
  ThermometerSun,
  RefreshCw,
  Layers,
  Map,
  Mountain,
  BarChart3,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { FloodMap } from "@/components/FloodMap";
import { FloodMapInteractive } from "@/components/FloodMapInteractive";
import { WeatherWidget } from "@/components/WeatherWidget";
import { LocationBasedAlerts } from "@/components/LocationBasedAlerts";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { PredictionPanel } from "@/components/PredictionPanel";
import { ElevationHeatmap } from "@/components/ElevationHeatmap";
import { SystemHealthCheck } from "@/components/SystemHealthCheck";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { useFloodPrediction } from "@/hooks/useFloodPrediction";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Badge } from "@/components/ui/badge";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface ChartDataPoint {
  time: string;
  level: number;
  predicted: number;
}

function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "text-risk-low";
    case "medium":
      return "text-risk-medium";
    case "high":
      return "text-risk-high";
    case "critical":
      return "text-risk-critical";
  }
}

function getRiskBgColor(risk: RiskLevel): string {
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

function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "LOW";
    case "medium":
      return "MEDIUM";
    case "high":
      return "HIGH";
    case "critical":
      return "CRITICAL";
  }
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
  const { latitude, longitude, hasLocation } = useGeolocation();

  // Get current risk level from prediction or calculate locally
  const riskLevel: RiskLevel = prediction?.riskLevel || "low";

  // Generate initial chart data
  useEffect(() => {
    const generateData = () => {
      const data: ChartDataPoint[] = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseLevel = 3 + Math.sin(i / 4) * 1.5;
        data.push({
          time: time.getHours().toString().padStart(2, "0") + ":00",
          level: Math.max(0, baseLevel + Math.random() * 0.8 - 0.4),
          predicted: Math.max(0, baseLevel + 0.3 + Math.random() * 0.5),
        });
      }
      return data;
    };
    setChartData(generateData());
  }, []);

  // Update chart when water level changes
  useEffect(() => {
    setChartData((prev) => {
      if (prev.length === 0) return prev;
      const newData = [...prev];
      newData[newData.length - 1] = {
        ...newData[newData.length - 1],
        level: waterLevel,
        predicted: prediction?.predictedWaterLevel || waterLevel + 0.3 + Math.random() * 0.5,
      };
      return newData;
    });
  }, [waterLevel, prediction?.predictedWaterLevel]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchAlerts();
      setLastRefresh(new Date());
      
      // Simulate slight variations in sensor readings
      setHumidity(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
      setSoilMoisture(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)));
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchAlerts]);

  const handleSendAlert = useCallback(async () => {
    const location = hasLocation 
      ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      : "Ahmedabad, Gujarat";
    
    await sendSMSAlert(riskLevel, location);
  }, [riskLevel, hasLocation, latitude, longitude, sendSMSAlert]);

  const handleManualRefresh = useCallback(() => {
    refetchAlerts();
    setLastRefresh(new Date());
    toast({
      title: "Data Refreshed",
      description: "All sensors and predictions updated",
    });
  }, [refetchAlerts]);

  return (
    <div className="min-h-screen pt-14 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px]" />
        {riskLevel === "critical" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-risk-critical/3 rounded-full blur-[180px] animate-pulse" />
        )}
      </div>

      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-card/95 backdrop-blur-sm border-r border-border p-5 lg:min-h-[calc(100vh-3.5rem)]">
          <div className="lg:sticky lg:top-18 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                <Activity className="w-4 h-4 text-primary" />
                Controls
              </h2>
              <PushNotificationToggle variant="compact" />
            </div>

            {/* Rainfall Slider */}
            <div className="control-panel">
              <div className="flex items-center justify-between">
                <label className="control-label">
                  <CloudRain className="w-4 h-4 text-primary" />
                  Rainfall Intensity
                </label>
                <span className="control-value">{rainfall} mm</span>
              </div>
              <Slider
                value={[rainfall]}
                onValueChange={(v) => setRainfall(v[0])}
                max={150}
                step={1}
                className="mt-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 mm</span>
                <span>150 mm</span>
              </div>
            </div>

            {/* Water Level Slider */}
            <div className="control-panel">
              <div className="flex items-center justify-between">
                <label className="control-label">
                  <Waves className="w-4 h-4 text-primary" />
                  River Water Level
                </label>
                <span className="control-value">{waterLevel.toFixed(1)} m</span>
              </div>
              <Slider
                value={[waterLevel]}
                onValueChange={(v) => setWaterLevel(v[0])}
                max={10}
                step={0.1}
                className="mt-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 m</span>
                <span>10 m</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="control-panel">
              <div className="flex items-center justify-between">
                <label className="control-label">
                  <Gauge className="w-4 h-4 text-primary" />
                  Humidity
                </label>
                <span className="control-value">{humidity.toFixed(0)}%</span>
              </div>
              <Slider
                value={[humidity]}
                onValueChange={(v) => setHumidity(v[0])}
                max={100}
                step={1}
                className="mt-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Sensor Readings
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="stat-card p-3 text-center">
                  <ThermometerSun className="w-4 h-4 mx-auto mb-1 text-risk-medium" />
                  <div className="text-base font-bold">{soilMoisture.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Soil Moisture</div>
                </div>
                <div className="stat-card p-3 text-center">
                  <Mountain className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-base font-bold">{elevation}m</div>
                  <div className="text-xs text-muted-foreground">Elevation</div>
                </div>
              </div>
            </div>

            {/* Nearby Alerts */}
            <LocationBasedAlerts maxAlerts={2} maxDistance={50} />
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gradient-primary shadow-sm">
                  <Droplets className="w-5 h-5 text-primary-foreground" />
                </div>
                Live Monitoring
              </h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                Real-time flood risk assessment • Updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(criticalCount > 0 || highCount > 0) && (
                <div className="px-2.5 py-1 rounded-lg bg-risk-critical/10 text-risk-critical text-xs font-medium animate-pulse">
                  {criticalCount + highCount} Active Warnings
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                className="gap-1.5 h-8"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={handleSendAlert}
                className={`gap-1.5 h-8 shadow-sm ${
                  riskLevel === "critical" || riskLevel === "high"
                    ? "bg-risk-critical hover:bg-risk-critical/90 animate-pulse"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                Send SMS Alert
              </Button>
            </div>
          </div>

          {/* ML Prediction Panel - Full Width */}
          <div className="mb-5">
            <PredictionPanel
              rainfall={rainfall}
              riverLevel={waterLevel}
              humidity={humidity}
              elevation={elevation}
              soilMoisture={soilMoisture}
              autoPredict={true}
              lat={hasLocation ? latitude : undefined}
              lon={hasLocation ? longitude : undefined}
            />
          </div>

          {/* Weather Widget & Chart Grid */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Water Level Trend Chart */}
            <div className="pro-card p-5">
              <div className="section-header">
                <div className="section-icon">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="section-title">Water Level Trends (24h)</h3>
                <span className="ml-auto pro-badge bg-risk-low/10 text-risk-low">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                  Live
                </span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10 }}
                      stroke="hsl(220, 9%, 46%)"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      stroke="hsl(220, 9%, 46%)"
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 13%, 91%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="level"
                      stroke="hsl(200, 98%, 39%)"
                      strokeWidth={2}
                      fill="url(#colorLevel)"
                      name="Actual Level"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Predicted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-5 mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-risk-medium" style={{ borderStyle: "dashed" }} />
                  <span className="text-muted-foreground">Predicted</span>
                </div>
              </div>
            </div>
          </div>

          {/* GIS Map & Elevation Tabs */}
          <div className="mb-5">
            <Tabs defaultValue="interactive-map" className="w-full">
              <TabsList className="mb-3 h-9">
                <TabsTrigger value="interactive-map" className="gap-1.5 text-xs">
                  <Map className="w-3.5 h-3.5" />
                  Interactive GIS Map
                </TabsTrigger>
                <TabsTrigger value="elevation" className="gap-1.5 text-xs">
                  <Mountain className="w-3.5 h-3.5" />
                  Elevation Analysis
                </TabsTrigger>
                <TabsTrigger value="simple-map" className="gap-1.5 text-xs">
                  <Layers className="w-3.5 h-3.5" />
                  Quick View
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="interactive-map" className="mt-0">
                <div className="pro-card p-5">
                  <div className="section-header">
                    <div className="section-icon">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="section-title">Interactive Flood Zone Map</h3>
                    <Badge variant="outline" className="ml-auto gap-1 text-xs">
                      <Layers className="w-3 h-3" />
                      GeoJSON + LiDAR
                    </Badge>
                  </div>
                  <FloodMapInteractive
                    showElevation={true}
                    showFloodZones={true}
                    showAlerts={true}
                    height="400px"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="elevation" className="mt-0">
                <ElevationHeatmap />
              </TabsContent>
              
              <TabsContent value="simple-map" className="mt-0">
                <div className="pro-card p-5">
                  <div className="section-header">
                    <div className="section-icon">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="section-title">Flood Zone Map</h3>
                    <span className="ml-auto pro-badge-muted">Quick View</span>
                  </div>
                  <div className="h-56 rounded-lg overflow-hidden">
                    <FloodMap riskLevel={riskLevel} />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-risk-critical" />
                      <span className="text-muted-foreground">High Risk</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-risk-medium" />
                      <span className="text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-risk-low" />
                      <span className="text-muted-foreground">Low</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* System Health & Recent Alerts Grid */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* System Health Check */}
            <SystemHealthCheck />

            {/* Recent Alerts */}
            <div className="pro-card p-5">
              <div className="section-header">
                <div className="section-icon">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="section-title">Recent System Alerts</h3>
              </div>
              <div className="space-y-2">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        alert.severity === "critical"
                          ? "bg-risk-critical animate-pulse"
                          : alert.severity === "high"
                          ? "bg-risk-high"
                          : alert.severity === "medium"
                          ? "bg-risk-medium"
                          : "bg-risk-low"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">{alert.title}</span>
                      <span className="text-xs text-muted-foreground">{alert.location}</span>
                    </div>
                    <span className={`text-xs font-semibold uppercase ${
                      alert.severity === "critical" ? "text-risk-critical" :
                      alert.severity === "high" ? "text-risk-high" :
                      alert.severity === "medium" ? "text-risk-medium" : "text-risk-low"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recent alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

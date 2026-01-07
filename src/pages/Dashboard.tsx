import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
import { WeatherWidget } from "@/components/WeatherWidget";
import { LocationBasedAlerts } from "@/components/LocationBasedAlerts";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface ChartDataPoint {
  time: string;
  level: number;
  predicted: number;
}

function calculateRiskLevel(rainfall: number, waterLevel: number): RiskLevel {
  const score = rainfall * 0.4 + waterLevel * 6;
  if (score < 30) return "low";
  if (score < 50) return "medium";
  if (score < 70) return "high";
  return "critical";
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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const { alerts, criticalCount, highCount } = useFloodAlerts();

  const riskLevel = calculateRiskLevel(rainfall, waterLevel);

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
        predicted: waterLevel + 0.3 + Math.random() * 0.5,
      };
      return newData;
    });
  }, [waterLevel]);

  const handleSendAlert = () => {
    toast({
      title: "Emergency Alert Sent",
      description: `Alert Sent via Twilio to Local Authorities: ${getRiskLabel(riskLevel)} Risk Level Detected`,
      variant: riskLevel === "critical" || riskLevel === "high" ? "destructive" : "default",
    });
  };

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        {riskLevel === "critical" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-risk-critical/5 rounded-full blur-[200px] animate-pulse" />
        )}
      </div>

      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-card/80 backdrop-blur-sm border-r border-border p-6 lg:min-h-[calc(100vh-4rem)]">
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Controls
              </h2>
              <PushNotificationToggle variant="compact" />
            </div>

            {/* Rainfall Slider */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-primary" />
                  Rainfall Intensity
                </label>
                <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                  {rainfall} mm
                </span>
              </div>
              <Slider
                value={[rainfall]}
                onValueChange={(v) => setRainfall(v[0])}
                max={150}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 mm</span>
                <span>150 mm</span>
              </div>
            </div>

            {/* Water Level Slider */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Waves className="w-4 h-4 text-primary" />
                  River Water Level
                </label>
                <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                  {waterLevel.toFixed(1)} m
                </span>
              </div>
              <Slider
                value={[waterLevel]}
                onValueChange={(v) => setWaterLevel(v[0])}
                max={10}
                step={0.1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 m</span>
                <span>10 m</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Sensor Readings
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-card border border-border text-center">
                  <ThermometerSun className="w-4 h-4 mx-auto mb-1 text-risk-medium" />
                  <div className="text-lg font-bold">78%</div>
                  <div className="text-xs text-muted-foreground">Soil Moisture</div>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border text-center">
                  <Gauge className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">85%</div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </div>
              </div>
            </div>

            {/* Nearby Alerts */}
            <LocationBasedAlerts maxAlerts={2} maxDistance={50} />
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
                  <Droplets className="w-6 h-6 text-primary-foreground" />
                </div>
                Live Monitoring
              </h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                Real-time flood risk assessment • Auto-updating
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(criticalCount > 0 || highCount > 0) && (
                <div className="px-3 py-1.5 rounded-full bg-risk-critical/10 text-risk-critical text-sm font-medium animate-pulse">
                  {criticalCount + highCount} Active Warnings
                </div>
              )}
              <Button
                onClick={handleSendAlert}
                className={`gap-2 shadow-lg ${
                  riskLevel === "critical" || riskLevel === "high"
                    ? "bg-risk-critical hover:bg-risk-critical/90 animate-pulse"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <Bell className="w-4 h-4" />
                Send SMS Alert
              </Button>
            </div>
          </div>

          {/* Risk Status Card */}
          <div
            className={`p-6 rounded-3xl mb-6 border-2 transition-all duration-500 backdrop-blur-sm ${
              riskLevel === "low"
                ? "bg-risk-low/5 border-risk-low/30"
                : riskLevel === "medium"
                ? "bg-risk-medium/5 border-risk-medium/30"
                : riskLevel === "high"
                ? "bg-risk-high/5 border-risk-high/30"
                : "bg-risk-critical/5 border-risk-critical/30 animate-pulse-slow"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${getRiskBgColor(
                    riskLevel
                  )} ${riskLevel === "critical" ? "animate-pulse" : ""}`}
                >
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Current Flood Risk Level
                  </p>
                  <p className={`text-4xl font-bold ${getRiskColor(riskLevel)}`}>
                    {getRiskLabel(riskLevel)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-8">
                <div className="text-center p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
                  <CloudRain className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{rainfall} mm</p>
                  <p className="text-xs text-muted-foreground">Rainfall</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
                  <Waves className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{waterLevel.toFixed(1)} m</p>
                  <p className="text-xs text-muted-foreground">Water Level</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-risk-high" />
                  <p className="text-2xl font-bold">
                    {riskLevel === "low"
                      ? "15%"
                      : riskLevel === "medium"
                      ? "45%"
                      : riskLevel === "high"
                      ? "72%"
                      : "94%"}
                  </p>
                  <p className="text-xs text-muted-foreground">Probability</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget & Chart Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Water Level Trend Chart */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Water Level Trends (24h)
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-risk-low/10 text-risk-low font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                  Live
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10 }}
                      stroke="hsl(215, 15%, 45%)"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      stroke="hsl(215, 15%, 45%)"
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(214, 25%, 90%)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="level"
                      stroke="hsl(199, 89%, 48%)"
                      strokeWidth={2}
                      fill="url(#colorLevel)"
                      name="Actual Level"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(45, 93%, 47%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Predicted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-3 text-xs">
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

          {/* Map & Recent Alerts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Flood Zone Map
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted font-medium">
                  Interactive
                </span>
              </div>
              <div className="h-64 rounded-xl overflow-hidden">
                <FloodMap riskLevel={riskLevel} />
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-critical" />
                  <span className="text-muted-foreground">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-medium" />
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Low</span>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Recent System Alerts
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert, i) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
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
                    <span className={`text-xs font-bold uppercase ${
                      alert.severity === "critical" ? "text-risk-critical" :
                      alert.severity === "high" ? "text-risk-high" :
                      alert.severity === "medium" ? "text-risk-medium" : "text-risk-low"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
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

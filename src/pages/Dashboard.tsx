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
    <div className="min-h-screen pt-16">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-card border-r border-border p-6 lg:min-h-[calc(100vh-4rem)]">
          <div className="lg:sticky lg:top-20">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Simulation Controls
            </h2>

            {/* Rainfall Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-primary" />
                  Rainfall Intensity
                </label>
                <span className="text-sm font-mono font-bold text-primary">
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Waves className="w-4 h-4 text-primary" />
                  River Water Level
                </label>
                <span className="text-sm font-mono font-bold text-primary">
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
            <div className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Current Readings
              </h3>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Soil Moisture</span>
                <span className="font-mono text-sm font-medium">78%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Humidity</span>
                <span className="font-mono text-sm font-medium">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Wind Speed</span>
                <span className="font-mono text-sm font-medium">12 km/h</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Droplets className="w-6 h-6 text-primary" />
                Live Monitoring Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time flood risk assessment • Last updated: Just now
              </p>
            </div>
            <Button
              onClick={handleSendAlert}
              className={`gap-2 ${
                riskLevel === "critical" || riskLevel === "high"
                  ? "bg-risk-critical hover:bg-risk-critical/90"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              <Bell className="w-4 h-4" />
              Send Emergency SMS
            </Button>
          </div>

          {/* Risk Status Card */}
          <div
            className={`p-6 rounded-2xl mb-6 border-2 transition-all duration-500 ${
              riskLevel === "low"
                ? "bg-risk-low/5 border-risk-low/30"
                : riskLevel === "medium"
                ? "bg-risk-medium/5 border-risk-medium/30"
                : riskLevel === "high"
                ? "bg-risk-high/5 border-risk-high/30"
                : "bg-risk-critical/5 border-risk-critical/30 animate-pulse-slow"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getRiskBgColor(
                    riskLevel
                  )}`}
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Current Risk Level
                  </p>
                  <p className={`text-3xl font-bold ${getRiskColor(riskLevel)}`}>
                    {getRiskLabel(riskLevel)}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                  <p className="text-xl font-bold">{rainfall} mm</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Water Level</p>
                  <p className="text-xl font-bold">{waterLevel.toFixed(1)} m</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className="text-xl font-bold">
                    {riskLevel === "low"
                      ? "15%"
                      : riskLevel === "medium"
                      ? "45%"
                      : riskLevel === "high"
                      ? "72%"
                      : "94%"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Map Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Water Level Trend Chart */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Water Level Trends (24h)
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                  Live
                </span>
              </div>
              <div className="h-64">
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
                      tick={{ fontSize: 12 }}
                      stroke="hsl(215, 15%, 45%)"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="hsl(215, 15%, 45%)"
                      domain={[0, 10]}
                      label={{ value: "m", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(214, 25%, 90%)",
                        borderRadius: "8px",
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
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Actual Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-risk-medium" style={{ borderStyle: "dashed" }} />
                  <span className="text-muted-foreground">Predicted</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Flood Zone Map
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                  Interactive
                </span>
              </div>
              <div className="h-64 rounded-xl overflow-hidden">
                <FloodMap riskLevel={riskLevel} />
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-critical" />
                  <span className="text-muted-foreground">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-medium" />
                  <span className="text-muted-foreground">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Low Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Log */}
          <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {[
                { time: "14:32", message: "Water level threshold exceeded", level: "high" },
                { time: "12:15", message: "Heavy rainfall detected upstream", level: "medium" },
                { time: "09:45", message: "System check completed", level: "low" },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-xs font-mono text-muted-foreground">
                    {alert.time}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.level === "high"
                        ? "bg-risk-high"
                        : alert.level === "medium"
                        ? "bg-risk-medium"
                        : "bg-risk-low"
                    }`}
                  />
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

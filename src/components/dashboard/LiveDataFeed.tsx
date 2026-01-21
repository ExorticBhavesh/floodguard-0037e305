import { useEffect, useState, useRef } from "react";
import { Droplets, Wind, Thermometer, CloudRain, Gauge, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataPoint {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
  timestamp: Date;
}

export function LiveDataFeed() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = [
    { icon: Droplets, label: "River Level", unit: "m", color: "text-primary", range: [2, 8] },
    { icon: CloudRain, label: "Rainfall", unit: "mm/h", color: "text-risk-medium", range: [0, 50] },
    { icon: Wind, label: "Wind Speed", unit: "km/h", color: "text-muted-foreground", range: [5, 45] },
    { icon: Thermometer, label: "Temperature", unit: "°C", color: "text-risk-high", range: [20, 38] },
    { icon: Gauge, label: "Humidity", unit: "%", color: "text-primary", range: [40, 95] },
  ];

  useEffect(() => {
    // Generate initial data
    const generateDataPoint = (): DataPoint => {
      const sensor = sensors[Math.floor(Math.random() * sensors.length)];
      const value = (sensor.range[0] + Math.random() * (sensor.range[1] - sensor.range[0])).toFixed(1);
      return {
        id: Math.random().toString(36).substr(2, 9),
        icon: sensor.icon,
        label: sensor.label,
        value,
        unit: sensor.unit,
        color: sensor.color,
        timestamp: new Date(),
      };
    };

    // Initialize with a few data points
    setDataPoints([generateDataPoint(), generateDataPoint(), generateDataPoint()]);

    // Add new data point every 3 seconds
    const interval = setInterval(() => {
      setIsAnimating(true);
      setDataPoints(prev => {
        const newPoint = generateDataPoint();
        const updated = [newPoint, ...prev.slice(0, 4)];
        return updated;
      });
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pro-card p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Live Sensor Feed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <span className="text-xs text-risk-low font-medium">Streaming</span>
        </div>
      </div>

      {/* Data Feed */}
      <div ref={containerRef} className="space-y-2 max-h-48 overflow-hidden">
        {dataPoints.map((point, index) => {
          const Icon = point.icon;
          const isNew = index === 0 && isAnimating;
          
          return (
            <div
              key={point.id}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg bg-muted/40 transition-all duration-300",
                isNew && "animate-slide-up bg-primary/5 ring-1 ring-primary/20"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4", point.color)} />
                <span className="text-xs font-medium">{point.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tabular-nums">
                  {point.value}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                    {point.unit}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection indicator */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span>5 active sensors</span>
        <span>Last sync: Just now</span>
      </div>
    </div>
  );
}

import { 
  Cloud, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  RefreshCw,
  CloudRain,
  Sun,
  CloudLightning,
  Snowflake,
  CloudFog,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/hooks/useWeather";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const weatherIcons: Record<string, React.ElementType> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
  Mist: CloudFog,
  Fog: CloudFog,
  Haze: CloudFog,
};

const riskColors = {
  low: "from-risk-low/20 to-risk-low/5 border-risk-low/30",
  medium: "from-risk-medium/20 to-risk-medium/5 border-risk-medium/30",
  high: "from-risk-high/20 to-risk-high/5 border-risk-high/30",
  critical: "from-risk-critical/20 to-risk-critical/5 border-risk-critical/30",
};

const riskTextColors = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

const riskBgColors = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
  critical: "bg-risk-critical",
};

export function WeatherWidget() {
  const { weather, floodRisk, isLoading, error, lastUpdated, refetch, userLocation } = useWeather();

  if (isLoading && !weather) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="text-center py-6">
          <Cloud className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = weatherIcons[weather.condition] || Cloud;
  const severity = floodRisk?.severity || "low";

  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${riskColors[severity]} border transition-all duration-500`}>
      {/* Animated background for critical/high */}
      {(severity === "critical" || severity === "high") && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-10 -right-10 w-40 h-40 ${riskBgColors[severity]} opacity-10 rounded-full blur-3xl animate-pulse-slow`} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${riskBgColors[severity]}/10`}>
            <Cloud className={`w-5 h-5 ${riskTextColors[severity]}`} />
          </div>
          <div>
            <h3 className="font-semibold">Weather & Flood Risk</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{weather.location}</span>
              {userLocation && <span className="text-primary">• GPS</span>}
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refetch}
          className="h-8 w-8"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-lg`}>
            <WeatherIcon className="w-10 h-10 text-primary" />
          </div>
          <div>
            <div className="text-4xl font-bold">{Math.round(weather.temperature)}°C</div>
            <div className="text-sm text-muted-foreground capitalize">{weather.description}</div>
          </div>
        </div>

        {/* Flood Risk Badge */}
        <div className={`px-4 py-2 rounded-xl ${riskBgColors[severity]} text-white font-bold text-sm shadow-lg`}>
          {severity === "critical" && <AlertTriangle className="w-4 h-4 inline mr-1 animate-pulse" />}
          {severity.toUpperCase()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-center">
          <Droplets className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold">{weather.humidity}%</div>
          <div className="text-xs text-muted-foreground">Humidity</div>
        </div>
        <div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-center">
          <CloudRain className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold">{weather.rain || 0}mm</div>
          <div className="text-xs text-muted-foreground">Rainfall</div>
        </div>
        <div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-center">
          <Wind className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-lg font-bold">{Math.round(weather.wind || 0)}</div>
          <div className="text-xs text-muted-foreground">Wind m/s</div>
        </div>
      </div>

      {/* Flood Risk Message */}
      {floodRisk && floodRisk.description && (
        <div className={`p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-sm ${riskTextColors[severity]}`}>
          <div className="font-medium mb-1">{floodRisk.title}</div>
          <div className="text-muted-foreground text-xs leading-relaxed">{floodRisk.description}</div>
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mt-3 text-xs text-muted-foreground text-center">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </div>
      )}
    </div>
  );
}

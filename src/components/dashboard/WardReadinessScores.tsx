import { Shield, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WardData {
  name: string;
  ward: string;
  score: number;
  drainageAdequacy: number;
  pastFloodFreq: number;
  elevationVulnerability: number;
  rainfallIntensity: number;
  infraSensitivity: number;
  trend: "up" | "down" | "stable";
}

const wardData: WardData[] = [
  { name: "Maninagar", ward: "Ward 22", score: 91, drainageAdequacy: 92, pastFloodFreq: 95, elevationVulnerability: 88, rainfallIntensity: 85, infraSensitivity: 95, trend: "up" },
  { name: "Satellite", ward: "Ward 18", score: 85, drainageAdequacy: 88, pastFloodFreq: 82, elevationVulnerability: 85, rainfallIntensity: 80, infraSensitivity: 90, trend: "stable" },
  { name: "Naranpura", ward: "Ward 7", score: 58, drainageAdequacy: 55, pastFloodFreq: 50, elevationVulnerability: 65, rainfallIntensity: 60, infraSensitivity: 60, trend: "down" },
  { name: "Kankaria", ward: "Ward 15", score: 62, drainageAdequacy: 60, pastFloodFreq: 55, elevationVulnerability: 70, rainfallIntensity: 65, infraSensitivity: 60, trend: "stable" },
  { name: "Bapunagar", ward: "Ward 10", score: 52, drainageAdequacy: 48, pastFloodFreq: 45, elevationVulnerability: 60, rainfallIntensity: 55, infraSensitivity: 52, trend: "down" },
  { name: "Sabarmati", ward: "Ward 12", score: 42, drainageAdequacy: 35, pastFloodFreq: 30, elevationVulnerability: 45, rainfallIntensity: 50, infraSensitivity: 50, trend: "down" },
  { name: "Chandkheda", ward: "Ward 3", score: 35, drainageAdequacy: 30, pastFloodFreq: 25, elevationVulnerability: 38, rainfallIntensity: 45, infraSensitivity: 37, trend: "down" },
  { name: "Vasna-Barrage", ward: "Ward 8", score: 28, drainageAdequacy: 22, pastFloodFreq: 20, elevationVulnerability: 30, rainfallIntensity: 35, infraSensitivity: 33, trend: "down" },
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-risk-low";
  if (score >= 50) return "text-risk-medium";
  return "text-risk-critical";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-risk-low";
  if (score >= 50) return "bg-risk-medium";
  return "bg-risk-critical";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Ready";
  if (score >= 50) return "Moderate Risk";
  return "High Risk";
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-risk-low" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-risk-critical" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

export function WardReadinessScores() {
  const readyCount = wardData.filter(w => w.score >= 80).length;
  const moderateCount = wardData.filter(w => w.score >= 50 && w.score < 80).length;
  const highRiskCount = wardData.filter(w => w.score < 50).length;
  const avgScore = Math.round(wardData.reduce((a, b) => a + b.score, 0) / wardData.length);

  return (
    <div className="pro-card p-5">
      <div className="section-header">
        <div className="section-icon">
          <Shield className="w-4 h-4" />
        </div>
        <h3 className="section-title">Pre-Monsoon Ward Readiness</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="text-center p-3 rounded-lg bg-muted/40">
          <div className="text-2xl font-bold">{avgScore}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Score</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-risk-low/10">
          <div className="text-2xl font-bold text-risk-low">{readyCount}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Ready</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-risk-medium/10">
          <div className="text-2xl font-bold text-risk-medium">{moderateCount}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Moderate</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-risk-critical/10">
          <div className="text-2xl font-bold text-risk-critical">{highRiskCount}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">High Risk</div>
        </div>
      </div>

      {/* Ward List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {wardData.sort((a, b) => a.score - b.score).map((ward) => (
          <div key={ward.ward} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{ward.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{ward.ward}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendIcon trend={ward.trend} />
                <span className={`text-sm font-bold ${getScoreColor(ward.score)}`}>{ward.score}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getScoreBg(ward.score)}/10 ${getScoreColor(ward.score)} font-medium`}>
                  {getScoreLabel(ward.score)}
                </span>
              </div>
            </div>
            <Progress value={ward.score} className="h-1.5" />
            <div className="grid grid-cols-5 gap-1 mt-2">
              {[
                { label: "Drainage", val: ward.drainageAdequacy },
                { label: "History", val: ward.pastFloodFreq },
                { label: "Elevation", val: ward.elevationVulnerability },
                { label: "Rainfall", val: ward.rainfallIntensity },
                { label: "Infra", val: ward.infraSensitivity },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <div className={`text-[10px] font-semibold ${getScoreColor(f.val)}`}>{f.val}</div>
                  <div className="text-[8px] text-muted-foreground">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Bell } from "lucide-react";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCard } from "./AlertCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AlertNotificationBell() {
  const { alerts, criticalCount, highCount, totalCount } = useFloodAlerts();
  const urgentCount = criticalCount + highCount;
  const recentAlerts = alerts.slice(0, 3);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          {totalCount > 0 && (
            <span
              className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1 ${
                criticalCount > 0
                  ? "bg-risk-critical animate-pulse"
                  : highCount > 0
                  ? "bg-risk-high"
                  : "bg-primary"
              }`}
            >
              {totalCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Flood Alerts</h3>
            {urgentCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-risk-critical/10 text-risk-critical text-xs font-semibold">
                {urgentCount} Urgent
              </span>
            )}
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-3 space-y-3">
          {recentAlerts.length > 0 ? (
            recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No active alerts</p>
            </div>
          )}
        </div>
        {totalCount > 3 && (
          <div className="p-3 border-t border-border">
            <Button asChild variant="outline" className="w-full">
              <Link to="/alerts">View All {totalCount} Alerts</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

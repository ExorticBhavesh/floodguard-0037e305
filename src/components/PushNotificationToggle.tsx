import { Bell, BellOff, BellRing, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface PushNotificationToggleProps {
  variant?: "default" | "compact";
}

export function PushNotificationToggle({ variant = "default" }: PushNotificationToggleProps) {
  const { isSupported, permission, isSubscribed, requestPermission, disableNotifications } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  if (variant === "compact") {
    return (
      <Button
        variant={isSubscribed ? "default" : "outline"}
        size="icon"
        onClick={isSubscribed ? disableNotifications : requestPermission}
        className={`h-9 w-9 ${isSubscribed ? "bg-risk-low hover:bg-risk-low/90" : ""}`}
        title={isSubscribed ? "Notifications enabled" : "Enable notifications"}
      >
        {isSubscribed ? (
          <BellRing className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isSubscribed ? "bg-risk-low/10" : "bg-muted"}`}>
            {isSubscribed ? (
              <BellRing className="w-5 h-5 text-risk-low" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm">Push Notifications</h4>
            <p className="text-xs text-muted-foreground">
              {isSubscribed 
                ? "You'll receive real-time flood alerts" 
                : "Get notified about critical flood warnings"}
            </p>
          </div>
        </div>
        
        <Button
          variant={isSubscribed ? "outline" : "default"}
          size="sm"
          onClick={isSubscribed ? disableNotifications : requestPermission}
          className={`gap-2 ${isSubscribed ? "" : "bg-primary hover:bg-primary/90"}`}
        >
          {isSubscribed ? (
            <>
              <Check className="w-4 h-4" />
              Enabled
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Enable
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | "unsupported";
  isSubscribed: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "unsupported",
    isSubscribed: false,
  });

  useEffect(() => {
    const checkSupport = () => {
      const isSupported = "Notification" in window && "serviceWorker" in navigator;
      setState((prev) => ({
        ...prev,
        isSupported,
        permission: isSupported ? Notification.permission : "unsupported",
        isSubscribed: isSupported && Notification.permission === "granted",
      }));
    };

    checkSupport();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      toast.error("Push notifications are not supported in your browser");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setState((prev) => ({
        ...prev,
        permission,
        isSubscribed: permission === "granted",
      }));

      if (permission === "granted") {
        toast.success("🔔 Push notifications enabled!", {
          description: "You'll receive alerts for critical flood warnings",
        });
        
        // Show a test notification
        showNotification(
          "FloodGuard Notifications Active",
          "You will now receive real-time flood alerts",
          "low"
        );
        
        return true;
      } else if (permission === "denied") {
        toast.error("Notifications blocked", {
          description: "Please enable notifications in your browser settings",
        });
        return false;
      }
      
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
      return false;
    }
  }, [state.isSupported]);

  const showNotification = useCallback(
    (
      title: string,
      body: string,
      severity: "low" | "medium" | "high" | "critical" = "medium"
    ) => {
      if (!state.isSupported || Notification.permission !== "granted") {
        return;
      }

      const icon = severity === "critical" || severity === "high" 
        ? "🚨" 
        : severity === "medium" 
          ? "⚠️" 
          : "ℹ️";

      try {
        const notification = new Notification(`${icon} ${title}`, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: `flood-alert-${Date.now()}`,
          requireInteraction: severity === "critical" || severity === "high",
          silent: false,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-close after some time for non-critical alerts
        if (severity !== "critical") {
          setTimeout(() => notification.close(), 10000);
        }
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    },
    [state.isSupported]
  );

  const disableNotifications = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSubscribed: false,
    }));
    toast.info("Notifications disabled");
  }, []);

  return {
    ...state,
    requestPermission,
    showNotification,
    disableNotifications,
  };
}

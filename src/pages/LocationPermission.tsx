import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MapPin, Navigation, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function LocationPermission() {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const handleEnableLocation = async () => {
    setIsRequesting(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
        });
      });

      // Update profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          location_enabled: true,
          preferred_lat: position.coords.latitude,
          preferred_lon: position.coords.longitude,
        }).eq("id", user.id);
      }

      toast.success("Location enabled! You'll receive localized alerts.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Location access denied. You can enable it later in settings.");
      navigate("/dashboard");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    toast.info("You can enable location later for better alerts.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="dashboard" />

      <div className="w-full max-w-lg mx-4 relative z-10">
        <div className="pro-card p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Enable Location Access</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Location is required to provide <span className="text-foreground font-medium">real-time flood alerts</span> and{" "}
            <span className="text-foreground font-medium">nearby risk analysis</span> for your area.
          </p>

          {/* Benefits */}
          <div className="grid gap-3 mb-8 text-left">
            {[
              { icon: Navigation, label: "Hyper-local flood warnings for your exact area" },
              { icon: Shield, label: "Ward-level pre-monsoon readiness scores" },
              { icon: AlertTriangle, label: "Instant emergency alerts when risk is high" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleEnableLocation}
              disabled={isRequesting}
              className="w-full h-12 text-base gap-2"
            >
              <MapPin className="w-5 h-5" />
              {isRequesting ? "Detecting location..." : "Enable Location"}
            </Button>
            <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Phone, MapPin, Heart, Shield, ArrowRight, Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true })
      );
      const { latitude, longitude } = pos.coords;
      // Reverse geocode
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
        headers: { "Accept-Language": "en" },
      });
      if (resp.ok) {
        const data = await resp.json();
        const detected = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "";
        if (detected) setCity(detected);
        toast.success(`Location detected: ${detected}`);
      }
    } catch {
      toast.error("Could not detect location. Please enter manually.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || phone.length < 10) {
      toast.error("Name and valid phone number are required");
      return;
    }
    if (!emergencyContact || emergencyContact.length < 10) {
      toast.error("Please enter a valid emergency contact number");
      return;
    }
    setIsLoading(true);

    try {
      // Check if phone already exists
      const { data: existing } = await supabase
        .from("app_users")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (existing) {
        toast.error("This phone number is already registered. Please login instead.");
        setIsLoading(false);
        return;
      }

      let lat: number | undefined;
      let lon: number | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch { /* optional */ }

      const { data, error } = await supabase
        .from("app_users")
        .insert({
          full_name: fullName,
          phone,
          city: city || null,
          emergency_contact: emergencyContact || null,
          latitude: lat ?? null,
          longitude: lon ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      const profile = {
        id: data?.id,
        fullName,
        phone,
        city,
        emergencyContact,
        lat,
        lon,
        createdAt: Date.now(),
      };
      localStorage.setItem("floodguard_profile", JSON.stringify(profile));
      toast.success("Account created! Welcome to FloodGuard.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      // Fallback: save locally
      const profile = { fullName, phone, city, emergencyContact, createdAt: Date.now() };
      localStorage.setItem("floodguard_profile", JSON.stringify(profile));
      toast.success("Account created!");
      navigate("/dashboard", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: "fullName", label: "Full Name", icon: User, value: fullName, setter: setFullName, placeholder: "Enter your full name", type: "text", required: true },
    { id: "phone", label: "Mobile Number", icon: Phone, value: phone, setter: setPhone, placeholder: "+91 XXXXX XXXXX", type: "tel", required: true },
    { id: "emergency", label: "Emergency Contact Number", icon: Heart, value: emergencyContact, setter: setEmergencyContact, placeholder: "+91 XXXXX XXXXX", type: "tel", required: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 50%, hsl(170 100% 44% / 0.06) 0%, transparent 50%)",
      }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl overflow-hidden shadow-glow border border-primary/30">
            <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Create Account</h1>
          <p className="text-xs text-muted-foreground mt-1">Set up your FloodGuard profile</p>
        </div>

        <div className="glass-card p-5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {fields.map((field) => {
              const isFocused = focusedField === field.id;
              return (
                <div key={field.id}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{field.label}</label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                    isFocused ? "border-primary/50 shadow-glow bg-primary/5" : "border-border/50 bg-muted/20"
                  }`}>
                    <field.icon className={`w-4 h-4 ml-3.5 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full bg-transparent py-2.5 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              );
            })}

            {/* Location with auto-detect */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Location</label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                focusedField === "city" ? "border-primary/50 shadow-glow bg-primary/5" : "border-border/50 bg-muted/20"
              }`}>
                <MapPin className={`w-4 h-4 ml-3.5 transition-colors ${focusedField === "city" ? "text-primary" : "text-muted-foreground"}`} />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your city"
                  className="w-full bg-transparent py-2.5 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="mr-2 p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                  title="Auto-detect location"
                >
                  {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 rounded-xl font-bold text-sm text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "0 0 20px hsl(170 100% 44% / 0.25), 0 4px 12px hsl(0 0% 0% / 0.3)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-3">
          Your data is stored securely for disaster response only.
        </p>
      </div>
    </div>
  );
}

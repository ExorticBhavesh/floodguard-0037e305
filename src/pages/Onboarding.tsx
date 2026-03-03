import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Heart, Shield, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Onboarding() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "full">("phone");

  // Check if phone number already exists
  const checkPhone = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_users")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();

      if (data) {
        // Returning user - auto login
        const profile = {
          id: data.id,
          fullName: data.full_name,
          phone: data.phone,
          city: data.city,
          emergencyContact: data.emergency_contact,
          createdAt: new Date(data.created_at).getTime(),
        };
        localStorage.setItem("floodguard_profile", JSON.stringify(profile));
        toast.success(`Welcome back, ${data.full_name}!`);
        navigate("/dashboard", { replace: true });
      } else {
        // New user - show full form
        setStep("full");
      }
    } catch (err) {
      console.error("Phone check error:", err);
      // Fallback: show full form
      setStep("full");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Name and phone are required");
      return;
    }
    setIsLoading(true);

    try {
      // Get location
      let lat: number | undefined;
      let lon: number | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch { /* location optional */ }

      // Save to database
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

      toast.success("Protection activated! Welcome to FloodGuard.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Fallback: save locally even if DB fails
      const profile = { fullName, phone, city, emergencyContact, createdAt: Date.now() };
      localStorage.setItem("floodguard_profile", JSON.stringify(profile));
      toast.success("Protection activated!");
      navigate("/dashboard", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fullFields = [
    { id: "fullName", label: "Full Name", icon: User, value: fullName, setter: setFullName, placeholder: "Enter your full name", type: "text" },
    { id: "city", label: "City", icon: MapPin, value: city, setter: setCity, placeholder: "Your city", type: "text" },
    { id: "emergency", label: "Emergency Contact", icon: Heart, value: emergencyContact, setter: setEmergencyContact, placeholder: "+91 XXXXX XXXXX", type: "tel" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 50%, hsl(170 100% 44% / 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(0 100% 60% / 0.03) 0%, transparent 50%)",
        }} />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `hsl(170 100% 44% / ${0.1 + (i % 4) * 0.05})`,
              left: `${10 + i * 10}%`,
              top: `${15 + (i % 6) * 14}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 3) * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl overflow-hidden shadow-glow border border-primary/30">
            <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {step === "phone" ? "Welcome to FloodGuard" : "Quick Setup"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {step === "phone" ? "Enter your phone to continue" : "No passwords. No friction. Just safety."}
          </p>
        </div>

        {/* Glass form card */}
        <div className="glass-card p-5">
          {step === "phone" ? (
            <div className="space-y-4">
              {/* Phone field */}
              <div className="relative">
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone Number</label>
                <div className="relative flex items-center rounded-xl border border-border/50 bg-muted/20 focus-within:border-primary/50 focus-within:shadow-glow focus-within:bg-primary/5 transition-all duration-300">
                  <Phone className="w-4 h-4 ml-3.5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    autoFocus
                    className="w-full bg-transparent py-3 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={checkPhone}
                disabled={isLoading || phone.length < 10}
                className="relative w-full py-3 rounded-xl font-bold text-sm text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 20px hsl(170 100% 44% / 0.25), 0 4px 12px hsl(0 0% 0% / 0.3)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone (locked) */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone</label>
                <div className="flex items-center rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-sm">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-foreground">{phone}</span>
                </div>
              </div>

              {fullFields.map((field) => {
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
                        required={field.id === "fullName"}
                        className="w-full bg-transparent py-2.5 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 rounded-xl font-bold text-sm text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 20px hsl(170 100% 44% / 0.25), 0 4px 12px hsl(0 0% 0% / 0.3)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Activate FloodGuard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-3">
          Your data is stored securely for disaster response only.
        </p>
      </div>
    </div>
  );
}

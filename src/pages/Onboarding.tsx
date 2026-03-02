import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Heart, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store locally
    const profile = { fullName, phone, city, emergencyContact, createdAt: Date.now() };
    localStorage.setItem("floodguard_profile", JSON.stringify(profile));

    // Show loading animation briefly
    await new Promise(resolve => setTimeout(resolve, 1200));

    toast.success("Protection activated! Welcome to FloodGuard.");
    navigate("/dashboard", { replace: true });
  };

  const fields = [
    { id: "fullName", label: "Full Name", icon: User, value: fullName, setter: setFullName, placeholder: "Enter your full name", type: "text" },
    { id: "phone", label: "Phone Number", icon: Phone, value: phone, setter: setPhone, placeholder: "+91 XXXXX XXXXX", type: "tel" },
    { id: "city", label: "City", icon: MapPin, value: city, setter: setCity, placeholder: "Your city", type: "text" },
    { id: "emergency", label: "Emergency Contact", icon: Heart, value: emergencyContact, setter: setEmergencyContact, placeholder: "+91 XXXXX XXXXX", type: "tel" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 50%, hsl(170 100% 44% / 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(0 100% 60% / 0.03) 0%, transparent 50%)",
        }} />
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `hsl(170 100% 44% / ${0.1 + (i % 4) * 0.05})`,
              left: `${10 + i * 8}%`,
              top: `${15 + (i % 6) * 14}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 3) * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md mx-4 relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow border border-primary/30">
            <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Quick Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">No passwords. No friction. Just safety.</p>
        </div>

        {/* Glass form card */}
        <div className="glass-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => {
              const isFocused = focusedField === field.id;
              const hasValue = field.value.length > 0;

              return (
                <div key={field.id} className="relative">
                  <label
                    htmlFor={field.id}
                    className={`absolute left-11 transition-all duration-200 pointer-events-none ${
                      isFocused || hasValue
                        ? "top-1 text-[10px] font-semibold text-primary"
                        : "top-3.5 text-sm text-muted-foreground"
                    }`}
                  >
                    {field.label}
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                    isFocused
                      ? "border-primary/50 shadow-glow bg-primary/5"
                      : "border-border/50 bg-muted/20"
                  }`}>
                    <field.icon className={`w-4 h-4 ml-3.5 transition-colors duration-200 ${
                      isFocused ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isFocused ? field.placeholder : ""}
                      required
                      className="w-full bg-transparent py-3.5 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 pt-5"
                    />
                  </div>
                </div>
              );
            })}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl font-bold text-base text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 group"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "0 0 20px hsl(170 100% 44% / 0.25), 0 4px 12px hsl(0 0% 0% / 0.3)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Signal wave animation */}
                  <span className="relative w-6 h-6">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="absolute inset-0 rounded-full border border-primary-foreground/40 animate-signal"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </span>
                  Activating...
                </span>
              ) : (
                <span className="relative flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Activate FloodGuard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Your data stays on your device. No cloud dependency for emergencies.
        </p>
      </div>
    </div>
  );
}

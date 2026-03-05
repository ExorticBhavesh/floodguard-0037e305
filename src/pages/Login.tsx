import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Phone, ArrowRight, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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
        const profile = {
          id: data.id,
          fullName: data.full_name,
          phone: data.phone,
          city: data.city,
          emergencyContact: data.emergency_contact,
          lat: data.latitude,
          lon: data.longitude,
          createdAt: new Date(data.created_at).getTime(),
        };
        localStorage.setItem("floodguard_profile", JSON.stringify(profile));
        toast.success(`Welcome back, ${data.full_name}!`);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Phone number not found. Please sign up first.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 50%, hsl(170 100% 44% / 0.06) 0%, transparent 50%)",
      }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl overflow-hidden shadow-glow border border-primary/30">
            <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-xs text-muted-foreground mt-1">Enter your phone number to login</p>
        </div>

        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone Number</label>
            <div className="relative flex items-center rounded-xl border border-border/50 bg-muted/20 focus-within:border-primary/50 focus-within:shadow-glow focus-within:bg-primary/5 transition-all duration-300">
              <Phone className="w-4 h-4 ml-3.5 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="+91 XXXXX XXXXX"
                autoFocus
                className="w-full bg-transparent py-3 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading || phone.length < 10}
            className="relative w-full py-3 rounded-xl font-bold text-sm text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 20px hsl(170 100% 44% / 0.25), 0 4px 12px hsl(0 0% 0% / 0.3)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Login
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

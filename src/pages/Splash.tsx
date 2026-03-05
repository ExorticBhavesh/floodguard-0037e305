import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Brain, AlertTriangle, Map, Bot, Droplets, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Splash() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("floodguard_profile");
    if (profile) {
      navigate("/dashboard", { replace: true });
      return;
    }
    setTimeout(() => setShowContent(true), 300);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 120%, hsl(170 100% 44% / 0.08) 0%, transparent 60%)",
        }} />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: `hsl(170 100% 44% / ${0.1 + (i % 5) * 0.06})`,
              left: `${5 + i * 6}%`,
              bottom: `${5 + (i % 7) * 12}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4) * 1.5}s`,
              boxShadow: `0 0 ${6 + i}px hsl(170 100% 44% / 0.2)`,
            }}
          />
        ))}
        <svg className="absolute bottom-0 left-0 w-full h-40 opacity-10" preserveAspectRatio="none" viewBox="0 0 1440 120">
          <path className="animate-wave" d="M0,60 C360,20 720,100 1080,60 C1260,40 1380,80 1440,60 L1440,120 L0,120 Z" fill="hsl(170 100% 44%)" />
          <path className="animate-wave" style={{ animationDelay: "0.5s" }} d="M0,80 C240,40 480,100 720,60 C960,20 1200,80 1440,50 L1440,120 L0,120 Z" fill="hsl(170 100% 44% / 0.5)" />
        </svg>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center relative z-10 px-6 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Team Name */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">Team Idiotic_ones</p>
        </div>

        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-glow border-2 border-primary/30 animate-glow-pulse">
          <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black mb-2 glow-text text-foreground tracking-tight text-center">
          Flood<span className="text-primary">Guard</span>
        </h1>

        <p className="text-sm font-medium text-primary/80 mb-2 tracking-wide text-center">
          AI-Powered Flood Monitoring & Emergency Alert System
        </p>

        <p className="text-xs text-muted-foreground mb-10 text-center max-w-sm leading-relaxed">
          ML Flood Prediction • Real-time Monitoring • Risk Indicator • Nearby Alerts • Elevation Analysis • India-wide Flood Centre • BLE SOS System • AI Chatbot
        </p>

        {/* Two CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Button
            onClick={() => navigate("/login")}
            className="flex-1 h-12 text-base font-bold gap-2 rounded-2xl"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 30px hsl(170 100% 44% / 0.3), 0 4px 15px hsl(0 0% 0% / 0.3)",
            }}
          >
            <Phone className="w-4 h-4" />
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            variant="outline"
            className="flex-1 h-12 text-base font-bold gap-2 rounded-2xl border-primary/30 hover:bg-primary/10"
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </Button>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm mt-10">
          {[
            { icon: Brain, label: "ML Prediction" },
            { icon: Map, label: "GIS Map" },
            { icon: AlertTriangle, label: "SOS Alerts" },
            { icon: Bot, label: "AI Chat" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-card/40 border border-border/30">
              <item.icon className="w-4 h-4 text-primary/70" />
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

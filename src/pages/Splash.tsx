import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Wifi, Brain, AlertTriangle, Satellite, Map, Bot, Activity } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("floodguard_profile");
    if (profile) {
      navigate("/dashboard", { replace: true });
      return;
    }
    setTimeout(() => setShowContent(true), 300);
  }, [navigate]);

  const handleActivate = () => {
    setRippleActive(true);
    setTimeout(() => navigate("/onboarding"), 800);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 120%, hsl(170 100% 44% / 0.08) 0%, transparent 60%)",
        }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: `hsl(170 100% 44% / ${0.1 + (i % 5) * 0.06})`,
              left: `${5 + i * 4.5}%`,
              bottom: `${5 + (i % 7) * 12}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4) * 1.5}s`,
              boxShadow: `0 0 ${6 + i}px hsl(170 100% 44% / 0.2)`,
            }}
          />
        ))}

        {/* Wave lines */}
        <svg className="absolute bottom-0 left-0 w-full h-40 opacity-10" preserveAspectRatio="none" viewBox="0 0 1440 120">
          <path className="animate-wave" d="M0,60 C360,20 720,100 1080,60 C1260,40 1380,80 1440,60 L1440,120 L0,120 Z" fill="hsl(170 100% 44%)" />
          <path className="animate-wave" style={{ animationDelay: "0.5s" }} d="M0,80 C240,40 480,100 720,60 C960,20 1200,80 1440,50 L1440,120 L0,120 Z" fill="hsl(170 100% 44% / 0.5)" />
        </svg>

        {/* Signal rings */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary/10 animate-signal"
              style={{
                width: "100px", height: "100px",
                top: "-50px", left: "-50px",
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>
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

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black mb-2 glow-text text-foreground tracking-tight text-center">
          Flood<span className="text-primary">Guard</span>
        </h1>

        <p className="text-sm font-medium text-primary/80 mb-2 tracking-wide text-center">
          AI-Powered Flood Monitoring & Emergency Alert System
        </p>

        <p className="text-xs text-muted-foreground mb-8 text-center max-w-sm leading-relaxed">
          ML Flood Prediction • Real-time Monitoring • Risk Indicator • Nearby Alerts • Elevation Analysis • India-wide Flood Centre • BLE SOS System • AI Chatbot
        </p>

        {/* CTA Button */}
        <button
          onClick={handleActivate}
          className="relative group px-10 py-4 rounded-2xl font-bold text-lg text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 mb-8"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 0 30px hsl(170 100% 44% / 0.3), 0 4px 15px hsl(0 0% 0% / 0.3)",
          }}
        >
          {rippleActive && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-primary-foreground/30 animate-ripple" />
            </span>
          )}
          <span className="relative flex items-center gap-3">
            <Shield className="w-5 h-5" />
            Get Started
          </span>
        </button>

        {/* Feature grid */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
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

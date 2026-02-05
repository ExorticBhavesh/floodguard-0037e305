import { Link } from "react-router-dom";
import { 
  Droplets, 
  AlertTriangle, 
  ArrowRight,
  LayoutDashboard,
  Bot,
  ChevronRight,
  Sparkles,
  Shield,
  Cpu,
  Satellite
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LiveStatusBadge } from "@/components/home/LiveStatusBadge";
import { HeroStats } from "@/components/home/HeroStats";
import { FeatureSteps } from "@/components/home/FeatureSteps";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  const { alerts, criticalCount, highCount, totalCount, isLoading } = useFloodAlerts();
  const urgentAlerts = alerts.filter(a => a.severity === "critical" || a.severity === "high").slice(0, 2);
  
  const hasActiveWarning = criticalCount > 0 || highCount > 0;
  const warningLevel = criticalCount > 0 ? "critical" : highCount > 0 ? "high" : totalCount > 0 ? "medium" : "low";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="hero" isWarningActive={hasActiveWarning} warningLevel={warningLevel as any} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Live Status Badge */}
            <LiveStatusBadge totalAlerts={totalCount} />
            
            {/* Main Title */}
            <div className="text-center mb-12">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                AI-Powered Flood Monitoring
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up leading-[1.1] tracking-tight">
                Real-Time{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Flood Alert</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </span>
                <br />
                <span className="text-foreground">Prediction System</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
                Protecting communities with advanced machine learning, real-time sensor data, and{" "}
                <span className="text-foreground font-medium">instant emergency alerts</span>.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button 
                  asChild 
                  size="lg" 
                  className="gap-2 px-8 h-14 text-base bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all shadow-lg shadow-primary/25 rounded-2xl group"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    Open Live Dashboard
                    <ChevronRight className="w-4 h-4 -mr-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 px-8 h-14 text-base rounded-2xl hover:bg-primary/5 border-border/60 group"
                >
                  <Link to="/chatbot">
                    <Bot className="w-5 h-5" />
                    AI Safety Assistant
                  </Link>
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {[
                  { icon: Satellite, label: "Satellite Data" },
                  { icon: Cpu, label: "ML Powered" },
                  { icon: Shield, label: "24/7 Monitoring" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-primary/70" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Cards */}
            <HeroStats />
          </div>
        </div>
      </section>

      {/* Push Notification CTA */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <PushNotificationToggle />
          </div>
        </div>
      </section>

      {/* Urgent Alerts Section */}
      {urgentAlerts.length > 0 && (
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-risk-critical to-risk-high flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Active Warnings</h2>
                    <p className="text-sm text-muted-foreground">
                      {criticalCount + highCount} urgent alerts requiring attention
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground group">
                  <Link to="/alerts">
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              {/* Alert Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {urgentAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <FeatureSteps />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

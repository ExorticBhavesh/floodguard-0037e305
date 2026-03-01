import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  ArrowRight,
  LayoutDashboard,
  Bot,
  ChevronRight,
  Shield,
  Cpu,
  Satellite,
  Bell
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="hero" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Live Status Badge */}
            <LiveStatusBadge totalAlerts={totalCount} />
            
            {/* Main Title */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 animate-slide-up leading-[1.05] tracking-tight">
                Predict.{" "}
                <span className="gradient-text">Prepare.</span>
                <br />
                Protect.
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
                AI-powered flood monitoring system that safeguards communities with{" "}
                <span className="text-foreground font-medium">real-time predictions</span>{" "}
                and instant emergency alerts.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button 
                  asChild 
                  size="lg" 
                  className="gap-2 px-10 h-14 text-base rounded-2xl group"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    View Flood Risk
                    <ChevronRight className="w-4 h-4 -mr-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 px-10 h-14 text-base rounded-2xl group"
                >
                  <Link to="/alerts">
                    <Bell className="w-5 h-5" />
                    Get Alerts
                  </Link>
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {[
                  { icon: Satellite, label: "Satellite Data" },
                  { icon: Cpu, label: "ML Powered" },
                  { icon: Shield, label: "24/7 Monitoring" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-accent" />
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
                  <div className="w-12 h-12 rounded-2xl bg-risk-high/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-risk-high" />
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

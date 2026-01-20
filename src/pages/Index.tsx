import { Link } from "react-router-dom";
import { 
  Droplets, 
  AlertTriangle, 
  Shield, 
  MessageSquare,
  ArrowRight,
  Waves,
  Bell,
  Zap,
  Radio,
  LayoutDashboard,
  Bot,
  Globe,
  BellRing,
  ChevronRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";

export default function Index() {
  const { alerts, criticalCount, highCount, totalCount, isLoading } = useFloodAlerts();
  const urgentAlerts = alerts.filter(a => a.severity === "critical" || a.severity === "high").slice(0, 2);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Live Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border shadow-sm animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                <span className="text-sm font-medium">System Active</span>
                <div className="w-px h-4 bg-border" />
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {totalCount} Active Alerts
                </span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight tracking-tight">
                Real-Time{" "}
                <span className="gradient-text">Flood Alert</span>
                <br />
                Prediction System
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
                AI-powered flood monitoring with{" "}
                <span className="text-foreground font-medium">real-time alerts</span> and{" "}
                <span className="text-primary font-medium">intelligent predictions</span>.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button asChild size="lg" className="gap-2 px-8 h-12 text-base bg-gradient-primary hover:opacity-90 transition-opacity shadow-md rounded-xl">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Live Dashboard
                    <ChevronRight className="w-4 h-4 -mr-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 px-8 h-12 text-base rounded-xl hover:bg-primary/5">
                  <Link to="/chatbot">
                    <Bot className="w-4 h-4" />
                    AI Safety Chat
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto mt-12">
            {[
              { label: "Prediction Accuracy", value: "94%", icon: Zap, color: "text-primary" },
              { label: "Response Time", value: "<5s", icon: Radio, color: "text-risk-low" },
              { label: "Coverage Area", value: "500km²", icon: Globe, color: "text-risk-medium" },
              { label: "Active Monitors", value: "24/7", icon: Shield, color: "text-risk-high" },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="stat-card text-center animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Push Notification CTA */}
      <section className="py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <PushNotificationToggle />
          </div>
        </div>
      </section>

      {/* Urgent Alerts Section */}
      {urgentAlerts.length > 0 && (
        <section className="py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="section-header mb-0">
                  <div className="section-icon bg-risk-critical/10 text-risk-critical">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="section-title">Active Warnings</h2>
                    <p className="text-sm text-muted-foreground">
                      {criticalCount + highCount} urgent alerts in your area
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <Link to="/alerts">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {urgentAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="pro-badge-primary mx-auto mb-3">
              <Zap className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">Three Steps to Safer Communities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI system continuously monitors, predicts, and alerts to keep communities safe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Monitor",
                description: "Real-time data from weather sensors, water levels, and satellite imagery across the region",
                icon: Radio,
                color: "text-primary",
                bgColor: "bg-primary",
              },
              {
                step: 2,
                title: "Predict",
                description: "Advanced AI models analyze patterns and historical data to forecast flood risks accurately",
                icon: Zap,
                color: "text-risk-medium",
                bgColor: "bg-risk-medium",
              },
              {
                step: 3,
                title: "Alert",
                description: "Instant push notifications to authorities and communities in at-risk zones within seconds",
                icon: BellRing,
                color: "text-risk-high",
                bgColor: "bg-risk-high",
              },
            ].map((item) => (
              <div 
                key={item.step} 
                className="pro-card-hover p-6 relative group"
              >
                <div className={`absolute -top-3 left-6 px-3 py-1 rounded-md ${item.bgColor} text-white text-xs font-bold shadow-sm`}>
                  Step {item.step}
                </div>
                
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-4 mt-3 shadow-sm`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-10 sm:p-12 rounded-2xl bg-gradient-primary relative overflow-hidden shadow-lg">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20 overflow-hidden">
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
              <Waves className="absolute bottom-8 left-8 w-32 h-32 text-white/10" />
              <Droplets className="absolute top-8 right-8 w-24 h-24 text-white/10" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Get Instant Flood Safety Guidance
              </h2>
              <p className="text-white/80 mb-8 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Our AI assistant is available 24/7 for evacuation routes, safety procedures, and emergency preparedness
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2 px-8 h-12 text-base font-semibold rounded-xl hover:scale-105 transition-transform">
                <Link to="/chatbot">
                  <Bot className="w-4 h-4" />
                  Chat with FloodGuard AI
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                <Droplets className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold">FloodGuard</span>
                <span className="text-muted-foreground text-sm ml-2">by Pixel-Coders</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              © 2024 Hackathon Project • Protecting communities through technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

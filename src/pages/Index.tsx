import { Link } from "react-router-dom";
import { 
  Droplets, 
  AlertTriangle, 
  Shield, 
  MessageSquare,
  ArrowRight,
  Waves,
  MapPin,
  Bell,
  Zap,
  Radio,
  LayoutDashboard,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFloodAlerts } from "@/hooks/useFloodAlerts";
import { AlertCard } from "@/components/AlertCard";

export default function Index() {
  const { alerts, criticalCount, highCount, totalCount, isLoading } = useFloodAlerts();
  const urgentAlerts = alerts.filter(a => a.severity === "critical" || a.severity === "high").slice(0, 2);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-risk-high/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Live Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border shadow-lg animate-fade-in">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-low" />
                </span>
                <span className="text-sm font-medium">System Active</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{totalCount} Active Alerts</span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
                Real-Time{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-primary to-primary-dark bg-clip-text text-transparent">
                    Flood Alert
                  </span>
                  <Waves className="absolute -right-8 top-0 w-6 h-6 text-primary animate-float hidden sm:block" />
                </span>
                <br />
                <span className="text-foreground">Prediction System</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                AI-powered flood monitoring with real-time alerts. 
                <span className="text-primary font-semibold"> Protect lives</span> with early warnings and intelligent predictions.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button asChild size="lg" className="gap-2 px-8 h-14 text-base bg-gradient-primary hover:opacity-90 transition-all shadow-glow">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    Live Dashboard
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 px-8 h-14 text-base border-2">
                  <Link to="/chatbot">
                    <Bot className="w-5 h-5" />
                    AI Safety Chat
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            {[
              { label: "Prediction Accuracy", value: "94%", icon: Zap, color: "text-primary" },
              { label: "Response Time", value: "<5s", icon: Radio, color: "text-risk-low" },
              { label: "Coverage Area", value: "500km²", icon: MapPin, color: "text-risk-medium" },
              { label: "Active Monitors", value: "24/7", icon: Shield, color: "text-risk-high" },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Alerts Section */}
      {urgentAlerts.length > 0 && (
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-risk-critical/10 border border-risk-critical/20">
                    <AlertTriangle className="w-5 h-5 text-risk-critical" />
                  </div>
                  <h2 className="text-xl font-bold">Active Warnings</h2>
                  <span className="px-2 py-0.5 rounded-full bg-risk-critical/10 text-risk-critical text-xs font-bold">
                    {criticalCount + highCount} Urgent
                  </span>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to="/alerts">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
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
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">Three steps to safer communities</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Monitor",
                description: "Real-time data from weather sensors, water levels, and satellite imagery",
                icon: Radio,
                gradient: "from-primary/20 to-primary/5",
              },
              {
                step: 2,
                title: "Predict",
                description: "AI models analyze patterns to forecast flood risks with 94% accuracy",
                icon: Zap,
                gradient: "from-risk-medium/20 to-risk-medium/5",
              },
              {
                step: 3,
                title: "Alert",
                description: "Instant notifications to authorities and communities in at-risk zones",
                icon: Bell,
                gradient: "from-risk-high/20 to-risk-high/5",
              },
            ].map((item) => (
              <div 
                key={item.step} 
                className={`relative p-6 rounded-3xl bg-gradient-to-br ${item.gradient} border border-border/50 hover:border-primary/30 transition-all duration-300 group`}
              >
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  Step {item.step}
                </div>
                
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform shadow-lg">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-10 sm:p-14 rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-60 h-60 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Get Instant Flood Safety Guidance
              </h2>
              <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
                Our AI assistant is available 24/7 to answer questions about evacuation, safety, and emergency preparedness
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2 px-10 h-14 text-base font-semibold">
                <Link to="/chatbot">
                  <Bot className="w-5 h-5" />
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
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Droplets className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FloodGuard</span>
              <span className="text-muted-foreground text-sm">by Pixel-Coders</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Hackathon Project • Protecting communities through technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

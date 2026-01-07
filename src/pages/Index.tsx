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
  Bot,
  Sparkles,
  Globe,
  BellRing,
  ChevronRight
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
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-risk-low/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-risk-medium/5 rounded-full blur-[100px] animate-pulse-slow" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 sm:pt-40 sm:pb-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Live Status Badge */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-xl animate-fade-in">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-risk-low" />
                </span>
                <span className="text-sm font-semibold">System Active</span>
                <div className="w-px h-4 bg-border" />
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  {totalCount} Active Alerts
                </span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 animate-slide-up leading-[1.1] tracking-tight">
                <span className="inline-block">Real-Time</span>{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-primary to-primary-dark bg-clip-text text-transparent">
                    Flood Alert
                  </span>
                  <Sparkles className="absolute -right-6 -top-2 w-5 h-5 text-primary animate-pulse hidden sm:block" />
                </span>
                <br />
                <span className="text-foreground inline-block">Prediction System</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
                AI-powered flood monitoring with{" "}
                <span className="text-foreground font-medium">real-time alerts</span> and{" "}
                <span className="text-primary font-semibold">intelligent predictions</span>.
                Protect lives with early warnings.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Button asChild size="lg" className="gap-3 px-10 h-16 text-lg bg-gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    Live Dashboard
                    <ChevronRight className="w-5 h-5 -mr-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-3 px-10 h-16 text-lg border-2 rounded-2xl hover:bg-primary/5">
                  <Link to="/chatbot">
                    <Bot className="w-5 h-5" />
                    AI Safety Chat
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
            {[
              { label: "Prediction Accuracy", value: "94%", icon: Zap, color: "text-primary", gradient: "from-primary/20 to-primary/5" },
              { label: "Response Time", value: "<5s", icon: Radio, color: "text-risk-low", gradient: "from-risk-low/20 to-risk-low/5" },
              { label: "Coverage Area", value: "500km²", icon: Globe, color: "text-risk-medium", gradient: "from-risk-medium/20 to-risk-medium/5" },
              { label: "Active Monitors", value: "24/7", icon: Shield, color: "text-risk-high", gradient: "from-risk-high/20 to-risk-high/5" },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className={`p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 animate-scale-in group`}
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <stat.icon className={`w-7 h-7 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                <div className="text-3xl sm:text-4xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
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
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-risk-critical/10 border border-risk-critical/20">
                    <AlertTriangle className="w-6 h-6 text-risk-critical" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Active Warnings</h2>
                    <p className="text-sm text-muted-foreground">
                      {criticalCount + highCount} urgent alerts in your area
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
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
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Three Steps to Safer Communities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system continuously monitors, predicts, and alerts to keep communities safe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: 1,
                title: "Monitor",
                description: "Real-time data from weather sensors, water levels, satellite imagery, and IoT devices across the region",
                icon: Radio,
                gradient: "from-primary/20 via-primary/10 to-transparent",
                iconBg: "bg-primary",
              },
              {
                step: 2,
                title: "Predict",
                description: "Advanced AI models analyze patterns and historical data to forecast flood risks with 94% accuracy",
                icon: Zap,
                gradient: "from-risk-medium/20 via-risk-medium/10 to-transparent",
                iconBg: "bg-risk-medium",
              },
              {
                step: 3,
                title: "Alert",
                description: "Instant push notifications to authorities and communities in at-risk zones within seconds",
                icon: BellRing,
                gradient: "from-risk-high/20 via-risk-high/10 to-transparent",
                iconBg: "bg-risk-high",
              },
            ].map((item) => (
              <div 
                key={item.step} 
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${item.gradient} border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2`}
              >
                <div className={`absolute -top-4 left-8 px-4 py-1.5 rounded-full ${item.iconBg} text-white text-sm font-bold shadow-lg`}>
                  Step {item.step}
                </div>
                
                <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center p-12 sm:p-16 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-30 overflow-hidden">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
              <Waves className="absolute bottom-10 left-10 w-40 h-40 text-white/10" />
              <Droplets className="absolute top-10 right-10 w-32 h-32 text-white/10" />
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                Get Instant Flood Safety Guidance
              </h2>
              <p className="text-white/80 mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Our AI assistant is available 24/7 to answer questions about evacuation routes, safety procedures, and emergency preparedness
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-3 px-12 h-16 text-lg font-semibold rounded-2xl hover:scale-105 transition-transform">
                <Link to="/chatbot">
                  <Bot className="w-5 h-5" />
                  Chat with FloodGuard AI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg">FloodGuard</span>
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

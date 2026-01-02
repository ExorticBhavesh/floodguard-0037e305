import { Link } from "react-router-dom";
import { 
  Droplets, 
  AlertTriangle, 
  Shield, 
  Database, 
  Brain, 
  MessageSquare,
  ArrowRight,
  Waves,
  MapPin,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Waves className="w-4 h-4" />
              <span>Hackathon Project 2024</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Flood Risk{" "}
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Prediction System
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Innovate to <span className="text-primary font-semibold">Revive</span>, <span className="text-primary font-semibold">Restore</span>, <span className="text-primary font-semibold">Rejuvenate</span> River
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="gap-2 px-8 bg-gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/chatbot">
                  <MessageSquare className="w-5 h-5" />
                  Chat with AI Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 px-8">
                <Link to="/dashboard">
                  <Droplets className="w-5 h-5" />
                  View Live Dashboard
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { label: "Prediction Accuracy", value: "94%" },
              { label: "Response Time", value: "<5s" },
              { label: "Coverage Area", value: "500km²" },
              { label: "Lives Protected", value: "10K+" },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="p-4 rounded-xl bg-card border border-border text-center animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Challenge We Solve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the gap between current disaster response and what's needed
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problem Card */}
            <div className="p-8 rounded-2xl bg-risk-critical/5 border border-risk-critical/20">
              <div className="w-14 h-14 rounded-xl bg-risk-critical/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7 text-risk-critical" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-risk-critical">The Problem</h3>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-critical mt-2 flex-shrink-0" />
                  <span>Flooding causes significant <strong>loss of life</strong> and property damage annually</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-critical mt-2 flex-shrink-0" />
                  <span><strong>Inadequate early warning systems</strong> leave communities unprepared</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-critical mt-2 flex-shrink-0" />
                  <span>Lack of <strong>real-time data integration</strong> for informed decision making</span>
                </li>
              </ul>
            </div>
            
            {/* Solution Card */}
            <div className="p-8 rounded-2xl bg-risk-low/5 border border-risk-low/20">
              <div className="w-14 h-14 rounded-xl bg-risk-low/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-risk-low" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-risk-low">Our Solution</h3>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low mt-2 flex-shrink-0" />
                  <span><strong>Real-time AI prediction</strong> using XGBoost & Random Forest models</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low mt-2 flex-shrink-0" />
                  <span><strong>Geospatial mapping</strong> with Folium for visual risk assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low mt-2 flex-shrink-0" />
                  <span><strong>SMS alerts via Twilio</strong> for instant community notification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A three-step process from data collection to actionable alerts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Data Collection",
                description: "Real-time rainfall data and LiDAR elevation mapping feed into our system continuously",
                icon: Database,
                details: ["Rainfall Sensors", "LiDAR Data", "Water Level Monitors"],
              },
              {
                step: 2,
                title: "ML Analysis",
                description: "XGBoost and Random Forest models analyze patterns to predict flood probability",
                icon: Brain,
                details: ["XGBoost Model", "Random Forest", "94% Accuracy"],
              },
              {
                step: 3,
                title: "Action",
                description: "Automated SMS alerts sent to authorities and communities in high-risk zones",
                icon: MessageSquare,
                details: ["Twilio SMS", "Push Alerts", "Email Notifications"],
              },
            ].map((item, i) => (
              <div 
                key={item.step} 
                className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  Step {item.step}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                
                {/* Details */}
                <div className="flex flex-wrap gap-2">
                  {item.details.map((detail) => (
                    <span key={detail} className="tech-badge text-xs">
                      {detail}
                    </span>
                  ))}
                </div>
                
                {/* Connector Line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Who Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system serves multiple stakeholders in disaster preparedness
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Disaster Management", desc: "Real-time data for informed decisions" },
              { icon: MapPin, title: "Local Communities", desc: "Early warnings save lives" },
              { icon: Bell, title: "Emergency Services", desc: "Faster response coordination" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                See It In Action
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Explore our live dashboard with real-time flood risk monitoring and interactive controls
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2 px-8">
                <Link to="/dashboard">
                  <Droplets className="w-5 h-5" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Droplets className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FloodGuard</span>
              <span className="text-muted-foreground text-sm">by Pixel-Coders</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Hackathon Project. Built with purpose.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

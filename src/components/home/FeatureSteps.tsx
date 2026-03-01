import { Radio, Zap, BellRing, Map, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ElementType;
}

const features: FeatureCard[] = [
  {
    title: "AI Flood Prediction",
    description: "Advanced ML models analyze weather patterns, historical data, and sensor readings to predict flood risks with 94% accuracy.",
    icon: Zap,
  },
  {
    title: "Pre-Monsoon Readiness",
    description: "Ward-level readiness scores help local authorities prepare infrastructure and emergency resources before monsoon season.",
    icon: Radio,
  },
  {
    title: "Live GIS Flood Maps",
    description: "Interactive maps with real-time flood zone visualization, elevation analysis, and LiDAR-based terrain modeling.",
    icon: Map,
  },
  {
    title: "Early Warning Alerts",
    description: "Instant push notifications and SMS alerts to authorities and communities in at-risk zones within seconds.",
    icon: BellRing,
  },
];

export function FeatureSteps() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Built for{" "}
            <span className="gradient-text">Community Safety</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Our AI system continuously monitors, predicts, and alerts to keep communities protected.
          </p>
        </div>
        
        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-7 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {/* Hover arrow */}
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

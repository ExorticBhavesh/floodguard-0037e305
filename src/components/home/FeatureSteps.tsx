import { Radio, Zap, BellRing, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  shadowColor: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Monitor",
    description: "Real-time data collection from weather sensors, water level gauges, and satellite imagery across the region",
    icon: Radio,
    gradient: "from-primary to-primary-dark",
    shadowColor: "shadow-primary/20",
  },
  {
    number: 2,
    title: "Predict",
    description: "Advanced ML models analyze patterns, historical data, and meteorological conditions to forecast flood risks",
    icon: Zap,
    gradient: "from-risk-medium to-amber-600",
    shadowColor: "shadow-risk-medium/20",
  },
  {
    number: 3,
    title: "Alert",
    description: "Instant push notifications and SMS alerts to authorities and communities in at-risk zones within seconds",
    icon: BellRing,
    gradient: "from-risk-high to-red-600",
    shadowColor: "shadow-risk-high/20",
  },
];

export function FeatureSteps() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Three Steps to{" "}
            <span className="gradient-text">Safer Communities</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Our AI system continuously monitors, predicts, and alerts to keep communities protected
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="group relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}
              
              <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Step number badge */}
                <div className={cn(
                  "absolute -top-3 left-6 px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg bg-gradient-to-r",
                  step.gradient,
                  step.shadowColor
                )}>
                  Step {step.number}
                </div>
                
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mt-4 shadow-md bg-gradient-to-br",
                  step.gradient
                )}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                
                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

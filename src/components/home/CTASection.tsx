import { Link } from "react-router-dom";
import { MessageSquare, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-12 sm:p-16 rounded-3xl bg-primary overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
                Get Instant Flood Safety Guidance
              </h2>
              <p className="text-primary-foreground/70 mb-8 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Our AI assistant is available 24/7 for evacuation routes, safety procedures, and emergency preparedness.
              </p>
              
              {/* CTA Button */}
              <Button 
                asChild 
                size="lg" 
                variant="secondary" 
                className="gap-2 px-10 h-14 text-base font-semibold rounded-2xl hover:scale-105 transition-all duration-300 group"
              >
                <Link to="/chatbot">
                  <Bot className="w-5 h-5" />
                  Chat with FloodGuard AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/50 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Always Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Instant Response
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Expert Guidance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

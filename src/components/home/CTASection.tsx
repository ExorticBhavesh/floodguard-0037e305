import { Link } from "react-router-dom";
import { MessageSquare, Bot, ArrowRight, Sparkles, Waves, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto relative">
          {/* Main CTA Card */}
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Glow effects */}
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px]" />
              
              {/* Decorative icons */}
              <Waves className="absolute bottom-10 left-10 w-40 h-40 text-white/[0.07] rotate-12" />
              <Droplets className="absolute top-10 right-10 w-32 h-32 text-white/[0.07] -rotate-12" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Assistance
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              
              {/* Text */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Get Instant Flood Safety Guidance
              </h2>
              <p className="text-white/80 mb-8 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Our AI assistant is available 24/7 for evacuation routes, safety procedures, and emergency preparedness guidance
              </p>
              
              {/* CTA Button */}
              <Button 
                asChild 
                size="lg" 
                variant="secondary" 
                className="gap-2 px-10 h-14 text-base font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg group"
              >
                <Link to="/chatbot">
                  <Bot className="w-5 h-5" />
                  Chat with FloodGuard AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                  Always Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                  Instant Response
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
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

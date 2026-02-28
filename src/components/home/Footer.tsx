import { Link } from "react-router-dom";
import { Droplets, Github, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t border-border/60 relative z-10 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-lg">
                FloodGuard
                <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  v2.0
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                by Pixel-Coders
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/alerts" className="hover:text-primary transition-colors">
              Alerts
            </Link>
            <Link to="/chatbot" className="hover:text-primary transition-colors">
              AI Chat
            </Link>
          </div>
          
          {/* Social & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              >
                <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              >
                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-risk-critical fill-risk-critical" /> for safer communities
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {currentYear} FloodGuard • Hackathon Project • Protecting communities through technology
        </div>
      </div>
    </footer>
  );
}

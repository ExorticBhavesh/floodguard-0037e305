import { Link } from "react-router-dom";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 border-t border-border/40 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-base tracking-wide">FloodGuard</div>
              <div className="text-xs text-muted-foreground">by Pixel-Coders</div>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/alerts" className="hover:text-foreground transition-colors">Alerts</Link>
            <Link to="/chatbot" className="hover:text-foreground transition-colors">AI Chat</Link>
          </div>
          
          {/* Social */}
          <div className="flex items-center gap-3">
            {[Github, Twitter, Mail].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                className="w-9 h-9 rounded-xl bg-muted/50 hover:bg-accent/10 flex items-center justify-center transition-colors group"
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} FloodGuard • River Hackathon Project
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Data Sources: IMD, CWC, ISRO</span>
            <span>•</span>
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

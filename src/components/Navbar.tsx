import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Droplets, Menu, X, Bot, Bell, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertNotificationBell } from "./AlertNotificationBell";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "AI Chat", path: "/chatbot", icon: Bot, highlight: true },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">FloodGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  link.highlight
                    ? location.pathname === link.path
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                    : location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <AlertNotificationBell />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  link.highlight
                    ? location.pathname === link.path
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                    : location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

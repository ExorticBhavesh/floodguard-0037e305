import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bot, Bell, LayoutDashboard, Home, Map, LogOut, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertNotificationBell } from "./AlertNotificationBell";
import { MeshStatusIndicator } from "./mesh/MeshStatusIndicator";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Flood Map", path: "/flood-map", icon: Map },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "AI Chat", path: "/chatbot", icon: Bot, highlight: true },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("floodguard_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("floodguard_profile");
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:shadow-glow transition-shadow duration-200 border border-primary/20">
              <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-base hidden sm:block">
              Flood<span className="text-primary">Guard</span>
            </span>
          </Link>

          {/* Mesh Status - center */}
          <div className="hidden md:flex">
            <MeshStatusIndicator isActive={true} nodeCount={6} mode="simulation" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    link.highlight
                      ? isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-sm"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                      : isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <AlertNotificationBell />
            
            {profile && (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs hidden sm:flex text-muted-foreground hover:text-foreground">
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/30 glass-surface animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {/* Mesh status in mobile */}
            <div className="px-3 py-2 mb-2">
              <MeshStatusIndicator isActive={true} nodeCount={6} mode="simulation" />
            </div>

            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? isActive
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                      : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            {profile && (
              <button
                onClick={() => { handleSignOut(); setIsOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

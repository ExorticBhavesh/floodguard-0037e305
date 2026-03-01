import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bot, Bell, LayoutDashboard, Home, Map, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertNotificationBell } from "./AlertNotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Flood Map", path: "/flood-map", icon: Map },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "AI Chat", path: "/chatbot", icon: Bot, highlight: true },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-background/90 backdrop-blur-lg border-b border-border/40 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              <img src="/images/floodguard-logo.jpg" alt="FloodGuard" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-base tracking-wide hidden sm:block">FloodGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link-underline px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    link.highlight
                      ? isActive
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-accent hover:bg-accent/8"
                      : isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
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
            
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs hidden sm:flex">
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            ) : (
              <Button asChild size="sm" className="h-9 text-xs">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
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
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-accent"
                      : isActive
                        ? "bg-muted/50 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => { handleSignOut(); setIsOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 w-full"
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

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Chatbot from "./pages/Chatbot";
import FloodMap from "./pages/FloodMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = localStorage.getItem("floodguard_profile");
  if (!profile) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<RequireProfile><Navbar /><Dashboard /></RequireProfile>} />
          <Route path="/alerts" element={<RequireProfile><Navbar /><Alerts /></RequireProfile>} />
          <Route path="/chatbot" element={<RequireProfile><Navbar /><Chatbot /></RequireProfile>} />
          <Route path="/flood-map" element={<RequireProfile><Navbar /><FloodMap /></RequireProfile>} />
          {/* Redirect old /home to dashboard */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

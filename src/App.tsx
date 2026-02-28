import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LocationPermission from "./pages/LocationPermission";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Chatbot from "./pages/Chatbot";
import FloodMap from "./pages/FloodMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/location-permission" element={<LocationPermission />} />
          <Route path="/" element={<><Navbar /><Index /></>} />
          <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Navbar /><Alerts /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Navbar /><Chatbot /></ProtectedRoute>} />
          <Route path="/flood-map" element={<ProtectedRoute><Navbar /><FloodMap /></ProtectedRoute>} />
          <Route path="*" element={<><Navbar /><NotFound /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

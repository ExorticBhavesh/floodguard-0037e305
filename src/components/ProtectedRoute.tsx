import { Navigate } from "react-router-dom";
import { useAuthReady } from "@/hooks/useAuthReady";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuthReady();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

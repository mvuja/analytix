import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../ui/Skeleton";
import { useAuthStore } from "../../stores/authStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

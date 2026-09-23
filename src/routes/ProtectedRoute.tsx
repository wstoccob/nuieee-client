import { Navigate, Outlet, useLocation } from "react-router-dom";
import { roleSatisfies, useAuth } from "@/auth/useAuth";
import type { Role } from "@/dtos/user";

export function ProtectedRoute({ minimumRole }: { minimumRole: Role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!roleSatisfies(user.role, minimumRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

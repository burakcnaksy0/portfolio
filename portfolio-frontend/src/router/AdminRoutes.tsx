import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken     = useAuthStore((s) => s.accessToken);

  // isAuthenticated from persisted store + accessToken in memory
  if (!isAuthenticated && !accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

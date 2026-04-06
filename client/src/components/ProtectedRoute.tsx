// =============================================================================
// client/src/components/ProtectedRoute.tsx — Auth guard for admin routes
// =============================================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '@shared/types';

interface Props {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-6 h-6 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (requiredRole) {
    const roles: UserRole[] = ['viewer', 'editor', 'admin'];
    const userLevel = roles.indexOf(user.role);
    const requiredLevel = roles.indexOf(requiredRole);
    if (userLevel < requiredLevel) return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

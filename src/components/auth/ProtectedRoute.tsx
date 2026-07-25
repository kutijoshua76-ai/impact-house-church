import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ShieldOff } from 'lucide-react';

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}) => {
  const { user, profile, loading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  // Wait for auth to fully resolve before making any routing decisions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/20 animate-pulse">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → send to login page, remembering where they came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin gate (e.g. User Management page)
  if (requireSuperAdmin && profile !== null && !isSuperAdmin) {
    return <AccessDenied />;
  }

  // Admin gate (general dashboard access)
  if (requireAdmin && profile !== null && !isAdmin) {
    return <AccessDenied />;
  }

  // Auth resolved, user valid — render the protected page
  return <>{children}</>;
};

function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 mb-6">
          <ShieldOff className="text-red-400" size={36} />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-3">Access Denied</h1>
        <p className="text-foreground/50 text-sm mb-8 leading-relaxed">
          You don't have permission to view this page.
          Contact your super administrator if you believe this is a mistake.
        </p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-gradient text-midnight font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

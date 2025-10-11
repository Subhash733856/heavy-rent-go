import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'client' | 'operator';
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we verify your credentials.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/client-login" replace />;
  }

  if (requireRole && profile?.role !== requireRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. 
              {profile?.role === 'client' ? ' This page is for operators only.' : ' This page is for clients only.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

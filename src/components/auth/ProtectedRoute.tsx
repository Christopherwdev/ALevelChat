import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  currentPath?: string;
}

export async function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAuth = true,
  currentPath = '/'
}: ProtectedRouteProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if auth is required but user is not authenticated
  if (requireAuth && !user) {
    redirect(`${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`);
  }

  // Redirect if auth is not required but user is authenticated
  if (!requireAuth && user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

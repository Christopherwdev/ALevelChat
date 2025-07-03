import AppNavigation from "@/components/app/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path');
  
  return (
    <ProtectedRoute currentPath={currentPath || '/'}>
      <AppNavigation />
      <main>
        {children}
      </main>
    </ProtectedRoute>
  );
}

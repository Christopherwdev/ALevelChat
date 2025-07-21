import { headers } from "next/headers";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppNavigation from "@/components/app/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path') || '/';
  const hideHeader =
    currentPath.startsWith('/past-paper/viewer') ||
    currentPath.startsWith('/learn/edexcel-igcse/chinese/listening') ||
    currentPath.startsWith('/learn/edexcel-igcse/chinese/reading') ||
    currentPath.startsWith('/learn/edexcel-igcse/chinese/translating') ||
    currentPath.startsWith('/learn/edexcel-igcse/chinese/writing');

    
    // currentPath.startsWith('/learn/edexcel-ial/chemistry');

  return (
    <ProtectedRoute currentPath={currentPath}>
      {!hideHeader && <AppNavigation />}
      <main className="flex-1">
        {children}
      </main>
    </ProtectedRoute>
  );
}

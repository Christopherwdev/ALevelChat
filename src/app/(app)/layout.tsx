import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppNavigationWrapper from "@/components/app/AppNavigationWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // currentPath is not needed; header logic is now client-side
  return (
    <ProtectedRoute>
      <AppNavigationWrapper />
      <main className="flex-1">
        {children}
      </main>
    </ProtectedRoute>
  );
}

import { headers } from "next/headers";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppNavigation from "@/components/app/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path');

  return (
    <ProtectedRoute currentPath={currentPath || '/'}>
      {/* The new top header navigation bar */}
      <AppNavigation />

      {/* Main Content */}
      {/* Add padding-top to the main content to prevent it from being hidden behind the fixed header.
          The header has a height of h-16 (64px). */}
      <main className="flex-1"> {/* Tailwind's pt-16 corresponds to 64px */}
        {children}
      </main>
    </ProtectedRoute>
  );
}

import AppNavigation from "@/components/app/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { headers } from "next/headers";

const SIDEBAR_COLLAPSED_WIDTH = 70; // px, match with AppNavigation collapsed width

const SIDEBAR_COLLAPSED_HEIGHT = 70;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path');

  return (
    <ProtectedRoute currentPath={currentPath || '/'}>
      {/* Desktop Navigation - Left Sidebar */}
      <aside
        className="hidden lg:block"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: `${SIDEBAR_COLLAPSED_WIDTH}px`,
          borderRight: "1px solid #eee",
          overflow: "visible",
          zIndex: 100,
          background: "#fff"
        }}
      >
        <AppNavigation collapsedWidth={SIDEBAR_COLLAPSED_WIDTH} />
      </aside>
      
      {/* Mobile Navigation - Bottom Bar */}
      <aside
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          height: `${SIDEBAR_COLLAPSED_WIDTH}px`,
          background: "#fff",
          borderTop: "1px solid #eee",
          minHeight: `${SIDEBAR_COLLAPSED_WIDTH}px`
        }}
      >
        <AppNavigation collapsedWidth={SIDEBAR_COLLAPSED_WIDTH} />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-[70px] pb-[70px] lg:pb-0">
        {children}
      </main>
    </ProtectedRoute>
  );
}

import AppNavigation from "@/components/app/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { headers } from "next/headers";

const COLLAPSED_WIDTH = 75; // px, match with AppNavigation collapsed width

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path');
  
  return (
    <ProtectedRoute currentPath={currentPath || '/'}>
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: `${COLLAPSED_WIDTH}px`,
          borderRight: "1px solid #eee",
          overflow: "visible",
          zIndex: 100,
          background: "#fff"
        
        }}
      >
        <AppNavigation collapsedWidth={COLLAPSED_WIDTH} />
      </aside>
      <main style={{ marginLeft: `${COLLAPSED_WIDTH}px`, flex: 1 }}>
        {children}
      </main>
    </ProtectedRoute>
  );
}

import AppNavigation from "@/components/app/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavigation />
      <main>
        {children}
      </main>
    </>
  );
}

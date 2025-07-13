// The old version landing page

import Navigation from '@/components/app/header';
import Footer from '@/components/public/footer';
import { createClient } from '@/utils/supabase/server';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navigation isAuthenticated={!!user} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'AIToLearn - AI-Powered Learning Platform',
  description: 'Your personal AI tutor for GCSE, IGCSE, IAL and IELTS exam preparation',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Navigation isAuthenticated={!!user} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
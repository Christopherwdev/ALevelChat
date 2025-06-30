import './globals.css';
import Navigation from '@/components/Navigation';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'AitoLearn - AI-Powered Learning Platform',
  description: 'Your personal AI tutor for GCSE, IGCSE, IAL and IELTS exam preparation',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation isAuthenticated={!!user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
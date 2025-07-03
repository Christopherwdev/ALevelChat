import './globals.css';

export const metadata = {
  title: 'AIToLearn - AI-Powered Learning Platform',
  description: 'Your personal AI tutor for GCSE, IGCSE, IAL and IELTS exam preparation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
import './globals.css';
import { Inter } from 'next/font/google';

const interFont = Inter({
  weight: ['400', '500', '600', '700'],
  display: "swap",
});

export const metadata = {
  title: 'AIToLearn - AI-Powered Learning Platform',
  description: 'Your personal AI tutor for GCSE, IGCSE, IAL and IELTS exam preparation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interFont.className} min-h-screen bg-white`}>
        {children}
      </body>
    </html>
  );
}
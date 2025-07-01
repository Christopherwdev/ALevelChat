"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  isAuthenticated: boolean;
}

export default function Navigation({ isAuthenticated }: NavigationProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Learn', path: '/learn' },
    { name: 'Practice', path: '/practice' },
    { name: 'Resources', path: '/resources' },
    { name: 'AI Hub', path: '/ai-hub' },
    { name: 'Social', path: '/social' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">AitoLearn</span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === tab.path
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-800'
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

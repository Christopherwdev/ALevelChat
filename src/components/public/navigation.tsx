"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { signOut } from '@/app/auth/actions';
import Image from 'next/image';

interface NavigationProps {
  isAuthenticated: boolean;
}

export default function Navigation({ isAuthenticated }: NavigationProps) {
  const pathname = usePathname();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { name: 'Learn', path: '/learn' },
    { name: 'Practice', path: '/practice' },
    { name: 'Resources', path: '/resources' },
    { name: 'AI Hub', path: '/ai-hub' },
    { name: 'Social', path: '/social' },
  ];

  async function handleSignOut() {
    startSignOutTransition(async () => {
      await signOut();
    });
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-300x300.png"
                alt="AIToLearn Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900">AIToLearn</span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Navigation tabs */}
              <div className="hidden md:flex space-x-6">
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === tab.path
                        ? 'text-red-500 border-b-2 border-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>Account</span>
                  <svg className={`ml-1 h-4 w-4 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      {isSigningOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
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

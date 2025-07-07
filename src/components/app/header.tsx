// The nav bar for the old version landing page

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { signOut } from '@/app/auth/actions';
import Image from 'next/image';

interface NavigationProps {
  isAuthenticated: boolean;
}

const exams = [
  {
    name: 'Edexcel IAL',
    path: '/learn/edexcel-ial',
    subjects: [
      { name: 'Biology', path: '/learn/edexcel-ial/biology' },
      { name: 'Chemistry', path: '/learn/edexcel-ial/chemistry' },
      { name: 'Physics', path: '/learn/edexcel-ial/physics' },
      { name: 'Math', path: '/learn/edexcel-ial/math' },
    ],
  },
  {
    name: 'Edexcel IGCSE',
    path: '/learn/edexcel-igcse-chinese',
    subjects: [
      { name: 'Chinese', path: '/learn/edexcel-igcse-chinese/chinese' },
    ],
  },
  {
    name: 'IELTS',
    path: '/learn/ielts',
    subjects: [
      { name: 'Reading', path: '/learn/ielts/reading' },
      { name: 'Speaking', path: '/learn/ielts/speaking' },
      { name: 'Writing', path: '/learn/ielts/writing' },
      { name: 'Listening', path: '/learn/ielts/listening' },
    ],
  },
  {
    name: 'University',
    path: '/learn/university',
    subjects: [
        { name: 'Application', path: '/learn/university/application' },
      { name: 'Interview Practice', path: '/learn/university/interview-practice' },
      { name: 'Personal Statement', path: '/learn/university/personal-statement' },
     
    ],
  },
];

export default function Navigation({ isAuthenticated }: NavigationProps) {
  const pathname = usePathname();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredExam, setHoveredExam] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  async function handleSignOut() {
    startSignOutTransition(async () => {
      await signOut();
    });
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <nav className="bg-[rgba(255,255,255,0.9)] backdrop-blur-[15px] shadow-xl shadow-[rgba(0,0,0,0.02)] border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between w-full">
            {/* Logo left */}
            <div className="flex items-center min-w-[100px]">
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
            {/* Exams center */}
            <div className="hidden lg:flex justify-center items-center space-x-0 py-2 px-3 bg-[rgba(0,0,0,0.04)] rounded-full">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="relative"
                  onMouseEnter={() => setHoveredExam(exam.name)}
                  onMouseLeave={() => setHoveredExam(null)}
                >
                  <Link
                    href={exam.path}
                    className={`px-4 py-2 text-md font-medium transition-colors rounded-md ${
                      pathname.startsWith(exam.path)
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-700 hover:text-red-500 hover:bg-gray-50'
                    }`}
                  >
                    {exam.name}
                  </Link>
                  {/* Dropdown for subjects */}
                  {hoveredExam === exam.name && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-lg py-2 z-20 border border-[#00000020] flex flex-col">
                      {exam.subjects.map((subject) => (
                        <Link
                          key={subject.name}
                          href={subject.path}
                          className="px-4 py-2 text-sm text-black font-semibold hover:bg-gray-100 hover:text-red-500 rounded transition-colors"
                        >
                          {subject.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Account button right */}
            <div className="flex items-center space-x-4 min-w-[100px] justify-end">
              {isAuthenticated ? (
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
            {/* Hamburger for mobile */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Open menu"
              >
                {/* Hamburger icon */}
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 bg-white shadow-lg rounded-b-xl z-40 mt-0 px-4 py-2">
          {exams.map((exam) => (
            <div key={exam.name} className="mb-2">
              <button
                onClick={() => setExpandedExam(expandedExam === exam.name ? null : exam.name)}
                className="w-full text-left px-2 py-2 font-semibold text-gray-800 hover:text-red-500 flex justify-between items-center"
              >
                {exam.name}
                <svg className={`h-4 w-4 ml-2 transition-transform ${expandedExam === exam.name ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {expandedExam === exam.name && (
                <div className="pl-4">
                  {exam.subjects.map((subject) => (
                    <Link
                      key={subject.name}
                      href={subject.path}
                      className="block px-2 py-1 text-gray-700 hover:text-red-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

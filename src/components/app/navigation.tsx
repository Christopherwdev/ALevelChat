"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';

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
    path: '/learn/edexcel-igcse',
    subjects: [
      { name: 'Chinese', path: '/learn/edexcel-igcse/chinese' },
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
];

export default function AppHeader() {
  const pathname = usePathname();
  const [hoveredExam, setHoveredExam] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 left-0 w-full z-1000 bg-[rgba(0,0,0,0.8)] backdrop-blur border-b border-[#23232a] shadow-[#00000020] flex items-center justify-between px-4" style={{ height: 50, minHeight: 50, maxHeight: 50, marginBottom: 0 }}>
      {/* Logo and Title */}
      <div className="flex items-center min-w-[100px]">
        <Image
          src="/logo-300x300.png"
          alt="AIToLearn Logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <Link href="/" className="text-xl ml-2 font-bold text-white flex items-center gap-2">
          AIToLearn
        </Link>
      </div>
      {/* Exams Dropdown and Home/Dashboard */}
      <div className="hidden lg:flex justify-center items-center gap-1 py-1 px-1 bg-[#00000050] rounded-full relative">
        <Link href="/learn" className={`px-4 py-0 text-md font-medium transition-all rounded-full ${pathname === '/learn' ? 'text-white bg-[#ff3b30] shadow-sm shadow-[0_0_0_7px_#ff3b3030]' : 'text-white hover:bg-[#ffffff30] '}`}>Home</Link>
        {exams.map((exam) => (
          <div
            key={exam.name}
            className="relative"
            onMouseEnter={() => setHoveredExam(exam.name)}
            onMouseLeave={() => setHoveredExam(null)}
          >
            <Link
              href={exam.path}
              className={`px-3 py-1 text-md h-[40px] font-medium transition-all rounded-full ${pathname.startsWith(exam.path) ? 'text-white bg-[#ff3b30] shadow-sm shadow-[0_0_0_7px_#ff3b3030]' : 'text-white hover:bg-[#ffffff30] '}`}
            >
              {exam.name}
            </Link> 
            {/* Dropdown for subjects */}
            {hoveredExam === exam.name && (
              <div className="absolute left-0 mt-0 w-48 bg-[#000000] rounded-xl shadow-lg py-2 z-20 border border-[#33334a] flex flex-col">
                {exam.subjects.map((subject) => (
                  <Link
                    key={subject.name}
                    href={subject.path}
                    className="px-3 py-2 text-sm text-white font-semibold hover:text-white hover:bg-[#ffffff40] transition-colors"
                  >
                    {subject.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link href="/dashboard" className={`px-3 py-0 text-md font-medium transition-all rounded-full ${pathname.startsWith('/dashboard') ? 'text-white bg-[#ff3b30] shadow-sm shadow-[0_0_0_7px_#ff3b3030]' : 'text-white hover:bg-[#ffffff30] '}`}>Dashboard</Link>
      </div>
      {/* Profile Link */}
      <div className="flex items-center">
        <Link
          href="/profile"
          className={`flex items-center gap-2 py-1 px-3 rounded-full transition-all duration-300 font-bold ${pathname === "/profile" ? "bg-[#ff3b30] text-white" : "text-gray-300 hover:text-[#ff3b30] hover:bg-[#23232a]"}`}
        >
          <span className="hidden sm:inline text-sm">Profile</span>
        </Link>
      </div>
    </header>
  );
}
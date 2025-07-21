"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn"; // Assuming cn utility is available
import Link from "next/link";
import { BookOpenText, Files, LayoutDashboard, School, Users, BotMessageSquare, User, ChevronDown } from "lucide-react";
import Image from 'next/image';

export default function AppHeader() {
  const pathname = usePathname();
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSubjectDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSubjectDropdownOpen]);

  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const navLinks = [
    { name: "Revision", href: "/learn", icon: BookOpenText },
    { name: "Past Papers", href: "/past-paper", icon: Files },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Teacher", href: "/ai-teacher", icon: BotMessageSquare },
    { name: "Social", href: "/social", icon: Users },
  ];

  const subjectOptions = [
    {
      name: "Edexcel IAL",
      href: "/learn/edexcel-ial",
      sub: [
        { name: "Biology", href: "/learn/edexcel-ial/biology" },
        { name: "Physics", href: "/learn/edexcel-ial/physics" },
        { name: "Chemistry", href: "/learn/edexcel-ial/chemistry" },
        { name: "Math", href: "/learn/edexcel-ial/math" },
      ],
    },
    {
      name: "Edexcel IGCSE",
      href: "/learn/edexcel-igcse",
      sub: [
        { name: "Chinese", href: "/learn/edexcel-igcse/chinese" },
      ],
    },
    {
      name: "IELTS",
      href: "/learn/ielts",
      sub: [
        { name: "Speaking", href: "/learn/ielts/speaking" },
        { name: "Writing", href: "/learn/ielts/writing" },
        { name: "Reading", href: "/learn/ielts/reading" },
        { name: "Listening", href: "/learn/ielts/listening" },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-200 bg-[rgba(0,0,0,1)] backdrop-blur-[15px] text-gray-100 border-b-[#ffffff10] border-b-1 h-[50px] flex items-center justify-between px-4 border-b-2">
      {/* Brand Name/Logo */}
      <div className="flex items-center">
        <Image
          src="/logo-300x300.png"
          alt="AIToLearn Logo"
          width={25}
          height={25}
          className="object-contain"
        />
        <Link href="/" className="text-xl ml-2 hidden md:block font-bold text-white flex items-center gap-2">
          AIToLearn
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleSubjectDropdown}
            className="flex items-center gap-1 py-1 px-2 rounded-lg text-white hover:bg-[#ffffff10] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-haspopup="true"
            aria-expanded={isSubjectDropdownOpen}
          >
            Subject <ChevronDown size={16} className={`transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubjectDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 bg-[#1a1a1a] rounded-lg shadow-lg py-2 w-56 border border-[#ffffff10] z-10">
              {subjectOptions.map((subject) => (
                <div key={subject.href}>
                  <Link
                    href={subject.href}
                    className="block px-4 py-2 text-white hover:bg-[#ffffff10] font-bold"
                    onClick={() => setIsSubjectDropdownOpen(false)}
                  >
                    {subject.name}
                  </Link>
                  {subject.sub && (
                    <div className="border-l-2 border-[#007aff] ml-4">
                      {subject.sub.map((subj) => (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          className="block px-4 py-1 text-white hover:bg-[#ffffff10] text-sm"
                          onClick={() => setIsSubjectDropdownOpen(false)}
                        >
                          {subj.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {navLinks.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 p-1 px-2 rounded-lg transition-all duration-300 font-medium",
                isActive
                  // ? "bg-white text-black hover:shadow-[0px_0px_10px_0px_#ffffff50]"

                     ? "text-[#ffffff] hover:text-white"
                  : "text-[#ffffff] hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="min-w-[20px] min-h-[20px]" />
              <span className="text-sm whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Link */}
      <div className="flex items-center">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2 p-2 px-4 rounded-full transition-all duration-300 font-bold",
            pathname === "/profile"
              ? "bg-white text-black hover:shadow-[0px_0px_10px_0px_#ffffff50]"
              : "text-gray-400 hover:text-white hover:bg-[#ffffff10]"
          )}
        >
          <User size={20} strokeWidth={pathname === "/profile" ? 2 : 1.5} />
          <span className="hidden sm:inline text-sm">Profile</span>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="p-2 rounded-lg text-gray-400 hover:bg-[#ffffff10]" aria-label="Open mobile menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
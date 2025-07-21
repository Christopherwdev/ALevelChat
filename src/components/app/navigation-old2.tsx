"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn"; // Assuming cn utility is available
import Link from "next/link";
import { BookOpenText, Files, LayoutDashboard, School, Users, BotMessageSquare, User, ChevronDown } from "lucide-react"; // Added ChevronDown for dropdown
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

  // Toggles the visibility of the subject dropdown
  const toggleSubjectDropdown = () => {
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  // Defines the main navigation links for the header
  const navLinks = [
    { name: "Revision", href: "/learn", icon: BookOpenText },
    { name: "Past Papers", href: "/past-paper", icon: Files },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Teacher", href: "/ai-teacher", icon: BotMessageSquare },
    { name: "Social", href: "/social", icon: Users },
  ];

  // Defines the options for the subject dropdown
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
    <header className="fixed top-0 left-0 w-full z-200 bg-[rgba(255,255,255,0.90)] backdrop-blur-[15px] text-gray-900 border-b-[#00000010] border-b-1 h-[50px] flex items-center justify-between px-4 border-b-2 border-b-[#00000010]">
      {/* Brand Name/Logo */}
      <div className="flex items-center">
      <Image
                  src="/logo-300x300.png"
                  alt="AIToLearn Logo"
                  width={25}
                  height={25}
                  className="object-contain"
                />
        <Link href="/" className="text-xl ml-2 hidden md:block font-bold text-black flex items-center gap-2">
          {/* <School size={24} className="text-blue-600" /> */}
          AIToLearn
        </Link>
      </div>

      {/* Navigation Links - Hidden on small screens */}
      <nav className="flex items-center gap-2">
        {/* Subject Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleSubjectDropdown}
            className="flex items-center gap-1 py-1 px-2 rounded-lg text-black hover:bg-[#00000010] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-haspopup="true" // ARIA attribute for dropdown
            aria-expanded={isSubjectDropdownOpen} // ARIA attribute for dropdown state
          >
            Subject <ChevronDown size={16} className={`transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubjectDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg py-2 w-56 border border-gray-200 z-10">
              {subjectOptions.map((subject) => (
                <div key={subject.href}>
                  <Link
                    href={subject.href}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                    onClick={() => setIsSubjectDropdownOpen(false)}
                  >
                    {subject.name}
                  </Link>
                  {subject.sub && (
                    <div className="border-l-2 border-gray-100 ml-4">
                      {subject.sub.map((subj) => (
                        <Link
                          key={subj.href}
                          href={subj.href}
                          className="block px-4 py-1 text-gray-700 hover:bg-gray-200 text-sm"
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

        {/* Render main navigation links */}
        {navLinks.map((item) => {
          // Determine if the current link is active based on the pathname
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon; // Dynamic icon component from lucide-react

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 p-1 px-2 rounded-lg transition-all duration-300 font-bold",
                // isActive
                //   ? "bg-black text-white hover:shadow-[0px_0px_10px_0px_#00000010]" 
                //   : "text-[#00000080] hover:text-gray-900 hover:bg-[#00000010]" 

                isActive
                ? "text-[#00000080] hover:text-gray-900 hover:bg-[#00000010]" 
                : "text-[#00000080] hover:text-gray-900 hover:bg-[#00000010]" 


              )}
              aria-current={isActive ? "page" : undefined} // ARIA attribute for current page
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="min-w-[20px] min-h-[20px]" />
              <span className="text-sm whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Link - Always visible */}
      <div className="flex items-center">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2 p-2 px-4 rounded-full transition-all duration-300 font-bold",
            pathname === "/profile"
              ? "bg-black text-white hover:shadow-[0px_0px_10px_0px_#00000010]"
              : "text-black hover:text-gray-900 hover:bg-[#00000010]"
          )}
        >
          <User size={20} strokeWidth={pathname === "/profile" ? 2 : 1.5} />
          <span className="hidden sm:inline text-sm">Profile</span> {/* Hide text on very small screens */}
        </Link>
      </div>

      {/* Mobile Menu Button (Hamburger Icon) - Visible only on small screens */}
      <div className="md:hidden">
        {/* Placeholder for mobile menu button. You would typically add state and a sidebar/modal for mobile navigation here. */}
        <button className="p-2 rounded-lg text-black hover:bg-[#00000010]" aria-label="Open mobile menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
      </div>
    </header>
  );
}

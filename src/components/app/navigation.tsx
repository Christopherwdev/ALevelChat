"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn"; // Assuming cn utility is available
import Link from "next/link";
// Importing a wider range of icons for better representation
import { Home, BookOpen, GraduationCap, LayoutDashboard, Library, Users, ChevronLeft, ChevronRight } from "lucide-react";

// Updated nav items with new, more descriptive icons
const navItems = [
  { name: "Learn", href: "/learn", icon: Home },
  { name: "Past Papers", href: "/past-paper", icon: BookOpen },
  { name: "AI Teacher", href: "/ai-teacher", icon: GraduationCap },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Library },
  { name: "Social", href: "/social", icon: Users },
];

export default function AppNavigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Effect to handle clicks outside the navigation to collapse it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  return (
    <nav
      ref={navRef}
      // Styling for iOS-like appearance: white background, shadow, rounded right corners.
      // Removed 'fixed top-0 left-0' so the navigation takes up space in the document flow.
      className={cn(
        "h-full z-50 flex flex-col items-start bg-white text-gray-900 transition-all duration-300 border-r-[#00000020] border-r-1 border-l",
        isExpanded ? "w-64" : "w-[75px]"
      )}
    >
      {/* Toggle Button - styled for a cleaner, iOS-like look with chevron icons */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="m-4 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle Navigation"
      >
        {/* Conditional rendering of chevron icons based on expansion state */}
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Navigation Items Container */}
      <div className="flex flex-col gap-2 mt-10 w-full px-4"> {/* Added horizontal padding for items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon; // Dynamic icon component

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-black hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon size={20} className="min-w-[20px] min-h-[20px] m-0" />
              <span
                className={cn(
                  "text-sm whitespace-nowrap transition-opacity duration-300",
                  isExpanded ? "opacity-100 ml-0" : "opacity-0 ml-0"
                )}
                style={{
                  width: isExpanded ? "auto" : 0,
                  overflow: "hidden",
                  display: "inline-block",
                }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}



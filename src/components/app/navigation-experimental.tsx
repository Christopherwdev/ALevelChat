"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { Home, User } from "lucide-react";

/**
 * The navigation bar component for the web application.
 * It now functions as a collapsible overlay at the top middle of the screen.
 * It collapses into a capsule "AIToLearn" and expands when clicked.
 * It collapses back when clicking outside the expanded menu.
 */
const navItems = [
  { name: "Learn", href: "/learn" },
  { name: "Past Papers", href: "/past-paper" },
  { name: "AI Teacher", href: "/ai-teacher" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Resources", href: "/resources" },
  { name: "Social", fun: () => {}, href: "/social" },
];

export default function AppNavigation() {
  const pathname = usePathname();
  // State to manage whether the navigation is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  // Ref to detect clicks outside the navigation component
  const navRef = useRef(null);

  /**
   * Effect hook to handle clicks outside the navigation menu.
   * If a click occurs outside the `navRef` element, the menu collapses.
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    // Add event listener for mousedown on the document
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  return (
    <nav
      ref={navRef} // Attach the ref to the main navigation container
      // Positioning and styling for the overlay navigation
      className="fixed top-[15px] left-1/2 -translate-x-1/2 z-50"
    >
      {/* Expanded navigation bar - always rendered but controlled by opacity/scale */}
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 rounded-full px-1 gap-1 border-[2px] border-[#00000010] h-[50px] font-bold",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Home button */}
        <Link
          className="flex bg-gray-300 text-gray-500 p-2 rounded-full hover:bg-gray-400 items-center justify-center transition-all"
          href="/"
          aria-label="home"
        >
          <Home size={25} />
        </Link>
        {/* Navigation items */}
        <div className="flex items-center justify-center rounded-full p-1 gap-1 flex-nowrap">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-gray-700 transition-all text-sm whitespace-nowrap",
                  isActive && "bg-white text-gray-900 border-2 border-[#ff3b30]",
                  !isActive && "text-gray-700 hover:bg-gray-300",
                )}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        {/* User profile button */}
        <Link
          className="flex bg-gray-300 text-gray-500 p-2 rounded-full hover:bg-gray-400 items-center justify-center transition-all"
          href="/profile"
          aria-label="my profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          <User size={25} />
        </Link>
      </div>

      {/* Collapsed capsule button - always rendered but controlled by opacity/scale */}
      <button
        onClick={() => setIsExpanded(true)} // Expand when the capsule is clicked
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 h-[50px] bg-gray-200 text-gray-700 rounded-full border-[2px] border-[#00000010] font-bold",
          "transition-all duration-300 ease-in-out",
          !isExpanded ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
          "hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        )}
        aria-label="Expand navigation"
      >
        AIToLearn
      </button>
    </nav>
  );
}
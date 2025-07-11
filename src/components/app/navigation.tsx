"use client";

import { useState, useRef} from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn"; // Assuming cn utility is available
import Link from "next/link";
import { Home, BookOpen, Files, LayoutDashboard, Library, Users, BotMessageSquare, User } from "lucide-react";

const navItems = [
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Past Papers", href: "/past-paper", icon: Files },
  { name: "AI Teacher", href: "/ai-teacher", icon: BotMessageSquare },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { name: "Resources", href: "/resources", icon: Library },
  // { name: "Social", href: "/social", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

interface AppNavigationProps {
  collapsedWidth?: number;
}

export default function AppNavigation({ collapsedWidth = 70 }: AppNavigationProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Sidebar auto-expands/contracts on hover (desktop only)
  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsExpanded(true);
  };
  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsExpanded(false);
  };

  return (
    <nav
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="z-1000 flex lg:flex-col flex-row items-center lg:items-start bg-[rgba(255,255,255,0.90)] backdrop-blur-[15px] text-gray-900 transition-all duration-300 border-r-[#00000010] lg:border-r-2 border-t-[#00000010] lg:border-t-0 w-full lg:w-auto"
      style={
        typeof window !== 'undefined' && window.innerWidth >= 1024
          ? { width: isExpanded ? "256px" : `${collapsedWidth}px`, height: "100%" }
          : { width: "100%", height: "100%" }
      }
    >
      {/* Home Button */}
      <Link
        href="/"
        className="m-3 w-[44px] h-[44px] p-[10px] bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center content-center lg:block hidden"
        aria-label="Home"
      >
        <Home size={24} />
      </Link>
      {/* Navigation Items Container */}
      <div className="flex lg:flex-col flex-row gap-x-4 gap-y-0 lg:gap-x-0 lg:gap-y-2 lg:mt-10 w-full flex-1 px-2 lg:px-3 justify-center lg:justify-start overflow-x-auto lg:overflow-y-auto overflow-y-hidden lg:overflow-x-hidden scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon; // Dynamic icon component

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-2 lg:p-3 rounded-lg transition-all duration-300 flex-shrink-0",
                isActive
                  ? "bg-black text-white font-medium"
                  : "text-black hover:bg-[#00000010] hover:text-gray-900"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} className="min-w-[20px] min-h-[20px] m-0" />
              {isExpanded && (
                <span className="hidden lg:inline text-sm whitespace-nowrap transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

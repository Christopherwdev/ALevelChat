"use client";

import { useState, useRef} from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn"; // Assuming cn utility is available
import Link from "next/link";
import { Home, BookOpen, GraduationCap, LayoutDashboard, Library, Users, BotMessageSquare, User } from "lucide-react";

const navItems = [
  { name: "Learn", href: "/learn", icon: GraduationCap },
  { name: "Past Papers", href: "/past-paper", icon: BookOpen },
  { name: "AI Teacher", href: "/ai-teacher", icon: BotMessageSquare },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Library },
  { name: "Social", href: "/social", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

interface AppNavigationProps {
  collapsedWidth?: number;
}

export default function AppNavigation({ collapsedWidth = 70 }: AppNavigationProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Sidebar auto-expands/contracts on hover
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  return (
    <nav
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "h-full z-1000 flex flex-col items-start bg-[rgba(255,255,255,0.90)] backdrop-blur-[15px] text-gray-900 transition-all duration-300 border-r-[#00000010] border-r-2",
        isExpanded ? "w-64" : `w-[${collapsedWidth}px]`,
      )}
    >
      {/* Home Button */}
      <Link
        href="/"
        className="m-3 p-3 w-[44px] h-[44px] bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        aria-label="Home"
      >
        <Home size={24} />
      </Link>

      {/* Navigation Items Container */}
      <div className="flex flex-col gap-2 mt-10 w-full px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon; // Dynamic icon component

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                isActive
                  ? "bg-[#BBDEFB50] text-blue-700 font-medium"
                  : "text-black hover:bg-[#00000010] hover:text-gray-900"
              )}
              aria-current={isActive ? "page" : undefined}
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

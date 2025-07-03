"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { Home, User } from "lucide-react";

/**
 * NOTE: This doesn't work well on mobile, 
 * we might want to reduce the number of tabs or switch to a different layout
 */
const navItems = [
  { name: "Learn", href: "/learn" },
  { name: "Practice", href: "/practice" },
  { name: "Past Papers", href: "/past-paper" },
  { name: "AI Hub", href: "/ai-hub" },
  { name: "Resources", href: "/resources" },
  { name: "Social", href: "/social" },
];

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0">
      <div className="flex items-center justify-center pt-4 gap-2">
        <Link
          className="flex bg-[rgba(216, 216, 216, 0.8)] text-gray-500 p-2 rounded-full hover:bg-gray-200 items-center justify-center backdrop-blur-[5px] transition-all"
          href="/"
          aria-label="home"
          // aria-current={pathname === "/" ? "page" : undefined}  not needed because home page doesn't use this navbar
        >
          <Home size={25} />
        </Link>
        <div className="flex items-center justify-center bg-[rgba(216, 216, 216, 0.8)] rounded-full p-1 gap-2 backdrop-blur-[5px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-gray-700 transition-all text-sm hover:shadow",
                  isActive && "bg-white shadow text-gray-900",
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
        <Link
          className="flex bg-[rgba(216, 216, 216, 0.8)] text-gray-500 p-2 rounded-full hover:bg-gray-200 items-center justify-center backdrop-blur-[5px] transition-all"
          href="/profile"
          aria-label="my profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          <User size={25} />
        </Link>
      </div>
    </nav>
  );
}

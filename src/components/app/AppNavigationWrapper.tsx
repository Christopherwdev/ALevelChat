"use client";
import { usePathname } from "next/navigation";
import AppNavigation from "./navigation";

export default function AppNavigationWrapper() {
  const pathname = usePathname();
  const hideHeader =
    pathname.startsWith("/past-paper/viewer") ||
    pathname.startsWith("/learn/edexcel-igcse/chinese/listening") ||
    pathname.startsWith("/learn/edexcel-igcse/chinese/reading") ||
    pathname.startsWith("/learn/edexcel-igcse/chinese/translating") ||
    pathname.startsWith("/learn/edexcel-igcse/chinese/writing");
  return !hideHeader ? <AppNavigation /> : null;
} 
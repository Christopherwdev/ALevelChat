// Simple utility for merging class names (like clsx or tailwind-merge)
export function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

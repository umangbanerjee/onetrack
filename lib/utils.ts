import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined, pattern: string = "MMM d, yyyy"): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern);
  } catch {
    return String(date);
  }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return String(date);
  }
}

export function getStatusBadgeClasses(colorHex?: string): { bg: string; text: string; border: string; dot: string } {
  // Returns safe Tailwind styles matching database hex or fallback
  return {
    bg: "bg-slate-500/10",
    text: "text-slate-200",
    border: "border-slate-500/20",
    dot: colorHex || "#64748b",
  };
}

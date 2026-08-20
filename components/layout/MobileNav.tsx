"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenQuickAdd?: () => void;
  isAdmin?: boolean;
}

export function MobileNav({ onOpenQuickAdd, isAdmin = false }: MobileNavProps) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Dash" },
    { href: "/applications", label: "Apps" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/settings", label: "Config" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around font-mono select-none shadow-lg">
      {items.slice(0, 2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1 text-xs rounded-sm transition-all active:scale-95",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            [{item.label}]
          </Link>
        );
      })}

      {onOpenQuickAdd && (
        <button
          onClick={onOpenQuickAdd}
          className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-sm inline-flex items-center gap-1 active:scale-95 transition-all shadow-sm"
        >
          <span>LOG</span>
          <Plus className="h-3 w-3" />
        </button>
      )}

      {items.slice(2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1 text-xs rounded-sm transition-all active:scale-95",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            [{item.label}]
          </Link>
        );
      })}
    </div>
  );
}

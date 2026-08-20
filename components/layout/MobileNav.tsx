"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LayoutDashboard, Briefcase, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenQuickAdd?: () => void;
  isAdmin?: boolean;
}

export function MobileNav({ onOpenQuickAdd, isAdmin = false }: MobileNavProps) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Dash", icon: LayoutDashboard },
    { href: "/applications", label: "Apps", icon: Briefcase },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
    { href: "/settings", label: "Config", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around font-mono select-none shadow-xl">
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 active:scale-95",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>[{item.label}]</span>
          </Link>
        );
      })}

      {onOpenQuickAdd && (
        <button
          onClick={onOpenQuickAdd}
          className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-sm inline-flex items-center gap-1 active:scale-95 transition-all shadow-md"
        >
          <span>LOG</span>
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}

      {items.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 active:scale-95",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>[{item.label}]</span>
          </Link>
        );
      })}
    </div>
  );
}

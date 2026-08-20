"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/statuses", label: "Statuses" },
    { href: "/admin/sources", label: "Channels" },
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Admin Section Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
          ADMIN CONFIG CONSOLE
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Config-driven pipeline stages, recruitment sources, and platform administration.
        </p>
      </div>

      {/* Sub-nav Tabs */}
      <div className="border-b border-border flex items-center gap-1.5 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 py-1 text-xs font-mono rounded-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              [{tab.label}]
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}

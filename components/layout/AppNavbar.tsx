"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface AppNavbarProps {
  onOpenQuickAdd?: () => void;
  isAdmin?: boolean;
}

export function AppNavbar({ isAdmin = false }: AppNavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/applications", label: "Applications" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border select-none font-mono transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <span className="font-bold text-sm tracking-tight text-foreground bg-primary text-primary-foreground px-2 py-0.5 rounded-sm transition-transform group-hover:scale-[1.02]">
              ONETRACK
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              [v1.0]
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1 text-xs font-mono transition-all duration-150 rounded-sm hover:scale-[1.02]",
                    isActive
                      ? "text-foreground font-bold bg-muted shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  [{link.label}]
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tools: Minimalist Theme Toggle + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="flex items-center pl-1 border-l border-border">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-7 w-7 rounded-sm border border-border transition-transform hover:scale-105",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

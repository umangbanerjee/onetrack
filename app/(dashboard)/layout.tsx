"use client";

import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuickAddModal } from "@/components/applications/QuickAddModal";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ApplicationStatus, ApplicationSource, DEFAULT_STATUSES, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { useUser } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isLoaded } = useUser();

  const loadConfig = async () => {
    try {
      const [resStatus, resSource] = await Promise.all([
        fetch("/api/config/statuses", { cache: "no-store" }),
        fetch("/api/config/sources", { cache: "no-store" }),
      ]);
      if (resStatus.ok) {
        const data = await resStatus.json();
        if (Array.isArray(data) && data.length > 0) setStatuses(data);
      }
      if (resSource.ok) {
        const data = await resSource.json();
        if (Array.isArray(data) && data.length > 0) setSources(data);
      }
    } catch (err) {
      console.warn("Could not load dynamic statuses/sources config:", err);
    }
  };

  const checkUserRole = async () => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (res.ok) {
        const profile = await res.json();
        setIsAdmin(profile.isAdmin === true || profile.role === "admin");
      }
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserRole();
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 pb-20 md:pb-8">
      <AppNavbar
        onOpenQuickAdd={() => setQuickAddOpen(true)}
        isAdmin={isAdmin}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </div>

      <MobileNav
        onOpenQuickAdd={() => setQuickAddOpen(true)}
        isAdmin={isAdmin}
      />

      <QuickAddModal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        statuses={statuses}
        sources={sources}
        onSuccess={() => {
          // Trigger custom refresh event for active page
          window.dispatchEvent(new Event("onetrack:application-updated"));
        }}
      />

      <InstallPrompt />
    </div>
  );
}

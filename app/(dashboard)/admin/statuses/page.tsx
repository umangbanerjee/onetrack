"use client";

import { useState, useEffect } from "react";
import { StatusConfigTable } from "@/components/admin/StatusConfigTable";
import { ApplicationStatus, DEFAULT_STATUSES } from "@/lib/constants/defaults";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStatusesPage() {
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatuses = async () => {
    try {
      const res = await fetch("/api/config/statuses");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setStatuses(data);
      }
    } catch (err) {
      console.error("Failed to load statuses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <StatusConfigTable statuses={statuses} onRefresh={fetchStatuses} />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { SourceConfigList } from "@/components/admin/SourceConfigList";
import { ApplicationSource, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSources = async () => {
    try {
      const res = await fetch("/api/config/sources");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setSources(data);
      }
    } catch (err) {
      console.error("Failed to load sources:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
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
      <SourceConfigList sources={sources} onRefresh={fetchSources} />
    </div>
  );
}

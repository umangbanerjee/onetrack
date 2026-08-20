"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { SourceBreakdown } from "@/components/dashboard/SourceBreakdown";
import { RecentApplicationsList } from "@/components/dashboard/RecentApplicationsList";
import { Button } from "@/components/ui/button";
import { DashboardSummary } from "@/lib/supabase/db";
import { ApplicationStatus, DEFAULT_STATUSES } from "@/lib/constants/defaults";
import { Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const [resSummary, resStatuses] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch("/api/config/statuses"),
      ]);

      if (resSummary.ok) {
        const data = await resSummary.json();
        setSummary(data);
      }
      if (resStatuses.ok) {
        const statusData = await resStatuses.json();
        if (Array.isArray(statusData) && statusData.length > 0) {
          setStatuses(statusData);
        }
      }

      if (showToast) {
        toast.success("[SYNC] Metrics updated from database");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener("onetrack:application-updated", handleUpdate);
    return () => window.removeEventListener("onetrack:application-updated", handleUpdate);
  }, [fetchDashboardData]);

  const displayName = user?.firstName || user?.fullName || "applicant";

  if (isLoading) {
    return (
      <div className="space-y-6 font-mono text-xs">
        <div className="border border-border p-4 bg-card rounded-sm flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">[SYNCING DATABASE METRICS...]</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono select-none animate-in fade-in duration-300">
      {/* Terminal Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            USER: {displayName.toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(new Date(), "yyyy-MM-dd")} • search command center
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchDashboardData(true)}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "syncing..." : "Sync"}</span>
          </Button>

          <Link href="/applications/new">
            <Button size="sm" variant="primary" className="group shadow-sm hover:shadow">
              <span>Log Application</span>
              <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Streak and Weekly Target Widget with Gamified Hunter Tier */}
      <StreakWidget
        currentStreak={summary?.currentStreakDays || 0}
        thisWeekCount={summary?.appliedThisWeek || 0}
        weeklyGoal={summary?.weeklyGoal || 5}
        totalApplications={summary?.totalApplications || 0}
        recentActivityDates={summary?.trendData?.filter((t) => t.count > 0).map((t) => t.date) || []}
      />

      {/* KPI Cards Grid */}
      <KpiGrid
        total={summary?.totalApplications || 0}
        thisWeek={summary?.appliedThisWeek || 0}
        thisMonth={summary?.appliedThisMonth || 0}
        activePipeline={summary?.activePipelineCount || 0}
        responseRate={summary?.responseRatePercent || 0}
        weeklyGoal={summary?.weeklyGoal || 5}
        streakDays={summary?.currentStreakDays || 0}
      />

      {/* Velocity Trend and Pipeline Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={summary?.trendData || []} />
        <StatusDonutChart
          data={summary?.statusDistribution || []}
          total={summary?.totalApplications || 0}
        />
      </div>

      {/* Source Channels and Recent Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SourceBreakdown
            data={summary?.sourceDistribution || []}
            total={summary?.totalApplications || 0}
          />
        </div>
        <div className="lg:col-span-2">
          <RecentApplicationsList
            applications={summary?.recentApplications || []}
            statuses={statuses}
          />
        </div>
      </div>
    </div>
  );
}

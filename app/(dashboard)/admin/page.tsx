"use client";

import { useState, useEffect } from "react";
import { PlatformOverviewMetrics, PlatformStats } from "@/components/admin/PlatformOverviewMetrics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sliders, Globe, Users, ArrowRight, Database, RefreshCw, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate, formatRelativeDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats & { recent_activity?: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      if (showToast) toast.success("Telemetry refreshed!");
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-sm" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono select-none">
      {/* Platform Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            ADMIN TELEMETRY & SYSTEM CONTROL
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time platform metrics, applicant activity, and config management.
          </p>
        </div>
        <Button
          onClick={() => fetchStats(true)}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          className="h-8 text-xs font-mono self-start sm:self-auto gap-1.5"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Platform KPI Grid */}
      <PlatformOverviewMetrics stats={stats || { total_applications: 0, active_applicants: 0, total_registered_users: 0, active_pipeline_count: 0, total_offers_count: 0, interview_stage_count: 0 }} />

      {/* Quick Config Control Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Card className="border border-border bg-card rounded-sm shadow-none p-5 space-y-3">
          <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Pipeline Statuses</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Add new stages, customize badge colors, and adjust terminal boundaries.
            </p>
          </div>
          <Link href="/admin/statuses" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 group">
              <span>Manage Statuses</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </Card>

        <Card className="border border-border bg-card rounded-sm shadow-none p-5 space-y-3">
          <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Recruitment Channels</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Create and manage job discovery sources across LinkedIn, referrals, and portals.
            </p>
          </div>
          <Link href="/admin/sources" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 group">
              <span>Manage Sources</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </Card>

        <Card className="border border-border bg-card rounded-sm shadow-none p-5 space-y-3">
          <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">User Management</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Promote co-admins, review registered applicant accounts, or toggle access.
            </p>
          </div>
          <Link href="/admin/users" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5 group">
              <span>Manage Users</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Live System Activity Feed */}
      {stats?.recent_activity && stats.recent_activity.length > 0 && (
        <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span>PLATFORM RECENT SUBMISSION FEED</span>
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Latest job applications recorded across all applicant accounts
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-secondary/50">
                REAL-TIME LOG
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {stats.recent_activity.map((app: any) => (
                <div key={app.id} className="p-3 sm:px-5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{app.company_name}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-muted-foreground">{app.role_title}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Applied: {formatDate(app.date_applied)} ({formatRelativeDate(app.date_applied)})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status && (
                      <Badge
                        variant="outline"
                        dotColor={app.status.color || "#201d1d"}
                        className="text-[10px] py-0.5 px-2 bg-secondary/50"
                      >
                        {app.status.label}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Config-Driven Architecture Notice */}
      <Card className="border border-border bg-card/60 rounded-sm p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <Database className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Config-Driven Architecture Active:</strong> All pipeline statuses, recruitment sources, and user roles are dynamically stored in database tables. No hardcoding or server redeployments required.
        </div>
      </Card>
    </div>
  );
}

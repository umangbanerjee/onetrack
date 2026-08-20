"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, FileText, Zap, TrendingUp, Award, Calendar, CheckCircle } from "lucide-react";

export interface PlatformStats {
  total_applications: number;
  active_applicants: number;
  active_users_7d?: number;
  active_users_30d?: number;
  total_registered_users: number;
  applications_today?: number;
  applications_this_week?: number;
  avg_applications_per_user?: number;
  active_pipeline_count: number;
  total_offers_count: number;
  interview_stage_count: number;
}

interface PlatformOverviewMetricsProps {
  stats: PlatformStats;
}

export function PlatformOverviewMetrics({ stats }: PlatformOverviewMetricsProps) {
  const cards = [
    {
      title: "REGISTERED USERS",
      value: stats.total_registered_users || 0,
      subtext: `${stats.active_users_7d || stats.active_applicants || 0} active in last 7 days`,
      icon: Users,
      highlight: false,
    },
    {
      title: "ACTIVE USERS (30D)",
      value: stats.active_users_30d || stats.active_applicants || 0,
      subtext: "engaged platform applicants",
      icon: Activity,
      highlight: false,
    },
    {
      title: "TOTAL APPLICATIONS",
      value: stats.total_applications || 0,
      subtext: `Avg ${stats.avg_applications_per_user || 0} apps / user`,
      icon: FileText,
      highlight: false,
    },
    {
      title: "SUBMISSIONS TODAY",
      value: stats.applications_today || 0,
      subtext: `${stats.applications_this_week || 0} logged this week`,
      icon: Calendar,
      highlight: (stats.applications_today || 0) > 0,
    },
    {
      title: "ACTIVE PIPELINES",
      value: stats.active_pipeline_count || 0,
      subtext: "open in progress",
      icon: TrendingUp,
      highlight: false,
    },
    {
      title: "INTERVIEWS ACTIVE",
      value: stats.interview_stage_count || 0,
      subtext: "OA & rounds scheduled",
      icon: Zap,
      highlight: false,
    },
    {
      title: "OFFERS SECURED",
      value: stats.total_offers_count || 0,
      subtext: "accepted & received offers",
      icon: Award,
      highlight: (stats.total_offers_count || 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 font-mono">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`border border-border bg-card rounded-sm shadow-none transition-all hover:border-primary/40 ${
              card.highlight ? "ring-1 ring-primary/20" : ""
            }`}
          >
            <CardContent className="p-3.5 space-y-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
              </div>
              <div className="text-xl font-bold text-foreground">
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{card.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

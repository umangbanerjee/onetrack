"use client";

import { Card, CardContent } from "@/components/ui/card";

interface KpiGridProps {
  total: number;
  thisWeek: number;
  thisMonth: number;
  activePipeline: number;
  responseRate: number;
  weeklyGoal?: number;
  streakDays?: number;
}

export function KpiGrid({
  total,
  thisWeek,
  thisMonth,
  activePipeline,
  responseRate,
  weeklyGoal = 5,
}: KpiGridProps) {
  const cards = [
    {
      label: "[TOTAL LOGGED]",
      value: total,
      subtext: "lifetime submissions",
    },
    {
      label: "[THIS WEEK]",
      value: thisWeek,
      subtext: `goal: ${weeklyGoal} apps (${Math.round((thisWeek / Math.max(weeklyGoal, 1)) * 100)}%)`,
    },
    {
      label: "[THIS MONTH]",
      value: thisMonth,
      subtext: "logged current month",
    },
    {
      label: "[ACTIVE PIPELINE]",
      value: activePipeline,
      subtext: "interviews & OAs",
    },
    {
      label: "[RESPONSE RATE]",
      value: `${responseRate}%`,
      subtext: "stage conversion",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border border-border bg-card rounded-sm shadow-none"
        >
          <CardContent className="p-3.5 sm:p-4 space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              {card.label}
            </span>
            <div className="text-2xl font-bold text-foreground">
              {card.value}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {card.subtext}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

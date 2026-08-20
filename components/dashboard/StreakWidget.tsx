"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, CalendarDays, CheckCircle2 } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

interface StreakWidgetProps {
  currentStreak: number;
  thisWeekCount: number;
  weeklyGoal: number;
  recentActivityDates?: string[];
}

export function StreakWidget({
  currentStreak,
  thisWeekCount,
  weeklyGoal,
  recentActivityDates = [],
}: StreakWidgetProps) {
  const goalProgress = Math.min(Math.round((thisWeekCount / Math.max(weeklyGoal, 1)) * 100), 100);
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday

  // Generate 7 days of the active week (Mon - Sun)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = addDays(weekStart, i);
    const dayStr = format(dayDate, "yyyy-MM-dd");
    const isToday = isSameDay(dayDate, now);
    const isPastOrToday = dayDate <= now;
    const hasActivity = recentActivityDates.includes(dayStr);

    return {
      dayLabel: format(dayDate, "EEE"), // Mon, Tue...
      dayNumber: format(dayDate, "d"),
      dateStr: dayStr,
      isToday,
      isPastOrToday,
      hasActivity,
    };
  });

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Column: Streak Momentum */}
          <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-border/60 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Zap className="h-3.5 w-3.5 fill-primary/30" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                    {currentStreak > 0 ? `${currentStreak}-DAY STREAK` : "0 DAYS STREAK"}
                  </span>
                  {currentStreak >= 3 ? (
                    <Badge variant="warning" className="text-[9px] py-0 px-1 font-mono">
                      MOMENTUM
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono text-muted-foreground bg-secondary/30">
                      DAILY GOAL
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {currentStreak > 0
                    ? "Active submission streak maintained."
                    : "Log 1 application today to ignite momentum."}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column: 7-Day Habit Matrix */}
          <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-border/60 pb-4 md:pb-0 md:px-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span>THIS WEEK&apos;S HABIT</span>
              </span>
              <span className="text-[10px] font-bold text-foreground">
                {thisWeekCount} active {thisWeekCount === 1 ? "day" : "days"}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {weekDays.map((day) => {
                return (
                  <div
                    key={day.dateStr}
                    className={`flex flex-col items-center justify-center py-1 rounded-sm border text-[10px] transition-colors ${
                      day.hasActivity
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                        : day.isToday
                        ? "border-primary/50 bg-secondary/50 font-bold text-foreground"
                        : "border-border/40 bg-secondary/20 text-muted-foreground"
                    }`}
                    title={`${day.dayLabel} (${day.dateStr}): ${day.hasActivity ? "Application Logged" : "No submission"}`}
                  >
                    <span className="text-[9px] uppercase leading-none opacity-80">
                      {day.dayLabel.charAt(0)}
                    </span>
                    <span className="text-[10px] leading-tight mt-0.5">
                      {day.dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Weekly Target Progress */}
          <div className="md:col-span-4 space-y-2 md:pl-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground uppercase flex items-center gap-1 font-bold text-[10px]">
                <Target className="h-3 w-3" />
                <span>WEEKLY TARGET</span>
              </span>
              <span className="font-bold text-foreground">
                {thisWeekCount} / {weeklyGoal} apps ({goalProgress}%)
              </span>
            </div>

            <Progress
              value={goalProgress}
              className="h-2 rounded-sm bg-muted"
              indicatorColor="bg-foreground"
            />

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {Math.max(0, weeklyGoal - thisWeekCount) > 0
                  ? `${weeklyGoal - thisWeekCount} more needed by Sunday`
                  : "Weekly velocity achieved!"}
              </span>
              {goalProgress >= 100 && (
                <span className="text-success font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  [COMPLETED]
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

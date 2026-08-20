"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrendChartProps {
  data: { date: string; count: number; label: string }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const [viewMode, setViewMode] = useState<"daily" | "accumulated">("daily");

  const chartData = data.map((item, idx) => {
    let value = item.count;
    if (viewMode === "accumulated") {
      value = data.slice(0, idx + 1).reduce((acc, curr) => acc + curr.count, 0);
    }
    return {
      ...item,
      displayCount: value,
    };
  });

  const totalSum = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xs uppercase tracking-wider font-bold">
            [+] APPLICATION VELOCITY (14-DAY)
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
            {totalSum === 0 ? "No activity logged in 14-day window" : "Daily submissions timeline"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={viewMode === "daily" ? "primary" : "outline"}
            onClick={() => setViewMode("daily")}
            className="h-7 px-2 text-[11px] font-mono"
          >
            [Daily]
          </Button>
          <Button
            size="sm"
            variant={viewMode === "accumulated" ? "primary" : "outline"}
            onClick={() => setViewMode("accumulated")}
            className="h-7 px-2 text-[11px] font-mono"
          >
            [Cumulative]
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontFamily="inherit"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontFamily="inherit"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="border border-border bg-background p-2 rounded-sm text-xs font-mono">
                        <p className="text-muted-foreground">{d.label}</p>
                        <p className="font-bold text-foreground mt-0.5">
                          {d.displayCount} {viewMode === "daily" ? "apps logged" : "total apps"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="displayCount"
                stroke="var(--foreground)"
                strokeWidth={1.5}
                fill="var(--secondary)"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

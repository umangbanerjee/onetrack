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
            {totalSum === 0 ? "No activity logged in 14-day window" : `${totalSum} total submissions tracked in window`}
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
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
                domain={[0, (dataMax: number) => Math.max(dataMax + 1, 3)]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="border border-border bg-background p-2 rounded-sm text-xs font-mono shadow-md">
                        <p className="text-muted-foreground">{d.label} ({d.date})</p>
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
                strokeWidth={2}
                fill="url(#velocityGradient)"
                dot={({ cx, cy, payload }) => {
                  if (payload.displayCount > 0) {
                    return (
                      <circle
                        key={payload.date}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill="var(--foreground)"
                        stroke="var(--background)"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  return null;
                }}
                activeDot={{
                  r: 5,
                  fill: "var(--foreground)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface StatusDistributionItem {
  id: string;
  label: string;
  color: string;
  count: number;
  percentage: number;
}

interface StatusDonutChartProps {
  data: StatusDistributionItem[];
  total: number;
}

export function StatusDonutChart({ data, total }: StatusDonutChartProps) {
  const activeItems = data.filter((item) => item.count > 0);

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wider font-bold">
          [+] PIPELINE STAGE DISTRIBUTION
        </CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
          Breakdown across pipeline stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground text-xs space-y-1">
            <p className="font-bold text-foreground">[0 APPLICATIONS LOGGED]</p>
            <p className="text-[11px]">Log your first application to view pipeline distribution.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Donut Chart */}
            <div className="h-48 w-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="border border-border bg-background p-2 rounded-sm text-xs font-mono">
                            <p className="font-bold text-foreground">[{d.label}]</p>
                            <p className="text-muted-foreground mt-0.5">
                              {d.count} apps ({d.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={activeItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {activeItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--card)" strokeWidth={1} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-bold text-foreground">{total}</span>
                <span className="text-[10px] text-muted-foreground uppercase">TOTAL</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 w-full space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 px-2 border border-border/40 rounded-sm bg-secondary/30"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-foreground truncate max-w-[120px] sm:max-w-[140px]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-bold text-foreground">{item.count}</span>
                    <span className="text-[10px] w-8 text-right">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

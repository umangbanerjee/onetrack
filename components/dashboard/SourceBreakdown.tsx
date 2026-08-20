"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SourceDistributionItem {
  id: string;
  label: string;
  count: number;
  percentage: number;
}

interface SourceBreakdownProps {
  data: SourceDistributionItem[];
  total: number;
}

export function SourceBreakdown({ data, total }: SourceBreakdownProps) {
  const activeSources = data
    .filter((src) => src.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wider font-bold">
          [+] SOURCING CHANNELS
        </CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
          Distribution across recruitment sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeSources.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground text-xs space-y-1">
            <p className="font-bold text-foreground">[0 CHANNELS LOGGED]</p>
            <p className="text-[11px]">Select sources (LinkedIn, Referrals, etc.) when logging applications.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {activeSources.map((src) => (
              <div key={src.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">[{src.label}]</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground font-bold">{src.count}</strong> ({src.percentage}%)
                  </span>
                </div>
                <Progress value={src.percentage} className="h-1.5 rounded-sm bg-muted" indicatorColor="bg-foreground" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

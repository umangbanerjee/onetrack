"use client";

import Link from "next/link";
import { ApplicationItem, ApplicationStatus } from "@/lib/constants/defaults";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

interface RecentApplicationsListProps {
  applications: ApplicationItem[];
  statuses: ApplicationStatus[];
  onStatusChange?: (appId: string, newStatusId: string) => void;
}

export function RecentApplicationsList({
  applications,
  statuses,
}: RecentApplicationsListProps) {
  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xs uppercase tracking-wider font-bold">
            RECENT APPLICATIONS
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
            Latest pipeline submissions
          </CardDescription>
        </div>
        <Link href="/applications">
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] gap-1 group">
            <span>View All</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold text-foreground">[0 APPLICATIONS IN PIPELINE]</p>
            <p className="text-[11px]">Press [N] or click Log Application to record your first submission.</p>
            <div className="pt-2">
              <Link href="/applications/new">
                <Button size="sm" variant="primary" className="group shadow-sm hover:shadow">
                  <span>Log First Application</span>
                  <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {applications.map((app) => {
              const statusObj = app.status || statuses.find((s) => s.id === app.status_id);
              return (
                <div
                  key={app.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/applications/${app.id}`}
                        className="font-bold text-xs text-foreground hover:underline"
                      >
                        {app.company_name}
                      </Link>
                      <span className="text-muted-foreground text-xs">/</span>
                      <span className="text-xs text-muted-foreground">{app.role_title}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Applied {formatRelativeDate(app.date_applied)} ({formatDate(app.date_applied)})</span>
                      {app.location && <span>• {app.location}</span>}
                      {app.salary_range && <span>• {app.salary_range}</span>}
                    </div>
                  </div>

                  <div className="self-start sm:self-auto shrink-0">
                    <Badge
                      variant="outline"
                      dotColor={statusObj?.color || "#201d1d"}
                      className="text-[10px] py-0.5 px-2 bg-secondary/50 font-mono shadow-2xs"
                    >
                      {statusObj?.label || "Applied"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

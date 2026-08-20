"use client";

import Link from "next/link";
import { ApplicationItem, ApplicationStatus } from "@/lib/constants/defaults";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Edit3, Trash2, ChevronDown } from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: ApplicationItem;
  statuses: ApplicationStatus[];
  onStatusChange: (appId: string, newStatusId: string) => void;
  onDeleteClick: (app: ApplicationItem) => void;
}

export function ApplicationCard({
  application: app,
  statuses,
  onStatusChange,
  onDeleteClick,
}: ApplicationCardProps) {
  const statusObj = app.status || statuses.find((s) => s.id === app.status_id) || statuses[0];

  return (
    <Card className="border border-border bg-card rounded-sm shadow-xs font-mono transition-all hover:border-foreground/20">
      <CardContent className="p-3.5 space-y-2.5">
        {/* Top Header: Company, Role & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <Link
              href={`/applications/${app.id}`}
              className="font-bold text-xs text-foreground hover:underline"
            >
              {app.company_name}
            </Link>
            <p className="text-[11px] text-muted-foreground">{app.role_title}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 font-mono rounded-sm border border-border bg-card shadow-lg">
              <DropdownMenuItem asChild className="text-xs font-mono cursor-pointer">
                <Link href={`/applications/${app.id}`} className="flex items-center gap-2">
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Details</span>
                </Link>
              </DropdownMenuItem>
              {app.job_url && (
                <DropdownMenuItem asChild className="text-xs font-mono cursor-pointer">
                  <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>Job Link</span>
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteClick(app)}
                className="text-xs font-mono text-destructive cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
          {app.location && <span>loc:{app.location}</span>}
          {app.salary_range && <span>comp:{app.salary_range}</span>}
          {app.source && <span>src:[{app.source.label}]</span>}
        </div>

        {/* Bottom Bar: Status Switcher & Date */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-border bg-background hover:bg-secondary text-[10px] font-mono transition-all active:scale-95">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: statusObj?.color || "#201d1d" }}
                />
                <span className="font-bold text-foreground">{statusObj?.label || "Applied"}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-60 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 font-mono rounded-sm border border-border bg-card shadow-lg">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">[UPDATE STAGE]</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((st) => (
                <DropdownMenuItem
                  key={st.id}
                  onClick={() => onStatusChange(app.id, st.id)}
                  className="text-xs font-mono cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className={st.id === app.status_id ? "font-bold text-foreground" : "text-muted-foreground"}>
                      {st.label}
                    </span>
                  </div>
                  {st.id === app.status_id && <span className="text-[10px] text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-[10px] text-muted-foreground">
            {formatRelativeDate(app.date_applied)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

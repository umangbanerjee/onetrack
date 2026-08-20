"use client";

import Link from "next/link";
import { ApplicationItem, ApplicationStatus } from "@/lib/constants/defaults";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Edit3, Trash2, ChevronDown, Send } from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

interface ApplicationTableProps {
  applications: ApplicationItem[];
  statuses: ApplicationStatus[];
  sortBy: "date_applied" | "company_name" | "updated_at";
  sortOrder: "asc" | "desc";
  onSortChange: (column: "date_applied" | "company_name" | "updated_at") => void;
  onStatusChange: (appId: string, newStatusId: string) => void;
  onDeleteClick: (app: ApplicationItem) => void;
  onOutreachClick?: (app: ApplicationItem) => void;
}

export function ApplicationTable({
  applications,
  statuses,
  sortBy,
  sortOrder,
  onSortChange,
  onStatusChange,
  onDeleteClick,
  onOutreachClick,
}: ApplicationTableProps) {
  return (
    <div className="border border-border bg-card rounded-sm overflow-hidden font-mono select-none shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
              <th
                className="py-2.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onSortChange("company_name")}
              >
                <span>COMPANY / ROLE {sortBy === "company_name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
              </th>
              <th className="py-2.5 px-4">STAGE</th>
              <th className="py-2.5 px-4 hidden md:table-cell">CHANNEL</th>
              <th
                className="py-2.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onSortChange("date_applied")}
              >
                <span>APPLIED {sortBy === "date_applied" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
              </th>
              <th className="py-2.5 px-4 hidden lg:table-cell">FOLLOW-UP</th>
              <th className="py-2.5 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {applications.map((app) => {
              const statusObj = app.status || statuses.find((s) => s.id === app.status_id) || statuses[0];

              return (
                <tr key={app.id} className="hover:bg-secondary/40 transition-colors group">
                  {/* Company & Role */}
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/applications/${app.id}`}
                          className="font-bold text-foreground hover:underline"
                        >
                          {app.company_name}
                        </Link>
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Open original job link"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                        {app.role_title}
                        {app.location ? ` • ${app.location}` : ""}
                      </span>
                    </div>
                  </td>

                  {/* Interactive Status Switcher */}
                  <td className="py-2.5 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-border/80 bg-background/80 hover:bg-secondary text-[11px] font-mono transition-all active:scale-95 shadow-2xs">
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
                  </td>

                  {/* Channel / Source */}
                  <td className="py-2.5 px-4 hidden md:table-cell text-[11px] text-muted-foreground">
                    {app.source ? `[${app.source.label}]` : "—"}
                  </td>

                  {/* Date Applied */}
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col text-[11px]">
                      <span className="font-medium text-foreground">{formatDate(app.date_applied)}</span>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeDate(app.date_applied)}</span>
                    </div>
                  </td>

                  {/* Follow Up */}
                  <td className="py-2.5 px-4 hidden lg:table-cell text-[11px] text-muted-foreground">
                    {app.next_follow_up_date ? (
                      <span className="text-warning font-medium bg-warning/10 px-1.5 py-0.5 rounded-xs">
                        {formatDate(app.next_follow_up_date, "MMM d")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Actions Menu */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      {onOutreachClick && (
                        <Button
                          onClick={() => onOutreachClick(app)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] font-mono text-muted-foreground hover:text-foreground hidden sm:inline-flex items-center gap-1"
                          title="Draft recruiter message or follow up"
                        >
                          <Send className="h-3 w-3 text-emerald-400" />
                          <span>Outreach</span>
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 font-mono rounded-sm border border-border bg-card shadow-lg">
                          <DropdownMenuItem asChild className="text-xs font-mono cursor-pointer">
                            <Link href={`/applications/${app.id}`} className="flex items-center gap-2">
                              <Edit3 className="h-3 w-3" />
                              <span>Edit & Prep</span>
                            </Link>
                          </DropdownMenuItem>
                          {onOutreachClick && (
                            <DropdownMenuItem
                              onClick={() => onOutreachClick(app)}
                              className="text-xs font-mono cursor-pointer flex items-center gap-2"
                            >
                              <Send className="h-3 w-3 text-emerald-400" />
                              <span>Draft Outreach</span>
                            </DropdownMenuItem>
                          )}
                          {app.job_url && (
                            <DropdownMenuItem asChild className="text-xs font-mono cursor-pointer">
                              <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <ExternalLink className="h-3 w-3" />
                                <span>Job Posting</span>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

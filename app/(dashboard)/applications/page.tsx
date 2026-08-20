"use client";

import { useState, useEffect, useCallback } from "react";
import { ApplicationItem, ApplicationStatus, ApplicationSource, DEFAULT_STATUSES, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { FilterBar } from "@/components/applications/FilterBar";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { DeleteConfirmDialog } from "@/components/applications/DeleteConfirmDialog";
import { SmartOutreachModal } from "@/components/applications/SmartOutreachModal";
import { DatePreset } from "@/components/applications/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date_applied" | "company_name" | "updated_at">("date_applied");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialogs State
  const [appToDelete, setAppToDelete] = useState<ApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOutreachApp, setSelectedOutreachApp] = useState<ApplicationItem | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);
      selectedStatusIds.forEach((id) => params.append("statusId", id));
      selectedSourceIds.forEach((id) => params.append("sourceId", id));
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const [resApps, resStatuses, resSources] = await Promise.all([
        fetch(`/api/applications?${params.toString()}`),
        fetch("/api/config/statuses"),
        fetch("/api/config/sources"),
      ]);

      if (resApps.ok) {
        const data = await resApps.json();
        setApplications(data.items || []);
        setTotalCount(data.total || 0);
      }
      if (resStatuses.ok) {
        const data = await resStatuses.json();
        if (Array.isArray(data) && data.length > 0) setStatuses(data);
      }
      if (resSources.ok) {
        const data = await resSources.json();
        if (Array.isArray(data) && data.length > 0) setSources(data);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, fromDate, toDate, selectedStatusIds, selectedSourceIds, sortBy, sortOrder]);

  useEffect(() => {
    fetchApplications();

    const handleUpdate = () => fetchApplications();
    window.addEventListener("onetrack:application-updated", handleUpdate);
    return () => window.removeEventListener("onetrack:application-updated", handleUpdate);
  }, [fetchApplications]);

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatusIds((prev) =>
      prev.includes(statusId) ? prev.filter((id) => id !== statusId) : [...prev, statusId]
    );
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  const handleDateRangeChange = (preset: DatePreset, from?: string, to?: string) => {
    setDatePreset(preset);
    setFromDate(from);
    setToDate(to);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDatePreset("all");
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedStatusIds([]);
    setSelectedSourceIds([]);
  };

  const handleSortChange = (col: "date_applied" | "company_name" | "updated_at") => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  const handleInlineStatusChange = async (appId: string, newStatusId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: newStatusId }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("[UPDATED] Stage changed");
      fetchApplications();
      window.dispatchEvent(new Event("onetrack:application-updated"));
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/applications/${appToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");
      toast.success("[DELETED] Application removed");
      setAppToDelete(null);
      fetchApplications();
      window.dispatchEvent(new Event("onetrack:application-updated"));
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    if (applications.length === 0) {
      toast.info("[EXPORT] No applications to export");
      return;
    }

    const headers = ["Company", "Role", "Status", "Source", "Date Applied", "Location", "Salary", "Notes", "Job URL"];
    const rows = applications.map((a) => [
      `"${a.company_name.replace(/"/g, '""')}"`,
      `"${a.role_title.replace(/"/g, '""')}"`,
      `"${a.status?.label || ""}"`,
      `"${a.source?.label || ""}"`,
      a.date_applied,
      `"${(a.location || "").replace(/"/g, '""')}"`,
      `"${(a.salary_range || "").replace(/"/g, '""')}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
      `"${a.job_url || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `onetrack_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("[EXPORT] CSV downloaded");
  };

  return (
    <div className="space-y-6 font-mono select-none animate-in fade-in duration-300">
      {/* Terminal Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            APPLICATIONS DIRECTORY [{totalCount} TOTAL]
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track, filter, and inspect your active submissions pipeline.
          </p>
        </div>

        <Link href="/applications/new">
          <Button size="sm" variant="primary" className="group shadow-sm hover:shadow">
            <span>Log Application</span>
            <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
          </Button>
        </Link>
      </div>

      {/* Filter Control Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        datePreset={datePreset}
        fromDate={fromDate}
        toDate={toDate}
        onDateRangeChange={handleDateRangeChange}
        selectedStatusIds={selectedStatusIds}
        onStatusToggle={handleStatusToggle}
        selectedSourceIds={selectedSourceIds}
        onSourceToggle={handleSourceToggle}
        onClearFilters={handleClearFilters}
        statuses={statuses}
        sources={sources}
        totalCount={totalCount}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="border border-border p-4 bg-card text-xs text-muted-foreground rounded-sm flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>[QUERYING APPLICATIONS...]</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center space-y-2 bg-card rounded-sm text-xs">
          <p className="font-bold text-foreground">[0 APPLICATIONS FOUND]</p>
          <p className="text-muted-foreground max-w-sm mx-auto text-[11px]">
            {searchQuery || selectedStatusIds.length > 0 || datePreset !== "all"
              ? "No applications matched active filters."
              : "No applications logged yet. Log your first opportunity to get started."}
          </p>
          <div className="pt-2">
            {searchQuery || selectedStatusIds.length > 0 || datePreset !== "all" ? (
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            ) : (
              <Link href="/applications/new">
                <Button variant="primary" size="sm" className="group shadow-sm hover:shadow">
                  <span>Log First Application</span>
                  <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ApplicationTable
              applications={applications}
              statuses={statuses}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onStatusChange={handleInlineStatusChange}
              onDeleteClick={setAppToDelete}
              onOutreachClick={setSelectedOutreachApp}
            />
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-2.5">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                statuses={statuses}
                onStatusChange={handleInlineStatusChange}
                onDeleteClick={setAppToDelete}
                onOutreachClick={setSelectedOutreachApp}
              />
            ))}
          </div>
        </>
      )}

      {/* Smart Outreach & Follow-Up Modal */}
      <SmartOutreachModal
        application={selectedOutreachApp}
        open={!!selectedOutreachApp}
        onOpenChange={(open) => !open && setSelectedOutreachApp(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        application={appToDelete}
        open={!!appToDelete}
        onOpenChange={(open) => !open && setAppToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

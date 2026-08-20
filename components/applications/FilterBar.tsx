"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector, DatePreset } from "./DateRangeSelector";
import { ApplicationStatus, ApplicationSource } from "@/lib/constants/defaults";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, X, RotateCcw, ChevronDown } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  datePreset: DatePreset;
  fromDate?: string;
  toDate?: string;
  onDateRangeChange: (preset: DatePreset, from?: string, to?: string) => void;
  selectedStatusIds: string[];
  onStatusToggle: (statusId: string) => void;
  selectedSourceIds: string[];
  onSourceToggle: (sourceId: string) => void;
  onClearFilters: () => void;
  statuses: ApplicationStatus[];
  sources: ApplicationSource[];
  totalCount: number;
  onExportCsv?: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  datePreset,
  fromDate,
  toDate,
  onDateRangeChange,
  selectedStatusIds,
  onStatusToggle,
  selectedSourceIds,
  onSourceToggle,
  onClearFilters,
  statuses,
  sources,
  onExportCsv,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    datePreset !== "all" ||
    selectedStatusIds.length > 0 ||
    selectedSourceIds.length > 0;

  return (
    <div className="space-y-3 font-mono">
      {/* Top Filter Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, role, location..."
            className="h-8 pl-8 pr-7 text-xs font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Date Filter */}
          <DateRangeSelector
            selectedPreset={datePreset}
            fromDate={fromDate}
            toDate={toDate}
            onSelect={onDateRangeChange}
          />

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs font-mono gap-1">
                <span>Stage{selectedStatusIds.length > 0 ? ` (${selectedStatusIds.length})` : ""}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 font-mono rounded-sm border border-border bg-card shadow-lg">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">[FILTER BY STAGE]</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status.id}
                  checked={selectedStatusIds.includes(status.id)}
                  onCheckedChange={() => onStatusToggle(status.id)}
                  className="text-xs font-mono cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: status.color }} />
                  <span>{status.label}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Source Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs font-mono gap-1">
                <span>Channel{selectedSourceIds.length > 0 ? ` (${selectedSourceIds.length})` : ""}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 font-mono rounded-sm border border-border bg-card shadow-lg">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">[FILTER BY CHANNEL]</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sources.map((src) => (
                <DropdownMenuCheckboxItem
                  key={src.id}
                  checked={selectedSourceIds.includes(src.id)}
                  onCheckedChange={() => onSourceToggle(src.id)}
                  className="text-xs font-mono cursor-pointer"
                >
                  <span>{src.label}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export CSV Button */}
          {onExportCsv && (
            <Button
              onClick={onExportCsv}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono hidden sm:inline-flex gap-1.5"
              title="Export filtered records to CSV"
            >
              <Download className="h-3 w-3" />
              <span>Export CSV</span>
            </Button>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-mono text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono animate-in fade-in duration-150">
          <span className="text-muted-foreground text-[10px]">Active filters:</span>
          {searchQuery && (
            <Badge variant="outline" className="gap-1 text-[10px] py-0.5 bg-secondary/50">
              <span>q:&quot;{searchQuery}&quot;</span>
              <X className="h-2.5 w-2.5 cursor-pointer hover:text-foreground" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {datePreset !== "all" && (
            <Badge variant="outline" className="gap-1 text-[10px] py-0.5 bg-secondary/50">
              <span>range:{datePreset}</span>
              <X className="h-2.5 w-2.5 cursor-pointer hover:text-foreground" onClick={() => onDateRangeChange("all")} />
            </Badge>
          )}
          {selectedStatusIds.map((id) => {
            const st = statuses.find((s) => s.id === id);
            return (
              <Badge key={id} variant="outline" className="gap-1 text-[10px] py-0.5 bg-secondary/50">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st?.color }} />
                <span>{st?.label || id}</span>
                <X className="h-2.5 w-2.5 cursor-pointer hover:text-foreground" onClick={() => onStatusToggle(id)} />
              </Badge>
            );
          })}
          {selectedSourceIds.map((id) => {
            const src = sources.find((s) => s.id === id);
            return (
              <Badge key={id} variant="outline" className="gap-1 text-[10px] py-0.5 bg-secondary/50">
                <span>{src?.label || id}</span>
                <X className="h-2.5 w-2.5 cursor-pointer hover:text-foreground" onClick={() => onSourceToggle(id)} />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

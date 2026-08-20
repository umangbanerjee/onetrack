"use client";

import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  format,
} from "date-fns";

export type DatePreset = "all" | "today" | "week" | "month" | "last30" | "custom";

interface DateRangeSelectorProps {
  selectedPreset: DatePreset;
  fromDate?: string;
  toDate?: string;
  onSelect: (preset: DatePreset, from?: string, to?: string) => void;
}

export function DateRangeSelector({
  selectedPreset,
  fromDate,
  toDate,
  onSelect,
}: DateRangeSelectorProps) {
  const handlePresetSelect = (preset: DatePreset) => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    if (preset === "all") {
      onSelect("all", undefined, undefined);
    } else if (preset === "today") {
      onSelect("today", todayStr, todayStr);
    } else if (preset === "week") {
      const from = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const to = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
      onSelect("week", from, to);
    } else if (preset === "month") {
      const from = format(startOfMonth(today), "yyyy-MM-dd");
      const to = format(endOfMonth(today), "yyyy-MM-dd");
      onSelect("month", from, to);
    } else if (preset === "last30") {
      const from = format(subDays(today, 30), "yyyy-MM-dd");
      onSelect("last30", from, todayStr);
    }
  };

  const getLabel = () => {
    switch (selectedPreset) {
      case "today":
        return "Applied: Today";
      case "week":
        return "Applied: This Week";
      case "month":
        return "Applied: This Month";
      case "last30":
        return "Applied: Last 30 Days";
      case "custom":
        return `Custom (${fromDate} to ${toDate})`;
      default:
        return "All Dates";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-lg font-medium">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{getLabel()}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => handlePresetSelect("all")} className="text-xs">
          All Time
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePresetSelect("today")} className="text-xs">
          Today
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePresetSelect("week")} className="text-xs">
          This Week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePresetSelect("month")} className="text-xs">
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePresetSelect("last30")} className="text-xs">
          Last 30 Days
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

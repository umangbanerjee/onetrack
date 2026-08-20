"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/validations/application";
import { ApplicationStatus, ApplicationSource } from "@/lib/constants/defaults";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface QuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: ApplicationStatus[];
  sources: ApplicationSource[];
  onSuccess?: () => void;
}

export function QuickAddModal({
  open,
  onOpenChange,
  statuses,
  sources,
  onSuccess,
}: QuickAddModalProps) {
  const [addAnother, setAddAnother] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultStatusId = statuses.find((s) => s.key === "applied")?.id || statuses[0]?.id || "status-1";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: "",
      role_title: "",
      status_id: defaultStatusId,
      source_id: sources[0]?.id || null,
      date_applied: format(new Date(), "yyyy-MM-dd"),
      job_url: "",
      location: "",
      salary_range: "",
      notes: "",
      next_follow_up_date: "",
    },
  });

  const selectedStatusId = watch("status_id");
  const selectedSourceId = watch("source_id");

  useEffect(() => {
    if (open && defaultStatusId) {
      setValue("status_id", defaultStatusId);
      setValue("date_applied", format(new Date(), "yyyy-MM-dd"));
    }
  }, [open, defaultStatusId, setValue]);

  // Global shortcut (Key "N")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key.toLowerCase() === "n" && !open && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save application");
      }

      toast.success(`[SAVED] ${data.company_name} — ${data.role_title}`);

      // Dispatch global update event to sync dashboard and tables immediately
      window.dispatchEvent(new Event("onetrack:application-updated"));

      if (onSuccess) onSuccess();

      if (addAnother) {
        reset({
          company_name: "",
          role_title: "",
          status_id: selectedStatusId,
          source_id: selectedSourceId,
          date_applied: format(new Date(), "yyyy-MM-dd"),
          job_url: "",
          location: "",
          salary_range: "",
          notes: "",
          next_follow_up_date: "",
        });
      } else {
        onOpenChange(false);
        reset();
      }
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:max-w-lg p-5 rounded-sm font-mono border border-border bg-card shadow-xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>LOG NEW APPLICATION</span>
              <Plus className="h-3.5 w-3.5 text-primary" />
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Fast entry for active job search pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 font-mono text-xs">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="company_name" className="text-[11px] font-bold">
                Company Name *
              </Label>
              <Input
                id="company_name"
                {...register("company_name")}
                placeholder="e.g. Stripe, Linear, Google"
                autoFocus
                className="h-8 text-xs font-mono"
              />
              {errors.company_name && (
                <p className="text-[10px] text-destructive">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="role_title" className="text-[11px] font-bold">
                Role Title *
              </Label>
              <Input
                id="role_title"
                {...register("role_title")}
                placeholder="e.g. Software Engineer"
                className="h-8 text-xs font-mono"
              />
              {errors.role_title && (
                <p className="text-[10px] text-destructive">{errors.role_title.message}</p>
              )}
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold">
                Pipeline Stage *
              </Label>
              <Select
                value={selectedStatusId}
                onValueChange={(val) => setValue("status_id", val)}
              >
                <SelectTrigger className="h-8 text-xs font-mono">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="font-mono rounded-sm border border-border bg-card">
                  {statuses.map((st) => (
                    <SelectItem key={st.id} value={st.id} className="text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                        <span>{st.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="date_applied" className="text-[11px] font-bold">
                Date Applied *
              </Label>
              <Input
                id="date_applied"
                type="date"
                {...register("date_applied")}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Source Channel */}
          <div className="space-y-1">
            <Label className="text-[11px] font-bold">Channel</Label>
            <Select
              value={selectedSourceId || "none"}
              onValueChange={(val) => setValue("source_id", val === "none" ? null : val)}
            >
              <SelectTrigger className="h-8 text-xs font-mono">
                <SelectValue placeholder="Where did you apply? (LinkedIn, Referral...)" />
              </SelectTrigger>
              <SelectContent className="font-mono rounded-sm border border-border bg-card">
                <SelectItem value="none" className="text-xs text-muted-foreground font-mono">None specified</SelectItem>
                {sources.map((src) => (
                  <SelectItem key={src.id} value={src.id} className="text-xs font-mono">
                    {src.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Collapsible Optional Info */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] text-foreground hover:underline font-bold inline-flex items-center gap-1 transition-colors"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <span>Hide optional fields</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  <span>Add URL, location, salary or notes</span>
                </>
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-2.5 pt-2 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="location" className="text-[11px]">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="e.g. Remote, San Francisco"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="salary_range" className="text-[11px]">Salary / Comp</Label>
                    <Input
                      id="salary_range"
                      {...register("salary_range")}
                      placeholder="e.g. $150k - $180k"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="job_url" className="text-[11px]">Job Posting URL</Label>
                  <Input
                    id="job_url"
                    type="url"
                    {...register("job_url")}
                    placeholder="https://..."
                    className="h-8 text-xs font-mono"
                  />
                  {errors.job_url && (
                    <p className="text-[10px] text-destructive">{errors.job_url.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-[11px]">Notes</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Referral contact, next steps, OA deadline..."
                    rows={2}
                    className="text-xs min-h-[50px] font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Switch
                id="add-another"
                checked={addAnother}
                onCheckedChange={setAddAnother}
              />
              <Label htmlFor="add-another" className="text-[11px] text-muted-foreground cursor-pointer">
                [continuous batch logging]
              </Label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="group"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span>Save Application</span>
                    <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

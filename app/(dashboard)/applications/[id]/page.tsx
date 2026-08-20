"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/validations/application";
import { ApplicationItem, ApplicationStatus, ApplicationSource, DEFAULT_STATUSES, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/applications/DeleteConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ExternalLink, Trash2, Save, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [application, setApplication] = useState<ApplicationItem | null>(null);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const selectedStatusId = watch("status_id");
  const selectedSourceId = watch("source_id");

  const loadData = useCallback(async () => {
    try {
      const [resApp, resStatuses, resSources] = await Promise.all([
        fetch(`/api/applications/${appId}`),
        fetch("/api/config/statuses"),
        fetch("/api/config/sources"),
      ]);

      if (resStatuses.ok) {
        const statusData = await resStatuses.json();
        if (Array.isArray(statusData) && statusData.length > 0) setStatuses(statusData);
      }
      if (resSources.ok) {
        const sourceData = await resSources.json();
        if (Array.isArray(sourceData) && sourceData.length > 0) setSources(sourceData);
      }

      if (resApp.ok) {
        const appData: ApplicationItem = await resApp.json();
        setApplication(appData);
        reset({
          company_name: appData.company_name,
          role_title: appData.role_title,
          status_id: appData.status_id,
          source_id: appData.source_id || null,
          date_applied: appData.date_applied,
          job_url: appData.job_url || "",
          location: appData.location || "",
          salary_range: appData.salary_range || "",
          notes: appData.notes || "",
          next_follow_up_date: appData.next_follow_up_date || "",
        });
      } else {
        toast.error("[ERROR] Application not found");
        router.push("/applications");
      }
    } catch (err) {
      console.error("Failed to fetch application:", err);
    } finally {
      setIsLoading(false);
    }
  }, [appId, reset, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update application");
      }

      const updated = await res.json();
      setApplication(updated);
      toast.success("[UPDATED] Changes saved");
      window.dispatchEvent(new Event("onetrack:application-updated"));
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatusAdvance = async (newStatusId: string) => {
    setValue("status_id", newStatusId, { shouldDirty: true });
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: newStatusId }),
      });
      if (!res.ok) throw new Error("Failed to advance stage");
      toast.success("[UPDATED] Pipeline stage updated");
      loadData();
      window.dispatchEvent(new Event("onetrack:application-updated"));
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");
      toast.success("[DELETED] Application removed");
      window.dispatchEvent(new Event("onetrack:application-updated"));
      router.push("/applications");
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 font-mono text-xs text-muted-foreground flex items-center gap-2">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span>[FETCHING APPLICATION RECORD...]</span>
      </div>
    );
  }

  if (!application) return null;

  const currentStatusObj = statuses.find((s) => s.id === application.status_id) || statuses[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/applications">
            <Button variant="outline" size="sm" className="gap-1.5 group">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {application.company_name} / {application.role_title}
            </h1>
            <p className="text-xs text-muted-foreground">
              applied: {formatDate(application.date_applied)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {application.job_url && (
            <a href={application.job_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Job Posting</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Button
            onClick={() => setIsDeleteOpen(true)}
            variant="destructive"
            size="sm"
            className="gap-1.5"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Stage Progression Bar */}
      <Card className="border border-border bg-card p-4 rounded-sm shadow-none font-mono">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-muted-foreground uppercase text-[11px]">
              ADVANCE PIPELINE STAGE
            </span>
            <Badge variant="outline" dotColor={currentStatusObj.color} className="text-[10px]">
              CURRENT: {currentStatusObj.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {statuses.map((st) => {
              const isCurrent = st.id === application.status_id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleQuickStatusAdvance(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-all border active:scale-95 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-secondary/40 hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: isCurrent ? "currentColor" : st.color }}
                  />
                  <span>{st.label}</span>
                  {isCurrent && <Check className="h-3 w-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Edit Details Form */}
      <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-xs uppercase tracking-wider font-bold">
              APPLICATION DETAILS
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground">
              Update company, compensation, interview notes, and follow-up reminders.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="company_name" className="text-[11px] font-bold">Company Name</Label>
                <Input id="company_name" {...register("company_name")} className="h-8 text-xs font-mono" />
                {errors.company_name && (
                  <p className="text-[10px] text-destructive">{errors.company_name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="role_title" className="text-[11px] font-bold">Role Title</Label>
                <Input id="role_title" {...register("role_title")} className="h-8 text-xs font-mono" />
                {errors.role_title && (
                  <p className="text-[10px] text-destructive">{errors.role_title.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Pipeline Stage</Label>
                <Select
                  value={selectedStatusId}
                  onValueChange={(val) => setValue("status_id", val, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
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
                <Label htmlFor="date_applied" className="text-[11px] font-bold">Date Applied</Label>
                <Input id="date_applied" type="date" {...register("date_applied")} className="h-8 text-xs font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Channel</Label>
                <Select
                  value={selectedSourceId || "none"}
                  onValueChange={(val) => setValue("source_id", val === "none" ? null : val, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue placeholder="Select channel" />
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

              <div className="space-y-1">
                <Label htmlFor="location" className="text-[11px] font-bold">Location</Label>
                <Input id="location" {...register("location")} placeholder="Remote, Hybrid, City" className="h-8 text-xs font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="salary_range" className="text-[11px] font-bold">Compensation Range</Label>
                <Input id="salary_range" {...register("salary_range")} placeholder="e.g. $150k - $180k" className="h-8 text-xs font-mono" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="next_follow_up_date" className="text-[11px] font-bold">Next Follow-Up Date</Label>
                <Input id="next_follow_up_date" type="date" {...register("next_follow_up_date")} className="h-8 text-xs font-mono" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="job_url" className="text-[11px] font-bold">Job URL</Label>
              <Input id="job_url" type="url" {...register("job_url")} placeholder="https://..." className="h-8 text-xs font-mono" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-[11px] font-bold">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                rows={4}
                placeholder="Log interviewer questions, prep links, compensation talk points..."
                className="text-xs min-h-[60px] font-mono"
              />
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 border-t border-border flex items-center justify-between mt-2 font-mono">
            <span className="text-[10px] text-muted-foreground">
              last modified: {formatRelativeDate(application.updated_at)}
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving || !isDirty}
              className="group shadow-sm hover:shadow"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        application={application}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

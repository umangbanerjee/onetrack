"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/validations/application";
import { ApplicationStatus, ApplicationSource, DEFAULT_STATUSES, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";

export default function NewApplicationPage() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

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
      status_id: DEFAULT_STATUSES[0]?.id || "status-1",
      source_id: DEFAULT_SOURCES[0]?.id || null,
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
    async function loadConfig() {
      try {
        const [resStatus, resSource] = await Promise.all([
          fetch("/api/config/statuses"),
          fetch("/api/config/sources"),
        ]);
        if (resStatus.ok) {
          const data = await resStatus.json();
          if (Array.isArray(data) && data.length > 0) {
            setStatuses(data);
            setValue("status_id", data[0].id);
          }
        }
        if (resSource.ok) {
          const data = await resSource.json();
          if (Array.isArray(data) && data.length > 0) {
            setSources(data);
            setValue("source_id", data[0].id);
          }
        }
      } catch (err) {
        console.warn("Could not load statuses/sources:", err);
      }
    }
    loadConfig();
  }, [setValue]);

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
        throw new Error(errorData.error || "Failed to create application");
      }

      toast.success(`[SAVED] ${data.company_name} — ${data.role_title}`);

      // Dispatch global update event
      window.dispatchEvent(new Event("onetrack:application-updated"));

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
        router.push("/applications");
      }
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-mono select-none animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link href="/applications">
          <Button variant="outline" size="sm" className="gap-1.5 group">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            RECORD JOB APPLICATION
          </h1>
          <p className="text-xs text-muted-foreground">
            Log opportunity details into database.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card rounded-sm shadow-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-5 space-y-4 font-mono text-xs">
            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="company_name" className="text-[11px] font-bold">
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  {...register("company_name")}
                  placeholder="e.g. Stripe, OpenAI, Figma"
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
                  placeholder="e.g. Senior Frontend Engineer"
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
                {errors.date_applied && (
                  <p className="text-[10px] text-destructive">{errors.date_applied.message}</p>
                )}
              </div>
            </div>

            {/* Source & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Channel</Label>
                <Select
                  value={selectedSourceId || "none"}
                  onValueChange={(val) => setValue("source_id", val === "none" ? null : val)}
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
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. Remote, San Francisco"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Salary & Job URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="salary_range" className="text-[11px] font-bold">Compensation Range</Label>
                <Input
                  id="salary_range"
                  {...register("salary_range")}
                  placeholder="e.g. $160k - $190k"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="job_url" className="text-[11px] font-bold">Job Posting URL</Label>
                <Input
                  id="job_url"
                  type="url"
                  {...register("job_url")}
                  placeholder="https://company.com/careers/..."
                  className="h-8 text-xs font-mono"
                />
                {errors.job_url && (
                  <p className="text-[10px] text-destructive">{errors.job_url.message}</p>
                )}
              </div>
            </div>

            {/* Next Follow Up */}
            <div className="space-y-1">
              <Label htmlFor="next_follow_up_date" className="text-[11px] font-bold">
                Follow-Up Date (Optional)
              </Label>
              <Input
                id="next_follow_up_date"
                type="date"
                {...register("next_follow_up_date")}
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="text-[11px] font-bold">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Tech stack, recruiter notes, interview dates..."
                rows={3}
                className="text-xs min-h-[60px] font-mono"
              />
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 mt-2 font-mono">
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Switch
                id="page-add-another"
                checked={addAnother}
                onCheckedChange={setAddAnother}
              />
              <Label htmlFor="page-add-another" className="text-[11px] text-muted-foreground cursor-pointer">
                [continuous entry mode]
              </Label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/applications" className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="group shadow-sm hover:shadow"
              >
                {isSubmitting ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <span>Save Application</span>
                    <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

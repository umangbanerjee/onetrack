"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/validations/application";
import { ApplicationItem, ApplicationStatus, ApplicationSource, DEFAULT_STATUSES, DEFAULT_SOURCES } from "@/lib/constants/defaults";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Send, Sparkles, Building2, Briefcase, DollarSign, MapPin, Globe, Calendar, Flame } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { SmartOutreachModal } from "@/components/applications/SmartOutreachModal";
import Link from "next/link";

const QUICK_COMPANIES = ["Google", "Microsoft", "Flipkart", "Swiggy", "Amazon", "Zomato", "Razorpay", "TCS", "Atlassian", "HDFC"];
const QUICK_ROLES = ["Full Stack Engineer", "Frontend Engineer", "Backend Engineer", "Data Analyst", "Product Designer"];

export default function NewApplicationPage() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(DEFAULT_STATUSES);
  const [sources, setSources] = useState<ApplicationSource[]>(DEFAULT_SOURCES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [outreachApp, setOutreachApp] = useState<ApplicationItem | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setFocus,
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

  const currentCompany = watch("company_name");
  const currentRole = watch("role_title");
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

  // Smart URL parser for company auto-fill
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value.toLowerCase();
    if (!currentCompany && url) {
      if (url.includes("stripe.com")) setValue("company_name", "Stripe");
      else if (url.includes("linear.app")) setValue("company_name", "Linear");
      else if (url.includes("google.com")) setValue("company_name", "Google");
      else if (url.includes("openai.com")) setValue("company_name", "OpenAI");
      else if (url.includes("meta.com")) setValue("company_name", "Meta");
      else if (url.includes("vercel.com")) setValue("company_name", "Vercel");
      else if (url.includes("figma.com")) setValue("company_name", "Figma");
      else if (url.includes("amazon.com")) setValue("company_name", "Amazon");
    }
  };

  const handleSelectQuickCompany = (company: string) => {
    setValue("company_name", company, { shouldValidate: true });
    setFocus("role_title");
  };

  const handleSelectQuickRole = (role: string) => {
    setValue("role_title", role, { shouldValidate: true });
  };

  const saveApplication = async (data: ApplicationFormValues, openOutreach = false) => {
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

      const savedApp: ApplicationItem = await res.json();
      toast.success(`🚀 [LOGGED] ${data.company_name} — ${data.role_title}`, {
        description: "Application successfully added to pipeline velocity!",
      });

      // Dispatch global update event
      window.dispatchEvent(new Event("onetrack:application-updated"));

      if (openOutreach) {
        setOutreachApp(savedApp);
      } else if (addAnother) {
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
        setFocus("company_name");
      } else {
        router.push("/applications");
      }
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ApplicationFormValues) => {
    return saveApplication(data, false);
  };

  const handleSaveAndOutreach = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit((data) => saveApplication(data, true))();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 font-mono select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <Link href="/applications">
            <Button variant="outline" size="sm" className="gap-1.5 group h-8">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>RECORD NEW APPLICATION</span>
              <Badge variant="outline" className="text-[10px] py-0 font-mono bg-secondary/50 text-emerald-400 border-emerald-500/30">
                <Flame className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                +50 XP
              </Badge>
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Log active target opportunity to track stages and velocity.
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-border bg-card rounded-sm shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-3 border-b border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>OPPORTUNITY DATA SHEET</span>
              </CardTitle>
              <span className="text-[10px] text-muted-foreground font-mono">
                [TAB to navigate • ENTER to submit]
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4 font-mono text-xs">
            {/* Quick Suggestions Pills */}
            <div className="space-y-1.5 p-3 rounded-sm bg-secondary/30 border border-border/60">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <span>⚡ Quick autofill chips</span>
                </span>
                <span>Click to apply</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {QUICK_COMPANIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectQuickCompany(c)}
                    className={`px-2 py-0.5 rounded-sm border text-[10px] transition-all hover:scale-105 active:scale-95 ${
                      currentCompany === c
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                        : "bg-background/80 hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Fields: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="company_name" className="text-[11px] font-bold flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-primary" />
                  <span>Company Name *</span>
                </Label>
                <Input
                  id="company_name"
                  {...register("company_name")}
                  placeholder="e.g. Flipkart, Google, Swiggy, TCS"
                  autoFocus
                  className={`h-8 text-xs font-mono transition-all ${
                    errors.company_name ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.company_name && (
                  <p className="text-[10px] text-destructive font-bold animate-in fade-in">
                    ↳ {errors.company_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="role_title" className="text-[11px] font-bold flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span>Role Title *</span>
                </Label>
                <Input
                  id="role_title"
                  {...register("role_title")}
                  placeholder="e.g. Software Engineer, Product Manager"
                  className={`h-8 text-xs font-mono transition-all ${
                    errors.role_title ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.role_title && (
                  <p className="text-[10px] text-destructive font-bold animate-in fade-in">
                    ↳ {errors.role_title.message}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Role Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0 text-[10px]">
              <span className="text-muted-foreground mr-1">Role presets:</span>
              {QUICK_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectQuickRole(r)}
                  className={`px-1.5 py-0.5 rounded-xs border text-[9px] transition-all hover:text-foreground ${
                    currentRole === r
                      ? "bg-secondary text-foreground border-foreground/40 font-bold"
                      : "bg-secondary/20 border-border/60 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Stage & Date Applied */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold flex items-center gap-1">
                  <span>Pipeline Stage *</span>
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
                <Label htmlFor="date_applied" className="text-[11px] font-bold flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>Date Applied *</span>
                </Label>
                <Input
                  id="date_applied"
                  type="date"
                  max={format(new Date(), "yyyy-MM-dd")}
                  {...register("date_applied")}
                  className={`h-8 text-xs font-mono transition-all ${
                    errors.date_applied ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.date_applied && (
                  <p className="text-[10px] text-destructive font-bold animate-in fade-in">
                    ↳ {errors.date_applied.message}
                  </p>
                )}
              </div>
            </div>

            {/* Source & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold">Recruitment Channel</Label>
                <Select
                  value={selectedSourceId || "none"}
                  onValueChange={(val) => setValue("source_id", val === "none" ? null : val)}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue placeholder="Where did you find this?" />
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
                <Label htmlFor="location" className="text-[11px] font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>Location</span>
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. Bangalore, Hyderabad, Gurgaon, Remote"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Compensation & Job URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="salary_range" className="text-[11px] font-bold flex items-center gap-1">
                  <span className="text-xs font-bold text-muted-foreground">₹</span>
                  <span>Compensation / CTC</span>
                </Label>
                <Input
                  id="salary_range"
                  {...register("salary_range")}
                  placeholder="e.g. ₹24 LPA - ₹30 LPA or ₹50k/mo"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="job_url" className="text-[11px] font-bold flex items-center gap-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span>Job Posting URL</span>
                </Label>
                <Input
                  id="job_url"
                  type="url"
                  {...register("job_url")}
                  onBlur={handleUrlBlur}
                  placeholder="https://company.com/careers/..."
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Follow Up & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="next_follow_up_date" className="text-[11px] font-bold">
                  Next Follow-Up Date (Optional)
                </Label>
                <Input
                  id="next_follow_up_date"
                  type="date"
                  {...register("next_follow_up_date")}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-[11px] font-bold">
                  Key Notes / Referral Contact
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Referral name, recruiter email, OA timeline..."
                  rows={2}
                  className="text-xs min-h-[45px] font-mono"
                />
              </div>
            </div>
          </CardContent>

          {/* Action Footer */}
          <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/10 font-mono">
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Switch
                id="page-add-another"
                checked={addAnother}
                onCheckedChange={setAddAnother}
              />
              <Label htmlFor="page-add-another" className="text-[11px] text-muted-foreground cursor-pointer">
                [continuous batch mode]
              </Label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <Link href="/applications" className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                  Cancel
                </Button>
              </Link>

              <Button
                type="button"
                onClick={handleSaveAndOutreach}
                variant="secondary"
                size="sm"
                disabled={isSubmitting}
                className="h-8 gap-1.5 border border-border text-xs font-bold"
                title="Save application and immediately draft recruiter message"
              >
                <Send className="h-3.5 w-3.5 text-emerald-400" />
                <span>Save & Outreach</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="h-8 gap-1.5 text-xs font-bold shadow-sm hover:shadow"
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

      {/* Outreach modal if triggered upon saving */}
      <SmartOutreachModal
        application={outreachApp}
        open={!!outreachApp}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOutreachApp(null);
            router.push("/applications");
          }
        }}
      />
    </div>
  );
}

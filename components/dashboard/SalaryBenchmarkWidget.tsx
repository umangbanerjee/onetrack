"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  Layers,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface YoYData {
  year: string;
  avg_salary_lakhs: number;
  growth_pct: number;
}

interface TopCompany {
  name: string;
  range: string;
  tier: string;
}

interface SalaryBenchmarkData {
  role: string;
  location: string;
  company?: string;
  experience_level: string;
  currency: string;
  salary_period: string;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  yoy_growth_percent: number;
  yoy_history: YoYData[];
  top_paying_companies: TopCompany[];
}

const ROLE_PRESETS = [
  { label: "SWE", value: "Software Engineer" },
  { label: "Product Mgr", value: "Product Manager" },
  { label: "Marketing", value: "Growth Marketing Manager" },
  { label: "Data Analyst", value: "Data Analyst" },
  { label: "Finance / IB", value: "Financial Analyst" },
  { label: "UI/UX", value: "Product Designer" },
  { label: "HR / Talent", value: "HR Business Partner" },
  { label: "SWE Intern", value: "Software Engineering Intern" },
];

const CITY_PRESETS = ["Bangalore", "Hyderabad", "Gurgaon / Delhi", "Mumbai", "Pune", "Remote India"];
const COMPANY_PRESETS = ["Google", "Flipkart", "HDFC Bank", "McKinsey", "Swiggy", "TCS"];

export function SalaryBenchmarkWidget() {
  const [roleTitle, setRoleTitle] = useState("Software Engineer");
  const [location, setLocation] = useState("Bangalore");
  const [companyName, setCompanyName] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (3-5y)");
  const [isLoading, setIsLoading] = useState(false);
  const [benchmark, setBenchmark] = useState<SalaryBenchmarkData | null>(null);

  const formatSalary = (val: number, period = "annual") => {
    if (period === "monthly") {
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L/mo`;
      return `₹${(val / 1000).toFixed(0)}k/mo`;
    }
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L/yr`;
    return `₹${val.toLocaleString()}/yr`;
  };

  const handleFetchBenchmark = async () => {
    if (!roleTitle.trim()) {
      toast.error("Please enter a role title");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/market-insights/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle,
          location: location || "Bangalore",
          companyName,
          experienceLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze market compensation");
      }

      setBenchmark(data);
      toast.success(`[MARKET DATA] Benchmarks loaded for ${data.role} in ${data.location}`);
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono text-xs select-none">
      <CardHeader className="pb-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 text-foreground">
            <span>[+] MARKET SALARY BENCHMARK & YOY TRENDS</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] bg-secondary/50 border-border text-muted-foreground">
            TECH & NON-TECH • INDIA MARKET
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Dedicated 3-Column Search Panel with direct chips under each input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Role / Domain */}
          <div className="space-y-2 p-3 rounded-sm bg-secondary/20 border border-border/70 flex flex-col justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-primary" />
                <span>Target Role (Any Domain)</span>
              </label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Software Engineer, Marketing Lead"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="pt-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Quick roles:</p>
              <div className="flex flex-wrap gap-1">
                {ROLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setRoleTitle(preset.value);
                      if (preset.value.includes("Intern")) setExperienceLevel("Internship");
                    }}
                    className="px-1.5 py-0.5 rounded-xs border border-border/70 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary text-[9px] transition-all"
                  >
                    +{preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: City / Location */}
          <div className="space-y-2 p-3 rounded-sm bg-secondary/20 border border-border/70 flex flex-col justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                <span>City / Region</span>
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Mumbai, Gurgaon"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="pt-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Quick cities:</p>
              <div className="flex flex-wrap gap-1">
                {CITY_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLocation(c)}
                    className="px-1.5 py-0.5 rounded-xs border border-border/70 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary text-[9px] transition-all"
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Company & Seniority */}
          <div className="space-y-2 p-3 rounded-sm bg-secondary/20 border border-border/70 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-primary" />
                  <span>Company</span>
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Flipkart"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" />
                  <span>Seniority</span>
                </label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono rounded-sm border border-border bg-card">
                    <SelectItem value="Internship" className="text-xs font-mono">Internship</SelectItem>
                    <SelectItem value="Junior (0-2y)" className="text-xs font-mono">Junior (0-2y)</SelectItem>
                    <SelectItem value="Mid-Level (3-5y)" className="text-xs font-mono">Mid-Level (3-5y)</SelectItem>
                    <SelectItem value="Senior (5-8y)" className="text-xs font-mono">Senior (5-8y)</SelectItem>
                    <SelectItem value="Staff / Lead (8y+)" className="text-xs font-mono">Staff / Lead (8y+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Quick companies:</p>
              <div className="flex flex-wrap gap-1">
                {COMPANY_PRESETS.map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setCompanyName(comp)}
                    className="px-1.5 py-0.5 rounded-xs border border-border/70 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary text-[9px] transition-all"
                  >
                    +{comp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex justify-end pt-1">
          <Button
            onClick={handleFetchBenchmark}
            disabled={isLoading}
            variant="primary"
            size="sm"
            className="h-8 px-5 gap-1.5 font-bold shadow-sm"
          >
            {isLoading ? (
              <span>Analyzing Market...</span>
            ) : (
              <>
                <Search className="h-3.5 w-3.5" />
                <span>Analyze Compensation</span>
              </>
            )}
          </Button>
        </div>

        {/* Real-Time Results Container */}
        {benchmark && (
          <div className="space-y-4 pt-3 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Result Line */}
            <div className="p-3 rounded-sm bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-foreground">
                  {benchmark.role} {benchmark.company ? `@ ${benchmark.company}` : ""}
                </span>
                <span className="text-muted-foreground text-[11px]">in {benchmark.location}</span>
                <Badge variant="outline" className="text-[9px] bg-background border-border font-mono">
                  {benchmark.experience_level}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[10px] text-muted-foreground">YoY Increment:</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono">
                  +{benchmark.yoy_growth_percent}% YoY
                </Badge>
              </div>
            </div>

            {/* Intuitive 4-Stage Compensation Spectrum (Easy to Understand) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Level 1: Starting Range */}
              <div className="p-3 rounded-sm bg-card border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">ENTRY RANGE</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                </div>
                <p className="text-sm sm:text-base font-bold text-foreground font-mono">
                  {formatSalary(benchmark.p25, benchmark.salary_period)}
                </p>
                <p className="text-[9px] text-muted-foreground">Starting offer baseline</p>
              </div>

              {/* Level 2: Market Average (Highlight) */}
              <div className="p-3 rounded-sm bg-card border-2 border-primary/40 space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.2 rounded-bl-sm">
                  MOST COMMON
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-primary uppercase font-bold">MARKET AVERAGE</p>
                </div>
                <p className="text-sm sm:text-base font-bold text-foreground font-mono">
                  {formatSalary(benchmark.median, benchmark.salary_period)}
                </p>
                <p className="text-[9px] text-muted-foreground">Typical standard offer</p>
              </div>

              {/* Level 3: Strong / Competitive Offer */}
              <div className="p-3 rounded-sm bg-card border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">STRONG OFFER</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-sm sm:text-base font-bold text-foreground font-mono">
                  {formatSalary(benchmark.p75, benchmark.salary_period)}
                </p>
                <p className="text-[9px] text-muted-foreground">Product & top tech firms</p>
              </div>

              {/* Level 4: Top Tier / Elite */}
              <div className="p-3 rounded-sm bg-card border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-emerald-400 uppercase font-bold">TOP TIER (MAX)</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                  {formatSalary(benchmark.p90, benchmark.salary_period)}
                </p>
                <p className="text-[9px] text-muted-foreground">Elite FAANG & Unicorns</p>
              </div>
            </div>

            {/* Visual Salary Scale Bar */}
            <div className="p-3 rounded-sm bg-secondary/15 border border-border/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>Base Range</span>
                <span className="text-primary font-bold">Average Standard</span>
                <span className="text-emerald-400 font-bold">Peak / Elite</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden flex border border-border/60">
                <div className="h-full bg-muted-foreground/40 w-1/4" title="Entry Range" />
                <div className="h-full bg-primary/70 w-1/2" title="Standard to Strong Market Range" />
                <div className="h-full bg-emerald-400 w-1/4" title="Elite Tier" />
              </div>
            </div>

            {/* YoY Growth History & Top Companies in Domain */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              {/* 3-Year YoY Progression */}
              <div className="lg:col-span-5 p-3.5 rounded-sm bg-secondary/20 border border-border space-y-2.5">
                <p className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>3-Year YoY Salary Progression</span>
                </p>
                <div className="space-y-2 pt-1">
                  {benchmark.yoy_history?.map((item) => (
                    <div
                      key={item.year}
                      className="p-2 rounded-xs bg-background/60 border border-border/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">[{item.year}]</span>
                        <span className="text-muted-foreground text-[11px]">Avg ₹{item.avg_salary_lakhs} LPA</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-secondary text-emerald-400 border-border font-mono">
                        +{item.growth_pct}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Paying Companies in Domain */}
              <div className="lg:col-span-7 p-3.5 rounded-sm bg-secondary/20 border border-border space-y-2.5">
                <p className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span>Top Hiring Companies for {benchmark.role} in {benchmark.location}</span>
                </p>
                <div className="space-y-1.5 pt-1">
                  {benchmark.top_paying_companies?.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xs bg-background/60 border border-border/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{comp.name}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-secondary/40 text-muted-foreground border-border/80">
                          {comp.tier}
                        </Badge>
                      </div>
                      <span className="font-bold text-foreground font-mono text-[11px]">{comp.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

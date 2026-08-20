import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  ShieldCheck,
  Filter,
  Flame,
  ChevronDown,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { TypewriterHeadline } from "@/components/landing/TypewriterHeadline";
import { HolographicDottedTarget } from "@/components/landing/HolographicDottedTarget";
import { AngledMarqueeRibbon } from "@/components/landing/AngledMarqueeRibbon";
import { VisualCareerRoadmap } from "@/components/landing/VisualCareerRoadmap";
import {
  TrendingUp,
  Award,
  Send,
} from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col justify-between selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-sm tracking-wider transition-transform group-hover:scale-[1.02]">
                ONETRACK
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                [v1.0]
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs text-muted-foreground">
              <a href="#roadmap" className="hover:text-foreground transition-colors">
                [Roadmap]
              </a>
              <a href="#features" className="hover:text-foreground transition-colors">
                [Features]
              </a>
              <a href="#comparison" className="hover:text-foreground transition-colors">
                [Why OneTrack]
              </a>
              <a href="#faqs" className="hover:text-foreground transition-colors">
                [FAQs]
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs group shadow-sm hover:shadow">
                <span>Start Free</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-16 space-y-10 sm:space-y-14 w-full">
        {/* Hero Section with 2-Column Responsive Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-1">
          {/* Left Column: Headline, Typewriter, Subtext, CTAs */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm bg-secondary/80 text-foreground text-[11px] border border-border">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="font-bold text-foreground">[PRECISION COMMAND CENTER]</span>
              <span className="text-muted-foreground hidden sm:inline">• Built for high-velocity searches</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-[40px] font-bold tracking-tight leading-[1.18] text-foreground">
              The high-velocity job search tracker for{" "}
              <TypewriterHeadline />
            </h1>

            <p className="text-xs sm:text-[13px] text-foreground/80 max-w-xl leading-relaxed font-medium">
              Stop losing high-value opportunities in bloated spreadsheets and slow notes. Log applications in under 5 seconds, track interview pipelines, and visualize hiring velocity with zero distraction.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link href="/sign-up">
                <Button size="sm" variant="primary" className="h-9 px-4 group shadow-md hover:shadow-lg gap-2 text-xs font-bold">
                  <span>Launch Workspace Free</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-medium">
                  <span>Sign In to Existing Account</span>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-[11px] text-foreground/80 pt-0.5 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-foreground">100% Free to Use</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-foreground">5-Second Fast Logging</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-foreground">Installable PWA (Offline Ready)</span>
              </span>
            </div>
          </div>

          {/* Right Column: 3D Holographic Achiever Target Visual */}
          <div className="lg:col-span-5 w-full">
            <HolographicDottedTarget />
          </div>
        </section>

        {/* Angled Kinetic Marquee Ribbon */}
        <AngledMarqueeRibbon />

        {/* Live Command Center Preview Mockup */}
        <section className="border border-border bg-card rounded-sm shadow-xl p-4 sm:p-6 space-y-5">
          {/* Top Bar of the Mockup */}
          <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="text-muted-foreground ml-2">[ACTIVE WORKSPACE: LIVE PIPELINE]</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
              <span className="hidden sm:inline">VELOCITY:</span>
              <Badge variant="outline" className="font-mono text-[10px] bg-secondary/40 text-foreground">
                12 APPS THIS WEEK
              </Badge>
            </div>
          </div>

          {/* Mockup Streak & Habit Matrix Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-secondary/30 rounded-sm border border-border/70 text-xs">
            <div className="md:col-span-4 flex items-center gap-2 border-b md:border-b-0 md:border-r border-border/60 pb-2 md:pb-0">
              <div className="h-6 w-6 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                <Flame className="h-3.5 w-3.5 fill-primary/30" />
              </div>
              <div>
                <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  5-DAY ACTIVE STREAK
                </span>
                <p className="text-[10px] text-muted-foreground">Daily momentum target met</p>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-between md:px-3 border-b md:border-b-0 md:border-r border-border/60 pb-2 md:pb-0">
              <span className="text-[10px] text-muted-foreground">HABIT MATRIX:</span>
              <div className="flex gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <span
                    key={idx}
                    className={`h-5 w-5 rounded-xs flex items-center justify-center text-[9px] font-bold ${
                      idx < 5
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-secondary border border-border text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex items-center justify-between text-[11px] md:pl-2">
              <span className="text-muted-foreground">WEEKLY GOAL:</span>
              <span className="font-bold text-foreground">12 / 10 apps (120%)</span>
            </div>
          </div>

          {/* Mockup Active Pipeline Table */}
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-12 text-[10px] text-muted-foreground uppercase font-bold py-1 border-b border-border px-2">
              <div className="col-span-4">Company &amp; Role</div>
              <div className="col-span-3">Stage</div>
              <div className="col-span-2 hidden sm:block">Channel</div>
              <div className="col-span-3 text-right">Status / Date</div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-sm bg-secondary/15 hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50">
              <div className="col-span-4">
                <span className="font-bold text-foreground">Stripe</span>
                <span className="text-[11px] text-muted-foreground block">Senior Full Stack Engineer</span>
              </div>
              <div className="col-span-3">
                <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] py-0">
                  Interview Scheduled
                </Badge>
              </div>
              <div className="col-span-2 hidden sm:block text-muted-foreground text-[11px]">
                Referral
              </div>
              <div className="col-span-3 text-right text-muted-foreground text-[11px]">
                <span className="text-foreground font-bold">Round 2</span> • Tomorrow 2:00 PM
              </div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-sm bg-secondary/15 hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50">
              <div className="col-span-4">
                <span className="font-bold text-foreground">Linear</span>
                <span className="text-[11px] text-muted-foreground block">Product Engineer</span>
              </div>
              <div className="col-span-3">
                <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] py-0">
                  Online Assessment
                </Badge>
              </div>
              <div className="col-span-2 hidden sm:block text-muted-foreground text-[11px]">
                Company Website
              </div>
              <div className="col-span-3 text-right text-muted-foreground text-[11px]">
                Due in 2 days
              </div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-sm bg-secondary/15 hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50">
              <div className="col-span-4">
                <span className="font-bold text-foreground">Vercel</span>
                <span className="text-[11px] text-muted-foreground block">Infrastructure Engineer</span>
              </div>
              <div className="col-span-3">
                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] py-0">
                  Offer Received
                </Badge>
              </div>
              <div className="col-span-2 hidden sm:block text-muted-foreground text-[11px]">
                LinkedIn
              </div>
              <div className="col-span-3 text-right text-emerald-400 font-bold text-[11px]">
                $165k - $185k
              </div>
            </div>
          </div>

          {/* Mockup Quick Command Hints */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border">
            <div className="flex flex-wrap gap-4">
              <span><kbd className="text-foreground bg-secondary px-1 rounded-xs border border-border">[N]</kbd> Log Application</span>
              <span><kbd className="text-foreground bg-secondary px-1 rounded-xs border border-border">[/]</kbd> Instant Search</span>
              <span><kbd className="text-foreground bg-secondary px-1 rounded-xs border border-border">[PWA]</kbd> Offline Sync</span>
            </div>
            <span className="text-emerald-500 font-bold">• 100% Database Backed</span>
          </div>
        </section>

        {/* Visual Career Roadmap (Interactive 4-Phase Journey) */}
        <VisualCareerRoadmap />

        {/* Feature Highlights Section (6 Core Capabilities) */}
        <section id="features" className="space-y-8 pt-6 border-t border-border">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Engineered for speed, intelligence, and consistency.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Every feature in OneTrack is purpose-built to accelerate your application process, sharpen interview responses, and benchmark your true market worth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">5-Second Quick-Log + Outreach</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log applications the instant you click submit with single-key modal triggers <kbd className="text-foreground bg-secondary px-1 rounded-xs border border-border font-bold">[N]</kbd> and 1-click tailored referral emails.
              </p>
            </div>

            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Market Salary Intelligence</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-world compensation bands (Entry, Average, Strong, Top Tier) with 3-year YoY growth metrics across Indian hubs and global markets.
              </p>
            </div>

            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">STAR AI Interview Chamber</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rehearse tailored technical and behavioral interview questions with real-time scoring across Situation, Task, Action, and Result.
              </p>
            </div>

            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Velocity Analytics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your 14-day application volume, stage conversion rates, response percentages, and sourcing channel efficacy.
              </p>
            </div>

            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Habit &amp; Streak Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maintain consistency during hiring cycles with 7-day habit matrices and weekly target meters that prevent search fatigue.
              </p>
            </div>

            <div className="border border-border p-5 bg-card rounded-sm space-y-3 hover:border-foreground/30 transition-colors">
              <div className="h-8 w-8 rounded-sm bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Installable PWA (Offline Ready)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Install directly onto iOS, Android, and Desktop. Enjoy standalone app speed, background caching, and offline application viewing.
              </p>
            </div>
          </div>
        </section>

        {/* Why OneTrack vs Spreadsheets / Notion Comparison Table */}
        <section id="comparison" className="space-y-8 pt-6 border-t border-border">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>WHY ONETRACK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why engineers choose OneTrack over Notion and Google Sheets.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Generic spreadsheets and heavy workspace docs force you to build your own CRM. OneTrack gives you a ready-to-use, zero-friction tracking command center.
            </p>
          </div>

          <div className="border border-border rounded-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-[11px] text-muted-foreground uppercase">
                    <th className="p-3.5 font-bold">Feature / Workflow</th>
                    <th className="p-3.5 font-bold text-foreground bg-primary/10 border-x border-primary/20">
                      OneTrack
                    </th>
                    <th className="p-3.5 font-bold">Notion Databases</th>
                    <th className="p-3.5 font-bold">Google Sheets / Excel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Logging Speed
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Time required to record a submitted application
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      &lt; 5 seconds ([N] shortcut)
                    </td>
                    <td className="p-3.5 text-muted-foreground">30-45 seconds (multi-click modal)</td>
                    <td className="p-3.5 text-muted-foreground">25-40 seconds (manual cell entry)</td>
                  </tr>

                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Pipeline Velocity Analytics
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Funnels, conversion percentages, and volume graphs
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      Automated &amp; Real-time
                    </td>
                    <td className="p-3.5 text-muted-foreground">Requires manual rollups / formulas</td>
                    <td className="p-3.5 text-muted-foreground">Requires complex pivot charts</td>
                  </tr>

                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Daily Streak &amp; Habit Matrix
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Visual weekly momentum and pacing targets
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      Built-in Mon-Sun Matrix
                    </td>
                    <td className="p-3.5 text-muted-foreground">None</td>
                    <td className="p-3.5 text-muted-foreground">None</td>
                  </tr>

                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Mobile &amp; Offline Experience
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Home-screen installation and offline access
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      1-Tap PWA (Fast &amp; Offline)
                    </td>
                    <td className="p-3.5 text-muted-foreground">Heavy, slow mobile app</td>
                    <td className="p-3.5 text-muted-foreground">Clunky mobile sheet pinching</td>
                  </tr>

                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Recruiter Follow-Up Sentinel
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Deadline detection for stale or silent applications
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      Dedicated follow-up scheduler
                    </td>
                    <td className="p-3.5 text-muted-foreground">Custom date reminder setup</td>
                    <td className="p-3.5 text-muted-foreground">Manual color-coding rules</td>
                  </tr>

                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      Distraction-Free Focus
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        Terminal-grade aesthetic with zero clutter
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 bg-primary/5 border-x border-primary/20">
                      High-density command center
                    </td>
                    <td className="p-3.5 text-muted-foreground">Cluttered canvas workspace</td>
                    <td className="p-3.5 text-muted-foreground">Overwhelming grid of cells</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3-Step Fast Workflow */}
        <section id="how-it-works" className="space-y-8 pt-6 border-t border-border">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>3-STEP WORKFLOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              How OneTrack accelerates your search.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border p-6 bg-card rounded-sm space-y-3 relative">
              <span className="text-2xl font-bold text-muted-foreground/40 font-mono">01</span>
              <h3 className="text-sm font-bold text-foreground">Apply &amp; Quick-Log</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Found a job on LinkedIn, Wellfound, or a referral? Press <kbd className="bg-secondary px-1 py-0.5 rounded-xs text-foreground font-bold">[N]</kbd> to record the company, role, salary range, and job link in 5 seconds.
              </p>
            </div>

            <div className="border border-border p-6 bg-card rounded-sm space-y-3 relative">
              <span className="text-2xl font-bold text-muted-foreground/40 font-mono">02</span>
              <h3 className="text-sm font-bold text-foreground">Track Stages &amp; Follow-Ups</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Advance applications through Online Assessments, System Design, and Behavioral rounds. Set follow-up reminders so no recruiter email gets missed.
              </p>
            </div>

            <div className="border border-border p-6 bg-card rounded-sm space-y-3 relative">
              <span className="text-2xl font-bold text-muted-foreground/40 font-mono">03</span>
              <h3 className="text-sm font-bold text-foreground">Analyze &amp; Secure Offers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                View real-time funnel metrics to see which sourcing channels yield the highest response rates. Double down on what works and close offers faster.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section id="faqs" className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Everything you need to know about OneTrack.
            </h2>
          </div>

          <LandingFaq />
        </section>

        {/* Bottom CTA Banner */}
        <section className="border border-border p-8 sm:p-12 bg-card text-center space-y-5 rounded-sm shadow-md">
          <Badge variant="outline" className="text-xs font-mono py-1 px-3 bg-secondary/50">
            START TRACKING TODAY
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground max-w-xl mx-auto">
            Take precision command of your next career move.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Join software engineers, product managers, and builders who track their hiring pipeline with terminal velocity.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" variant="primary" className="group shadow-md hover:shadow-lg gap-2 text-xs sm:text-sm">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-xs sm:text-sm">
                <span>Open Existing Workspace</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8 px-4 text-xs text-muted-foreground mt-20 font-mono bg-background">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground bg-primary text-primary-foreground px-1.5 py-0.5 rounded-xs">
              ONETRACK
            </span>
            <span>— Precision Job Search Command Center</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#comparison" className="hover:text-foreground transition-colors">Comparison</a>
            <a href="#faqs" className="hover:text-foreground transition-colors">FAQs</a>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
          <div>© {new Date().getFullYear()} OneTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

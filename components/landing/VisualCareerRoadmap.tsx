"use client";

import { useState } from "react";
import {
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  Send,
  CheckCircle2,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Flame,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoadmapPhase {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  graphicComponent: React.ReactNode;
}

export function VisualCareerRoadmap() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const phases: RoadmapPhase[] = [
    {
      id: "outreach",
      stepNumber: "01",
      title: "Fast Discovery & Cold Outreach",
      subtitle: "5-Second Logging + 1-Click Referral Drafter",
      badge: "LOG & OUTREACH",
      description:
        "Capture applications the moment you apply. Instantly generate tailored cold outreach notes and referral request emails matching the target company and role.",
      keyFeatures: [
        "Single-key modal trigger [N] with autofocus",
        "1-Click smart recruiter email & LinkedIn drafts",
        "Automatic recruitment channel tagging",
      ],
      graphicComponent: (
        <div className="bg-card border border-border/80 rounded-sm p-4 space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-bold text-foreground text-[11px]">[SMART OUTREACH DRAFTER]</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Target: Google / Flipkart</span>
          </div>

          <div className="space-y-1.5 bg-secondary/30 p-2.5 rounded-xs border border-border/50 text-[11px]">
            <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
              <Send className="h-3 w-3 text-primary" />
              <span>Subject: Referral Request — Software Engineer</span>
            </div>
            <p className="text-foreground/90 leading-relaxed text-[11px] pt-1">
              &quot;Hi team, I noticed the open Software Engineer role in Bangalore. Given my track record in high-scale distributed systems, I would love to connect for a quick referral...&quot;
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
            <span className="text-emerald-400 font-bold">✓ 1-Click Copy to Clipboard</span>
            <span>Channel: LinkedIn Referral</span>
          </div>
        </div>
      ),
    },
    {
      id: "salary",
      stepNumber: "02",
      title: "Live Market Salary Benchmark",
      subtitle: "Gemini 3.5 Compensation Intelligence (India-First & Global)",
      badge: "MARKET BENCHMARK",
      description:
        "Never enter an interview without knowing your worth. Query real-world compensation bands, YoY salary growth trends, and top hiring employers across Bangalore, Hyderabad, and Remote.",
      keyFeatures: [
        "4-Tier bands: Entry, Market Average, Strong Offer, Top Tier",
        "Year-over-Year (YoY) salary growth analytics (2024–2026)",
        "Top paying companies in your domain & experience tier",
      ],
      graphicComponent: (
        <div className="bg-card border border-border/80 rounded-sm p-4 space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-bold text-foreground text-[11px]">COMPENSATION BENCHMARK</span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              +14.2% YoY Growth
            </Badge>
          </div>

          {/* 4-Tier Visual Scale */}
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="p-1.5 rounded-xs bg-secondary/40 border border-border">
              <span className="text-[9px] text-muted-foreground block">ENTRY</span>
              <span className="font-bold text-foreground text-[11px]">₹18L</span>
            </div>
            <div className="p-1.5 rounded-xs bg-blue-500/10 border border-blue-500/30">
              <span className="text-[9px] text-blue-400 block">AVERAGE</span>
              <span className="font-bold text-blue-300 text-[11px]">₹28L</span>
            </div>
            <div className="p-1.5 rounded-xs bg-purple-500/10 border border-purple-500/30">
              <span className="text-[9px] text-purple-400 block">STRONG</span>
              <span className="font-bold text-purple-300 text-[11px]">₹38L</span>
            </div>
            <div className="p-1.5 rounded-xs bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[9px] text-emerald-400 block">TOP TIER</span>
              <span className="font-bold text-emerald-300 text-[11px]">₹52L</span>
            </div>
          </div>

          {/* Top Domain Employers Preview */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
            <span>Top Payers: Google, Swiggy, Razorpay</span>
            <span className="text-foreground font-bold">Bangalore / Remote</span>
          </div>
        </div>
      ),
    },
    {
      id: "prep",
      stepNumber: "03",
      title: "STAR AI Interview Prep Chamber",
      subtitle: "Behavioral & Technical Question Simulation",
      badge: "INTERVIEW CHAMBER",
      description:
        "Master high-stakes rounds. Generate role-specific behavioral and technical interview questions, rehearse your response, and receive structured grading on Situation, Task, Action, and Result.",
      keyFeatures: [
        "Tailored questions based on role title & company culture",
        "Live grading matrix with structured STAR breakdowns",
        "Actionable coaching tips to stand out in final rounds",
      ],
      graphicComponent: (
        <div className="bg-card border border-border/80 rounded-sm p-4 space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-bold text-foreground text-[11px]">STAR METHOD GRADING MATRIX</span>
            </div>
            <span className="text-emerald-400 font-bold text-[11px]">Score: 92/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-secondary/30 rounded-xs border border-border/50">
              <span className="text-primary font-bold block">[S] SITUATION</span>
              <span className="text-muted-foreground text-[9px]">Clear production incident context established.</span>
            </div>
            <div className="p-2 bg-secondary/30 rounded-xs border border-border/50">
              <span className="text-primary font-bold block">[T] TASK</span>
              <span className="text-muted-foreground text-[9px]">Specific latency reduction goal highlighted.</span>
            </div>
            <div className="p-2 bg-secondary/30 rounded-xs border border-border/50">
              <span className="text-primary font-bold block">[A] ACTION</span>
              <span className="text-muted-foreground text-[9px]">Caching &amp; DB indexing techniques detailed.</span>
            </div>
            <div className="p-2 bg-secondary/30 rounded-xs border border-border/50">
              <span className="text-emerald-400 font-bold block">[R] RESULT</span>
              <span className="text-emerald-300 text-[9px]">42% latency drop with zero downtime.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "velocity",
      stepNumber: "04",
      title: "Pipeline Velocity & Offer Closing",
      subtitle: "Visual Funnel Analytics + Follow-up Sentinel",
      badge: "PIPELINE VELOCITY",
      description:
        "Understand your entire hiring pipeline at a glance. Track stage conversion rates, follow-up deadlines, and daily consistency habits to close offers with confidence.",
      keyFeatures: [
        "14-Day application velocity & stage conversion funnel",
        "7-Day habit dot matrix & weekly pacing meters",
        "Automated recruiter follow-up sentinel alerts",
      ],
      graphicComponent: (
        <div className="bg-card border border-border/80 rounded-sm p-4 space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-primary fill-primary/20" />
              <span className="font-bold text-foreground text-[11px]">CONVERSION VELOCITY</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Active Cycle: 34 Applications</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Applied ➔ Assessment</span>
              <span className="font-bold text-foreground">62% (21/34)</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[62%]" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">Assessment ➔ Technical Rounds</span>
              <span className="font-bold text-foreground">38% (8/21)</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full w-[38%]" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">Final Round ➔ Offer</span>
              <span className="font-bold text-emerald-400">75% (3/4)</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[75%]" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="roadmap" className="space-y-8 pt-6 border-t border-border font-mono">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>VISUAL CAREER ROADMAP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          The end-to-end lifecycle from discovery to dream offer.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          OneTrack guides you through every milestone of modern hiring: fast logging, cold outreach, salary benchmarking, AI interview rehearsal, and offer closing.
        </p>
      </div>

      {/* Horizontal Step Selector Roadmap Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {phases.map((phase, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={phase.id}
              onClick={() => setActiveTab(idx)}
              className={`p-3 sm:p-3.5 rounded-sm border text-left transition-all relative ${
                isActive
                  ? "bg-card border-foreground/50 shadow-md ring-1 ring-foreground/20"
                  : "bg-secondary/20 border-border hover:bg-secondary/40 hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}
                >
                  PHASE {phase.stepNumber}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {idx + 1}/4
                </span>
              </div>
              <h4 className="text-xs font-bold text-foreground line-clamp-1">
                {phase.title}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                {phase.subtitle}
              </p>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-b-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card */}
      <div className="border border-border bg-card/60 backdrop-blur-xs rounded-sm p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-lg animate-in fade-in duration-300">
        {/* Left Column: Description & Features */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded-xs bg-primary/10 text-primary border border-primary/20 font-bold">
              [{phases[activeTab].badge}]
            </span>
            <span className="text-xs text-muted-foreground">
              Step {phases[activeTab].stepNumber} of 04
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            {phases[activeTab].title}
          </h3>

          <p className="text-xs text-foreground/80 leading-relaxed">
            {phases[activeTab].description}
          </p>

          <div className="space-y-2 pt-1">
            {phases[activeTab].keyFeatures.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-foreground">{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link href="/sign-up">
              <Button size="sm" variant="primary" className="text-xs font-bold gap-1.5 h-8">
                <span>Try This Feature Free</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            <span className="text-[11px] text-muted-foreground">
              Included with zero setup
            </span>
          </div>
        </div>

        {/* Right Column: Visual Interactive Graphic Mockup */}
        <div className="lg:col-span-6 w-full">
          {phases[activeTab].graphicComponent}
        </div>
      </div>
    </section>
  );
}

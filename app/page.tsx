import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Terminal, Zap, BarChart3, Smartphone, Sparkles } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col justify-between selection:bg-primary selection:text-primary-foreground animate-in fade-in duration-300">
      {/* Primary Nav */}
      <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-sm tracking-wider">
              ONETRACK
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              [manpage: onetrack(1)]
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary" size="sm" className="group">
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-20 w-full">
        {/* Hero Section */}
        <section className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-surface-dark text-on-dark text-xs border border-white/10 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block animate-pulse" />
            <span className="font-bold">[v1.0-LIVE]</span>
            <span className="text-ash">Precision job search command center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.25] text-foreground max-w-3xl">
            Your entire job search pipeline, tracked in one glance.
          </h1>

          <p className="text-sm sm:text-base text-body max-w-2xl leading-relaxed">
            Replace messy spreadsheets and lost notes. Log applications in under 15 seconds, track interview stages, and visualize search velocity with terminal precision.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/sign-up">
              <Button size="lg" variant="primary" className="group shadow-md hover:shadow-lg">
                <span>Start Tracking</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="group">
                <span>Open Workspace</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors ml-0.5">→</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero TUI Mockup */}
        <section className="tui-card rounded-none p-6 sm:p-10 space-y-6 border border-hairline-strong shadow-xl">
          {/* ASCII Block Wordmark */}
          <pre className="text-[10px] sm:text-xs leading-tight text-on-dark font-mono overflow-x-auto whitespace-pre select-none opacity-90">
{`  ___  _  _ ___ _____ ___    _   ___ _  __
 / _ \\| \\| | __|_   _| _ \\  / _\\ / __| |/ /
| (_) | .\` | _|  | | |   / / _ \\ (__| ' < 
 \\___/|_|\\_|___| |_| |_|_\\/_/ \\_\\___|_|\\_\\`}
          </pre>

          {/* TUI Prompt Row */}
          <div className="tui-prompt-row p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold">$</span>
              <span>onetrack log --company &quot;Stripe&quot; --role &quot;Full Stack Eng&quot; --stage &quot;Interview&quot;</span>
            </div>
            <span className="text-ash text-[11px]">[status: RECORDED in 0.12s]</span>
          </div>

          {/* TUI Mock Application Status Table */}
          <div className="space-y-1 text-xs border border-white/10 p-3 bg-black/30">
            <div className="flex justify-between text-ash text-[11px] pb-1 border-b border-white/10">
              <span>COMPANY / ROLE</span>
              <span>STAGE</span>
              <span>TIMELINE</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 items-center">
              <span>Stripe • Senior Software Engineer</span>
              <span className="text-warning text-[11px] bg-warning/10 px-1.5 py-0.5 rounded-xs">[Interview Scheduled]</span>
              <span className="text-ash">Applied 2d ago</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 items-center">
              <span>Linear • Product Engineer</span>
              <span className="text-accent text-[11px] bg-white/10 px-1.5 py-0.5 rounded-xs">[Online Assessment]</span>
              <span className="text-ash">Applied 4d ago</span>
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span>Vercel • Infrastructure Engineer</span>
              <span className="text-success text-[11px] bg-success/10 px-1.5 py-0.5 rounded-xs">[Offer Received]</span>
              <span className="text-ash">Applied 2w ago</span>
            </div>
          </div>

          {/* TUI Keybinding Hints */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ash pt-2 border-t border-white/10">
            <div className="flex gap-4">
              <span><kbd className="text-on-dark font-bold bg-white/10 px-1 rounded-xs">[N]</kbd> quick log</span>
              <span><kbd className="text-on-dark font-bold bg-white/10 px-1 rounded-xs">[tab]</kbd> cycle filter</span>
              <span><kbd className="text-on-dark font-bold bg-white/10 px-1 rounded-xs">[/]</kbd> search</span>
            </div>
            <span className="text-ash">[PWA offline-ready]</span>
          </div>
        </section>

        {/* Feature List */}
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>SYSTEM CAPABILITIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2.5 border border-border p-5 bg-card rounded-sm hover:border-foreground/30 transition-all">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  &lt;15-Second Logging
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-speed keyboard entry. Company, role, and custom status pills with smart autofocus and continuous batch logging.
              </p>
            </div>

            <div className="space-y-2.5 border border-border p-5 bg-card rounded-sm hover:border-foreground/30 transition-all">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  Real-time Velocity Metrics
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                14-day velocity curves, stage distribution donuts, and channel conversion breakdowns. Zero hardcoded mocks.
              </p>
            </div>

            <div className="space-y-2.5 border border-border p-5 bg-card rounded-sm hover:border-foreground/30 transition-all">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  Offline Installable PWA
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Native home-screen install on iOS, Android, and Desktop with background service worker precache and offline reads.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture & Specs */}
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>TECHNICAL SPECIFICATION</span>
          </div>

          <div className="border border-border p-4 bg-card space-y-3 text-xs rounded-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-bold text-foreground">Architecture</span>
              <span className="text-muted-foreground">Next.js 14 App Router + TypeScript</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-bold text-foreground">Authentication</span>
              <span className="text-muted-foreground">Clerk Auth (JWT Session Gating)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-bold text-foreground">Database Layer</span>
              <span className="text-muted-foreground">Supabase Postgres with Row Level Security (RLS)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-bold text-foreground">Security Shield</span>
              <span className="text-muted-foreground">Arcjet App-Layer Rate Limiting & Bot Shield</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-foreground">Offline Support</span>
              <span className="text-muted-foreground">Service Worker Network-First API + Standalone Manifest</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border border-border p-8 sm:p-10 bg-card text-center space-y-4 rounded-sm shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Ready to organize your job pipeline?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Log your applications today with zero friction. Open source, config-driven, and built for speed.
          </p>
          <div className="pt-2">
            <Link href="/sign-up">
              <Button size="lg" variant="primary" className="group shadow-md hover:shadow-lg">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8 px-4 text-xs text-muted-foreground mt-24 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">ONETRACK</span>
            <span>— Precision Job Search Command Center</span>
          </div>
          <div>© {new Date().getFullYear()} OneTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

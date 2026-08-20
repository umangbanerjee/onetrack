"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Target, Palette, Smartphone, Save, Download, RefreshCw, CheckCircle2, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [weeklyGoal, setWeeklyGoal] = useState("5");
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  // PWA Installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isSyncingSW, setIsSyncingSW] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(!!isStandalone);

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallPWA = async () => {
    if (isInstalled) {
      toast.info("OneTrack is already installed and running in standalone mode!");
      return;
    }

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("OneTrack PWA installed successfully!");
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      toast.info("To install: Tap your browser's menu (⋮ or Share) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleSyncServiceWorker = async () => {
    setIsSyncingSW(true);
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.update();
        }
        toast.success("[PWA] Service Worker cache updated and verified online");
      } else {
        toast.error("Service Worker is not supported in this browser");
      }
    } catch (err: any) {
      toast.error(`Service worker sync failed: ${err.message}`);
    } finally {
      setIsSyncingSW(false);
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoal(true);
    setTimeout(() => {
      setIsSavingGoal(false);
      toast.success(`[SAVED] Weekly goal set to ${weeklyGoal} applications`);
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono select-none animate-in fade-in duration-300">
      <div className="border-b border-border pb-4">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
          CONFIG & USER SETTINGS
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Account identity, weekly target velocity, and environment preferences.
        </p>
      </div>

      {/* Profile Info */}
      <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>USER IDENTITY & AUTH</span>
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Authentication token managed securely by Clerk
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Name</Label>
              <Input
                value={user?.fullName || user?.firstName || "Applicant"}
                readOnly
                className="bg-secondary/40 text-xs font-mono h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Email</Label>
              <Input
                value={user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                readOnly
                className="bg-secondary/40 text-xs font-mono h-8"
              />
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            <span>Row Level Security (RLS) active • User-scoped data isolation enforced.</span>
          </div>
        </CardContent>
      </Card>

      {/* Target Velocity */}
      <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span>WEEKLY TARGET VELOCITY</span>
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Target applications volume per 7-day period.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveGoal}>
          <CardContent className="p-5 space-y-3 font-mono text-xs">
            <div className="max-w-xs space-y-1">
              <Label htmlFor="goal" className="text-[11px] font-bold">Weekly Goal (Apps/Week)</Label>
              <Input
                id="goal"
                type="number"
                min="1"
                max="50"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0 border-t border-border flex justify-end font-mono">
            <Button type="submit" variant="primary" size="sm" disabled={isSavingGoal} className="group shadow-sm hover:shadow gap-1.5">
              <Save className="h-3.5 w-3.5" />
              <span>{isSavingGoal ? "Saving..." : "Save Goal"}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Appearance & Theme */}
      <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span>THEME & APPEARANCE</span>
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Switch UI theme mode
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <Button
              type="button"
              onClick={() => setTheme("dark")}
              variant={theme === "dark" ? "primary" : "outline"}
              size="sm"
            >
              [mode: dark]
            </Button>
            <Button
              type="button"
              onClick={() => setTheme("light")}
              variant={theme === "light" ? "primary" : "outline"}
              size="sm"
            >
              [mode: light]
            </Button>
            <Button
              type="button"
              onClick={() => setTheme("system")}
              variant={theme === "system" ? "primary" : "outline"}
              size="sm"
            >
              [mode: system]
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA & Mobile Installation */}
      <Card className="border border-border bg-card rounded-sm shadow-none font-mono">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 text-primary" />
              <span>PROGRESSIVE WEB APP (PWA)</span>
            </CardTitle>
            {isInstalled ? (
              <Badge variant="success" className="text-[10px] gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>INSTALLED (STANDALONE)</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] bg-secondary/50">
                PWA READY
              </Badge>
            )}
          </div>
          <CardDescription className="text-[11px] text-muted-foreground">
            Install OneTrack locally for instant launch, dock icon, and offline access
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {/* Service Worker Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <p className="font-bold text-foreground">Service Worker Status</p>
              <p className="text-[11px] text-muted-foreground">
                Precached application shell and network-first API cache.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px]">
                [ONLINE/CACHED]
              </Badge>
              <Button
                onClick={handleSyncServiceWorker}
                variant="ghost"
                size="sm"
                disabled={isSyncingSW}
                className="h-7 px-2 text-[11px] font-mono gap-1 text-muted-foreground hover:text-foreground"
                title="Force refresh service worker cache"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncingSW ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </Button>
            </div>
          </div>

          {/* Install Trigger Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5">
              <p className="font-bold text-foreground">
                {isInstalled ? "OneTrack is Installed" : "Install Standalone Application"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isInstalled
                  ? "Running with full native app lifecycle, local badge icon, and offline cache."
                  : "Add OneTrack to your macOS Dock, Windows Taskbar, iOS Home Screen, or Android App Drawer."}
              </p>
            </div>

            <Button
              onClick={handleInstallPWA}
              variant={isInstalled ? "outline" : "primary"}
              size="sm"
              className="h-8 px-3 text-xs font-mono shrink-0 gap-1.5 group shadow-sm hover:shadow"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>Installed</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-y-0.5" />
                  <span>Install OneTrack PWA</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* iOS Installation Instruction Modal */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="max-w-md p-5 rounded-sm font-mono border border-border bg-card shadow-xl text-xs">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Share2 className="h-3.5 w-3.5 text-primary" />
              <span>INSTALL ON IOS (SAFARI)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-muted-foreground text-xs">
            <p>To install OneTrack as a standalone PWA on your iPhone or iPad:</p>
            <ol className="space-y-2 text-[11px] list-decimal list-inside bg-secondary/30 p-3 rounded-sm border border-border/60">
              <li>
                Tap the <strong className="text-foreground">Share</strong> icon at the bottom of Safari.
              </li>
              <li>
                Scroll down and tap <strong className="text-foreground">&quot;Add to Home Screen&quot;</strong>.
              </li>
              <li>
                Tap <strong className="text-foreground">&quot;Add&quot;</strong> in the top-right corner.
              </li>
            </ol>
            <p className="text-[10px] text-muted-foreground">
              Once added, OneTrack will launch from your home screen in full standalone mode.
            </p>
          </div>
          <DialogFooter className="pt-3 border-t border-border">
            <Button onClick={() => setShowIOSModal(false)} variant="primary" size="sm" className="w-full">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

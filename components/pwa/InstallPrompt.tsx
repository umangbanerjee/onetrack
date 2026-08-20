"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "onetrack:pwa_prompt_dismissed";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dismissed previously
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const timeSinceDismiss = Date.now() - parseInt(dismissedAt, 10);
      if (timeSinceDismiss < DISMISS_DURATION_MS) {
        return; // Respect user dismissal
      }
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt && !showIOSModal) return null;

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-md border border-border rounded-sm p-4 font-mono select-none text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Download className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-foreground">[INSTALL ONETRACK PWA]</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  1-tap standalone access with offline caching.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button onClick={handleInstallClick} size="sm" variant="primary" className="w-full text-xs h-7">
              Install App
            </Button>
            <Button onClick={handleDismiss} size="sm" variant="outline" className="text-xs h-7">
              Later
            </Button>
          </div>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 font-mono select-none">
          <div className="bg-card border border-border rounded-sm p-5 max-w-md w-full text-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <h3 className="font-bold text-foreground text-xs uppercase flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5 text-primary" />
                <span>INSTALL ON IOS</span>
              </h3>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <ol className="space-y-2 text-[11px] text-muted-foreground">
              <li>1. Tap the <strong className="text-foreground">Share</strong> icon in Safari&apos;s bottom bar.</li>
              <li>2. Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong>.</li>
              <li>3. Tap <strong className="text-foreground">Add</strong> in top-right to complete.</li>
            </ol>
            <Button onClick={handleDismiss} className="w-full mt-4 h-8 text-xs font-bold" variant="primary" size="sm">
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

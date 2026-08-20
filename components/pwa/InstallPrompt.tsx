"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone;
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
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt && !isIOS) return null;

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] bg-card border border-border rounded-sm p-4 font-mono select-none text-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-foreground">[INSTALL ONETRACK PWA]</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Fast desktop & mobile access with offline caching.
              </p>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              [x]
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button onClick={handleInstallClick} size="sm" variant="primary" className="w-full">
              [Install Now]
            </Button>
            <Button onClick={() => setShowPrompt(false)} size="sm" variant="outline">
              [Later]
            </Button>
          </div>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4 font-mono select-none">
          <div className="bg-card border border-border rounded-sm p-5 max-w-md w-full text-xs">
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <h3 className="font-bold text-foreground text-xs uppercase">[INSTALL ON IOS]</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                [x]
              </button>
            </div>
            <ol className="space-y-2 text-[11px] text-muted-foreground">
              <li>1. Tap the Share button in Safari bottom bar.</li>
              <li>2. Scroll and select &quot;Add to Home Screen&quot;.</li>
              <li>3. Tap Add to complete installation.</li>
            </ol>
            <Button onClick={() => setShowIOSModal(false)} className="w-full mt-4" variant="primary" size="sm">
              [Dismiss]
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

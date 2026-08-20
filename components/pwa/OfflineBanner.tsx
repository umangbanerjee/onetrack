"use client";

import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-warning/10 border-b border-warning/30 text-warning px-4 py-1.5 text-xs font-mono flex items-center justify-center gap-2 sticky top-0 z-50 select-none">
      <span>[!] OFFLINE MODE: Serving cached data. Network sync will resume once reconnected.</span>
    </div>
  );
}

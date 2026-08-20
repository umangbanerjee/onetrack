"use client";

import { Heart, Zap, Sparkles, Terminal, Flame, Shield, Compass } from "lucide-react";

export function AngledMarqueeRibbon() {
  const marqueeItems = [
    { text: "MADE WITH LOVE BY BUILDERS FOR BUILDERS", icon: Heart, highlight: true },
    { text: "5-SECOND QUICK-LOG", icon: Zap },
    { text: "ZERO SPREADSHEET FATIGUE", icon: Terminal },
    { text: "7-DAY HABIT VELOCITY MATRIX", icon: Flame },
    { text: "REAL-TIME PIPELINE FUNNELS", icon: Sparkles },
    { text: "100% PRIVATE & ISOLATED RLS", icon: Shield },
    { text: "INSTALLABLE OFFLINE PWA", icon: Compass },
  ];

  return (
    <div className="relative py-2 my-0 overflow-hidden select-none font-mono">
      {/* Background ambient gradient glow */}
      <div className="absolute inset-0 bg-primary/10 blur-xl pointer-events-none" />

      {/* Angled Marquee Banner */}
      <div className="transform -rotate-1 sm:-rotate-2 scale-105 border-y border-foreground/20 bg-card text-foreground shadow-md py-2.5 sm:py-3 transition-transform hover:rotate-0 duration-300">
        <div className="animate-marquee flex items-center gap-6 text-xs sm:text-sm uppercase font-bold tracking-wider">
          {/* Repeated seamlessly */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 shrink-0 px-3 cursor-default"
              >
                <div
                  className={`h-6 w-6 rounded-xs flex items-center justify-center shrink-0 ${
                    item.highlight
                      ? "bg-red-500 text-white shadow-xs"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span
                  className={
                    item.highlight
                      ? "text-foreground font-black tracking-wide text-sm sm:text-base underline decoration-red-500/50 underline-offset-4"
                      : "text-foreground font-bold text-sm sm:text-base opacity-95 hover:opacity-100"
                  }
                >
                  {item.text}
                </span>

                <span className="text-foreground/40 font-mono text-xs ml-4">{"//"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

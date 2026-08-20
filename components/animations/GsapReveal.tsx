"use client";

import { useEffect, useRef } from "react";

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
}

export function GsapReveal({
  children,
  className = "",
  delay = 0,
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to prevent any SSR / hydration glitches
    let ctx: any;
    import("gsap").then(({ default: gsap }) => {
      if (containerRef.current) {
        ctx = gsap.context(() => {
          gsap.from(containerRef.current, {
            opacity: 0,
            y: 8,
            duration: 0.35,
            delay,
            ease: "power1.out",
          });
        }, containerRef);
      }
    }).catch(() => {});

    return () => {
      if (ctx && ctx.revert) ctx.revert();
    };
  }, [delay]);

  return (
    <div ref={containerRef} className={`opacity-100 ${className}`}>
      {children}
    </div>
  );
}

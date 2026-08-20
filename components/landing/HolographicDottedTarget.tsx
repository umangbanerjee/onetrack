"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, CheckCircle2, Target } from "lucide-react";

export function HolographicDottedTarget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 400;
    };

    window.addEventListener("resize", handleResize);

    // Generate 3D spherical points for hollow sphere / torus
    const numPoints = 160;
    const radius = Math.min(width, height) * 0.36;
    const points: { x: number; y: number; z: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        size: Math.random() * 1.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      angleX += 0.004;
      angleY += 0.007;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Draw subtle background radar concentric rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      [radius * 0.5, radius * 0.85, radius * 1.2].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw axis lines
      ctx.beginPath();
      ctx.moveTo(centerX - radius * 1.25, centerY);
      ctx.lineTo(centerX + radius * 1.25, centerY);
      ctx.moveTo(centerX, centerY - radius * 1.25);
      ctx.lineTo(centerX, centerY + radius * 1.25);
      ctx.stroke();

      // Transform and project points
      const projected = points.map((p) => {
        // Rotate Y
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Perspective scale
        const fov = 340;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const depthAlpha = Math.max(0.15, (z2 + radius) / (2 * radius));

        return {
          x: projX,
          y: projY,
          z: z2,
          scale,
          alpha: depthAlpha,
          size: p.size * scale,
        };
      });

      // Sort by depth (painter's algorithm)
      projected.sort((a, b) => a.z - b.z);

      // Draw constellation connecting lines between nearest points
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 32 && projected[i].z > -radius * 0.2) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * projected[i].alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Dots
      projected.forEach((p) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra highlight on front-facing nodes
        if (p.z > radius * 0.4) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Central Holographic Target Core
      const pulse = (Math.sin(Date.now() * 0.003) + 1) / 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + pulse * 0.04})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24 + pulse * 6, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[250px] sm:h-[280px] md:h-[310px] flex items-center justify-center font-mono select-none overflow-hidden rounded-sm border border-border/70 bg-secondary/15 backdrop-blur-xs">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-95 transition-opacity"
      />

      {/* Floating Holographic Badge 1: Top Left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 animate-in fade-in slide-in-from-top-2 duration-700">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-background/90 border border-border text-[11px] shadow-sm backdrop-blur-sm">
          <Award className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-bold text-foreground">[OFFER SECURED]</span>
          <span className="text-muted-foreground text-[10px]">Stripe • $175k</span>
        </div>
      </div>

      {/* Floating Holographic Badge 2: Bottom Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-background/90 border border-border text-[11px] shadow-sm backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-bold text-foreground">94.8% VELOCITY</span>
          <span className="text-emerald-400 text-[10px]">[TOP 1%]</span>
        </div>
      </div>

      {/* Floating Holographic Badge 3: Bottom Left */}
      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-background/80 border border-border/60 text-[10px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>3D KINETIC MATRIX</span>
      </div>
    </div>
  );
}

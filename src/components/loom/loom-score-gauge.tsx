"use client";

import { motion, useReducedMotion } from "motion/react";
import type { LoomScore } from "@/lib/changelog/score";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

const GRADE_COLORS: Record<string, string> = {
  "A+": "oklch(0.8 0.17 152)",
  A: "oklch(0.8 0.17 152)",
  B: "oklch(0.83 0.16 120)",
  C: "oklch(0.83 0.15 90)",
  D: "oklch(0.75 0.15 55)",
  F: "oklch(0.68 0.19 22)",
};

/**
 * The Loom Score — a radial gauge whose arc is drawn as a woven thread.
 * The ring sweeps in on mount; factors render as mini thread bars.
 */
export function LoomScoreGauge({
  score,
  className,
}: {
  score: LoomScore;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const R = 54;
  const C = 2 * Math.PI * R;
  // Leave a bottom gap so the ring reads as a gauge, not a spinner.
  const arcSpan = C * 0.78;
  const filled = arcSpan * (score.score / 100);
  const color = GRADE_COLORS[score.grade];

  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-center", className)}>
      {/* Gauge */}
      <div className="relative mx-auto size-40 shrink-0 sm:mx-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-[130deg]">
          {/* track */}
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${arcSpan} ${C}`}
          />
          {/* thread */}
          <motion.circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${C}`}
            initial={reduce ? false : { strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${filled} ${C}` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-4xl font-bold tracking-tight"
            style={{ color }}
          >
            {score.grade}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            <AnimatedNumber value={score.score} /> / 100
          </span>
        </div>
      </div>

      {/* Factors */}
      <div className="min-w-0 flex-1 space-y-3">
        {score.factors.map((f, i) => {
          const pct = Math.round(f.value * 100);
          return (
            <div key={f.key} title={f.hint}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-xs text-foreground/85">{f.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                  initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.7,
                    delay: reduce ? 0 : 0.15 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

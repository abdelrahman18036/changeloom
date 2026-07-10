"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Honest indeterminate loader: a cobalt shuttle passes back and forth across
 * the warp while data is fetched in one request. Reduced-motion shows a static
 * woven bar.
 */
export function WeaveLoader({
  label = "Weaving…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const warp = Array.from({ length: 13 }, (_, i) => i);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <svg viewBox="0 0 240 60" className="w-56" aria-hidden>
        <g stroke="currentColor" className="text-foreground" opacity={0.18}>
          {warp.map((i) => (
            <line
              key={i}
              x1={12 + i * 18}
              y1={8}
              x2={12 + i * 18}
              y2={52}
              strokeWidth={1}
            />
          ))}
        </g>
        <line x1={8} y1={30} x2={232} y2={30} stroke="var(--border)" strokeWidth={1} />
        {reduce ? (
          <line
            x1={8}
            y1={30}
            x2={232}
            y2={30}
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : (
          <motion.circle
            r={4}
            cy={30}
            fill="var(--primary)"
            initial={{ cx: 12 }}
            animate={{ cx: [12, 228, 12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
          />
        )}
      </svg>
      <span
        className="font-mono text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {label}
      </span>
    </div>
  );
}

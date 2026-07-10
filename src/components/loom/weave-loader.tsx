"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CYCLE = 3.4;
const ROWS = [26, 42, 58, 74, 90];
const WARP = [30, 52, 74, 96, 118, 140, 162, 184, 206];
const LEFT = 22;
const RIGHT = 214;

const STAGES = [
  "Fetching tags",
  "Comparing releases",
  "Weaving commits",
  "Reading pull requests",
  "Crediting contributors",
  "Scoring changelog hygiene",
];

export function WeaveLoader({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const rowDur = CYCLE / ROWS.length;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1100);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="relative">
        {/* glow */}
        {!reduce && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, oklch(0.685 0.166 252 / 0.4), transparent 70%)" }}
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <svg viewBox="0 0 236 116" className="w-64" aria-hidden>
          {/* warp */}
          <g stroke="currentColor" className="text-foreground" opacity={0.18}>
            {WARP.map((x) => (
              <line key={x} x1={x} y1={14} x2={x} y2={102} strokeWidth={1.3} />
            ))}
          </g>

          {/* woven rows */}
          {ROWS.map((y, i) =>
            reduce ? (
              <line key={y} x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="var(--primary)" strokeWidth={2.4} strokeLinecap="round" opacity={0.85 - i * 0.1} />
            ) : (
              <motion.line
                key={y}
                x1={i % 2 === 0 ? LEFT : RIGHT}
                y1={y}
                x2={i % 2 === 0 ? RIGHT : LEFT}
                y2={y}
                stroke="var(--primary)"
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.95 }}
                animate={{ pathLength: [0, 1, 1, 0], opacity: [0.95, 0.95, 0.5, 0] }}
                transition={{
                  duration: CYCLE,
                  times: [(i * rowDur) / CYCLE, ((i + 0.9) * rowDur) / CYCLE, 0.93, 1],
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ filter: "drop-shadow(0 0 3px var(--primary))" }}
              />
            ),
          )}

          {/* shuttle */}
          {!reduce && (
            <motion.g
              animate={{
                x: [LEFT, RIGHT, RIGHT, LEFT, LEFT, RIGHT, RIGHT, LEFT, LEFT, RIGHT],
                y: [ROWS[0], ROWS[0], ROWS[1], ROWS[1], ROWS[2], ROWS[2], ROWS[3], ROWS[3], ROWS[4], ROWS[4]],
              }}
              transition={{ duration: CYCLE, repeat: Infinity, ease: "linear" }}
            >
              <rect x={-6} y={-2.6} width={12} height={5.2} rx={2.6} fill="var(--thread-signal)" style={{ filter: "drop-shadow(0 0 6px var(--primary))" }} />
            </motion.g>
          )}
        </svg>
      </div>

      {/* Cycling pipeline status */}
      <div className="h-5 overflow-hidden text-center" role="status" aria-live="polite">
        {reduce ? (
          <span className="font-mono text-xs text-muted-foreground">Weaving…</span>
        ) : (
          <AnimatedStage key={stage} label={STAGES[stage]} />
        )}
      </div>
    </div>
  );
}

function AnimatedStage({ label }: { label: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground"
    >
      <span className="size-1.5 animate-pulse rounded-full bg-primary" />
      {label}…
    </motion.span>
  );
}

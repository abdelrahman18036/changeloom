"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const T = 3.2; // full weave cycle (s)
const ROWS = [22, 37, 52, 67];
const WARP_X = [22, 41, 60, 79, 98];
const LEFT = 10;
const RIGHT = 110;

/**
 * The weaving loader: a cobalt shuttle carries the weft back and forth,
 * binding one row of cloth per pass — the fabric visibly builds, then
 * re-weaves. Reduced motion: a fully-woven static swatch.
 */
export function WeaveLoader({
  label = "Weaving…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rowDur = T / ROWS.length;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <svg viewBox="0 0 120 80" className="w-52" aria-hidden>
        {/* warp */}
        <g stroke="currentColor" className="text-foreground" opacity={0.16}>
          {WARP_X.map((x) => (
            <line key={x} x1={x} y1={10} x2={x} y2={72} strokeWidth={1.2} />
          ))}
        </g>

        {/* woven rows */}
        {ROWS.map((y, i) =>
          reduce ? (
            <line
              key={y}
              x1={LEFT}
              y1={y}
              x2={RIGHT}
              y2={y}
              stroke="var(--primary)"
              strokeWidth={2.2}
              strokeLinecap="round"
              opacity={0.85 - i * 0.12}
            />
          ) : (
            <motion.line
              key={y}
              x1={i % 2 === 0 ? LEFT : RIGHT}
              y1={y}
              x2={i % 2 === 0 ? RIGHT : LEFT}
              y2={y}
              stroke="var(--primary)"
              strokeWidth={2.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.9 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0.9, 0.9, 0.55, 0] }}
              transition={{
                duration: T,
                times: [
                  (i * rowDur) / T,
                  ((i + 0.92) * rowDur) / T,
                  0.94,
                  1,
                ],
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ),
        )}

        {/* the shuttle */}
        {!reduce && (
          <motion.g
            animate={{
              x: [LEFT, RIGHT, RIGHT, LEFT, LEFT, RIGHT, RIGHT, LEFT],
              y: [
                ROWS[0],
                ROWS[0],
                ROWS[1],
                ROWS[1],
                ROWS[2],
                ROWS[2],
                ROWS[3],
                ROWS[3],
              ],
            }}
            transition={{ duration: T, repeat: Infinity, ease: "linear" }}
          >
            <rect
              x={-4.5}
              y={-2.2}
              width={9}
              height={4.4}
              rx={2.2}
              fill="var(--thread-signal)"
              style={{ filter: "drop-shadow(0 0 5px var(--primary))" }}
            />
          </motion.g>
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

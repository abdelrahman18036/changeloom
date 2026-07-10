"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A living loom backdrop: drifting cobalt aurora glows, warp threads with
 * light pulses travelling up them, and slow-rising motes. All deterministic
 * (SSR-safe) and disabled under prefers-reduced-motion.
 */
export function LiveBackdrop({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const W = 1200;
  const H = 760;
  const cols = 26;
  const gap = W / (cols + 1);

  // Deterministic warp thread definitions.
  const threads = Array.from({ length: cols }, (_, i) => {
    const x = gap * (i + 1);
    const bow = Math.sin(i * 0.6) * 10;
    return {
      x,
      d: `M ${x} 0 C ${x + bow} ${H * 0.34}, ${x - bow} ${H * 0.68}, ${x} ${H}`,
      pulse: i % 4 === 0, // every 4th thread carries a light pulse
      delay: (i % 7) * 0.9,
    };
  });

  const motes = Array.from({ length: 14 }, (_, i) => ({
    x: ((i * 83) % 100) + 0.5,
    size: 2 + (i % 3),
    dur: 14 + (i % 5) * 3,
    delay: (i % 6) * 2.2,
    drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 8),
  }));

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Aurora glows */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-1/4 top-[-15%] h-[70vh] w-[70vh] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.685 0.166 252 / 0.18), transparent 65%)" }}
            animate={{ x: [0, 120, -40, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-15%] top-[10%] h-[60vh] w-[60vh] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.72 0.14 220 / 0.14), transparent 65%)" }}
            animate={{ x: [0, -90, 30, 0], y: [0, 40, 80, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-[30%] h-[55vh] w-[55vh] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.62 0.18 280 / 0.1), transparent 65%)" }}
            animate={{ x: [0, 60, -60, 0], y: [0, -50, 20, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Warp threads + light pulses */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="pulse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--thread-signal)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <mask id="fade">
            <rect width={W} height={H} fill="url(#fadeGrad)" />
          </mask>
          <radialGradient id="fadeGrad" cx="50%" cy="26%" r="72%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
        </defs>

        <g mask="url(#fade)">
          <g stroke="currentColor" className="text-foreground" fill="none" opacity={0.075}>
            {threads.map((t, i) => (
              <path key={i} d={t.d} strokeWidth={1} />
            ))}
          </g>

          {/* travelling light pulses along select threads */}
          {!reduce &&
            threads
              .filter((t) => t.pulse)
              .map((t, i) => (
                <circle key={i} r={2.6} fill="var(--thread-signal)" opacity={0.85}>
                  <animateMotion
                    dur={`${6 + (i % 4)}s`}
                    begin={`${t.delay}s`}
                    repeatCount="indefinite"
                    path={t.d}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              ))}
        </g>
      </svg>

      {/* Rising motes */}
      {!reduce &&
        motes.map((m, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary/50"
            style={{
              left: `${m.x}%`,
              bottom: "-4%",
              width: m.size,
              height: m.size,
              filter: "drop-shadow(0 0 4px var(--primary))",
            }}
            animate={{ y: [0, -H * 0.9], x: [0, m.drift], opacity: [0, 0.8, 0] }}
            transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
    </div>
  );
}

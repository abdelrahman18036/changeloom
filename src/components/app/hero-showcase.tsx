"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CATEGORY_MAP, type CategoryKey } from "@/lib/changelog/categories";

interface DemoRelease {
  tag: string;
  commits: number;
  date: string;
  grade: string;
  gradeColor: string;
  contributors: number;
  prerelease?: boolean;
  entries: { cat: CategoryKey; text: string }[];
}

const RELEASES: DemoRelease[] = [
  { tag: "v1.4.0", commits: 12, date: "Mar 3", grade: "B", gradeColor: "oklch(0.83 0.16 120)", contributors: 4,
    entries: [{ cat: "feature", text: "streaming responses" }, { cat: "fix", text: "retry on timeout" }] },
  { tag: "v1.5.0", commits: 23, date: "Mar 21", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 7,
    entries: [{ cat: "feature", text: "plugin system" }, { cat: "perf", text: "40% faster cold start" }, { cat: "docs", text: "plugin guide" }] },
  { tag: "v1.5.2", commits: 6, date: "Apr 2", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 2,
    entries: [{ cat: "fix", text: "edge-case in parser" }, { cat: "chore", text: "bump deps" }] },
  { tag: "v2.0.0-rc", commits: 14, date: "Apr 19", grade: "B", gradeColor: "oklch(0.83 0.16 120)", contributors: 5, prerelease: true,
    entries: [{ cat: "breaking", text: "new config schema" }, { cat: "feature", text: "typed client" }] },
  { tag: "v2.0.0", commits: 31, date: "May 6", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 11,
    entries: [{ cat: "breaking", text: "drop Node 16" }, { cat: "feature", text: "edge runtime" }, { cat: "fix", text: "memory leak" }] },
  { tag: "v2.1.0", commits: 18, date: "May 24", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 6,
    entries: [{ cat: "feature", text: "websocket support" }, { cat: "perf", text: "smaller bundle" }] },
  { tag: "v2.2.0", commits: 24, date: "Jun 12", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 9,
    entries: [{ cat: "feature", text: "middleware API" }, { cat: "docs", text: "migration guide" }, { cat: "fix", text: "cors headers" }] },
  { tag: "v3.0.0", commits: 27, date: "Jul 1", grade: "A", gradeColor: "oklch(0.8 0.17 152)", contributors: 13,
    entries: [{ cat: "breaking", text: "async plugins" }, { cat: "feature", text: "built-in cache" }] },
];

const W = 640;
const H = 190;
const padX = 34;
const baseline = H - 34;
const amp = H - 78;
const STEP = 2400;

export function HeroShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(RELEASES.length - 1);

  const max = Math.max(...RELEASES.map((r) => r.commits));
  const step = (W - padX * 2) / (RELEASES.length - 1);
  const nodes = RELEASES.map((r, i) => ({
    x: padX + i * step,
    y: baseline - (r.commits / max) * amp,
    r,
  }));
  const weft = nodes.map((n) => `${n.x},${n.y}`).join(" ");
  const cur = nodes[active];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % RELEASES.length), STEP);
    return () => clearInterval(id);
  }, [reduce]);

  const rel = RELEASES[active];

  return (
    <div className="w-full text-foreground">
      <div className="pane relative overflow-hidden rounded-2xl p-4 sm:p-5">
        {/* header */}
        <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-muted-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            live release ribbon
          </span>
          <span>node = release · height = commits</span>
        </div>

        {/* Ribbon */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Interactive release timeline demo">
          {/* warp */}
          <g stroke="currentColor" className="text-foreground" opacity={0.08}>
            {nodes.map((n, i) => (
              <line key={i} x1={n.x} y1={16} x2={n.x} y2={baseline} strokeWidth={1} />
            ))}
          </g>
          <line x1={padX} y1={baseline} x2={W - padX} y2={baseline} stroke="var(--border)" strokeWidth={1} />

          {/* posts */}
          <g stroke="var(--primary)" opacity={0.35} strokeWidth={1.5}>
            {nodes.map((n, i) => (
              <line key={i} x1={n.x} y1={baseline} x2={n.x} y2={n.y} />
            ))}
          </g>

          {/* weft */}
          <polyline
            points={weft}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.25}
            strokeLinejoin="round"
            strokeLinecap="round"
            className="animate-weft"
            style={{ ["--dash" as string]: W * 2 }}
          />

          {/* nodes */}
          {nodes.map((n, i) => (
            <g key={i} transform={`translate(${n.x} ${n.y})`}>
              <motion.circle
                r={active === i ? 7 : 0}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={1.5}
                animate={{ opacity: active === i ? [0.7, 0] : 0, r: active === i ? [4, 12] : 4 }}
                transition={{ duration: 1.2, repeat: active === i ? Infinity : 0 }}
              />
              <g transform="rotate(45)">
                <rect
                  x={-3.4}
                  y={-3.4}
                  width={6.8}
                  height={6.8}
                  rx={1}
                  fill={n.r.prerelease ? "var(--background)" : active === i ? "var(--thread-signal)" : "var(--primary)"}
                  stroke="var(--primary)"
                  strokeWidth={1.5}
                />
              </g>
            </g>
          ))}

          {/* Tooltip on active node */}
          <motion.g
            animate={{ x: cur.x, y: cur.y }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <g transform="translate(10, -34)">
              <rect width={104} height={26} rx={6} fill="var(--surface-raised)" stroke="var(--border)" />
              <text x={9} y={16} className="font-mono" fontSize={11} fill="var(--foreground)">
                {rel.tag}
              </text>
              <text x={94} y={16} textAnchor="end" fontSize={10} fill="var(--primary)">
                +{rel.commits}
              </text>
            </g>
          </motion.g>

          {/* Ghost cursor */}
          {!reduce && (
            <motion.g
              animate={{ x: cur.x + 12, y: cur.y + 10 }}
              transition={{ duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }}
            >
              <path
                d="M0 0 L0 15 L4 11.5 L6.5 17 L8.5 16 L6 10.8 L10.5 10.5 Z"
                fill="var(--foreground)"
                stroke="var(--background)"
                strokeWidth={0.8}
              />
            </motion.g>
          )}
        </svg>

        {/* Live panel — this makes it "not only a chart" */}
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-border/60 pt-3">
          <AnimatePresence mode="wait">
            <motion.ul
              key={rel.tag}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
              className="min-w-0 space-y-1"
            >
              {rel.entries.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-3 w-[3px] shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_MAP[e.cat].colorVar }}
                  />
                  <span className="font-mono text-[10px] text-primary">{CATEGORY_MAP[e.cat].label}</span>
                  <span className="truncate text-foreground/80">{e.text}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-[10px] text-muted-foreground">{rel.date}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{rel.contributors} authors</div>
            </div>
            <div
              className="flex size-9 items-center justify-center rounded-lg border font-mono text-sm font-bold"
              style={{ color: rel.gradeColor, borderColor: `color-mix(in oklch, ${rel.gradeColor} 40%, transparent)` }}
              title="Loom Score grade"
            >
              {rel.grade}
            </div>
          </div>
        </div>

        {/* progress dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {RELEASES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show release ${RELEASES[i].tag}`}
              className="h-1 rounded-full transition-all"
              style={{
                width: active === i ? 18 : 6,
                backgroundColor: active === i ? "var(--primary)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

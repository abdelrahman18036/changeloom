"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RibbonPoint {
  label: string;
  /** Raw magnitude (e.g. commit count); normalized internally. */
  value: number;
  prerelease?: boolean;
}

/**
 * A horizontal release timeline: diamond version nodes threaded by a single
 * cobalt weft polyline, each node's post height encoding its magnitude.
 * Draws on mount; with `traveler`, a luminous shuttle rides the weft
 * continuously. Reduced motion renders everything static.
 */
export function ReleaseRibbon({
  points,
  animate = true,
  traveler = false,
  className,
  height = 150,
}: {
  points: RibbonPoint[];
  animate?: boolean;
  traveler?: boolean;
  className?: string;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const W = 640;
  const H = height;
  const padX = 20;
  const baseline = H - 26;
  const amp = H - 62;

  const max = Math.max(1, ...points.map((p) => p.value));
  const n = points.length;
  const step = n > 1 ? (W - padX * 2) / (n - 1) : 0;

  const nodes = points.map((p, i) => {
    const x = padX + i * step;
    const h = (p.value / max) * amp;
    const y = baseline - h;
    return { x, y, ...p };
  });

  const weft = nodes.map((nd) => `${nd.x},${nd.y}`).join(" ");
  const weftPath = nodes
    .map((nd, i) => `${i === 0 ? "M" : "L"} ${nd.x} ${nd.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      role="img"
      aria-label="Release timeline"
    >
      {/* warp back-plane */}
      <g stroke="currentColor" className="text-foreground" opacity={0.08}>
        {nodes.map((nd, i) => (
          <line key={i} x1={nd.x} y1={12} x2={nd.x} y2={baseline} strokeWidth={1} />
        ))}
      </g>

      {/* baseline */}
      <line
        x1={padX}
        y1={baseline}
        x2={W - padX}
        y2={baseline}
        stroke="var(--border)"
        strokeWidth={1}
      />

      {/* posts */}
      <g stroke="var(--primary)" opacity={0.4} strokeWidth={1.5}>
        {nodes.map((nd, i) => (
          <line key={i} x1={nd.x} y1={baseline} x2={nd.x} y2={nd.y} />
        ))}
      </g>

      {/* cobalt weft thread */}
      <polyline
        points={weft}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={animate && !reduce ? "animate-weft" : undefined}
        style={{ ["--dash" as string]: W * 2 }}
      />

      {/* diamond nodes */}
      {nodes.map((nd, i) => (
        <g key={i} transform={`translate(${nd.x} ${nd.y}) rotate(45)`}>
          <rect
            x={-3.2}
            y={-3.2}
            width={6.4}
            height={6.4}
            fill={nd.prerelease ? "var(--background)" : "var(--primary)"}
            stroke="var(--primary)"
            strokeWidth={1.5}
            rx={1}
          />
        </g>
      ))}

      {/* the shuttle in flight */}
      {traveler && !reduce && n > 1 && (
        <circle
          r={3.4}
          fill="var(--thread-signal)"
          style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
        >
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="linear"
            path={weftPath}
          />
        </circle>
      )}
    </svg>
  );
}

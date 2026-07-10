import { cn } from "@/lib/utils";

export interface CadencePoint {
  date: string;
  gapDays: number | null;
}

/**
 * Release rhythm as weave density: one vertical pick per release, positioned
 * along a real time axis so busy periods pack tightly and quiet stretches
 * spread out — the "shipping rhythm" read at a glance.
 */
export function CadenceRibbon({
  points,
  className,
}: {
  points: CadencePoint[];
  className?: string;
}) {
  const W = 640;
  const H = 96;
  const padX = 14;
  const top = 16;
  const bottom = H - 16;

  // Oldest → newest for a left-to-right time axis.
  const ordered = [...points]
    .filter((p) => p.date)
    .reverse()
    .map((p) => ({ ...p, t: new Date(p.date).getTime() }))
    .filter((p) => Number.isFinite(p.t));

  if (ordered.length < 2) {
    return null;
  }

  const t0 = ordered[0].t;
  const t1 = ordered[ordered.length - 1].t;
  const span = Math.max(1, t1 - t0);
  const usableW = W - padX * 2;

  const picks = ordered.map((p) => {
    const x = padX + ((p.t - t0) / span) * usableW;
    // Faster cadence (small gap) → taller, brighter pick.
    const gap = p.gapDays ?? 30;
    const intensity = Math.max(0.25, Math.min(1, 14 / (gap + 6)));
    const h = (bottom - top) * intensity;
    return { x, h, intensity };
  });

  const median = (() => {
    const gaps = ordered
      .map((p) => p.gapDays)
      .filter((g): g is number => g !== null)
      .sort((a, b) => a - b);
    return gaps.length ? gaps[Math.floor(gaps.length / 2)] : null;
  })();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      role="img"
      aria-label={`Release cadence, ${ordered.length} releases${median ? `, median ${median} days apart` : ""}`}
    >
      <line
        x1={padX}
        y1={bottom}
        x2={W - padX}
        y2={bottom}
        stroke="var(--border)"
        strokeWidth={1}
      />
      {picks.map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={bottom}
          x2={p.x}
          y2={bottom - p.h}
          stroke="var(--primary)"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.35 + p.intensity * 0.55}
        />
      ))}
    </svg>
  );
}

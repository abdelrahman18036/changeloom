import { CATEGORY_MAP } from "@/lib/changelog/categories";
import type { CategorySlice } from "@/lib/changelog/types";
import { cn } from "@/lib/utils";

/**
 * "Shape of a release" — a radial fingerprint where each spoke is a category
 * and its length is that category's share. Every release has a recognizable
 * silhouette; fix-heavy patches look nothing like feature-heavy minors.
 */
export function ReleaseShape({
  distribution,
  className,
}: {
  distribution: CategorySlice[];
  className?: string;
}) {
  const present = distribution.filter((d) => d.count > 0);
  if (present.length < 3) return null;

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const R = 82;
  const max = Math.max(...present.map((d) => d.count));
  const n = present.length;

  const pts = present.map((d, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = 14 + (d.count / max) * (R - 14);
    return {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      ax: cx + Math.cos(a) * R,
      ay: cy + Math.sin(a) * R,
      lx: cx + Math.cos(a) * (R + 14),
      ly: cy + Math.sin(a) * (R + 14),
      meta: CATEGORY_MAP[d.category],
      count: d.count,
    };
  });

  const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn("w-full max-w-[240px]", className)} role="img" aria-label="Release shape">
      {/* rings */}
      {[0.33, 0.66, 1].map((f) => (
        <circle key={f} cx={cx} cy={cy} r={R * f} fill="none" stroke="var(--border)" strokeWidth={1} />
      ))}
      {/* spokes */}
      {pts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.ax} y2={p.ay} stroke="var(--border)" strokeWidth={1} opacity={0.5} />
      ))}
      {/* fingerprint */}
      <polygon points={poly} fill="var(--primary)" fillOpacity={0.16} stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={p.meta.colorVar} />
      ))}
      {/* labels */}
      {pts.map((p, i) => (
        <text
          key={i}
          x={p.lx}
          y={p.ly}
          fontSize={9}
          fill="var(--muted-foreground)"
          textAnchor={p.lx < cx - 4 ? "end" : p.lx > cx + 4 ? "start" : "middle"}
          dominantBaseline="middle"
          className="font-mono"
        >
          {p.meta.label}
        </text>
      ))}
    </svg>
  );
}

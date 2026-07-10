import { cn } from "@/lib/utils";

/**
 * The "unwoven cloth" back-plane: evenly spaced vertical hairline threads,
 * each with a slight deterministic sinusoidal bow (pure path math, never
 * feTurbulence). Split into phase-offset groups so the warp breathes.
 */
export function WarpField({
  lines = 34,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const W = 1200;
  const H = 600;
  const gap = W / (lines + 1);

  const paths = Array.from({ length: lines }, (_, i) => {
    const x = gap * (i + 1);
    // Deterministic bow so it's SSR-stable (no Math.random).
    const bow = Math.sin(i * 0.7) * 9;
    const d = `M ${x} 0 C ${x + bow} ${H * 0.33}, ${x - bow} ${H * 0.66}, ${x} ${H}`;
    return { d, group: i % 3 };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      {[0, 1, 2].map((g) => (
        <g
          key={g}
          className="warp-sway text-foreground"
          style={{ animationDelay: `${g * -3}s` }}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.09}
          fill="none"
        >
          {paths
            .filter((p) => p.group === g)
            .map((p, i) => (
              <path key={i} d={p.d} />
            ))}
        </g>
      ))}
    </svg>
  );
}

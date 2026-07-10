import type { RangeContributor } from "@/lib/changelog/types";
import { cn } from "@/lib/utils";

/**
 * Each contributor rendered as a warp thread whose weight maps to their share
 * of the range — "who wove this release" — replacing the avatar-circle reflex.
 */
export function ContributorWarp({
  contributors,
  className,
}: {
  contributors: RangeContributor[];
  className?: string;
}) {
  const shown = contributors.slice(0, 24);
  if (shown.length === 0) return null;
  const W = 640;
  const H = 64;
  const gap = W / (shown.length + 1);
  const maxShare = Math.max(...shown.map((c) => c.share), 0.001);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      role="img"
      aria-label={`${contributors.length} contributors, weighted by commits`}
    >
      {shown.map((c, i) => {
        const x = gap * (i + 1);
        const weight = 1 + (c.share / maxShare) * 5;
        const opacity = 0.35 + (c.share / maxShare) * 0.6;
        return (
          <line
            key={c.login}
            x1={x}
            y1={8}
            x2={x}
            y2={H - 8}
            stroke="var(--primary)"
            strokeWidth={weight}
            strokeLinecap="round"
            opacity={opacity}
          >
            <title>{`${c.login} — ${c.commits} commits`}</title>
          </line>
        );
      })}
    </svg>
  );
}

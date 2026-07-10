import { CATEGORY_MAP } from "@/lib/changelog/categories";
import type { CategorySlice } from "@/lib/changelog/types";
import { cn } from "@/lib/utils";

/**
 * Release anatomy — a single stacked bar of the category mix. Legitimate
 * multi-color data-viz (each segment encodes a real proportion), not decoration.
 */
export function DistributionBar({
  distribution,
  className,
}: {
  distribution: CategorySlice[];
  className?: string;
}) {
  const total = distribution.reduce((n, d) => n + d.count, 0) || 1;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
        {distribution.map((d) => {
          const meta = CATEGORY_MAP[d.category];
          const w = (d.count / total) * 100;
          return (
            <div
              key={d.category}
              style={{ width: `${w}%`, backgroundColor: meta.colorVar }}
              title={`${meta.label}: ${d.count} (${d.pct}%)`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {distribution.map((d) => {
          const meta = CATEGORY_MAP[d.category];
          return (
            <div
              key={d.category}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: meta.colorVar }}
              />
              <span className="text-foreground/80">{meta.label}</span>
              <span className="font-mono tabular-nums">{d.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

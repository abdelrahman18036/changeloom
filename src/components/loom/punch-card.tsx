import type { ChangelogEntry } from "@/lib/changelog/types";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Ship punch-card — a day-of-week × hour heatmap of when commits land, from
 * the entries' author dates. Reveals a team's rhythm ("ships Tuesday mornings")
 * with no extra API calls.
 */
export function PunchCard({
  entries,
  className,
}: {
  entries: ChangelogEntry[];
  className?: string;
}) {
  // grid[day][hourBucket] where hour buckets are 3-hour columns (8 columns).
  const cols = 8;
  const grid: number[][] = Array.from({ length: 7 }, () =>
    Array(cols).fill(0),
  );
  let max = 0;
  let counted = 0;

  for (const e of entries) {
    if (!e.date) continue;
    const d = new Date(e.date);
    if (!Number.isFinite(d.getTime())) continue;
    const day = d.getDay();
    const col = Math.min(cols - 1, Math.floor(d.getHours() / 3));
    grid[day][col] += 1;
    counted += 1;
    if (grid[day][col] > max) max = grid[day][col];
  }

  if (counted < 2) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        <div className="grid grid-rows-7 gap-1 pr-1">
          {DAYS.map((d) => (
            <span
              key={d}
              className="flex h-4 items-center font-mono text-[9px] text-muted-foreground/70"
            >
              {d[0]}
            </span>
          ))}
        </div>
        <div className="grid grid-rows-7 gap-1">
          {grid.map((row, di) => (
            <div key={di} className="grid grid-cols-8 gap-1">
              {row.map((n, ci) => {
                const t = max ? n / max : 0;
                return (
                  <div
                    key={ci}
                    className="h-4 rounded-[3px]"
                    style={{
                      backgroundColor:
                        n === 0
                          ? "var(--secondary)"
                          : `color-mix(in oklch, var(--primary) ${20 + t * 80}%, transparent)`,
                    }}
                    title={`${DAYS[di]} ${ci * 3}:00–${ci * 3 + 3}:00 · ${n} commit${n === 1 ? "" : "s"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between font-mono text-[9px] text-muted-foreground/70">
        <span>12a</span>
        <span>6a</span>
        <span>12p</span>
        <span>6p</span>
      </div>
    </div>
  );
}

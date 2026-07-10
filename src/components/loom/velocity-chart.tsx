import type { CadencePoint } from "@/components/loom/cadence-ribbon";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Release velocity — releases shipped per month over the recent window, as a
 * bar chart. Reads the same /releases data the cadence ribbon uses.
 */
export function VelocityChart({
  points,
  months = 12,
  className,
}: {
  points: CadencePoint[];
  months?: number;
  className?: string;
}) {
  const dated = points
    .map((p) => new Date(p.date))
    .filter((d) => Number.isFinite(d.getTime()));
  if (dated.length < 2) return null;

  const now = dated.reduce((a, b) => (a > b ? a : b));
  const buckets: { label: string; year: number; month: number; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), count: 0 });
  }
  for (const d of dated) {
    const b = buckets.find((x) => x.year === d.getFullYear() && x.month === d.getMonth());
    if (b) b.count += 1;
  }

  const max = Math.max(1, ...buckets.map((b) => b.count));
  const total = buckets.reduce((n, b) => n + b.count, 0);
  const perMonth = (total / months).toFixed(1);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums">{perMonth}</span>
        <span className="text-xs text-muted-foreground">releases / month</span>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {buckets.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5" title={`${b.label} ${b.year}: ${b.count}`}>
            <div className="flex w-full items-end justify-center" style={{ height: "100%" }}>
              <div
                className="w-full max-w-4 rounded-t-sm bg-primary transition-all"
                style={{ height: `${(b.count / max) * 100}%`, minHeight: b.count > 0 ? 3 : 0, opacity: 0.55 + (b.count / max) * 0.45 }}
              />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/70">{b.label[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Churn } from "@/lib/changelog/types";
import { cn } from "@/lib/utils";

/**
 * Terminal `--stat` view, designed: per top-changed file a mono-aligned dual
 * bar (cobalt additions, muted deletions), tabular so columns never jitter.
 */
export function ChurnBars({
  churn,
  className,
}: {
  churn: Churn;
  className?: string;
}) {
  const max = Math.max(1, ...churn.topFiles.map((f) => f.additions + f.deletions));

  return (
    <div className={cn("space-y-2.5", className)}>
      {churn.topFiles.map((f) => {
        const addW = (f.additions / max) * 100;
        const delW = (f.deletions / max) * 100;
        return (
          <div key={f.filename} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="truncate font-mono text-xs text-foreground/80">
                {f.filename}
              </div>
              <div className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                <div
                  className="h-full"
                  style={{ width: `${addW}%`, backgroundColor: "var(--primary)" }}
                />
                <div
                  className="h-full"
                  style={{ width: `${delW}%`, backgroundColor: "var(--destructive)" }}
                />
              </div>
            </div>
            <div className="shrink-0 font-mono text-xs tabular-nums">
              <span className="text-primary">+{f.additions}</span>{" "}
              <span className="text-destructive">−{f.deletions}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

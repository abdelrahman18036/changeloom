import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** A hairline-bordered surface pane (console ramp does elevation, no shadow). */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-panel p-5", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      {hint && (
        <span className="font-mono text-xs text-muted-foreground/70">{hint}</span>
      )}
    </div>
  );
}

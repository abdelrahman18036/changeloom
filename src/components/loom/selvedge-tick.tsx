import { CATEGORY_MAP, type CategoryKey } from "@/lib/changelog/categories";
import { cn } from "@/lib/utils";

/**
 * The bound-edge tick that marks a woven row — the portal's entry affordance,
 * in the entry's category color. Replaces the icon-card reflex.
 */
export function SelvedgeTick({
  category,
  className,
  animate = false,
}: {
  category: CategoryKey;
  className?: string;
  animate?: boolean;
}) {
  const meta = CATEGORY_MAP[category];
  return (
    <span
      aria-hidden
      className={cn(
        "block w-[3px] shrink-0 self-stretch rounded-full",
        animate && "animate-tick",
        className,
      )}
      style={{
        backgroundColor: meta.colorVar,
        boxShadow: `0 0 8px -1px ${meta.colorVar}`,
      }}
    />
  );
}

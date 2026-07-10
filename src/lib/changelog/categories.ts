export type CategoryKey =
  | "breaking"
  | "feature"
  | "fix"
  | "perf"
  | "docs"
  | "refactor"
  | "test"
  | "chore"
  | "other";

export type Audience = "ship" | "plumbing";

export interface CategoryMeta {
  key: CategoryKey;
  /** Heading used in rendered markdown output. */
  title: string;
  /** Emoji prefix for the markdown heading. */
  emoji: string;
  /** Short label for UI chips. */
  label: string;
  /** CSS color token (see globals.css). */
  colorVar: string;
  /**
   * Whether this category affects users ("ship") or is internal
   * ("plumbing"). Drives the Ship-vs-Plumbing split in the portal.
   */
  audience: Audience;
}

/**
 * Ordered by priority (first match wins) and by the order groups are
 * rendered in the output. Breaking changes always lead.
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    key: "breaking",
    title: "Breaking Changes",
    emoji: "💥",
    label: "Breaking",
    colorVar: "var(--cat-breaking)",
    audience: "ship",
  },
  {
    key: "feature",
    title: "Features",
    emoji: "✨",
    label: "Feature",
    colorVar: "var(--cat-feature)",
    audience: "ship",
  },
  {
    key: "fix",
    title: "Fixes",
    emoji: "🐛",
    label: "Fix",
    colorVar: "var(--cat-fix)",
    audience: "ship",
  },
  {
    key: "perf",
    title: "Performance",
    emoji: "⚡",
    label: "Perf",
    colorVar: "var(--cat-perf)",
    audience: "ship",
  },
  {
    key: "docs",
    title: "Documentation",
    emoji: "📚",
    label: "Docs",
    colorVar: "var(--cat-docs)",
    audience: "plumbing",
  },
  {
    key: "refactor",
    title: "Refactors",
    emoji: "🔨",
    label: "Refactor",
    colorVar: "var(--cat-refactor)",
    audience: "plumbing",
  },
  {
    key: "test",
    title: "Tests",
    emoji: "🧪",
    label: "Test",
    colorVar: "var(--cat-test)",
    audience: "plumbing",
  },
  {
    key: "chore",
    title: "Chores",
    emoji: "🔧",
    label: "Chore",
    colorVar: "var(--cat-chore)",
    audience: "plumbing",
  },
  {
    key: "other",
    title: "Other Changes",
    emoji: "📦",
    label: "Other",
    colorVar: "var(--cat-other)",
    audience: "plumbing",
  },
];

export const CATEGORY_MAP: Record<CategoryKey, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<CategoryKey, CategoryMeta>;

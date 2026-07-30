/** Changeloom's real design tokens, flattened to hex for video rendering. */
export const T = {
  bg: "#12161d",
  panel: "#171c26",
  card: "#1b212c",
  raised: "#212836",
  border: "#2b3342",
  ink: "#eef2f8",
  muted: "#8e99ad",
  cobalt: "#6ea0ff",
  signal: "#a8d4ff",
  cat: {
    breaking: "#f0705f",
    feature: "#4fd18a",
    fix: "#f2c14e",
    perf: "#b78bf5",
    docs: "#6fb2f0",
    chore: "#9aa3b2",
  },
} as const;

export const MONO =
  "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace";
export const SANS =
  "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

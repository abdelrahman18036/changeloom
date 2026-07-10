import { CATEGORIES } from "./categories";
import type { ChangelogEntry, ChangelogGroup } from "./types";

function entryLink(entry: ChangelogEntry, repoUrl: string): string {
  if (entry.prNumber) {
    return `([#${entry.prNumber}](${repoUrl}/pull/${entry.prNumber}))`;
  }
  return `([\`${entry.shortSha}\`](${repoUrl}/commit/${entry.sha}))`;
}

function entryLine(entry: ChangelogEntry, repoUrl: string): string {
  const scope = entry.scope ? `**${entry.scope}:** ` : "";
  return `- ${scope}${entry.text} ${entryLink(entry, repoUrl)}`;
}

export function renderMarkdown(params: {
  owner: string;
  name: string;
  base: string | null;
  head: string | null;
  rangeMode: "tags" | "commits";
  groups: ChangelogGroup[];
}): string {
  const { owner, name, base, head, rangeMode, groups } = params;
  const repoUrl = `https://github.com/${owner}/${name}`;

  const rangeLabel =
    rangeMode === "tags" && base && head
      ? `${base}...${head}`
      : `Latest ${head ?? "commits"}`;

  const lines: string[] = ["# Changelog", "", `_${rangeLabel} · ${owner}/${name}_`, ""];

  const order = new Map(CATEGORIES.map((c, i) => [c.key, i]));
  const sorted = [...groups].sort(
    (a, b) => (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99),
  );

  for (const group of sorted) {
    if (group.entries.length === 0) continue;
    const meta = CATEGORIES.find((c) => c.key === group.category)!;
    lines.push(`## ${meta.emoji} ${meta.title}`, "");
    for (const entry of group.entries) {
      lines.push(entryLine(entry, repoUrl));
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

/** Keep a Changelog (keepachangelog.com) style: Added / Changed / Fixed … */
const KAC_MAP: Record<string, string> = {
  feature: "Added",
  fix: "Fixed",
  perf: "Changed",
  refactor: "Changed",
  docs: "Changed",
  test: "Changed",
  chore: "Changed",
  breaking: "Changed",
  other: "Changed",
};

export function renderKeepAChangelog(params: {
  owner: string;
  name: string;
  base: string | null;
  head: string | null;
  groups: ChangelogGroup[];
}): string {
  const { owner, name, base, head, groups } = params;
  const repoUrl = `https://github.com/${owner}/${name}`;
  const version = head ?? "Unreleased";

  const buckets: Record<string, ChangelogEntry[]> = {
    Added: [],
    Changed: [],
    Deprecated: [],
    Removed: [],
    Fixed: [],
    Security: [],
  };
  for (const group of groups) {
    const bucket = KAC_MAP[group.category] ?? "Changed";
    buckets[bucket].push(...group.entries);
  }

  const lines: string[] = [
    "# Changelog",
    "",
    "All notable changes to this project are documented here.",
    "The format is based on [Keep a Changelog](https://keepachangelog.com/).",
    "",
    `## [${version}]`,
    "",
  ];
  for (const [section, entries] of Object.entries(buckets)) {
    if (entries.length === 0) continue;
    lines.push(`### ${section}`, "");
    for (const entry of entries) lines.push(entryLine(entry, repoUrl));
    lines.push("");
  }
  if (base && head) {
    lines.push(`[${version}]: ${repoUrl}/compare/${base}...${head}`);
  }
  return lines.join("\n").trimEnd() + "\n";
}

/** Plain-text export (no markdown syntax). */
export function renderPlainText(params: {
  owner: string;
  name: string;
  base: string | null;
  head: string | null;
  groups: ChangelogGroup[];
}): string {
  const { owner, name, base, head, groups } = params;
  const range = base && head ? `${base}...${head}` : (head ?? "");
  const lines: string[] = [`Changelog — ${owner}/${name} (${range})`, ""];
  for (const group of groups) {
    const meta = CATEGORIES.find((c) => c.key === group.category)!;
    lines.push(`${meta.title.toUpperCase()}`);
    for (const entry of group.entries) {
      const ref = entry.prNumber ? ` (#${entry.prNumber})` : "";
      const scope = entry.scope ? `${entry.scope}: ` : "";
      lines.push(`  - ${scope}${entry.text}${ref}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

import { CATEGORY_MAP, type CategoryKey } from "./categories";
import type { ChangelogEntry, RawCommit } from "./types";

const TYPE_TO_CATEGORY: Record<string, CategoryKey> = {
  feat: "feature",
  feature: "feature",
  fix: "fix",
  bugfix: "fix",
  perf: "perf",
  docs: "docs",
  doc: "docs",
  refactor: "refactor",
  style: "refactor",
  test: "test",
  tests: "test",
  chore: "chore",
  build: "chore",
  ci: "chore",
};

/**
 * Keyword heuristics for commits that don't follow any convention — first
 * match wins, ordered by specificity. This keeps real-world repos out of a
 * giant "Other" bucket without requiring Conventional Commits.
 */
const HEURISTICS: { match: RegExp; category: CategoryKey }[] = [
  // Bare version subjects ("4.12.29", "v2.0.0") are release commits.
  { match: /^v?\d+\.\d+(\.\d+)?(-[\w.]+)?$/i, category: "chore" },
  { match: /^revert\b/i, category: "fix" },
  {
    match: /\b(fix(es|ed)?|bugfix|hotfix|resolve[sd]?|repair(s|ed)?|correct(s|ed)?|patch(es|ed)?)\b/i,
    category: "fix",
  },
  {
    match: /\b(bump(s|ed)?|upgrade[sd]?|update[sd]? dep(endencie)?s?|dependabot|renovate|lockfile|changelog|release[sd]?|version|prepare|publish)\b/i,
    category: "chore",
  },
  {
    match: /\b(docs?|documentation|readme|typo(s)?|jsdoc|comment(s)?|guide|example(s)? in docs)\b/i,
    category: "docs",
  },
  {
    match: /\b(tests?|specs?|coverage|e2e|unit test)\b/i,
    category: "test",
  },
  {
    match: /\b(refactor(s|ed)?|rewrite|rework(ed)?|restructure[sd]?|clean\s?up|simplif(y|ies|ied)|rename[sd]?|reorganiz|extract(ed)?|move[sd]?\b.*\bto\b)\b/i,
    category: "refactor",
  },
  {
    match: /\b(optimiz|performance|perf\b|faster|speed(s|ed)? up|reduce[sd]? (memory|allocations|bundle))\b/i,
    category: "perf",
  },
  {
    match: /\b(ci\b|workflow|github action|pipeline|lint(ing|er)?|prettier|eslint|format(ting)?|build(s)? config)\b/i,
    category: "chore",
  },
  {
    match: /\b(add(s|ed)?|introduce[sd]?|implement(s|ed)?|support(s)? for|new\b|create[sd]?|enable[sd]?|allow(s|ed)?)\b/i,
    category: "feature",
  },
  {
    match: /\b(remove[sd]?|delete[sd]?|drop(s|ped)?|deprecate[sd]?)\b/i,
    category: "refactor",
  },
  {
    match: /\b(improve[sd]?|enhance[sd]?|better|polish(ed)?|tweak(s|ed)?)\b/i,
    category: "feature",
  },
];

function heuristicCategory(subject: string): CategoryKey | null {
  const hit = HEURISTICS.find((h) => h.match.test(subject));
  return hit?.category ?? null;
}

/** Parse `owner` and `name` out of a variety of GitHub URL shapes. */
export function parseRepoUrl(
  input: string,
): { owner: string; name: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Accept `owner/repo` shorthand.
  const shorthand = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shorthand) {
    return { owner: shorthand[1], name: stripGit(shorthand[2]) };
  }

  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (!/(^|\.)github\.com$/i.test(url.hostname)) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  return { owner: parts[0], name: stripGit(parts[1]) };
}

function stripGit(name: string): string {
  return name.replace(/\.git$/i, "");
}

const CONVENTIONAL_RE = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;
const PR_RE = /\(#(\d+)\)\s*$/;
const BREAKING_RE = /BREAKING[ -]CHANGE[s]?:?\s*(.*)/i;
const CHANGELOG_SECTION_RE =
  /(?:^|\n)\s*#{0,4}\s*Changelog\s*:?\s*\n+([^\n]+)/i;

/**
 * When a squash-merged PR body lands in the commit message, maintainers who
 * write an explicit `## Changelog` section get that line used verbatim — the
 * git-glance / idea-doc §7 differentiator, with zero extra API calls.
 */
function extractChangelogSection(message: string): string | null {
  const m = message.match(CHANGELOG_SECTION_RE);
  if (!m) return null;
  const line = m[1].replace(/^[-*]\s*/, "").trim();
  return line.length > 0 ? line : null;
}

/**
 * Categorize a single commit using the rule engine from the design doc.
 * Priority: breaking → feat → fix → perf → docs → refactor → test →
 * chore → label fallback → other. First match wins.
 */
export function categorizeCommit(commit: RawCommit): ChangelogEntry {
  const subject = commit.message.split("\n")[0].trim();

  const prMatch = subject.match(PR_RE);
  const prNumber = prMatch ? Number(prMatch[1]) : null;
  const subjectNoPr = subject.replace(PR_RE, "").trim();

  const conventional = subjectNoPr.match(CONVENTIONAL_RE);
  const breakingMatch = commit.message.match(BREAKING_RE);
  const bodyHasBreaking = Boolean(breakingMatch);
  const breakingNote =
    breakingMatch && breakingMatch[1]?.trim()
      ? breakingMatch[1].trim()
      : null;

  let category: CategoryKey = "other";
  let scope: string | null = null;
  let text = subjectNoPr;

  if (conventional) {
    const type = conventional[1].toLowerCase();
    scope = conventional[2] ?? null;
    const bang = conventional[3] === "!";
    text = conventional[4].trim();

    if (bang || bodyHasBreaking) {
      category = "breaking";
    } else {
      category = TYPE_TO_CATEGORY[type] ?? "other";
    }
  } else if (bodyHasBreaking) {
    category = "breaking";
  } else {
    // No convention — fall back to keyword heuristics before "other".
    category = heuristicCategory(subjectNoPr) ?? "other";
  }

  // An explicit Changelog section in the body wins over the derived subject.
  const authored = extractChangelogSection(commit.message);
  if (authored) text = authored;

  return {
    text: sentenceCase(text),
    category,
    audience: CATEGORY_MAP[category].audience,
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    prNumber,
    scope,
    author: commit.authorLogin,
    avatarUrl: commit.avatarUrl,
    breakingNote,
  };
}

function sentenceCase(text: string): string {
  if (!text) return text;
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Merge-commit noise we never want in a changelog (raw "Merge pull
 * request", release bumps, etc.).
 */
export function isNoise(commit: RawCommit): boolean {
  const subject = commit.message.split("\n")[0].trim();
  return (
    /^Merge (pull request|branch|remote)/i.test(subject) ||
    /^Merge tag /i.test(subject) ||
    subject === ""
  );
}

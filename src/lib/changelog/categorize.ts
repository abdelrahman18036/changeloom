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
  }
  // Non-conventional commits with no breaking marker stay in "other".

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

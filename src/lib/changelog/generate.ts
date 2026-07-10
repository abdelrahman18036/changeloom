import { CATEGORIES, type CategoryKey } from "./categories";
import { categorizeCommit, isNoise, parseRepoUrl } from "./categorize";
import {
  compareRefs,
  getRepo,
  GitHubError,
  listRecentCommits,
  listTags,
  type GitHubCommit,
  type GitHubTag,
} from "./github";
import {
  aggregateContributors,
  computeChurn,
  computeDistribution,
} from "./insights";
import { renderMarkdown } from "./render";
import { computeLoomScore } from "./score";
import type {
  ChangelogEntry,
  ChangelogGroup,
  ChangelogResult,
  RawCommit,
  RepoVitals,
  SemverBump,
} from "./types";

/** GitHub's /compare endpoint caps the commit list at 250. */
const COMPARE_CAP = 250;

function toRaw(c: GitHubCommit): RawCommit {
  return {
    sha: c.sha,
    message: c.commit.message,
    authorLogin: c.author?.login ?? null,
    authorName: c.commit.author?.name ?? null,
    avatarUrl: c.author?.avatar_url ?? null,
    date: c.commit.author?.date ?? null,
  };
}

interface Version {
  major: number;
  minor: number;
  patch: number;
  isPrerelease: boolean;
}

/** Extract a comparable semver from a tag name, or null if not versioned. */
export function parseVersion(name: string): Version | null {
  const m = name.match(/(\d+)\.(\d+)(?:\.(\d+))?(?:[-+.](.+))?/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3] ?? 0),
    isPrerelease: Boolean(m[4]) && /alpha|beta|rc|pre|next|canary|dev/i.test(m[4]),
  };
}

function compareVersionsDesc(a: Version, b: Version): number {
  if (a.major !== b.major) return b.major - a.major;
  if (a.minor !== b.minor) return b.minor - a.minor;
  if (a.patch !== b.patch) return b.patch - a.patch;
  return Number(a.isPrerelease) - Number(b.isPrerelease);
}

/** Semver-sort tag names, newest first. Prefer releases over prereleases. */
function sortTagNames(tags: GitHubTag[]): string[] {
  const versioned = tags
    .map((t) => ({ name: t.name, version: parseVersion(t.name) }))
    .filter((t): t is { name: string; version: Version } => t.version !== null);
  versioned.sort((a, b) => compareVersionsDesc(a.version, b.version));
  const sorted = versioned.map((t) => t.name);
  // Append any non-semver tags at the end, preserving order.
  for (const t of tags) if (!sorted.includes(t.name)) sorted.push(t.name);
  return sorted;
}

function pickLatestTags(tags: GitHubTag[]): [string, string] | null {
  const versioned = tags
    .map((t) => ({ name: t.name, version: parseVersion(t.name) }))
    .filter((t): t is { name: string; version: Version } => t.version !== null);
  const releases = versioned.filter((t) => !t.version.isPrerelease);
  const pool = releases.length >= 2 ? releases : versioned;
  if (pool.length >= 2) {
    const sorted = [...pool].sort((a, b) =>
      compareVersionsDesc(a.version, b.version),
    );
    return [sorted[0].name, sorted[1].name];
  }
  if (tags.length >= 2) return [tags[0].name, tags[1].name];
  return null;
}

function semverBump(base: string | null, head: string | null): SemverBump {
  if (!base || !head) return "none";
  const b = parseVersion(base);
  const h = parseVersion(head);
  if (!b || !h) return "none";
  // A backward range (base newer than head) is not a bump.
  if (compareVersionsDesc(h, b) > 0) return "none";
  if (h.major > b.major) return "major";
  if (h.minor > b.minor) return "minor";
  if (h.patch > b.patch) return "patch";
  return "none";
}

/** Suggested next version from the range's own content (git-cliff style). */
function suggestNextVersion(
  head: string | null,
  hasBreaking: boolean,
  hasFeature: boolean,
): string | null {
  if (!head) return null;
  const v = parseVersion(head);
  if (!v) return null;
  const prefix = head.startsWith("v") ? "v" : "";
  // A prerelease head stabilizes to its own version unless the range demands
  // a bigger bump.
  if (v.isPrerelease && !hasBreaking && !hasFeature) {
    return `${prefix}${v.major}.${v.minor}.${v.patch}`;
  }
  if (hasBreaking) return `${prefix}${v.major + 1}.0.0`;
  if (hasFeature) return `${prefix}${v.major}.${v.minor + 1}.0`;
  return `${prefix}${v.major}.${v.minor}.${v.patch + 1}`;
}

function topAreas(entries: ChangelogEntry[], files: string[]): string[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (e.scope) counts.set(e.scope, (counts.get(e.scope) ?? 0) + 1);
  }
  if (counts.size === 0) {
    // Fall back to top-level directories from changed files.
    for (const f of files) {
      const dir = f.includes("/") ? f.split("/")[0] : "(root)";
      counts.set(dir, (counts.get(dir) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);
}

function toVitals(
  meta: Awaited<ReturnType<typeof getRepo>> | null,
): RepoVitals | null {
  if (!meta) return null;
  return {
    fullName: meta.full_name,
    description: meta.description,
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    openIssues: meta.open_issues_count,
    language: meta.language,
    url: meta.html_url,
    homepage: meta.homepage,
    license: meta.license?.spdx_id ?? null,
    pushedAt: meta.pushed_at,
    defaultBranch: meta.default_branch,
  };
}

export async function generateChangelog(
  url: string,
  options: { token?: string; base?: string; head?: string } = {},
): Promise<ChangelogResult> {
  const { token, base: baseOverride, head: headOverride } = options;
  const parsed = parseRepoUrl(url);
  if (!parsed) {
    throw new GitHubError(
      400,
      "not_found",
      "That doesn't look like a GitHub repository URL.",
    );
  }
  const { owner, name } = parsed;

  // Fast path: repo meta + tags in parallel (no releases/contributors here).
  const [metaResult, tagsResult] = await Promise.allSettled([
    getRepo(owner, name, token),
    listTags(owner, name, token),
  ]);

  if (tagsResult.status === "rejected") throw tagsResult.reason;
  const tags = tagsResult.value;
  const meta = metaResult.status === "fulfilled" ? metaResult.value : null;
  const tagNames = sortTagNames(tags);

  let rawCommits: RawCommit[] = [];
  let files: string[] = [];
  let base: string | null = null;
  let head: string | null = null;
  let rangeMode: "tags" | "commits" = "commits";
  let totalCommits = 0;
  let truncated = false;
  let churn = null;

  const useOverride = Boolean(baseOverride && headOverride);
  const latest = !useOverride && tags.length >= 2 ? pickLatestTags(tags) : null;

  if (useOverride || latest) {
    rangeMode = "tags";
    let newer = headOverride ?? latest![0];
    let older = baseOverride ?? latest![1];
    let cmp = await compareRefs(owner, name, older, newer, token);
    if (cmp.commits.length === 0 && !useOverride) {
      const swapped = await compareRefs(owner, name, newer, older, token);
      if (swapped.commits.length > 0) {
        [newer, older] = [older, newer];
        cmp = swapped;
      }
    }
    base = older;
    head = newer;
    totalCommits = cmp.total_commits;
    truncated = cmp.total_commits > cmp.commits.length;
    rawCommits = cmp.commits.map(toRaw);
    files = (cmp.files ?? []).map((f) => f.filename);
    churn = computeChurn(cmp.files);
  } else {
    head = meta?.default_branch ?? "HEAD";
    rangeMode = "commits";
    const commits = await listRecentCommits(owner, name, token);
    rawCommits = commits.map(toRaw);
    totalCommits = commits.length;
    truncated = commits.length >= 100;
  }

  const rawEntries = rawCommits.filter((c) => !isNoise(c));
  const entries: ChangelogEntry[] = rawEntries.map((c) => categorizeCommit(c));

  if (entries.length === 0) {
    throw new GitHubError(
      404,
      "no_commits",
      "No changelog-worthy commits found in this range.",
    );
  }

  const byCategory = new Map<CategoryKey, ChangelogEntry[]>();
  for (const entry of entries) {
    const list = byCategory.get(entry.category) ?? [];
    list.push(entry);
    byCategory.set(entry.category, list);
  }
  const groups: ChangelogGroup[] = CATEGORIES.map((c) => c.key)
    .filter((key) => byCategory.has(key))
    .map((category) => ({ category, entries: byCategory.get(category)! }));

  const statCounts: Partial<Record<CategoryKey, number>> = {};
  for (const g of groups) statCounts[g.category] = g.entries.length;

  const breaking = byCategory.get("breaking") ?? [];
  const hasFeature = byCategory.has("feature");
  const contributors = aggregateContributors(
    rawEntries.map((c) => ({
      sha: c.sha,
      commit: {
        message: c.message,
        author: c.authorName ? { name: c.authorName, date: c.date ?? "" } : null,
      },
      author: c.authorLogin
        ? { login: c.authorLogin, avatar_url: c.avatarUrl ?? "" }
        : null,
    })),
  );
  const distribution = computeDistribution(groups);
  const shipCount = entries.filter((e) => e.audience === "ship").length;

  const markdown = renderMarkdown({ owner, name, base, head, rangeMode, groups });
  const loomScore = computeLoomScore(
    entries,
    rawEntries.map((c) => c.message.split("\n")[0].trim()),
  );

  return {
    repo: `${owner}/${name}`,
    owner,
    name,
    base,
    head,
    rangeMode,
    tags: tagNames,
    groups,
    breaking,
    markdown,
    vitals: toVitals(meta),
    contributors,
    churn,
    distribution,
    truncated,
    loomScore,
    tldr: {
      commits: totalCommits,
      entries: entries.length,
      contributors: contributors.length,
      shipCount,
      plumbingCount: entries.length - shipCount,
      byCategory: statCounts,
      topAreas: topAreas(entries, files),
      bump: semverBump(base, head),
      suggestedVersion: suggestNextVersion(head, breaking.length > 0, hasFeature),
    },
    stats: {
      totalCommits,
      counted: entries.length,
      byCategory: statCounts,
    },
  };
}

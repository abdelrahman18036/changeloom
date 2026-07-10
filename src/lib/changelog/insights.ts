import type {
  GitHubCommit,
  GitHubFile,
  GitHubRelease,
} from "./github";
import type {
  CategorySlice,
  ChangelogGroup,
  Churn,
  RangeContributor,
} from "./types";

const DAY_MS = 1000 * 60 * 60 * 24;

/** Aggregate commit authors within a compare range, most active first. */
export function aggregateContributors(
  commits: GitHubCommit[],
): RangeContributor[] {
  const map = new Map<string, Omit<RangeContributor, "share">>();
  let total = 0;
  for (const c of commits) {
    const login = c.author?.login;
    if (!login) continue;
    total += 1;
    const existing = map.get(login);
    if (existing) {
      existing.commits += 1;
    } else {
      map.set(login, {
        login,
        avatarUrl: c.author?.avatar_url ?? "",
        commits: 1,
      });
    }
  }
  const denom = total || 1;
  return [...map.values()]
    .map((c) => ({ ...c, share: c.commits / denom }))
    .sort((a, b) => b.commits - a.commits);
}

export function computeChurn(files: GitHubFile[] | undefined): Churn | null {
  if (!files || files.length === 0) return null;
  let additions = 0;
  let deletions = 0;
  for (const f of files) {
    additions += f.additions;
    deletions += f.deletions;
  }
  const topFiles = [...files]
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 8)
    .map((f) => ({
      filename: f.filename,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
    }));
  return { filesChanged: files.length, additions, deletions, topFiles };
}

export function computeDistribution(groups: ChangelogGroup[]): CategorySlice[] {
  const total = groups.reduce((n, g) => n + g.entries.length, 0) || 1;
  return groups
    .map((g) => ({
      category: g.category,
      count: g.entries.length,
      pct: Math.round((g.entries.length / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export interface ReleasePoint {
  tag: string;
  name: string | null;
  date: string; // ISO
  gapDays: number | null; // days since previous release
  url: string;
  prerelease: boolean;
}

export interface CadenceInsights {
  total: number;
  points: ReleasePoint[]; // newest first
  avgDaysBetween: number | null;
  medianDaysBetween: number | null;
  fastestGapDays: number | null;
  slowestGapDays: number | null;
  firstDate: string | null;
  latestDate: string | null;
}

function releaseDate(r: GitHubRelease): string {
  return r.published_at ?? r.created_at;
}

/** Release cadence / velocity from the /releases endpoint. */
export function computeCadence(releases: GitHubRelease[]): CadenceInsights {
  const usable = releases
    .filter((r) => !r.draft)
    .sort(
      (a, b) =>
        new Date(releaseDate(b)).getTime() - new Date(releaseDate(a)).getTime(),
    );

  const points: ReleasePoint[] = usable.map((r, i) => {
    const next = usable[i + 1]; // older
    const gapDays = next
      ? Math.round(
          (new Date(releaseDate(r)).getTime() -
            new Date(releaseDate(next)).getTime()) /
            DAY_MS,
        )
      : null;
    return {
      tag: r.tag_name,
      name: r.name,
      date: releaseDate(r),
      gapDays,
      url: r.html_url,
      prerelease: r.prerelease,
    };
  });

  const gaps = points
    .map((p) => p.gapDays)
    .filter((g): g is number => g !== null && g >= 0);

  const avg =
    gaps.length > 0
      ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
      : null;

  const sortedGaps = [...gaps].sort((a, b) => a - b);
  const median = (() => {
    const len = sortedGaps.length;
    if (len === 0) return null;
    const mid = Math.floor(len / 2);
    return len % 2 === 0
      ? Math.round((sortedGaps[mid - 1] + sortedGaps[mid]) / 2)
      : sortedGaps[mid];
  })();

  return {
    total: usable.length,
    points,
    avgDaysBetween: avg,
    medianDaysBetween: median,
    fastestGapDays: gaps.length ? Math.min(...gaps) : null,
    slowestGapDays: gaps.length ? Math.max(...gaps) : null,
    firstDate: usable.length ? releaseDate(usable[usable.length - 1]) : null,
    latestDate: usable.length ? releaseDate(usable[0]) : null,
  };
}

import { describe, expect, it } from "vitest";
import {
  aggregateContributors,
  computeCadence,
  computeChurn,
  computeDistribution,
} from "./insights";
import type { GitHubCommit, GitHubFile, GitHubRelease } from "./github";

function ghCommit(login: string | null): GitHubCommit {
  return {
    sha: Math.random().toString(36).slice(2),
    commit: { message: "x", author: { name: "n", date: "2026-01-01" } },
    author: login ? { login, avatar_url: `https://a/${login}` } : null,
  };
}

function release(tag: string, isoDate: string): GitHubRelease {
  return {
    tag_name: tag,
    name: tag,
    body: "",
    published_at: isoDate,
    created_at: isoDate,
    prerelease: false,
    draft: false,
    html_url: `https://github.com/o/r/releases/tag/${tag}`,
    author: null,
  };
}

function file(over: Partial<GitHubFile> = {}): GitHubFile {
  return {
    filename: "src/a.ts",
    additions: 10,
    deletions: 2,
    changes: 12,
    status: "modified",
    ...over,
  };
}

describe("aggregateContributors", () => {
  it("tallies commits per author and sorts by volume", () => {
    const out = aggregateContributors([
      ghCommit("alice"),
      ghCommit("bob"),
      ghCommit("alice"),
      ghCommit("alice"),
    ]);
    expect(out[0]).toMatchObject({ login: "alice", commits: 3 });
    expect(out[1]).toMatchObject({ login: "bob", commits: 1 });
  });

  it("computes shares that sum to 1", () => {
    const out = aggregateContributors([ghCommit("a"), ghCommit("b")]);
    expect(out.reduce((n, c) => n + c.share, 0)).toBeCloseTo(1, 5);
  });

  it("skips commits with no linked GitHub account", () => {
    expect(aggregateContributors([ghCommit(null)])).toEqual([]);
  });

  it("never divides by zero", () => {
    expect(aggregateContributors([])).toEqual([]);
  });
});

describe("computeChurn", () => {
  it("sums additions/deletions and ranks the busiest files", () => {
    const churn = computeChurn([
      file({ filename: "a.ts", additions: 5, deletions: 1, changes: 6 }),
      file({ filename: "b.ts", additions: 50, deletions: 10, changes: 60 }),
    ])!;
    expect(churn.filesChanged).toBe(2);
    expect(churn.additions).toBe(55);
    expect(churn.deletions).toBe(11);
    expect(churn.topFiles[0].filename).toBe("b.ts");
  });

  it("returns null when the compare carried no file data", () => {
    expect(computeChurn(undefined)).toBeNull();
    expect(computeChurn([])).toBeNull();
  });
});

describe("computeDistribution", () => {
  it("returns percentages sorted by count", () => {
    const dist = computeDistribution([
      { category: "fix", entries: [{}, {}, {}] as never[] },
      { category: "feature", entries: [{}] as never[] },
    ]);
    expect(dist[0]).toMatchObject({ category: "fix", count: 3, pct: 75 });
    expect(dist[1]).toMatchObject({ category: "feature", count: 1, pct: 25 });
  });

  it("never divides by zero on an empty range", () => {
    expect(computeDistribution([])).toEqual([]);
  });
});

describe("computeCadence", () => {
  it("orders releases newest-first and measures the gaps", () => {
    const c = computeCadence([
      release("v1", "2026-01-01T00:00:00Z"),
      release("v2", "2026-01-11T00:00:00Z"), // 10d after v1
      release("v3", "2026-01-15T00:00:00Z"), // 4d after v2
    ]);
    expect(c.total).toBe(3);
    expect(c.points[0].tag).toBe("v3");
    expect(c.points[0].gapDays).toBe(4);
    expect(c.points[1].gapDays).toBe(10);
    expect(c.points[2].gapDays).toBeNull(); // oldest has no predecessor
  });

  it("averages the two middle gaps for an even-length set", () => {
    // gaps of 2 and 4 → median 3, not 4
    const c = computeCadence([
      release("v1", "2026-01-01T00:00:00Z"),
      release("v2", "2026-01-03T00:00:00Z"),
      release("v3", "2026-01-07T00:00:00Z"),
    ]);
    expect(c.medianDaysBetween).toBe(3);
  });

  it("reports fastest and slowest gaps", () => {
    const c = computeCadence([
      release("v1", "2026-01-01T00:00:00Z"),
      release("v2", "2026-01-02T00:00:00Z"),
      release("v3", "2026-02-01T00:00:00Z"),
    ]);
    expect(c.fastestGapDays).toBe(1);
    expect(c.slowestGapDays).toBe(30);
  });

  it("excludes drafts", () => {
    const draft = { ...release("draft", "2026-01-05T00:00:00Z"), draft: true };
    const c = computeCadence([release("v1", "2026-01-01T00:00:00Z"), draft]);
    expect(c.total).toBe(1);
  });

  it("handles a repo with no releases", () => {
    const c = computeCadence([]);
    expect(c.total).toBe(0);
    expect(c.medianDaysBetween).toBeNull();
    expect(c.latestDate).toBeNull();
  });

  it("handles a single release without inventing a gap", () => {
    const c = computeCadence([release("v1", "2026-01-01T00:00:00Z")]);
    expect(c.total).toBe(1);
    expect(c.avgDaysBetween).toBeNull();
  });
});

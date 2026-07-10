import type { Audience, CategoryKey } from "./categories";
import type { LoomScore } from "./score";

/** A single raw commit as we consume it from the GitHub compare API. */
export interface RawCommit {
  sha: string;
  message: string;
  authorLogin: string | null;
  authorName: string | null;
  avatarUrl: string | null;
  date: string | null;
}

/** A normalized changelog entry after categorization. */
export interface ChangelogEntry {
  /** Human-facing one-line description. */
  text: string;
  category: CategoryKey;
  audience: Audience;
  sha: string;
  shortSha: string;
  prNumber: number | null;
  /** Scope from a conventional commit, e.g. "api" in `feat(api):`. */
  scope: string | null;
  /** Author login for filtering / leaderboards. */
  author: string | null;
  avatarUrl: string | null;
  /** First line of a BREAKING CHANGE footer, when present. */
  breakingNote: string | null;
  /** Flagged as a security fix (CVE / vuln / security keywords). */
  isSecurity: boolean;
  /** Flagged as a dependency bump (bot author or bump pattern). */
  isDependency: boolean;
}

export interface ChangelogGroup {
  category: CategoryKey;
  entries: ChangelogEntry[];
}

export interface RepoVitals {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  url: string;
  homepage: string | null;
  license: string | null;
  pushedAt: string;
  defaultBranch: string;
}

export interface RangeContributor {
  login: string;
  avatarUrl: string;
  commits: number;
  /** Share of range commits, 0..1. */
  share: number;
}

export interface Churn {
  filesChanged: number;
  additions: number;
  deletions: number;
  topFiles: {
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
  }[];
}

export interface CategorySlice {
  category: CategoryKey;
  count: number;
  pct: number;
}

export type SemverBump = "major" | "minor" | "patch" | "none";

export interface Tldr {
  commits: number;
  entries: number;
  contributors: number;
  shipCount: number;
  plumbingCount: number;
  byCategory: Partial<Record<CategoryKey, number>>;
  topAreas: string[];
  bump: SemverBump;
  suggestedVersion: string | null;
}

/** The full portal payload returned by the primary generate endpoint. */
export interface ChangelogResult {
  repo: string;
  owner: string;
  name: string;
  base: string | null;
  head: string | null;
  rangeMode: "tags" | "commits";
  /** All tag names (newest-first, semver sorted) for the range picker. */
  tags: string[];
  groups: ChangelogGroup[];
  breaking: ChangelogEntry[];
  markdown: string;
  vitals: RepoVitals | null;
  contributors: RangeContributor[];
  churn: Churn | null;
  distribution: CategorySlice[];
  tldr: Tldr;
  loomScore: LoomScore;
  /** Security fixes surfaced from the range (CVE / vuln keywords). */
  security: ChangelogEntry[];
  /** Count of dependency-bump entries in the range. */
  dependencyUpdates: number;
  /** True when head is a branch (unreleased preview), not a tag. */
  staging: boolean;
  /** Repo default branch, for the "Unreleased" staging button. */
  defaultBranch: string | null;
  /** A deterministic, fun codename for this release. */
  codename: string;
  /** True when the range exceeded GitHub's compare cap (250 commits). */
  truncated: boolean;
  stats: {
    totalCommits: number;
    counted: number;
    byCategory: Partial<Record<CategoryKey, number>>;
  };
}

export interface ChangelogRequest {
  url: string;
  token?: string;
  base?: string;
  head?: string;
}

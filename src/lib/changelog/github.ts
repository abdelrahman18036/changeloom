const API = "https://api.github.com";

export class GitHubError extends Error {
  status: number;
  /** Machine-readable reason so the UI can render the right message. */
  reason: "not_found" | "rate_limit" | "bad_token" | "no_commits" | "unknown";

  constructor(status: number, reason: GitHubError["reason"], message: string) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
    this.reason = reason;
  }
}

export interface GitHubTag {
  name: string;
  commit: { sha: string };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
  author: { login: string; avatar_url: string } | null;
}

export interface GitHubRepoMeta {
  full_name: string;
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  license: { spdx_id: string | null; name: string } | null;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  created_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  author: { login: string; avatar_url: string } | null;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubFile {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
}

function headers(token?: string): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "changeloom",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function gh<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(token),
    // Live data per request; the route layer handles caching.
    cache: "no-store",
  });

  if (res.ok) return (await res.json()) as T;

  if (res.status === 404) {
    throw new GitHubError(404, "not_found", "Repository not found.");
  }
  if (res.status === 401) {
    throw new GitHubError(401, "bad_token", "The provided token is invalid.");
  }
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new GitHubError(
        403,
        "rate_limit",
        "GitHub API rate limit reached. Add a personal access token to raise the limit.",
      );
    }
    throw new GitHubError(403, "unknown", "GitHub denied the request.");
  }
  throw new GitHubError(
    res.status,
    "unknown",
    `GitHub request failed (${res.status}).`,
  );
}

export function listTags(owner: string, name: string, token?: string) {
  return gh<GitHubTag[]>(
    `/repos/${owner}/${name}/tags?per_page=100`,
    token,
  );
}

export function compareRefs(
  owner: string,
  name: string,
  base: string,
  head: string,
  token?: string,
) {
  return gh<{
    commits: GitHubCommit[];
    total_commits: number;
    files?: GitHubFile[];
  }>(
    `/repos/${owner}/${name}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
    token,
  );
}

export function getRepo(owner: string, name: string, token?: string) {
  return gh<GitHubRepoMeta>(`/repos/${owner}/${name}`, token);
}

export function listReleases(
  owner: string,
  name: string,
  token?: string,
  perPage = 100,
) {
  return gh<GitHubRelease[]>(
    `/repos/${owner}/${name}/releases?per_page=${perPage}`,
    token,
  );
}

export function listContributors(
  owner: string,
  name: string,
  token?: string,
  perPage = 100,
) {
  return gh<GitHubContributor[]>(
    `/repos/${owner}/${name}/contributors?per_page=${perPage}`,
    token,
  );
}

export function listRecentCommits(
  owner: string,
  name: string,
  token?: string,
) {
  return gh<GitHubCommit[]>(
    `/repos/${owner}/${name}/commits?per_page=100`,
    token,
  );
}

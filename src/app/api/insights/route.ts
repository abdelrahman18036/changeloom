import { NextResponse } from "next/server";
import { parseRepoUrl } from "@/lib/changelog/categorize";
import {
  GitHubError,
  listContributors,
  listReleases,
} from "@/lib/changelog/github";
import { computeCadence } from "@/lib/changelog/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lazy-loaded when the Insights tab opens, so the changelog fast path is
 * never blocked on the /releases call.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  if (!repo) {
    return NextResponse.json(
      { error: "A repo is required.", reason: "bad_request" },
      { status: 400 },
    );
  }

  const parsed = parseRepoUrl(repo);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid repo.", reason: "not_found" },
      { status: 400 },
    );
  }

  const token =
    searchParams.get("token")?.trim() || process.env.GITHUB_TOKEN || undefined;

  try {
    // Releases (cadence) + all-time contributors (first-timer detection),
    // fetched in parallel. Contributors are best-effort.
    const [releases, contributors] = await Promise.all([
      listReleases(parsed.owner, parsed.name, token),
      listContributors(parsed.owner, parsed.name, token).catch(() => []),
    ]);
    const cadence = computeCadence(releases);
    const allTimeContributors = contributors.map((c) => ({
      login: c.login,
      contributions: c.contributions,
    }));
    return NextResponse.json(
      { cadence, releaseCount: releases.length, allTimeContributors },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    if (err instanceof GitHubError) {
      return NextResponse.json(
        { error: err.message, reason: err.reason, retryAt: err.retryAt },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Couldn't load insights.", reason: "unknown" },
      { status: 500 },
    );
  }
}

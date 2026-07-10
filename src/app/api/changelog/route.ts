import { NextResponse } from "next/server";
import { generateChangelog } from "@/lib/changelog/generate";
import { GitHubError } from "@/lib/changelog/github";
import {
  renderKeepAChangelog,
  renderPlainText,
} from "@/lib/changelog/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  url?: string;
  token?: string;
  base?: string;
  head?: string;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", reason: "bad_request" },
      { status: 400 },
    );
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json(
      { error: "A repository URL is required.", reason: "bad_request" },
      { status: 400 },
    );
  }

  // User-supplied token wins; fall back to the server token so the hosted
  // demo isn't limited to 60 requests/hour for anonymous visitors.
  const token = body.token?.trim() || process.env.GITHUB_TOKEN || undefined;

  try {
    const result = await generateChangelog(url, {
      token,
      base: body.base?.trim() || undefined,
      head: body.head?.trim() || undefined,
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    if (err instanceof GitHubError) {
      return NextResponse.json(
        { error: err.message, reason: err.reason },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    console.error("changelog generation failed", err);
    return NextResponse.json(
      { error: "Something went wrong generating the changelog.", reason: "unknown" },
      { status: 500 },
    );
  }
}

/**
 * Callable export API for CI pipelines:
 *   GET /api/changelog?repo=owner/name&base=..&head=..&format=md|keepachangelog|plain|json
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
  const format = searchParams.get("format") ?? "md";
  const token =
    searchParams.get("token")?.trim() || process.env.GITHUB_TOKEN || undefined;

  try {
    const result = await generateChangelog(repo, {
      token,
      base: searchParams.get("base")?.trim() || undefined,
      head: searchParams.get("head")?.trim() || undefined,
    });

    if (format === "json") {
      return NextResponse.json(result);
    }

    const args = {
      owner: result.owner,
      name: result.name,
      base: result.base,
      head: result.head,
      groups: result.groups,
    };
    const body =
      format === "keepachangelog"
        ? renderKeepAChangelog(args)
        : format === "plain"
          ? renderPlainText(args)
          : result.markdown;

    return new Response(body, {
      headers: {
        "Content-Type":
          format === "plain" ? "text/plain; charset=utf-8" : "text/markdown; charset=utf-8",
        "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    if (err instanceof GitHubError) {
      return NextResponse.json(
        { error: err.message, reason: err.reason },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Export failed.", reason: "unknown" },
      { status: 500 },
    );
  }
}

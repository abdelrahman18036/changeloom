import { generateChangelog } from "@/lib/changelog/generate";
import { GitHubError } from "@/lib/changelog/github";
import { CATEGORY_MAP } from "@/lib/changelog/categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * llms.txt-style machine-readable changelog for AI coding agents / MCP.
 *   /api/llms/owner/repo?base=..&head=..
 * Clean, token-efficient plain text an agent can drop into an upgrade prompt.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params;
  const { searchParams } = new URL(request.url);
  const token = process.env.GITHUB_TOKEN || undefined;

  try {
    const r = await generateChangelog(`${owner}/${repo}`, {
      token,
      base: searchParams.get("base")?.trim() || undefined,
      head: searchParams.get("head")?.trim() || undefined,
    });

    const range = r.base && r.head ? `${r.base}...${r.head}` : (r.head ?? "");
    const lines: string[] = [
      `# ${r.repo} changelog (${range})`,
      "",
      `loom_score: ${r.loomScore.grade} (${r.loomScore.score}/100)`,
      `commits: ${r.stats.totalCommits}`,
      `contributors: ${r.tldr.contributors}`,
      `semver_bump: ${r.tldr.bump}`,
      `suggested_version: ${r.tldr.suggestedVersion ?? "n/a"}`,
      `breaking_changes: ${r.breaking.length}`,
      `security_fixes: ${r.security.length}`,
      `dependency_updates: ${r.dependencyUpdates}`,
      `truncated: ${r.truncated}`,
      "",
    ];

    if (r.breaking.length) {
      lines.push("## Breaking changes");
      for (const e of r.breaking) {
        lines.push(`- ${e.text}${e.breakingNote ? ` — ${e.breakingNote}` : ""} (${e.prNumber ? `#${e.prNumber}` : e.shortSha})`);
      }
      lines.push("");
    }
    if (r.security.length) {
      lines.push("## Security fixes");
      for (const e of r.security) lines.push(`- ${e.text} (${e.prNumber ? `#${e.prNumber}` : e.shortSha})`);
      lines.push("");
    }

    for (const g of r.groups) {
      if (g.category === "breaking") continue;
      lines.push(`## ${CATEGORY_MAP[g.category].title}`);
      for (const e of g.entries) {
        lines.push(`- ${e.scope ? `${e.scope}: ` : ""}${e.text} (${e.prNumber ? `#${e.prNumber}` : e.shortSha})`);
      }
      lines.push("");
    }

    lines.push(`source: ${new URL(request.url).origin}/${r.repo}`);

    return new Response(lines.join("\n") + "\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const msg = err instanceof GitHubError ? err.message : "Unavailable.";
    const status = err instanceof GitHubError ? err.status : 500;
    return new Response(`# error\n${msg}\n`, {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

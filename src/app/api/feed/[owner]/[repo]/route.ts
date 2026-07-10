import { listReleases, GitHubError } from "@/lib/changelog/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Atom feed of a repo's releases — the zero-signup subscription backbone.
 *   /api/feed/owner/repo
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params;
  const site = new URL(request.url).origin;
  const token = process.env.GITHUB_TOKEN || undefined;

  try {
    const releases = (await listReleases(owner, repo, token))
      .filter((r) => !r.draft)
      .slice(0, 40);

    const updated = releases[0]?.published_at ?? new Date(0).toISOString();
    const self = `${site}/api/feed/${owner}/${repo}`;

    const entries = releases
      .map((r) => {
        const title = r.name || r.tag_name;
        const when = r.published_at ?? r.created_at;
        const body = (r.body || "").trim() || `Release ${r.tag_name}.`;
        return `  <entry>
    <title>${esc(title)}</title>
    <id>${esc(r.html_url)}</id>
    <link href="${esc(r.html_url)}"/>
    <updated>${esc(when)}</updated>
    <content type="text">${esc(body.slice(0, 4000))}</content>
  </entry>`;
      })
      .join("\n");

    const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(owner)}/${esc(repo)} — releases</title>
  <subtitle>Woven by Changeloom</subtitle>
  <id>${esc(self)}</id>
  <link rel="self" href="${esc(self)}"/>
  <link href="${esc(`${site}/${owner}/${repo}`)}"/>
  <updated>${esc(updated)}</updated>
${entries}
</feed>`;

    return new Response(atom, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const status = err instanceof GitHubError ? err.status : 500;
    return new Response(`<!-- feed unavailable -->`, {
      status,
      headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
    });
  }
}

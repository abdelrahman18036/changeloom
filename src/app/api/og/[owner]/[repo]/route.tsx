import { ImageResponse } from "next/og";
import { generateChangelog } from "@/lib/changelog/generate";
import type { CategoryKey } from "@/lib/changelog/categories";

export const runtime = "nodejs";

const CAT_HEX: Record<CategoryKey, string> = {
  breaking: "#f0705f",
  feature: "#4fd18a",
  fix: "#f2c14e",
  perf: "#b78bf5",
  docs: "#6fb2f0",
  refactor: "#8f9bf0",
  test: "#4fd0d8",
  chore: "#9aa3b2",
  other: "#a3abb8",
};

function gradeHex(g: string): string {
  if (g.startsWith("A")) return "#4fd18a";
  if (g === "B") return "#b6d94f";
  if (g === "C") return "#f2c14e";
  if (g === "D") return "#f0955f";
  return "#f0705f";
}

const BG = "#12161d";
const INK = "#e6edf3";
const MUTED = "#8b95a8";
const COBALT = "#6ea0ff";

/**
 * Dynamic Open Graph card for a repo/range — turns every shared permalink into
 * a branded unfurl. /api/og/owner/repo?base=..&head=..
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params;
  const { searchParams } = new URL(request.url);

  let data: Awaited<ReturnType<typeof generateChangelog>> | null = null;
  try {
    data = await generateChangelog(`${owner}/${repo}`, {
      token: process.env.GITHUB_TOKEN || undefined,
      base: searchParams.get("base")?.trim() || undefined,
      head: searchParams.get("head")?.trim() || undefined,
    });
  } catch {
    data = null;
  }

  const range =
    data?.base && data?.head ? `${data.base} … ${data.head}` : (data?.head ?? "");
  const total = data ? data.distribution.reduce((n, d) => n + d.count, 0) || 1 : 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          backgroundImage: `radial-gradient(1000px 500px at 15% -10%, rgba(110,160,255,0.22), transparent), radial-gradient(800px 500px at 95% 110%, rgba(110,160,255,0.12), transparent)`,
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 40, height: 40, borderRadius: 11, background: "#1b2230", alignItems: "center", justifyContent: "center" }}>
            <svg width="30" height="30" viewBox="0 0 32 32">
              <path d="M5.5 13 C 8 13, 8 11.5, 10.5 11.5 S 13.5 14.5, 16 14.5 S 19 11.5, 21.5 11.5 S 24 13, 26.5 13" stroke={COBALT} strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <g stroke="#e8ecf4" strokeWidth="2" opacity="0.5" strokeLinecap="round">
                <line x1="10.5" y1="6" x2="10.5" y2="26" /><line x1="16" y1="6" x2="16" y2="26" /><line x1="21.5" y1="6" x2="21.5" y2="26" />
              </g>
              <path d="M5.5 19 C 8 19, 8 20.5, 10.5 20.5 S 13.5 17.5, 16 17.5 S 19 20.5, 21.5 20.5 S 24 19, 26.5 19" stroke={COBALT} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.62" />
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>Changeloom</div>
        </div>

        {/* repo */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
            {`${owner}/${repo}`}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: MUTED, marginTop: 8 }}>
            {range || "latest changes"}
          </div>
        </div>

        {/* category bar */}
        {data && (
          <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginTop: 28, background: "#1b2230" }}>
            {data.distribution.map((d) => (
              <div key={d.category} style={{ width: `${(d.count / total) * 100}%`, background: CAT_HEX[d.category] }} />
            ))}
          </div>
        )}

        {/* footer stats + score */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 28 }}>
          <div style={{ display: "flex", gap: 40, fontSize: 26, color: MUTED }}>
            {data ? (
              <>
                <div style={{ display: "flex", gap: 8 }}><span style={{ color: INK, fontWeight: 700 }}>{data.stats.totalCommits}</span> commits</div>
                <div style={{ display: "flex", gap: 8 }}><span style={{ color: INK, fontWeight: 700 }}>{data.tldr.contributors}</span> contributors</div>
                <div style={{ display: "flex", gap: 8 }}><span style={{ color: INK, fontWeight: 700 }}>{data.breaking.length}</span> breaking</div>
              </>
            ) : (
              <div>Paste a repo URL, get a changelog.</div>
            )}
          </div>
          {data && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: `2px solid ${gradeHex(data.loomScore.grade)}`, borderRadius: 16, padding: "12px 22px" }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: gradeHex(data.loomScore.grade), lineHeight: 1 }}>{data.loomScore.grade}</div>
              <div style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>{`Loom Score ${data.loomScore.score}`}</div>
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

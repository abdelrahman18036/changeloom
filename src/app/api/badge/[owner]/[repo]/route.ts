import { generateChangelog } from "@/lib/changelog/generate";
import type { LoomGrade } from "@/lib/changelog/score";

export const runtime = "nodejs";

const GRADE_COLORS: Record<LoomGrade, string> = {
  "A+": "#4ade80",
  A: "#4ade80",
  B: "#a3e635",
  C: "#facc15",
  D: "#fb923c",
  F: "#f87171",
};

/** Approximate text width at 11px for badge sizing. */
function textWidth(text: string): number {
  return Math.round(text.length * 6.6);
}

function badgeSvg(right: string, rightColor: string): string {
  const label = "changelog";
  const leftText = textWidth(label);
  const rightText = textWidth(right);
  const glyph = 22;
  const leftW = glyph + leftText + 10;
  const rightW = rightText + 14;
  const W = leftW + rightW;
  const H = 22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" role="img" aria-label="${label}: ${right}">
  <clipPath id="r"><rect width="${W}" height="${H}" rx="4"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftW}" height="${H}" fill="#161b26"/>
    <rect x="${leftW}" width="${rightW}" height="${H}" fill="#0d1117"/>
    <rect x="${leftW}" width="1" height="${H}" fill="#2a3140"/>
  </g>
  <!-- mini weave glyph -->
  <g transform="translate(6,4)">
    <line x1="3" y1="1" x2="3" y2="13" stroke="#8b95a8" stroke-width="1.1" opacity="0.55"/>
    <line x1="7.5" y1="1" x2="7.5" y2="13" stroke="#8b95a8" stroke-width="1.1" opacity="0.55"/>
    <line x1="12" y1="1" x2="12" y2="13" stroke="#8b95a8" stroke-width="1.1" opacity="0.55"/>
    <path d="M0.5 4.5 C3 4.5 3 4.5 5 4.5 S7.5 8 9.5 8 S12 4.5 14.5 4.5" fill="none" stroke="#6ea0ff" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M0.5 10.5 C3 10.5 3 10.5 5 10.5 S7.5 8 9.5 8 S12 10.5 14.5 10.5" fill="none" stroke="#6ea0ff" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>
  </g>
  <g fill="#e6edf3" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${glyph + 2}" y="15">${label}</text>
    <text x="${leftW + 7}" y="15" fill="${rightColor}" font-weight="bold">${right}</text>
  </g>
</svg>`;
}

/**
 * Embeddable changelog badge:
 *   [![changelog](https://changeloom.vercel.app/api/badge/owner/repo)](https://changeloom.vercel.app/owner/repo)
 * Shows the repo's Loom Score (changelog-hygiene grade) for its latest range.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params;
  const headers = {
    "Content-Type": "image/svg+xml; charset=utf-8",
    // Badges are hot-linked from READMEs — cache hard at the edge.
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  };

  try {
    const result = await generateChangelog(`${owner}/${repo}`, {
      token: process.env.GITHUB_TOKEN || undefined,
    });
    const { grade, score } = result.loomScore;
    const right = `${grade} · ${score}`;
    return new Response(badgeSvg(right, GRADE_COLORS[grade]), { headers });
  } catch {
    return new Response(badgeSvg("n/a", "#8b95a8"), { headers });
  }
}

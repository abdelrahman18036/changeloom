import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChangeloomApp } from "@/components/app/changeloom-app";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ base?: string; head?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const { base, head } = await searchParams;
  const full = `${owner}/${repo}`;
  const q = new URLSearchParams();
  if (base) q.set("base", base);
  if (head) q.set("head", head);
  const ogUrl = `/api/og/${full}${q.toString() ? `?${q}` : ""}`;
  const desc = `Categorized changelog, release insights, contributors and Loom Score for ${full} — woven by Changeloom.`;

  return {
    title: full,
    description: desc,
    alternates: {
      types: { "application/atom+xml": `/api/feed/${full}` },
    },
    openGraph: {
      title: `${full} · Changeloom`,
      description: desc,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${full} · Changeloom`,
      description: desc,
      images: [ogUrl],
    },
  };
}

export default async function RepoPage({ params, searchParams }: Props) {
  const { owner, repo } = await params;
  const { base, head } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ChangeloomApp
          initialRepo={`${owner}/${repo}`}
          initialBase={base}
          initialHead={head}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

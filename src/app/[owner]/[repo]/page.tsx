import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChangeloomApp } from "@/components/app/changeloom-app";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ base?: string; head?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const full = `${owner}/${repo}`;
  return {
    title: full,
    description: `Categorized changelog, release insights, contributors and Loom Score for ${full} — woven by Changeloom.`,
    openGraph: {
      title: `${full} · Changeloom`,
      description: `What actually changed in ${full} — categorized changelog, insights and contributors.`,
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

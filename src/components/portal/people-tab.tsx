"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderGit2, Heart, Sparkles, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import type { ChangelogResult } from "@/lib/changelog/types";
import { CATEGORY_MAP, type CategoryKey } from "@/lib/changelog/categories";
import { ContributorWarp } from "@/components/loom/contributor-warp";
import { Panel, PanelHeader } from "@/components/portal/panel";

const INITIAL = 15;

export function PeopleTab({
  result,
  token,
}: {
  result: ChangelogResult;
  token: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [firstTimers, setFirstTimers] = useState<Set<string>>(new Set());
  const contributors = result.contributors;

  // First-time contributors: their all-time commit count ≈ their count in this
  // range → they have no history before it. Lazy, best-effort.
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ repo: result.repo });
    if (token) params.set("token", token);
    fetch(`/api/insights?${params}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const all: { login: string; contributions: number }[] =
          data?.allTimeContributors ?? [];
        if (all.length === 0) return;
        const allTime = new Map(all.map((c) => [c.login, c.contributions]));
        const timers = new Set<string>();
        for (const c of result.contributors) {
          const total = allTime.get(c.login);
          if (total != null && total <= c.commits) timers.add(c.login);
        }
        setFirstTimers(timers);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [result.repo, result.contributors, token]);

  // What each author actually built, by category — "who did what".
  const authorMix = useMemo(() => {
    const map = new Map<string, Map<CategoryKey, number>>();
    for (const g of result.groups) {
      for (const e of g.entries) {
        if (!e.author) continue;
        const m = map.get(e.author) ?? new Map<CategoryKey, number>();
        m.set(g.category, (m.get(g.category) ?? 0) + 1);
        map.set(e.author, m);
      }
    }
    return map;
  }, [result.groups]);

  // Who owns each area (conventional-commit scope) in this range.
  const areaOwners = useMemo(() => {
    const scopes = new Map<string, Map<string, number>>();
    for (const g of result.groups) {
      for (const e of g.entries) {
        if (!e.scope || !e.author) continue;
        const m = scopes.get(e.scope) ?? new Map<string, number>();
        m.set(e.author, (m.get(e.author) ?? 0) + 1);
        scopes.set(e.scope, m);
      }
    }
    return [...scopes.entries()]
      .map(([scope, authors]) => {
        const total = [...authors.values()].reduce((n, v) => n + v, 0);
        const [owner, count] = [...authors.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0];
        return { scope, owner, count, total, share: count / total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [result.groups]);
  const shown = expanded ? contributors : contributors.slice(0, INITIAL);
  const top = contributors[0];
  const topShare = top ? Math.round(top.share * 100) : 0;
  const top3Share = Math.round(
    contributors.slice(0, 3).reduce((n, c) => n + c.share, 0) * 100,
  );

  if (contributors.length === 0) {
    return (
      <Panel>
        <p className="py-6 text-center text-sm text-muted-foreground">
          No attributable commit authors in this range.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader icon={Users} title="Who wove this release" hint={`${result.base ?? "start"}…${result.head ?? "HEAD"}`} />
        <ContributorWarp contributors={contributors} className="mb-5" />
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border/60 pt-4 text-sm">
          <span>
            <span className="font-mono font-semibold tabular-nums">
              {contributors.length}
            </span>{" "}
            <span className="text-muted-foreground">contributors</span>
          </span>
          {top && (
            <span className="text-muted-foreground">
              top author{" "}
              <span className="font-mono text-foreground">{top.login}</span> ·{" "}
              {topShare}%
            </span>
          )}
          <span className="text-muted-foreground">
            top 3 · <span className="font-mono text-foreground">{top3Share}%</span> of commits
          </span>
          {firstTimers.size > 0 && (
            <span className="inline-flex items-center gap-1 text-cat-feature">
              <UserPlus className="size-3.5" /> {firstTimers.size} first-timer
              {firstTimers.size > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => {
              const names = contributors.map((c) => `@${c.login}`).join(", ");
              const co = result.coAuthors.map((c) => c.name).join(", ");
              const block = `Thanks to ${names}${co ? ` and co-authors ${co}` : ""} for shipping ${result.base ?? ""}…${result.head ?? ""}! 🧵`;
              navigator.clipboard
                ?.writeText(block)
                .then(() => toast.success("Credits copied — go say thanks"))
                .catch(() => toast.error("Clipboard blocked"));
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Heart className="size-3" /> Thank them
          </button>
        </div>
        {result.truncated && (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
            counts are a floor — range exceeds GitHub&apos;s compare cap
          </p>
        )}
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
      <div className="overflow-hidden rounded-xl border bg-panel">
        <ol>
          {shown.map((c, i) => {
            const pct = Math.round(c.share * 100);
            return (
              <li
                key={c.login}
                className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0"
              >
                <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    className="size-7 rounded-full border border-border/60"
                  />
                ) : (
                  <span className="size-7 rounded-full bg-secondary" />
                )}
                <a
                  href={`https://github.com/${c.login}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-1.5 truncate font-mono text-sm text-foreground/90 hover:text-primary"
                >
                  {c.login}
                  {firstTimers.has(c.login) && (
                    <span
                      title="First-time contributor"
                      className="inline-flex items-center gap-0.5 rounded-full bg-cat-feature/15 px-1.5 py-0.5 text-[10px] font-medium text-cat-feature"
                    >
                      <UserPlus className="size-2.5" /> new
                    </span>
                  )}
                </a>
                <ContributionMix mix={authorMix.get(c.login)} />
                <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {c.commits}
                </span>
              </li>
            );
          })}
        </ol>
        {contributors.length > INITIAL && (
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="w-full border-t border-border/60 py-2.5 text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded
              ? "Show less"
              : `Show all ${contributors.length} contributors`}
          </button>
        )}
      </div>

      <div className="space-y-5">
      {areaOwners.length > 0 && (
        <Panel>
          <PanelHeader icon={FolderGit2} title="Area ownership" hint="by scope" />
          <ul className="space-y-2.5">
            {areaOwners.map((a) => (
              <li key={a.scope} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 truncate font-mono text-xs text-primary">
                  {a.scope}
                </span>
                <a
                  href={`https://github.com/${a.owner}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-foreground/80 hover:text-primary"
                >
                  {a.owner}
                </a>
                <div className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-secondary sm:block">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(6, Math.round(a.share * 100))}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {Math.round(a.share * 100)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            The dominant author per area — useful for reviews and bus-factor.
          </p>
        </Panel>
      )}

      {result.coAuthors.length > 0 && (
        <Panel>
          <PanelHeader icon={Sparkles} title="Co-authors" hint="Co-authored-by trailers" />
          <div className="flex flex-wrap gap-2">
            {result.coAuthors.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs"
              >
                <span className="text-foreground/90">{c.name}</span>
                {c.commits > 1 && (
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {c.commits}
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Credited via commit trailers — easy to miss on GitHub&apos;s own view.
          </p>
        </Panel>
      )}

      <p className="px-1 text-xs text-muted-foreground">
        Each bar shows{" "}
        <span className="text-foreground/80">what that person built</span>, by
        category — not just how much.
      </p>
      </div>
      </div>
    </div>
  );
}

/** A tiny stacked bar of one contributor's work, by category. */
function ContributionMix({ mix }: { mix?: Map<CategoryKey, number> }) {
  if (!mix || mix.size === 0) {
    return <div className="hidden h-1.5 w-28 rounded-full bg-secondary sm:block" />;
  }
  const entries = [...mix.entries()].sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((n, [, v]) => n + v, 0) || 1;
  const label = entries
    .map(([cat, n]) => `${CATEGORY_MAP[cat].label}: ${n}`)
    .join(", ");
  return (
    <div
      className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-secondary sm:flex"
      title={label}
    >
      {entries.map(([cat, n]) => (
        <div
          key={cat}
          style={{ width: `${(n / total) * 100}%`, backgroundColor: CATEGORY_MAP[cat].colorVar }}
        />
      ))}
    </div>
  );
}

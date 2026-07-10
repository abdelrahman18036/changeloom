"use client";

import { useMemo, useState } from "react";
import { FolderGit2, Users } from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import { CATEGORY_MAP, type CategoryKey } from "@/lib/changelog/categories";
import { ContributorWarp } from "@/components/loom/contributor-warp";
import { Panel, PanelHeader } from "@/components/portal/panel";

const INITIAL = 15;

export function PeopleTab({ result }: { result: ChangelogResult }) {
  const [expanded, setExpanded] = useState(false);
  const contributors = result.contributors;

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
        </div>
        {result.truncated && (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
            counts are a floor — range exceeds GitHub&apos;s compare cap
          </p>
        )}
      </Panel>

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
                  className="min-w-0 flex-1 truncate font-mono text-sm text-foreground/90 hover:text-primary"
                >
                  {c.login}
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

      <p className="px-1 text-xs text-muted-foreground">
        Each bar shows <span className="text-foreground/80">what that person built</span>,
        by category — not just how much.
      </p>

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

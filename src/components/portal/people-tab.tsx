"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import { ContributorWarp } from "@/components/loom/contributor-warp";
import { Panel, PanelHeader } from "@/components/portal/panel";

const INITIAL = 15;

export function PeopleTab({ result }: { result: ChangelogResult }) {
  const [expanded, setExpanded] = useState(false);
  const contributors = result.contributors;
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
                <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-secondary sm:block">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
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
    </div>
  );
}

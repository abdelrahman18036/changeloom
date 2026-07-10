"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FlaskConical,
  Package,
  Search,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  CATEGORIES,
  CATEGORY_MAP,
  type CategoryKey,
} from "@/lib/changelog/categories";
import type { ChangelogEntry, ChangelogResult } from "@/lib/changelog/types";
import { SelvedgeTick } from "@/components/loom/selvedge-tick";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
type Audience = "all" | "ship" | "plumbing";

export function ChangelogTab({ result }: { result: ChangelogResult }) {
  const all = useMemo(() => result.groups.flatMap((g) => g.entries), [result]);
  const presentCats = useMemo(
    () => CATEGORIES.filter((c) => result.groups.some((g) => g.category === c.key)),
    [result],
  );

  const [q, setQ] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [cats, setCats] = useState<Set<CategoryKey>>(new Set());
  const [author, setAuthor] = useState("");
  const [hideDeps, setHideDeps] = useState(false);
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const authors = useMemo(() => {
    const set = new Set<string>();
    for (const e of all) if (e.author) set.add(e.author);
    return [...set].sort();
  }, [all]);
  const depCount = useMemo(() => all.filter((e) => e.isDependency).length, [all]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((e) => {
      if (audience !== "all" && e.audience !== audience) return false;
      if (cats.size > 0 && !cats.has(e.category)) return false;
      if (author && e.author !== author) return false;
      if (hideDeps && e.isDependency) return false;
      if (needle) {
        const hay = `${e.text} ${e.scope ?? ""} ${e.author ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [all, q, audience, cats, author, hideDeps]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE,
  );

  useEffect(() => setPage(0), [q, audience, cats, author, hideDeps]);

  // Keyboard: `/` focus search, `[` `]` paginate.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable;
      if (typing) {
        if (e.key === "Escape") el?.blur();
        return;
      }
      // Don't hijack browser/OS shortcuts.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "[") {
        setPage((p) => Math.max(0, p - 1));
      } else if (e.key === "]") {
        setPage((p) => Math.min(pageCount - 1, p + 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageCount]);

  function toggleCat(key: CategoryKey) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const from = filtered.length === 0 ? 0 : clampedPage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, clampedPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      {result.staging && (
        <div className="flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Unreleased preview</strong> —
            everything on{" "}
            <span className="font-mono text-foreground">{result.head}</span> since{" "}
            <span className="font-mono text-foreground">{result.base}</span>. This
            is what your next release would contain.
          </p>
        </div>
      )}

      <TldrStrip result={result} />

      {result.security.length > 0 && (
        <SecurityCallout entries={result.security} repo={result.repo} />
      )}

      {result.truncated && (
        <div className="flex items-start gap-2.5 rounded-lg border border-cat-fix/30 bg-cat-fix/10 p-3 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-cat-fix" />
          <p className="text-muted-foreground">
            {result.rangeMode === "commits" ? (
              <>
                This repo has fewer than two tags, so this shows the{" "}
                <strong className="text-foreground">latest 100 commits</strong> on{" "}
                {result.head}. There may be more history.
              </>
            ) : (
              <>
                This range exceeds GitHub&apos;s compare limit (250 commits) —
                counts and contributor totals below are a{" "}
                <strong className="text-foreground">floor</strong>. Narrow the
                range for exact numbers.
              </>
            )}
          </p>
        </div>
      )}

      {result.breaking.length > 0 && (
        <BreakingCallout entries={result.breaking} repo={result.repo} />
      )}

      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search entries…  ( / )"
              aria-label="Search changelog entries"
              className="h-9 w-full rounded-lg border bg-panel pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            {authors.length > 1 && (
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                aria-label="Filter by author"
                className="h-9 max-w-[10rem] rounded-lg border bg-panel px-2.5 font-mono text-xs text-foreground/90 outline-none focus-visible:border-primary/50"
              >
                <option value="">All authors</option>
                {authors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            )}
            <div className="inline-flex rounded-lg border bg-panel p-0.5 text-xs font-medium">
              {(["all", "ship", "plumbing"] as Audience[]).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                aria-pressed={audience === a}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  audience === a
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {a === "all" ? "All" : a === "ship" ? "Affects you" : "Under the hood"}
              </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {presentCats.map((c) => {
            const active = cats.has(c.key);
            return (
              <button
                key={c.key}
                onClick={() => toggleCat(c.key)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "text-foreground"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
                style={
                  active
                    ? {
                        color: c.colorVar,
                        borderColor: `color-mix(in oklch, ${c.colorVar} 40%, transparent)`,
                        backgroundColor: `color-mix(in oklch, ${c.colorVar} 12%, transparent)`,
                      }
                    : undefined
                }
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: c.colorVar }}
                />
                {c.label}
                <span className="tabular-nums opacity-70">
                  {result.stats.byCategory[c.key] ?? 0}
                </span>
              </button>
            );
          })}
          {depCount > 0 && (
            <button
              onClick={() => setHideDeps((h) => !h)}
              aria-pressed={hideDeps}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                hideDeps
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <Package className="size-3" />
              {hideDeps ? "deps hidden" : `hide ${depCount} deps`}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No entries match these filters.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border bg-panel">
          {pageItems.map((entry, i) => (
            <ChangelogRow
              key={entry.sha}
              entry={entry}
              repo={result.repo}
              last={i === pageItems.length - 1}
            />
          ))}
        </ul>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(from).padStart(3, "0")}–{String(to).padStart(3, "0")} /{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <PagerButton
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              label="Previous page ( [ )"
            >
              <ChevronLeft className="size-4" />
            </PagerButton>
            <span className="px-2 font-mono text-xs tabular-nums text-muted-foreground">
              {clampedPage + 1}/{pageCount}
            </span>
            <PagerButton
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={clampedPage >= pageCount - 1}
              label="Next page ( ] )"
            >
              <ChevronRight className="size-4" />
            </PagerButton>
          </div>
        </div>
      )}
    </div>
  );
}

function PagerButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-lg border bg-panel text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ChangelogRow({
  entry,
  repo,
  last,
}: {
  entry: ChangelogEntry;
  repo: string;
  last: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const repoUrl = `https://github.com/${repo}`;
  const href = entry.prNumber
    ? `${repoUrl}/pull/${entry.prNumber}`
    : `${repoUrl}/commit/${entry.sha}`;
  const ref = entry.prNumber ? `#${entry.prNumber}` : entry.shortSha;

  async function copyEntry() {
    const line = `- ${entry.scope ? `${entry.scope}: ` : ""}${entry.text} (${ref})`;
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      toast.success("Entry copied");
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Clipboard blocked");
    }
  }

  return (
    <li
      className={cn(
        "group flex items-stretch gap-3 px-3 py-2.5 transition-colors hover:bg-secondary/40",
        !last && "border-b border-border/60",
      )}
    >
      <SelvedgeTick category={entry.category} />
      <div className="flex min-w-0 flex-1 items-start gap-2 py-0.5 text-sm leading-relaxed">
        <span className="min-w-0 flex-1 break-words text-foreground/90">
          {entry.scope && (
            <span className="font-mono text-xs font-medium text-primary">
              {entry.scope}:{" "}
            </span>
          )}
          {entry.text}
          {entry.isSecurity && (
            <ShieldAlert className="ml-1.5 inline size-3 align-[-1px] text-cat-fix" />
          )}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-center">
        <button
          onClick={copyEntry}
          aria-label="Copy entry"
          className="opacity-0 transition-opacity hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? (
            <Check className="size-3.5 text-primary" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
        {entry.author && (
          <span className="hidden font-mono text-xs text-muted-foreground/70 sm:inline">
            {entry.author}
          </span>
        )}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {ref}
        </a>
      </div>
    </li>
  );
}

function BreakingCallout({
  entries,
  repo,
}: {
  entries: ChangelogEntry[];
  repo: string;
}) {
  const repoUrl = `https://github.com/${repo}`;
  return (
    <div className="rounded-xl border border-cat-breaking/30 bg-cat-breaking/[0.07] p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="size-4 text-cat-breaking" />
        <h3 className="text-sm font-semibold text-cat-breaking">
          {entries.length} breaking change{entries.length > 1 ? "s" : ""}
        </h3>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.sha} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cat-breaking" />
            <span className="min-w-0 flex-1 break-words text-foreground/90">
              {e.text}
              {e.breakingNote && (
                <span className="mt-0.5 block break-words font-mono text-xs text-muted-foreground">
                  {e.breakingNote}
                </span>
              )}
            </span>
            <a
              href={
                e.prNumber ? `${repoUrl}/pull/${e.prNumber}` : `${repoUrl}/commit/${e.sha}`
              }
              target="_blank"
              rel="noreferrer"
              className="shrink-0 font-mono text-xs text-muted-foreground hover:text-cat-breaking"
            >
              {e.prNumber ? `#${e.prNumber}` : e.shortSha}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecurityCallout({
  entries,
  repo,
}: {
  entries: ChangelogEntry[];
  repo: string;
}) {
  const repoUrl = `https://github.com/${repo}`;
  return (
    <div className="rounded-xl border border-cat-fix/40 bg-cat-fix/[0.08] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="size-4 text-cat-fix" />
        <h3 className="text-sm font-semibold text-cat-fix">
          {entries.length} security fix{entries.length > 1 ? "es" : ""} — patch
          soon
        </h3>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.sha} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cat-fix" />
            <span className="min-w-0 flex-1 break-words text-foreground/90">
              {e.text}
            </span>
            <a
              href={
                e.prNumber ? `${repoUrl}/pull/${e.prNumber}` : `${repoUrl}/commit/${e.sha}`
              }
              target="_blank"
              rel="noreferrer"
              className="shrink-0 font-mono text-xs text-muted-foreground hover:text-cat-fix"
            >
              {e.prNumber ? `#${e.prNumber}` : e.shortSha}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TldrStrip({ result }: { result: ChangelogResult }) {
  const t = result.tldr;
  const bumpColor =
    t.bump === "major"
      ? "text-cat-breaking"
      : t.bump === "minor"
        ? "text-cat-feature"
        : "text-cat-fix";
  const stats = [
    { label: "commits", value: result.stats.totalCommits },
    { label: "entries", value: t.entries },
    { label: "contributors", value: t.contributors },
    { label: "affects you", value: t.shipCount },
  ];
  return (
    <div className="rounded-xl border bg-panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="size-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">codename</span>
          <span className="font-display text-base italic text-primary">
            {result.codename}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result.security.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-cat-fix/15 px-2 py-0.5 text-xs text-cat-fix">
              <ShieldAlert className="size-3" /> {result.security.length} security
            </span>
          )}
          {result.dependencyUpdates > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              <Package className="size-3" /> {result.dependencyUpdates} deps
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className="font-mono text-lg font-semibold tabular-nums">
              {s.value}
            </span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
        {t.bump !== "none" && (
          <div className="flex items-baseline gap-1.5">
            <span className={cn("font-mono text-sm font-semibold uppercase", bumpColor)}>
              {t.bump}
            </span>
            <span className="text-xs text-muted-foreground">bump</span>
          </div>
        )}
      </div>
      {t.topAreas.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <span className="text-xs text-muted-foreground">Most touched</span>
          {t.topAreas.map((a) => (
            <span
              key={a}
              className="max-w-full truncate rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/80"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

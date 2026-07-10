"use client";

import { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  Activity,
  Clock,
  Fingerprint,
  Flame,
  Gauge,
  GitCommitHorizontal,
  Hammer,
  HeartPulse,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChangelogResult } from "@/lib/changelog/types";
import type { CadenceInsights } from "@/lib/changelog/insights";
import { CadenceRibbon } from "@/components/loom/cadence-ribbon";
import { VelocityChart } from "@/components/loom/velocity-chart";
import { ReleaseShape } from "@/components/loom/release-shape";
import { PunchCard } from "@/components/loom/punch-card";
import { LoomScoreGauge } from "@/components/loom/loom-score-gauge";
import { DistributionBar } from "@/components/loom/distribution-bar";
import { ChurnBars } from "@/components/loom/churn-bars";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Panel, PanelHeader } from "@/components/portal/panel";

export function InsightsTab({
  result,
  token,
}: {
  result: ChangelogResult;
  token: string;
}) {
  const [cadence, setCadence] = useState<CadenceInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ repo: result.repo });
    if (token) params.set("token", token);
    fetch(`/api/insights?${params}`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || "Couldn't load release insights.");
        }
        return r.json();
      })
      .then((data) => setCadence(data.cadence))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [result.repo, token, reloadKey]);

  const allEntries = useMemo(
    () => result.groups.flatMap((g) => g.entries),
    [result.groups],
  );

  // Building vs firefighting: features/perf (forward) vs fixes (reactive).
  const building =
    (result.stats.byCategory.feature ?? 0) + (result.stats.byCategory.perf ?? 0);
  const firefighting = result.stats.byCategory.fix ?? 0;
  const balanceTotal = building + firefighting;
  const buildingPct = balanceTotal
    ? Math.round((building / balanceTotal) * 100)
    : null;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Loom Score — changelog hygiene grade */}
      <Panel className="lg:col-span-2">
        <PanelHeader
          icon={Gauge}
          title="Loom Score"
          hint="changelog hygiene, 0–100"
        />
        <LoomScoreGauge score={result.loomScore} />
      </Panel>

      {/* Project pulse */}
      <Panel className="lg:col-span-2">
        <PanelHeader icon={HeartPulse} title="Project pulse" hint="health signals" />
        <PulseRow result={result} cadence={cadence} loading={loading} />
      </Panel>

      {/* Ship Rhythm */}
      <Panel className="lg:col-span-2">
        <PanelHeader icon={Activity} title="Ship rhythm" hint="from releases" />
        <div aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="flex h-28 items-center justify-center text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-panel px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" /> Retry
            </button>
          </div>
        ) : !cadence || cadence.total < 2 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Not enough published releases to chart a cadence.
          </p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Stat label="releases" value={cadence.total} />
              <Stat label="median gap" value={cadence.medianDaysBetween ?? 0} suffix="d" />
              <Stat label="avg gap" value={cadence.avgDaysBetween ?? 0} suffix="d" />
              <Stat label="fastest" value={cadence.fastestGapDays ?? 0} suffix="d" />
              <Stat label="longest" value={cadence.slowestGapDays ?? 0} suffix="d" />
            </div>
            <CadenceRibbon points={cadence.points} />
            <DroughtLine cadence={cadence} />
            <p className="font-mono text-[11px] text-muted-foreground/70">
              denser weave = more frequent releases
            </p>
            <div className="border-t border-border/60 pt-4">
              <VelocityChart points={cadence.points} />
            </div>
          </div>
        )}
        </div>
      </Panel>

      {/* Release anatomy */}
      <Panel>
        <PanelHeader icon={GitCommitHorizontal} title="Release anatomy" hint="this range" />
        <DistributionBar distribution={result.distribution} />
        {result.tldr.suggestedVersion && (
          <div className="mt-5 rounded-lg border bg-raised/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5 text-primary" />
              Suggested next version
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-primary">
              {result.tldr.suggestedVersion}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              from {result.tldr.byCategory.feature ?? 0} features
              {result.breaking.length > 0
                ? ` and ${result.breaking.length} breaking`
                : ""}{" "}
              since {result.base ?? "start"}
            </p>
          </div>
        )}
      </Panel>

      {/* Release shape */}
      <Panel>
        <PanelHeader icon={Fingerprint} title="Shape of the release" hint="category fingerprint" />
        <div className="flex justify-center py-2">
          <ReleaseShape distribution={result.distribution} />
        </div>
        <p className="text-center font-mono text-[11px] text-muted-foreground/70">
          every release has a silhouette
        </p>
      </Panel>

      {/* Ship punch-card */}
      <Panel>
        <PanelHeader icon={Clock} title="When they ship" hint="commit times" />
        <PunchCard entries={allEntries} />
        <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
          brighter = more commits in that day + time-of-day
        </p>
      </Panel>

      {/* Building vs firefighting */}
      {buildingPct !== null && (
        <Panel>
          <PanelHeader icon={Hammer} title="Building vs firefighting" hint="this range" />
          <div className="mb-2 flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Hammer className="size-3.5 text-cat-feature" />
              <span className="font-mono text-lg font-semibold tabular-nums">
                {buildingPct}%
              </span>
              building
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              firefighting{" "}
              <span className="font-mono font-semibold text-foreground">
                {100 - buildingPct}%
              </span>
              <Flame className="size-3.5 text-cat-fix" />
            </span>
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
            <div style={{ width: `${buildingPct}%`, backgroundColor: "var(--cat-feature)" }} />
            <div style={{ width: `${100 - buildingPct}%`, backgroundColor: "var(--cat-fix)" }} />
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground">
            {building} new features &amp; perf wins vs {firefighting} bug fixes.
          </p>
        </Panel>
      )}

      {/* Churn */}
      <Panel>
        <PanelHeader icon={GitCommitHorizontal} title="Hotspots" hint="most-changed files" />
        {result.churn ? (
          <>
            <div className="mb-4 flex gap-6 font-mono text-sm">
              <span className="text-primary">
                +<AnimatedNumber value={result.churn.additions} />
              </span>
              <span className="text-destructive">
                −<AnimatedNumber value={result.churn.deletions} />
              </span>
              <span className="text-muted-foreground">
                <AnimatedNumber value={result.churn.filesChanged} /> files
              </span>
            </div>
            <ChurnBars churn={result.churn} />
            <ChurnByArea churn={result.churn} />
            {result.truncated && (
              <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
                totals are a floor — range exceeds GitHub&apos;s file cap
              </p>
            )}
          </>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            File-level churn isn&apos;t available for this range.
          </p>
        )}
      </Panel>
    </div>
  );
}

const DAY_MS = 86_400_000;

function DroughtLine({ cadence }: { cadence: CadenceInsights }) {
  if (!cadence.latestDate) return null;
  const days = Math.floor(
    (Date.now() - new Date(cadence.latestDate).getTime()) / DAY_MS,
  );
  const med = cadence.medianDaysBetween;
  const overdue = med != null && days > med * 2;
  return (
    <p
      className={cn(
        "mt-1 text-xs",
        overdue ? "text-cat-fix" : "text-muted-foreground",
      )}
    >
      Last release <span className="font-mono">{days}d</span> ago
      {med != null && (
        <>
          {" "}
          · median <span className="font-mono">{med}d</span>
        </>
      )}
      {overdue && <span className="font-medium"> · overdue</span>}
    </p>
  );
}

type Pulse = "good" | "ok" | "weak";
const PULSE_COLOR: Record<Pulse, string> = {
  good: "var(--cat-feature)",
  ok: "var(--cat-fix)",
  weak: "var(--cat-breaking)",
};

function PulseRow({
  result,
  cadence,
  loading,
}: {
  result: ChangelogResult;
  cadence: CadenceInsights | null;
  loading: boolean;
}) {
  const signals: { label: string; value: string; pulse: Pulse }[] = [];

  // Shipping (from cadence)
  if (cadence?.latestDate) {
    const days = Math.floor(
      (Date.now() - new Date(cadence.latestDate).getTime()) / DAY_MS,
    );
    const med = cadence.medianDaysBetween ?? 30;
    const pulse: Pulse = days <= med * 1.5 ? "good" : days <= med * 3 ? "ok" : "weak";
    signals.push({
      label: "Shipping",
      value: `${days}d since release`,
      pulse,
    });
  } else if (!loading) {
    signals.push({ label: "Shipping", value: "no releases", pulse: "ok" });
  }

  // Team concentration (bus factor)
  const topShare = result.contributors[0]?.share ?? 1;
  signals.push({
    label: "Team",
    value:
      result.contributors.length <= 1
        ? "solo"
        : `top author ${Math.round(topShare * 100)}%`,
    pulse: result.contributors.length <= 1 ? "weak" : topShare > 0.8 ? "ok" : "good",
  });

  // Changelog hygiene (Loom Score)
  const s = result.loomScore.score;
  signals.push({
    label: "Hygiene",
    value: `Loom ${result.loomScore.grade}`,
    pulse: s >= 80 ? "good" : s >= 55 ? "ok" : "weak",
  });

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {signals.map((sig) => (
        <div
          key={sig.label}
          className="flex items-center gap-2.5 rounded-lg border bg-raised/40 px-3 py-2.5"
        >
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: PULSE_COLOR[sig.pulse],
              boxShadow: `0 0 8px -1px ${PULSE_COLOR[sig.pulse]}`,
            }}
          />
          <div className="min-w-0">
            <div className="text-sm text-foreground/90">{sig.label}</div>
            <div className="truncate font-mono text-xs text-muted-foreground">
              {sig.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChurnByArea({ churn }: { churn: NonNullable<ChangelogResult["churn"]> }) {
  const dirs = new Map<string, number>();
  for (const f of churn.topFiles) {
    const dir = f.filename.includes("/") ? f.filename.split("/")[0] : "(root)";
    dirs.set(dir, (dirs.get(dir) ?? 0) + f.changes);
  }
  const rows = [...dirs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (rows.length < 2) return null;
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div className="mt-4 border-t border-border/60 pt-3">
      <div className="mb-2 font-mono text-[11px] text-muted-foreground/70">
        by top-level directory
      </div>
      <div className="space-y-1.5">
        {rows.map(([dir, changes]) => (
          <div key={dir} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate font-mono text-xs text-foreground/80">
              {dir}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/60">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(changes / max) * 100}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {changes}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono text-2xl font-semibold tabular-nums">
        <AnimatedNumber value={value} />
        {suffix}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

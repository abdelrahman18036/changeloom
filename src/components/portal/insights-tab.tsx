"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Fingerprint,
  Gauge,
  GitCommitHorizontal,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import type { CadenceInsights } from "@/lib/changelog/insights";
import { CadenceRibbon } from "@/components/loom/cadence-ribbon";
import { VelocityChart } from "@/components/loom/velocity-chart";
import { ReleaseShape } from "@/components/loom/release-shape";
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

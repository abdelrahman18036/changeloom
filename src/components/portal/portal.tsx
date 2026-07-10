"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Activity, Download, RotateCcw, ScrollText, Users } from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import { VitalSigns } from "@/components/portal/vital-signs";
import { RangeSelector } from "@/components/portal/range-selector";
import { ChangelogTab } from "@/components/portal/changelog-tab";
import { InsightsTab } from "@/components/portal/insights-tab";
import { PeopleTab } from "@/components/portal/people-tab";
import { ExportTab } from "@/components/portal/export-tab";
import { cn } from "@/lib/utils";

type TabId = "changelog" | "insights" | "people" | "export";

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "changelog", label: "Changelog", icon: ScrollText },
  { id: "insights", label: "Insights", icon: Activity },
  { id: "people", label: "People", icon: Users },
  { id: "export", label: "Export", icon: Download },
];

export function Portal({
  result,
  token,
  pending,
  onCompare,
  onReset,
}: {
  result: ChangelogResult;
  token: string;
  pending: boolean;
  onCompare: (base: string, head: string) => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<TabId>("changelog");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-5xl px-5 py-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <VitalSigns result={result} />
        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          <RangeSelector
            tags={result.tags}
            base={result.base}
            head={result.head}
            pending={pending}
            onCompare={onCompare}
          />
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> New repo
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div
        role="tablist"
        aria-label="Portal views"
        onKeyDown={(e) => {
          const idx = TABS.findIndex((t) => t.id === tab);
          let next = idx;
          if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
          else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = TABS.length - 1;
          else return;
          e.preventDefault();
          setTab(TABS[next].id);
          tabRefs.current[next]?.focus();
        }}
        className="mt-4 flex gap-1 overflow-x-auto border-b border-border/60"
      >
        {TABS.map((t, i) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-4" />
              {t.label}
              {active && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab */}
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="mt-6 focus-visible:outline-none"
      >
        {tab === "changelog" && <ChangelogTab result={result} />}
        {tab === "insights" && <InsightsTab result={result} token={token} />}
        {tab === "people" && <PeopleTab result={result} />}
        {tab === "export" && <ExportTab result={result} />}
      </div>
    </motion.div>
  );
}

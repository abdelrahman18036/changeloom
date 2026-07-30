"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Activity,
  Command as CommandIcon,
  Copy,
  Download,
  ExternalLink,
  FlaskConical,
  Link2,
  RotateCcw,
  ScrollText,
  Users,
} from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import { VitalSigns } from "@/components/portal/vital-signs";
import { RangeSelector } from "@/components/portal/range-selector";
import { ChangelogTab } from "@/components/portal/changelog-tab";
import { InsightsTab } from "@/components/portal/insights-tab";
import { PeopleTab } from "@/components/portal/people-tab";
import { ExportTab } from "@/components/portal/export-tab";
import {
  CommandPalette,
  type Command,
} from "@/components/portal/command-palette";
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
  onStaging,
  onReset,
}: {
  result: ChangelogResult;
  token: string;
  pending: boolean;
  onCompare: (base: string, head: string) => void;
  onStaging: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<TabId>("changelog");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const repoUrl = `https://github.com/${result.repo}`;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function copyText(text: string, msg: string) {
    navigator.clipboard
      ?.writeText(text)
      .then(() => toast.success(msg))
      .catch(() => toast.error("Clipboard blocked"));
  }

  const commands: Command[] = [
    ...TABS.map((t) => ({
      id: `tab-${t.id}`,
      label: `Go to ${t.label}`,
      icon: t.icon,
      keywords: "tab view",
      run: () => setTab(t.id),
    })),
    {
      id: "unreleased",
      label: "Show unreleased changes",
      icon: FlaskConical,
      keywords: "staging preview",
      run: onStaging,
    },
    {
      id: "copy-md",
      label: "Copy changelog markdown",
      icon: Copy,
      run: () => copyText(result.markdown, "Markdown copied"),
    },
    {
      id: "copy-link",
      label: "Copy shareable link",
      icon: Link2,
      run: () =>
        copyText(
          typeof window !== "undefined"
            ? `${window.location.origin}/${result.repo}`
            : result.repo,
          "Link copied",
        ),
    },
    {
      id: "github",
      label: "Open repository on GitHub",
      icon: ExternalLink,
      run: () => window.open(repoUrl, "_blank", "noopener,noreferrer"),
    },
    {
      id: "new-repo",
      label: "Weave a different repo",
      icon: RotateCcw,
      keywords: "reset home",
      run: onReset,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[1800px] px-5 py-8 sm:px-8"
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
          <div className="flex items-center gap-3">
            <button
              onClick={onStaging}
              disabled={pending || result.staging}
              title="Everything on the default branch not yet released"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
            >
              <FlaskConical className="size-3.5" /> Unreleased
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> New repo
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              title="Command palette"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <CommandIcon className="size-3" />K
            </button>
          </div>
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
        {tab === "people" && <PeopleTab result={result} token={token} />}
        {tab === "export" && <ExportTab result={result} />}
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        commands={commands}
      />
    </motion.div>
  );
}

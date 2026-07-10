"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Bot,
  Check,
  Copy,
  Download,
  Link2,
  Rocket,
  Rss,
  Share2,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import type { ChangelogResult } from "@/lib/changelog/types";
import {
  renderKeepAChangelog,
  renderMarkdown,
  renderPlainText,
} from "@/lib/changelog/render";
import { Panel, PanelHeader } from "@/components/portal/panel";
import { cn } from "@/lib/utils";

type Format = "conventional" | "keepachangelog" | "plain" | "json";

const FORMATS: { id: Format; label: string; ext: string; lang: string }[] = [
  { id: "conventional", label: "Markdown", ext: "md", lang: "markdown" },
  { id: "keepachangelog", label: "Keep a Changelog", ext: "md", lang: "markdown" },
  { id: "plain", label: "Plain text", ext: "txt", lang: "text" },
  { id: "json", label: "JSON", ext: "json", lang: "json" },
];

export function ExportTab({ result }: { result: ChangelogResult }) {
  const [format, setFormat] = useState<Format>("conventional");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const content = useMemo(() => {
    const args = {
      owner: result.owner,
      name: result.name,
      base: result.base,
      head: result.head,
      groups: result.groups,
    };
    switch (format) {
      case "conventional":
        return renderMarkdown({ ...args, rangeMode: result.rangeMode });
      case "keepachangelog":
        return renderKeepAChangelog(args);
      case "plain":
        return renderPlainText(args);
      case "json":
        return JSON.stringify(result, null, 2);
    }
  }, [format, result]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const permalink = useMemo(() => {
    if (!origin) return "";
    const p = new URLSearchParams();
    if (result.base) p.set("base", result.base);
    if (result.head) p.set("head", result.head);
    const q = p.toString();
    return `${origin}/${result.repo}${q ? `?${q}` : ""}`;
  }, [result, origin]);

  const badgeUrl = `${origin}/api/badge/${result.repo}`;
  const badgeMarkdown = `[![changelog](${badgeUrl})](${origin}/${result.repo})`;
  const feedUrl = `${origin}/api/feed/${result.repo}`;
  const llmsUrl = `${origin}/api/llms/${result.repo}`;
  const repoUrl = `https://github.com/${result.repo}`;

  // One-click GitHub Release drafter — deep-link, no auth.
  const releaseDraftUrl = useMemo(() => {
    const tag = result.head ?? "";
    const title = `${tag} — ${result.codename}`;
    const p = new URLSearchParams({
      tag,
      title,
      body: `${result.markdown}\n\n---\n_Woven by [Changeloom](${origin}/${result.repo})._`,
    });
    return `${repoUrl}/releases/new?${p}`;
  }, [result, origin, repoUrl]);

  // Pre-composed social share intents.
  const shareText = `What changed in ${result.repo} ${result.base ? `(${result.base}…${result.head})` : ""} — Loom Score ${result.loomScore.grade}`;
  const shares = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(permalink)}` },
    { label: "Bluesky", href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareText} ${permalink}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}` },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodeURIComponent(permalink)}&title=${encodeURIComponent(shareText)}` },
    { label: "Hacker News", href: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(permalink)}&t=${encodeURIComponent(result.repo + " changelog")}` },
  ];

  const apiUrl = useMemo(() => {
    const p = new URLSearchParams({ repo: result.repo, format });
    if (result.base) p.set("base", result.base);
    if (result.head) p.set("head", result.head);
    return `/api/changelog?${p}`;
  }, [result, format]);

  async function copy(text: string, msg: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(msg);
      return true;
    } catch {
      toast.error("Clipboard was blocked by your browser");
      return false;
    }
  }

  function download() {
    const meta = FORMATS.find((f) => f.id === format)!;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      format === "json" ? "changeloom.json" : `CHANGELOG.${meta.ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  }

  return (
    <div className="space-y-5">
      <Panel>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex flex-wrap rounded-lg border bg-panel p-0.5 text-xs font-medium">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                aria-pressed={format === f.id}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  format === f.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={download}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-panel px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="size-4" /> Download
            </button>
            <button
              onClick={async () => {
                const ok = await copy(content, "Copied to clipboard");
                if (!ok) return;
                setCopied(true);
                if (copyTimer.current) clearTimeout(copyTimer.current);
                copyTimer.current = setTimeout(() => setCopied(false), 1600);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <pre className="max-h-[26rem] overflow-auto rounded-lg border bg-background/60 p-4 font-mono text-xs leading-relaxed text-foreground/80">
          {content}
        </pre>
      </Panel>

      {/* Publish & share */}
      <div className="grid gap-5 md:grid-cols-2">
        <Panel>
          <PanelHeader icon={Rocket} title="Publish" hint="one click to GitHub" />
          <p className="mb-3 text-sm text-muted-foreground">
            Draft a GitHub Release pre-filled with these notes — you land one
            click from Publish.
          </p>
          <a
            href={releaseDraftUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Rocket className="size-4" /> Draft GitHub Release
          </a>
        </Panel>

        <Panel>
          <PanelHeader icon={Share2} title="Share" hint="pre-composed" />
          <div className="flex flex-wrap gap-2">
            {shares.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border bg-panel px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
            <button
              onClick={() => copy(`*${result.repo}* changelog — Loom Score ${result.loomScore.grade}\n${permalink}`, "Slack snippet copied")}
              className="rounded-lg border bg-panel px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Copy for Slack
            </button>
          </div>
        </Panel>
      </div>

      {/* Machine-readable — feeds & AI agents */}
      <Panel>
        <PanelHeader icon={Bot} title="Machine-readable" hint="feeds & AI agents" />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            { icon: Rss, label: "Atom feed", url: feedUrl, hint: "subscribe" },
            { icon: Bot, label: "llms.txt", url: llmsUrl, hint: "for AI agents" },
            { icon: Terminal, label: "OG card", url: `${origin}/api/og/${result.repo}`, hint: "social image" },
          ].map((m) => (
            <a
              key={m.label}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-lg border bg-panel px-3 py-2.5 transition-colors hover:border-primary/40"
            >
              <m.icon className="size-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-sm text-foreground/90">{m.label}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">{m.hint}</span>
              </span>
            </a>
          ))}
        </div>
      </Panel>

      {/* README badge — the Loom Score, embeddable anywhere */}
      <Panel>
        <PanelHeader
          icon={BadgeCheck}
          title="README badge"
          hint="live Loom Score"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center rounded-lg border bg-background/60 px-5 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeUrl} alt={`Changelog badge for ${result.repo}`} height={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm text-muted-foreground">
              A living badge of this repo&apos;s changelog hygiene — paste it in
              your README and it links readers straight to this portal.
            </p>
            <div className="flex items-start gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg border bg-background/60 px-3 py-2 font-mono text-xs text-foreground/80">
                {badgeMarkdown}
              </code>
              <button
                onClick={() => copy(badgeMarkdown, "Badge markdown copied")}
                aria-label="Copy badge markdown"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-panel text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel>
          <PanelHeader icon={Link2} title="Shareable link" />
          <p className="mb-3 text-sm text-muted-foreground">
            Anyone opening this link gets the same repo and range, ready-woven.
          </p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border bg-background/60 px-3 py-2 font-mono text-xs text-foreground/80">
              {permalink}
            </code>
            <button
              onClick={() => copy(permalink, "Link copied")}
              aria-label="Copy link"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-panel text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="size-4" />
            </button>
          </div>
        </Panel>

        <Panel>
          <PanelHeader icon={Terminal} title="CI recipe" hint="callable API" />
          <p className="mb-3 text-sm text-muted-foreground">
            Fetch this changelog from your release pipeline.
          </p>
          <div className="flex items-start gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre rounded-lg border bg-background/60 px-3 py-2 font-mono text-xs text-foreground/80">
              {`curl "${typeof window !== "undefined" ? window.location.origin : ""}${apiUrl}"`}
            </code>
            <button
              onClick={() =>
                copy(
                  `curl "${window.location.origin}${apiUrl}"`,
                  "Command copied",
                )
              }
              aria-label="Copy command"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-panel text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="size-4" />
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, GitCompareArrows, Gauge, KeyRound, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WarpField } from "@/components/loom/warp-field";
import { ReleaseRibbon, type RibbonPoint } from "@/components/loom/release-ribbon";
import { cn } from "@/lib/utils";

const EXAMPLES = ["honojs/hono", "vercel/next.js", "colinhacks/zod", "facebook/react"];

const DEMO: RibbonPoint[] = [
  { label: "v1.0", value: 9 },
  { label: "v1.1", value: 15 },
  { label: "v1.2", value: 6 },
  { label: "v1.3", value: 23 },
  { label: "v2.0-rc", value: 12, prerelease: true },
  { label: "v2.0", value: 31 },
  { label: "v2.1", value: 14 },
  { label: "v2.2", value: 20 },
  { label: "v2.3", value: 9 },
  { label: "v3.0", value: 27 },
  { label: "v3.1", value: 17 },
  { label: "v3.2", value: 24 },
];

const stage = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const FEATURES = [
  { icon: Gauge, text: "Loom Score — grade your changelog hygiene" },
  { icon: GitCompareArrows, text: "compare any two tags" },
  { icon: BadgeCheck, text: "live README badge" },
];

export function Hero({
  onGenerate,
  pending,
  token,
  onToken,
}: {
  onGenerate: (url: string) => void;
  pending: boolean;
  token: string;
  onToken: (t: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [showToken, setShowToken] = useState(false);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Loom-stage back-planes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <WarpField />
      </div>
      <div aria-hidden className="weave-field pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="weave-grid pointer-events-none absolute inset-0 -z-10" />

      <motion.div
        variants={stage}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-14 pt-20 text-center sm:pt-28"
      >
        {/* Overline */}
        <motion.div
          variants={rise}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3.5 py-1.5"
        >
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_1px_var(--primary)]" />
          <span className="font-mono text-xs text-muted-foreground">
            open source · no account · no install
          </span>
        </motion.div>

        {/* Headline — Geist with a woven serif accent */}
        <motion.h1
          variants={rise}
          className="text-balance text-[clamp(2.75rem,7.5vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.025em]"
        >
          Weave any repo into
          <br />
          <span className="relative inline-block">
            <span className="font-display italic tracking-normal text-primary">
              a changelog
            </span>
            {/* the weft threads through the word */}
            <svg
              viewBox="0 0 340 14"
              className="absolute -bottom-2 left-0 h-3.5 w-full sm:-bottom-3"
              aria-hidden
              preserveAspectRatio="none"
            >
              <path
                d="M4 7 C 50 7, 50 3.5, 96 3.5 S 148 11, 194 11 S 246 3.5, 292 3.5 S 320 7, 336 7"
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2.5}
                strokeLinecap="round"
                className="animate-weft"
                style={{ ["--dash" as string]: 700, opacity: 0.85 }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Changeloom threads commits, releases and contributors into a portal
          that answers what actually changed — categorized, scored, exportable.
        </motion.p>

        {/* The reed — command bar */}
        <motion.form
          variants={rise}
          onSubmit={(e) => {
            e.preventDefault();
            onGenerate(url);
          }}
          className="mt-9 w-full max-w-2xl"
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl border bg-card/80 p-2 pl-4 backdrop-blur-sm transition-shadow duration-300",
              "focus-within:thread-ring",
            )}
          >
            <span className="hidden select-none font-mono text-sm text-muted-foreground sm:inline">
              github.com/
            </span>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="owner/repo"
              aria-label="GitHub repository"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-11 flex-1 border-0 bg-transparent px-0 font-mono text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <kbd className="hidden rounded-md border border-border/70 bg-secondary/60 px-2 py-1 font-mono text-[10px] text-muted-foreground md:inline-block">
              ↵ Enter
            </kbd>
            <button
              type="submit"
              disabled={pending || !url.trim()}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Weaving
                </>
              ) : (
                <>
                  Weave <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                disabled={pending}
                onClick={() => {
                  setUrl(ex);
                  onGenerate(ex);
                }}
                className="rounded-full border border-border/70 bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--primary)] disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowToken((s) => !s)}
              className="inline-flex items-center gap-1 px-1 text-xs text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <KeyRound className="size-3" />
              {showToken ? "hide token" : "token"}
            </button>
          </div>

          {showToken && (
            <div className="animate-rise mx-auto mt-3 max-w-md">
              <Input
                type="password"
                value={token}
                onChange={(e) => onToken(e.target.value)}
                placeholder="ghp_… (kept in your browser, sent only with your request)"
                aria-label="GitHub personal access token"
                autoComplete="off"
                className="h-9 font-mono text-xs"
              />
            </div>
          )}
        </motion.form>

        {/* The living ribbon — full-width landscape with the shuttle in flight */}
        <motion.div variants={rise} className="mt-14 w-full text-foreground">
          <div className="pane relative overflow-hidden rounded-2xl p-5 sm:p-6">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground/80">
              <span>release ribbon</span>
              <span>node = release · post = commits shipped</span>
            </div>
            <ReleaseRibbon points={DEMO} height={170} traveler />
          </div>
        </motion.div>

        {/* Feature ticker */}
        <motion.div
          variants={rise}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5"
        >
          {FEATURES.map((f) => (
            <span
              key={f.text}
              className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground"
            >
              <f.icon className="size-3.5 text-primary" />
              {f.text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LiveBackdrop } from "@/components/loom/live-backdrop";
import { HeroShowcase } from "@/components/app/hero-showcase";
import { isValidRepo, normalizeRepoInput } from "@/lib/changelog/categorize";
import { cn } from "@/lib/utils";

const EXAMPLES = ["honojs/hono", "vercel/next.js", "colinhacks/zod", "facebook/react"];

const stage = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const FEATURES = [
  { icon: Gauge, text: "Loom Score — grade changelog hygiene" },
  { icon: FlaskConical, text: "preview unreleased changes" },
  { icon: ShieldCheck, text: "spot security fixes" },
  { icon: GitCompareArrows, text: "compare any two tags" },
  { icon: BadgeCheck, text: "live README badge" },
];

export function Hero({
  value,
  onValueChange,
  onGenerate,
  pending,
  token,
  onToken,
  openToken,
  error,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onGenerate: (url: string) => void;
  pending: boolean;
  token: string;
  onToken: (t: string) => void;
  openToken?: boolean;
  error?: string | null;
}) {
  const [showToken, setShowToken] = useState(false);

  // A private-repo error upstream asks us to reveal the token field.
  useEffect(() => {
    if (openToken) setShowToken(true);
  }, [openToken]);

  const trimmed = value.trim();
  const valid = trimmed === "" ? null : isValidRepo(trimmed);

  return (
    <section className="relative isolate overflow-hidden">
      <LiveBackdrop className="-z-20" />
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

        {/* Headline */}
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
          Paste a GitHub repo and Changeloom weaves its commits, releases and
          contributors into a portal that answers what actually changed — then
          scores it, and hands you the markdown, feeds and badges to ship it.
        </motion.p>

        {/* The reed — command bar */}
        <motion.form
          variants={rise}
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onGenerate(trimmed);
          }}
          className="mt-9 w-full max-w-2xl"
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border bg-card/80 p-1.5 pl-4 backdrop-blur-sm transition-shadow duration-300 focus-within:thread-ring",
              valid === false && "border-destructive/50",
            )}
          >
            <span className="hidden select-none font-mono text-sm text-muted-foreground sm:inline">
              github.com/
            </span>
            <Input
              value={value}
              onChange={(e) => onValueChange(normalizeRepoInput(e.target.value))}
              onPaste={(e) => {
                e.preventDefault();
                onValueChange(normalizeRepoInput(e.clipboardData.getData("text")));
              }}
              placeholder="owner/repo"
              aria-label="GitHub repository"
              aria-invalid={valid === false}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-11 flex-1 border-0 bg-transparent px-0 font-mono text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <button
              type="submit"
              disabled={pending || !valid}
              className={cn(
                "group inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-5 text-[15px] font-medium transition-all disabled:opacity-45",
                "bg-primary text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0/0.25)_inset]",
                "hover:shadow-[0_0_22px_-4px_var(--primary),0_1px_0_0_oklch(1_0_0/0.25)_inset] active:scale-[0.98]",
              )}
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Weaving
                </>
              ) : (
                <>
                  Weave
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          {/* Validation hint / error */}
          {error ? (
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-left">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="mt-2 h-4 text-left text-xs text-destructive">
              {valid === false && "Enter a repository as owner/repo (or paste its GitHub URL)."}
            </div>
          )}

          {/* Examples + private toggle */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                disabled={pending}
                onClick={() => {
                  onValueChange(ex);
                  onGenerate(ex);
                }}
                className="rounded-full border border-border/70 bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--primary)] disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={() => setShowToken((s) => !s)}
              aria-expanded={showToken}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                showToken
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <Lock className="size-3" />
              Private repo?
            </button>
          </div>

          {/* Token card */}
          <AnimatePresence>
            {showToken && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mx-auto mt-4 max-w-md rounded-xl border bg-panel p-4 text-left">
                  <div className="mb-2 flex items-center gap-2">
                    <Lock className="size-4 text-primary" />
                    <span className="text-sm font-medium">Access a private repo</span>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                    Paste a GitHub personal access token. It&apos;s kept in your
                    browser and sent only with your request — never stored. No
                    scopes are needed for public repos; use the{" "}
                    <span className="font-mono text-foreground/80">repo</span> scope
                    for private ones.
                  </p>
                  <Input
                    type="password"
                    value={token}
                    onChange={(e) => onToken(e.target.value)}
                    placeholder="ghp_…"
                    aria-label="GitHub personal access token"
                    autoComplete="off"
                    className="h-9 font-mono text-xs"
                  />
                  <a
                    href="https://github.com/settings/tokens/new?description=Changeloom&scopes=repo"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Create a token <ExternalLink className="size-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* The living, self-playing showcase */}
        <motion.div variants={rise} className="mt-14 w-full max-w-2xl">
          <HeroShowcase />
        </motion.div>

        {/* Feature ticker */}
        <motion.div
          variants={rise}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5"
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

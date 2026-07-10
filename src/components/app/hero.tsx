"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WarpField } from "@/components/loom/warp-field";
import { ReleaseRibbon, type RibbonPoint } from "@/components/loom/release-ribbon";
import { cn } from "@/lib/utils";

const EXAMPLES = ["facebook/react", "vercel/next.js", "honojs/hono", "colinhacks/zod"];

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
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 opacity-70">
        <WarpField />
      </div>
      <div aria-hidden className="weave-field pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 pb-16 pt-16 sm:pt-24 lg:grid-cols-12 lg:gap-8">
        {/* LEFT — the making */}
        <div className="lg:col-span-7">
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1"
          >
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_1px_var(--primary)]" />
            <span className="font-mono text-xs text-muted-foreground">
              paste a repo · get a portal
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            Weave a repo into a changelog.
          </motion.h1>

          {/* drawn cobalt weft under the headline */}
          <motion.svg
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            viewBox="0 0 420 12"
            className="mt-3 h-3 w-64"
            aria-hidden
          >
            <path
              d="M2 6 C 60 6, 60 6, 120 6 S 200 10, 260 6 S 360 2, 418 6"
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="animate-weft"
              style={{ ["--dash" as string]: 900 }}
            />
          </motion.svg>

          <motion.p
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Paste any GitHub repo and Changeloom threads its commits, releases and
            contributors into a portal that answers what actually changed — not
            just a raw list.
          </motion.p>

          {/* Reed / URL field */}
          <motion.form
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            onSubmit={(e) => {
              e.preventDefault();
              onGenerate(url);
            }}
            className="mt-8 max-w-xl"
          >
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-card/70 p-2 backdrop-blur-sm transition-shadow",
                "focus-within:thread-ring",
              )}
            >
              <span className="select-none pl-2.5 font-mono text-sm text-muted-foreground">
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
                className="h-10 flex-1 border-0 bg-transparent px-0 font-mono text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
              <button
                type="submit"
                disabled={pending || !url.trim()}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
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

            <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  className="rounded-full border border-border/70 bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground/80">
                open source · no account · no install
              </span>
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <KeyRound className="size-3" />
                {showToken ? "hide token" : "add token"}
              </button>
            </div>

            {showToken && (
              <div className="animate-rise mt-3 max-w-md">
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
        </div>

        {/* RIGHT — the made thing (live demo ribbon) */}
        <motion.div
          custom={5}
          variants={fade}
          initial="hidden"
          animate="show"
          className="hidden text-foreground lg:col-span-5 lg:block"
        >
          <div className="pane rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                release ribbon
              </span>
              <span className="font-mono text-xs text-muted-foreground/70">
                demo
              </span>
            </div>
            <ReleaseRibbon points={DEMO} height={180} />
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
              each node is a release · post height = commits shipped
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

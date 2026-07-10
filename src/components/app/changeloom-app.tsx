"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { ChangelogResult } from "@/lib/changelog/types";
import { Hero } from "@/components/app/hero";
import { Portal } from "@/components/portal/portal";
import { WeaveLoader } from "@/components/loom/weave-loader";

type Phase = "hero" | "loading" | "portal";

interface ApiError {
  error: string;
  reason: string;
}

export function ChangeloomApp({
  initialRepo,
  initialBase,
  initialHead,
}: {
  initialRepo?: string;
  initialBase?: string;
  initialHead?: string;
} = {}) {
  const [phase, setPhase] = useState<Phase>(initialRepo ? "loading" : "hero");
  const [result, setResult] = useState<ChangelogResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rangePending, setRangePending] = useState(false);
  const [token, setToken] = useState("");
  const [tokenHint, setTokenHint] = useState(false);
  // Lifted so the typed repo survives the hero → loading → hero remount.
  const [input, setInput] = useState(initialRepo ?? "");
  const booted = useRef(false);

  const syncUrl = useCallback((r: ChangelogResult | null) => {
    if (typeof window === "undefined") return;
    if (!r) {
      window.history.replaceState(null, "", "/");
      return;
    }
    // Clean path-style permalink: /owner/repo?base=..&head=..
    const p = new URLSearchParams();
    if (r.base) p.set("base", r.base);
    if (r.head) p.set("head", r.head);
    const q = p.toString();
    window.history.replaceState(null, "", `/${r.repo}${q ? `?${q}` : ""}`);
  }, []);

  const run = useCallback(
    async (
      url: string,
      opts: {
        base?: string;
        head?: string;
        inPortal?: boolean;
        staging?: boolean;
      } = {},
    ) => {
      const value = url.trim();
      if (!value) return;
      if (opts.inPortal) setRangePending(true);
      else {
        setError(null);
        setTokenHint(false);
        setPhase("loading");
      }
      try {
        const res = await fetch("/api/changelog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: value,
            token: token || undefined,
            base: opts.base,
            head: opts.head,
            staging: opts.staging,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const { error: err, reason } = data as ApiError;
          // A 404 with no token most often means a private repo.
          const isPrivateGuess = reason === "not_found" && !token;
          const msg = isPrivateGuess
            ? "We couldn't find that repository. If it's private, add a personal access token and try again."
            : (err ?? "Something went wrong.");
          if (opts.inPortal) toast.error(msg);
          else {
            setError(msg);
            setTokenHint(isPrivateGuess);
            setPhase("hero");
          }
          return;
        }
        const r = data as ChangelogResult;
        setResult(r);
        setPhase("portal");
        syncUrl(r);
      } catch {
        const msg = "Network error — please try again.";
        if (opts.inPortal) toast.error(msg);
        else {
          setError(msg);
          setPhase("hero");
        }
      } finally {
        setRangePending(false);
      }
    },
    [token, syncUrl],
  );

  // Permalinks: /owner/repo path routes pass initialRepo; the legacy
  // ?repo= query form still works on the home page.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (initialRepo) {
      run(initialRepo, { base: initialBase, head: initialHead });
      return;
    }
    const p = new URLSearchParams(window.location.search);
    const repo = p.get("repo");
    if (repo) {
      run(repo, { base: p.get("base") ?? undefined, head: p.get("head") ?? undefined });
    }
  }, [run, initialRepo, initialBase, initialHead]);

  function reset() {
    setResult(null);
    setError(null);
    setInput("");
    setPhase("hero");
    syncUrl(null);
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "portal" && result ? (
        <motion.div key="portal" exit={{ opacity: 0 }}>
          <Portal
            result={result}
            token={token}
            pending={rangePending}
            onCompare={(base, head) =>
              run(result.repo, { base, head, inPortal: true })
            }
            onStaging={() => run(result.repo, { staging: true, inPortal: true })}
            onReset={reset}
          />
        </motion.div>
      ) : phase === "loading" ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex min-h-[70vh] items-center justify-center"
        >
          <WeaveLoader />
        </motion.div>
      ) : (
        <motion.div key="hero" exit={{ opacity: 0 }}>
          <Hero
            value={input}
            onValueChange={setInput}
            onGenerate={(url) => run(url)}
            pending={false}
            token={token}
            onToken={setToken}
            openToken={tokenHint}
            error={error}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

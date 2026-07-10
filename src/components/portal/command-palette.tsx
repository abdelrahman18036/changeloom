"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
}

/**
 * ⌘K command palette. Native-dialog-free but portal-safe (fixed overlay,
 * semantic stacking), keyboard-driven, reduced-motion aware.
 */
export function CommandPalette({
  open,
  onOpenChange,
  commands,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [commands, q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      // Focus after the enter animation begins.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        onOpenChange(false);
        cmd.run();
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  }

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-xl border bg-panel shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-2.5 border-b px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command…"
                aria-label="Command"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <kbd className="rounded border border-border/70 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>
            <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No matching commands.
                </div>
              ) : (
                filtered.map((c, i) => (
                  <button
                    key={c.id}
                    data-idx={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => {
                      onOpenChange(false);
                      c.run();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      i === active ? "bg-primary/15 text-foreground" : "text-foreground/80",
                    )}
                  >
                    <c.icon
                      className={cn(
                        "size-4 shrink-0",
                        i === active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{c.label}</span>
                    {c.hint && (
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {c.hint}
                      </span>
                    )}
                    {i === active && (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

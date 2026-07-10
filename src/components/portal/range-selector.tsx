"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pick any base…head across the repo's tags — this is also the
 * "everything since my version" upgrade aggregator.
 */
export function RangeSelector({
  tags,
  base,
  head,
  pending,
  onCompare,
}: {
  tags: string[];
  base: string | null;
  head: string | null;
  pending: boolean;
  onCompare: (base: string, head: string) => void;
}) {
  const [b, setB] = useState(base ?? tags[1] ?? "");
  const [h, setH] = useState(head ?? tags[0] ?? "");

  useEffect(() => {
    setB(base ?? tags[1] ?? "");
    setH(head ?? tags[0] ?? "");
  }, [base, head, tags]);

  if (tags.length < 2) return null;
  const dirty = b !== base || h !== head;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TagSelect value={b} onChange={setB} tags={tags} label="Base (older)" />
      <GitCompareArrows className="size-4 shrink-0 text-muted-foreground" />
      <TagSelect value={h} onChange={setH} tags={tags} label="Head (newer)" />
      <button
        onClick={() => onCompare(b, h)}
        disabled={pending || !dirty || b === h}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Compare
      </button>
    </div>
  );
}

function TagSelect({
  value,
  onChange,
  tags,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  tags: string[];
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 max-w-[9rem] rounded-lg border bg-panel px-2.5 font-mono text-xs text-foreground/90",
        "outline-none focus-visible:border-primary/50",
      )}
    >
      {tags.map((t) => (
        <option key={t} value={t} className="bg-panel">
          {t}
        </option>
      ))}
    </select>
  );
}

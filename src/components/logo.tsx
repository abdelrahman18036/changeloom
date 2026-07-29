import { cn } from "@/lib/utils";

/**
 * Changeloom mark — three changelog entries with a cobalt thread woven
 * through them. It says both halves of the product at once: the bars are a
 * changelog, the thread is the loom.
 *
 * The interlace is real, done with draw order: bars 1 and 3 go down first so
 * the thread crosses OVER them, then bar 2 is drawn last so the thread passes
 * UNDER it. Bold 3.5px bars survive a 16px favicon; the old hairline warp did
 * not (and read as a "#").
 */
export function LoomMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden
    >
      {/* entries the thread binds over */}
      <g fill="currentColor" opacity="0.92">
        <rect x="6" y="8.5" width="20" height="3.5" rx="1.75" />
        <rect x="6" y="20" width="17" height="3.5" rx="1.75" />
      </g>

      {/* the weft — one taut cobalt thread drawn through the stack */}
      <path
        d="M9.5 25.5 L 22.5 6.5"
        stroke="var(--primary)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* the entry the thread passes under — drawn last, so it covers */}
      <rect
        x="6"
        y="14.25"
        width="14"
        height="3.5"
        rx="1.75"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

/** GitHub glyph — lucide dropped brand icons, so we ship our own. */
export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-4", className)}
      aria-hidden
    >
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.556 0-.274-.01-1-.015-1.965-3.196.695-3.87-1.54-3.87-1.54-.523-1.33-1.276-1.684-1.276-1.684-1.043-.713.08-.699.08-.699 1.153.081 1.76 1.184 1.76 1.184 1.026 1.758 2.692 1.25 3.35.955.103-.743.402-1.25.73-1.538-2.552-.29-5.236-1.276-5.236-5.68 0-1.255.448-2.28 1.183-3.084-.119-.29-.513-1.46.112-3.043 0 0 .966-.31 3.165 1.178a11 11 0 0 1 2.88-.388c.977.004 1.962.132 2.882.388 2.197-1.488 3.162-1.178 3.162-1.178.626 1.583.232 2.753.114 3.043.737.804 1.18 1.83 1.18 3.084 0 4.415-2.688 5.386-5.25 5.67.413.356.78 1.057.78 2.13 0 1.538-.014 2.778-.014 3.157 0 .308.207.668.79.555A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("group/mark inline-flex items-center gap-2.5", className)}>
      <LoomMark className="size-7 text-foreground transition-transform duration-300 group-hover/mark:rotate-[8deg]" />
      <span className="text-[15px] font-semibold tracking-tight">
        Change
        <span className="font-display italic text-primary">loom</span>
      </span>
    </span>
  );
}

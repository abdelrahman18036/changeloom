import { cn } from "@/lib/utils";

/**
 * Changeloom mark — a woven tile with TRUE over-under interlacing.
 *
 * Two cobalt weft threads cross three warp threads. Draw order does the
 * weaving: wefts first, warps on top (warp-over everywhere), then short weft
 * segments re-drawn on top at the crossings where the weft binds over.
 */
export function LoomMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="weft" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--thread-signal, var(--primary))" />
        </linearGradient>
      </defs>

      {/* tile */}
      <rect x="1" y="1" width="30" height="30" rx="8.5" fill="var(--card)" stroke="var(--border)" />

      {/* wefts (under layer) */}
      <path
        d="M5.5 13 C 8 13, 8 11.5, 10.5 11.5 S 13.5 14.5, 16 14.5 S 19 11.5, 21.5 11.5 S 24 13, 26.5 13"
        stroke="url(#weft)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M5.5 19 C 8 19, 8 20.5, 10.5 20.5 S 13.5 17.5, 16 17.5 S 19 20.5, 21.5 20.5 S 24 19, 26.5 19"
        stroke="url(#weft)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.62"
      />

      {/* warps (drawn over both wefts) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <line x1="10.5" y1="6" x2="10.5" y2="26" />
        <line x1="16" y1="6" x2="16" y2="26" />
        <line x1="21.5" y1="6" x2="21.5" y2="26" />
      </g>

      {/* weft-over segments: weft A binds over warp 1 & 3, weft B over warp 2 */}
      <path
        d="M8.6 11.7 C 9.4 11.5, 9.7 11.5, 10.5 11.5 C 11.3 11.5, 11.8 11.7, 12.4 12.1"
        stroke="url(#weft)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M19.6 12.1 C 20.2 11.7, 20.7 11.5, 21.5 11.5 C 22.3 11.5, 22.6 11.6, 23.4 11.8"
        stroke="url(#weft)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14.1 17.9 C 14.7 17.6, 15.2 17.5, 16 17.5 C 16.8 17.5, 17.3 17.6, 17.9 17.9"
        stroke="url(#weft)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.62"
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

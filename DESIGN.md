# Changeloom design system — "The Loom"

Changeloom is dark-only and built on a single generative metaphor: **a loom**.
The repository's structure is the **warp** (vertical threads); Changeloom
running the shuttle is the **cobalt weft**; every finished changelog row is a
bound pick of cloth. The metaphor is load-bearing — it encodes real data, it is
never wallpaper.

## Identity

- **Surface** — a deep near-black blue "fabric" (`oklch(0.15 0.014 262)`). The
  console surface ramp stacks with hairline borders, not shadows:
  `stage → panel → card → raised`.
- **The thread** — one luminous cobalt (`oklch(0.685 0.166 252)`) is the only
  saturated color at rest. It is the primary, the focus ring, and the weft in
  every SVG.
- **Category colors** — a single-saturation family (`--cat-*`) used *only* to
  encode data on selvedge ticks and distribution bars, never as decoration.

All colors are OKLCH. Tokens live in [`src/app/globals.css`](src/app/globals.css).

## Typography

Two cuts of one family on a real contrast axis:

- **Geist Sans** — display and UI.
- **Geist Mono** — the "machine" voice for every datum the tool reads or emits:
  repo paths, version ranges, SHAs, counts, timestamps, PR numbers, keyboard
  hints. `tabular-nums` everywhere so digit columns never jitter.

## Thread primitives

Three load-bearing SVG marks recur at every scale
([`src/components/loom/`](src/components/loom)):

1. **Warp field** — the hero back-plane: evenly spaced vertical hairlines with a
   deterministic sinusoidal bow (pure path math, never `feTurbulence`).
2. **Weft / release ribbon** — a cobalt polyline threading diamond version
   nodes; post height encodes commit count. Reused for the hero demo and the
   portal timeline.
3. **Selvedge tick** — the bound-edge mark on every changelog row, in the
   entry's category color. It replaces the icon-card reflex.

Derived weaves reuse the same grammar: the **cadence ribbon** (weave density =
release frequency), the **contributor warp** (thread weight = commit share),
and the **churn bars** (a designed `git --stat`).

## Motion

Motion is intentional and always has a `prefers-reduced-motion` fallback:

- Warp **breathing** (slow sine sway) on the hero only.
- The weft **draws on** via `stroke-dashoffset`; selvedge ticks draw as rows
  reveal (content is already in the DOM — the draw only enhances it).
- An honest **indeterminate weave loader** while data is fetched.
- Stat **count-ups** ≤600ms with `tabular-nums`.

No infinite shimmers, no decorative motion that doesn't convey state.

## Guardrails (what we refuse)

- No gradient text; emphasis is weight/size/color.
- No hand-drawn / sketchy / turbulence SVG.
- No ghost cards (a 1px border **and** a wide soft shadow together). Panes use a
  hairline border **or** a small shadow — the surface ramp does elevation.
- Card radius ≤ ~16px.
- Body contrast ≥ 4.5:1; the muted foreground is tuned against the panel.
- No tiny uppercase tracked eyebrow on every section; no numbered scaffolding.

This document is the contract — new UI should read as part of the same woven
system.

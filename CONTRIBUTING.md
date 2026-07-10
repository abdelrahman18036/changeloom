# Contributing to Changeloom

Thanks for your interest in improving Changeloom! This project is small,
dependency-light, and friendly to first-time contributors.

## Getting started

```bash
git clone https://github.com/abdelrahman18036/changeloom
cd changeloom
npm install
npm run dev        # http://localhost:3000
```

No environment variables are required to run against public repositories.

## Before you open a PR

```bash
npm run lint       # ESLint (next/core-web-vitals + TS)
npm run build      # must pass — CI runs this on every PR
```

Please test your change in the browser and confirm the dark theme still looks
right at mobile and desktop widths.

## Commit conventions

Changeloom generates changelogs from Conventional Commits, so — fittingly — we
use them here too:

- `feat:` a new feature
- `fix:` a bug fix
- `perf:` a performance improvement
- `docs:` documentation only
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` adding or fixing tests
- `chore:` / `build:` / `ci:` tooling and maintenance

Add a `!` (e.g. `feat!:`) or a `BREAKING CHANGE:` footer for breaking changes.

## Project structure

```
src/
  app/
    api/            Route handlers (GitHub data → JSON)
    page.tsx        Landing hero
    portal/         The generated portal (tabs)
    globals.css     OKLCH dark theme + design tokens
  components/
    portal/         Feature modules (changelog, releases, contributors, insights, export)
    ui/             shadcn/ui primitives
  lib/
    changelog/      Categorizer, GitHub client, renderers, insights
```

## Design principles

- **Dark-only, cobalt-thread identity.** Keep the "weave" motif consistent.
- **Few GitHub calls.** The hosted demo runs unauthenticated (60 req/hr). Any
  new feature should be derivable from data we already fetch when possible.
- **No AI required for the baseline.** AI features must be opt-in and degrade
  gracefully when disabled.
- **Accessibility is not optional.** 4.5:1 contrast, focus states, and a
  `prefers-reduced-motion` fallback for every animation.

## Adding a changelog category

Categories live in `src/lib/changelog/categories.ts`. Add an entry (with an
emoji, label, and color token) and map any commit prefixes or PR labels to it
in `src/lib/changelog/categorize.ts`. Add the matching color token to
`src/app/globals.css`.

## Questions

Open a [Discussion](https://github.com/abdelrahman18036/changeloom/discussions) — no
question is too small.

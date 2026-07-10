<div align="center">

# Changeloom

**Weave a repo into a changelog.**

Paste any GitHub repo URL and get a dark, animated **portal** that answers what
actually changed — categorized changelog, release cadence, contributor
leaderboards, code hotspots, and one-click export. No install, no config, no
account.

*The open-source, no-signup alternative to paid changelog SaaS.*

</div>

---

## Why it exists

GitHub's native "Generate release notes" gives you a flat list of PR titles.
CLIs like `git-cliff` are powerful but need a terminal and a config file. The
hosted tools that do this well are closed-source and paywalled.

Changeloom is the missing corner: **open-source + self-hostable + website-first
+ zero-config**, and it goes past the raw changelog to surface things GitHub
can't show you in one place.

## Features

Paste a repo — or just open `changeloom.dev/owner/repo` — and land in a
portal with five views:

- **Changelog** — entries categorized (breaking / feature / fix / perf / docs /
  refactor / test / chore) with a **Ship vs Plumbing** split ("affects you" vs
  "under the hood"), a deterministic **TL;DR** strip, breaking-change callout,
  live search, category filters, and pagination.
- **Compare any two tags** — pick any base…head from the range selector; it
  doubles as the "everything since my version" upgrade digest.
- **Insights** — **release cadence** (median/avg gap, drought, a woven rhythm
  ribbon), **release anatomy** (category mix), a **suggested next version**
  (semver-inferred), and **code hotspots** (most-changed files, +/− churn).
- **People** — a **range-scoped contributor leaderboard** (who actually built
  *this* release — impossible to get natively), drawn as weighted warp threads,
  with a bus-factor read.
- **Export** — live switch between **Conventional Markdown**, **Keep a
  Changelog**, plain text, and JSON; copy, download, a shareable permalink, and
  a callable API for CI.
- **Loom Score** — a 0–100 grade of the range's changelog hygiene
  (conventional-commit adoption, PR linkage, scoped changes, documented
  breaking changes), rendered as an animated gauge.
- **Live README badge** — embed the score anywhere; it links readers straight
  to the portal:

  ```md
  [![changelog](https://changeloom.dev/api/badge/owner/repo)](https://changeloom.dev/owner/repo)
  ```

Everything runs on the **rule-based engine** — no AI required. The baseline is
fully deterministic and offline-safe, and a keyword heuristic layer
categorizes non-conventional commits ("fix crash on start", "add dark mode")
so real-world history doesn't collapse into "Other".

## Tech stack

- **Next.js 16** — App Router, TypeScript, Turbopack, React Compiler
- **Tailwind CSS v4** + **shadcn/ui** (Base UI + Lucide) — a dark-only,
  OKLCH "loom" design system (see [DESIGN.md](DESIGN.md))
- **motion** for animation, hand-authored SVG for every chart (no chart lib)
- **GitHub REST API** via `fetch` — no SDK, rate-limit aware

The core generate is a **fast 3-call path** (repo + tags in parallel, then one
`/compare`); release insights lazy-load only when the Insights tab opens.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

No env vars are needed for public repos. To raise the hosted rate limit above
GitHub's 60 req/hr, set a server token (see [`.env.example`](.env.example)):

```bash
GITHUB_TOKEN=ghp_xxx
```

## API

The portal is backed by three endpoints:

| Endpoint | Purpose |
|---|---|
| `POST /api/changelog` | Full portal payload for a repo (+ optional `base`/`head`/`token`) |
| `GET /api/changelog?repo=o/r&format=md\|keepachangelog\|plain\|json` | Callable export for CI pipelines |
| `GET /api/insights?repo=o/r` | Release cadence / velocity (lazy) |
| `GET /api/badge/owner/repo` | Embeddable SVG badge with the repo's Loom Score |

```bash
curl "https://changeloom.dev/api/changelog?repo=honojs/hono&format=md"
```

## Rate limits

Unauthenticated GitHub requests are capped at 60/hr. Add a personal access
token in the UI (kept in your browser, sent only with your request) for
5,000/hr and private repos. Ranges over GitHub's compare cap (250 commits) are
flagged and derived counts are labeled as a floor.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project dogfoods Conventional
Commits — its own history is a Changeloom demo.

## License

[MIT](LICENSE).

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

Paste a repo — or just open `changeloom.vercel.app/owner/repo` — and land in a
portal with five views:

- **Changelog** — entries categorized (breaking / feature / fix / perf / docs /
  refactor / test / chore) with a **Ship vs Plumbing** split, a deterministic
  **TL;DR** strip, breaking-change callout, live search, category + **author**
  filters, a **group-by pivot** (by area / by author), per-entry copy, a
  **dependency de-noiser**, and pagination.
- **Compare any two tags** — pick any base…head from the range selector; it
  doubles as the "everything since my version" upgrade digest.
- **Insights** — the **Loom Score** gauge, **release cadence** + **velocity**,
  **release anatomy** + a **"shape of the release"** radial fingerprint, a
  **ship punch-card** (when the team commits), a **building-vs-firefighting**
  balance, a **suggested next version**, and **code hotspots** (+/− churn).
- **People** — a **range-scoped contributor leaderboard** (who actually built
  *this* release — impossible to get natively) as weighted warp threads, a
  **contribution-mix** bar per person (what they built), **area ownership**
  (who owns each scope), and a bus-factor read.
- **Export** — live switch between **Conventional Markdown**, **Keep a
  Changelog**, plain text, and JSON; copy, download, a shareable permalink, and
  a callable API for CI.
- **Loom Score** — a 0–100 grade of the range's changelog hygiene
  (conventional-commit adoption, PR linkage, scoped changes, documented
  breaking changes), rendered as an animated gauge.
- **Live README badge** — embed the score anywhere; it links readers straight
  to the portal:

  ```md
  [![changelog](https://changeloom.vercel.app/api/badge/owner/repo)](https://changeloom.vercel.app/owner/repo)
  ```

- **Staging Dock** — one click to preview *everything unreleased* on the default
  branch since the latest tag (GitHub's biggest blind spot), fully categorized.
- **Security spotlight** — CVE / vuln / advisory keywords are detected and
  surfaced in a "patch soon" callout; dependency bumps are counted and rolled up.
- **Release codename** — a deterministic, fun name for every range.
- **Atom feed** (`/api/feed/owner/repo`) and **llms.txt** (`/api/llms/owner/repo`)
  — a subscribe-anywhere feed and a token-efficient, machine-readable changelog
  for AI coding agents.
- **Social OG cards** — every permalink unfurls into a branded image
  (`/api/og/owner/repo`).
- **One-click GitHub Release drafter** and **pre-composed share intents**
  (X / Bluesky / LinkedIn / Reddit / HN / Slack).

Everything runs on the **rule-based engine** — no AI required. The baseline is
fully deterministic and offline-safe, and a keyword heuristic layer
categorizes non-conventional commits ("fix crash on start", "add dark mode")
so real-world history doesn't collapse into "Other".

See **[ROADMAP.md](ROADMAP.md)** for the full 194-idea feature catalog (from a
19-agent brainstorm) — top-leverage builds, quick wins, and moonshots.

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
GITHUB_TOKEN=ghp_xxx   # ⚠️ create with NO scopes — see below
```

### ⚠️ Server-token security

`GITHUB_TOKEN` is applied to **every** request that doesn't carry a
user-supplied token, so it authorizes **all visitors** of your deployment.

- **Create it with no scopes** (public read only). It exists purely to lift the
  anonymous rate limit.
- **Never** use a token with the `repo` scope here — that would let anyone read
  **your** private repos through your deployment, and private repos would keep
  resolving even after a visitor removes their own token.
- To read **private** repos, users paste their **own** token in the UI. It's
  validated (`/api/token/check`), saved in their browser (localStorage), sent
  only with their requests, and never persisted server-side.

## API

The portal is backed by a small set of endpoints:

| Endpoint | Purpose |
|---|---|
| `POST /api/changelog` | Full portal payload for a repo (+ optional `base`/`head`/`token`) |
| `GET /api/changelog?repo=o/r&format=md\|keepachangelog\|plain\|json` | Callable export for CI pipelines |
| `GET /api/insights?repo=o/r` | Release cadence / velocity (lazy) |
| `GET /api/badge/owner/repo` | Embeddable SVG badge with the repo's Loom Score |
| `GET /api/feed/owner/repo` | Atom feed of the repo's releases |
| `GET /api/llms/owner/repo` | Machine-readable changelog (llms.txt) for AI agents |
| `GET /api/og/owner/repo` | Dynamic 1200×630 social share card |

```bash
curl "https://changeloom.vercel.app/api/changelog?repo=honojs/hono&format=md"
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

---

Created by [abdorange](https://www.abdorange.me/) · live at
[changeloom.vercel.app](https://changeloom.vercel.app)

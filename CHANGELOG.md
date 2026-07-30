# Changelog

All notable changes to Changeloom are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

<!-- This file was drafted with Changeloom itself. -->

## [1.0.0] — 2026-07-30

First stable release. Paste a GitHub repo URL and get a portal that answers
what actually changed — categorized, scored and exportable — with no account,
no install and no AI key.

### Added

**The changelog**

- Rule-based categorization into breaking / feature / fix / perf / docs /
  refactor / test / chore, from Conventional Commits **and** a keyword
  heuristic layer so repos with no convention don't collapse into "Other".
- An authored `## Changelog` section in a commit body wins over the derived
  subject, rewarding maintainers who already write good PR descriptions.
- **Ship vs Plumbing** split — "affects you" versus "under the hood".
- Deterministic **TL;DR** strip, breaking-change callout and release codename.
- Live search, category / author filters, a group-by pivot (area or author),
  a dependency de-noiser, per-entry copy and client-side pagination.
- Filter state is encoded in the URL, so any filtered view is shareable.

**Upgrade intelligence**

- **Should I upgrade?** — a risk score derived from breaking markers, the
  semver delta, removed files and dependency/lockfile changes.
- **Security spotlight** — CVE / advisory / vulnerability detection surfaced
  in its own "patch soon" callout.
- **Staging Dock** — one click to preview everything unreleased on the default
  branch since the latest tag.
- Compare **any two tags**, which doubles as an "everything since my version"
  upgrade digest, plus a prev/next release scrubber.

**Insights**

- **Loom Score** — a 0–100 grade of a range's changelog hygiene (conventional
  commit adoption, PR linkage, scoped changes, documented breaking changes).
- Release cadence and velocity, a project pulse, release anatomy, a "shape of
  the release" fingerprint, a ship punch-card, a building-vs-firefighting
  balance, code hotspots and a suggested next version.

**People**

- A **range-scoped contributor leaderboard** — who actually built *this*
  release, which GitHub does not show anywhere.
- Contribution mix per person, area ownership by scope, co-author credit from
  `Co-authored-by:` trailers, first-time contributor badges and a bus-factor
  read.

**Export and distribution**

- Conventional Markdown, Keep a Changelog, plain text and JSON.
- One-click GitHub Release drafter, platform-flavored announcements
  (Slack / Discord / Markdown) and pre-composed share intents.
- Embeddable **Loom Score badge**, an **Atom feed**, **llms.txt** for AI
  agents, dynamic **OG social cards** and a callable export API for CI.

**Platform**

- Path permalinks (`changeloom.vercel.app/owner/repo`).
- Private repositories via your own token — validated, stored only in your
  browser, never persisted server-side.
- A ⌘K command palette and keyboard-first navigation.
- A dark-only OKLCH "loom" design system with hand-authored SVG data
  visualisation and motion, all with reduced-motion fallbacks.

### Security

- The server-side `GITHUB_TOKEN` is documented as **no-scope only**; a
  `repo`-scoped token there would expose private repositories to every
  visitor. See [SECURITY.md](SECURITY.md).
- Public-sharing surfaces (badge, feed, llms.txt, OG card, permalink, CI API)
  are hidden for private repositories, since they are fetched without a
  viewer's token.

### Fixed

- Heuristic prefix stems (`optimiz`, `reorganiz`, `vulnerab`, `advisor`,
  `sanitiz`) matched only their bare stem, so "Optimize bundle size" fell
  through to "Other" and "fix a vulnerability" was never flagged as a security
  fix.
- `BREAKING CHANGE` was matched case-insensitively anywhere in a message, so
  commits that merely *described* breaking changes were classified as breaking
  and inflated the upgrade-risk score. It now follows the Conventional Commits
  footer rule.
- GitHub's `/tags` endpoint returns tags in an unreliable order; ranges are now
  resolved by semver sort rather than list position.
- The Release drafter no longer exceeds GitHub's URL length limit on long
  changelogs.
- OG cards are cached, so social crawlers no longer regenerate a full changelog
  on every hit.

### Known limitations

- GitHub only — GitLab/Bitbucket adapters are planned.
- GitHub's compare API caps a range at 250 commits; Changeloom flags a range as
  truncated rather than silently undercounting.
- Monorepo per-package changelogs and the optional AI layer are not built yet.

[1.0.0]: https://github.com/abdelrahman18036/changeloom/releases/tag/v1.0.0

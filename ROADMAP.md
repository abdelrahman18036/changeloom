# Changeloom Roadmap

> Distilled from a 19-agent feature brainstorm — **194 ideas** across 14 categories.
> Legend: ✅ shipped · ✦ differentiator · 🚀 moonshot · effort in \`backticks\` (S/M/L/XL).

## Strategy

Changeloom already wins the 'read any repo's history beautifully, with zero signup' job. The strategic opening is to run in three directions at once that every competitor is structurally blocked from: (1) FREE WHAT THEY PAYWALL — AI prose, custom domains, feeds, widgets, email/chat distribution, multi-language, analytics — because paid SaaS gates exactly these and OSS generators require config and repo write-access; (2) OWN THE UNCLAIMED READER/UPGRADER NICHE — 'what changed in a dependency I consume, and will it break me' — via dependency diffs, safe-to-upgrade verdicts, migration guides, CVE digests and cross-repo ripple, a market no changelog tool serves because they're all locked to first-party data; and (3) BECOME THE MACHINE-READABLE CHANGELOG LAYER for AI coding agents through an MCP server and clean JSON/llms.txt, planting Changeloom inside every upgrade workflow before anyone else. The durable moat is a compounding flywheel: viral OG cards, feeds, badges and the public Loom Index drive organic reach; the Loom Gate CI check and GitHub App turn one-off visits into sticky org infrastructure; and a generous no-signup free tier funds itself by monetizing only the three things that cost real money or trust — private-repo access, hosted persistence/distribution, and org/enterprise governance — never betraying the open-source wedge that makes the whole thing spread.

## 🎯 Top-leverage next builds

- The Staging Dock (unreleased-changes preview) — GitHub's single biggest blind spot; turns Changeloom from a rear-view tool into the pre-release cockpit maintainers return to every cycle, all off primitives that already exist.
- RSS / Atom / JSON feeds per repo — S-effort, no-DB serialization that is the zero-signup subscription backbone every other distribution channel (widget, chat, email, agents) rides on.
- Dynamic per-page OG / release cards — near-free viral loop: every link pasted into X/Slack/Discord unfurls into a branded card that markets the product on every share.
- AI Prose Mode + audience registers — the #1 feature every paid rival paywalls; table-stakes to be taken seriously as an AI alternative, and it saves maintainers hours per release with BYO-key zero server cost.
- Dependency & lockfile diff + 'Safe to upgrade?' verdict — owns the entirely-unclaimed changelog-READER niche no SaaS can touch (they're locked to first-party data); answers the upgrader's actual question.
- Auto migration / upgrade guide generator — the most-requested, least-written OSS artifact; a genuine moat that converts the scariest part of an upgrade into a follow-along and pairs with breaking-change detection.
- Embeddable 'What's New' widget with unread badge — the core paid-SaaS distribution channel given away free; every embed is a live billboard and backlink on a customer's own domain.
- Security-fix spotlight + 'does this upgrade patch a CVE?' — what upgraders most need and everyone buries; rule-based against the free GitHub Advisory DB, so it fits the no-signup ethos.
- Monorepo per-package changelogs — impossible on GitHub/GitLab natively and where most large modern OSS lives; a deep power-user moat raw git-cliff/GitHub notes can't match.
- MCP server + machine-readable JSON/llms.txt API — AI coding agents are the fastest-growing distribution channel and no competitor exposes clean change data; first-mover, defensible.
- One-click Release drafter + publish-back to GitHub — a no-auth deep-link that drops maintainers one click from Publish, converting a viewer into part of the release ritual.
- Universal Git-provider adapter spine (GitLab / Gitea / Codeberg) — one pure refactor unlocks the entire non-GitHub market; because everything normalizes to RawCommit, categorizer, score, insights and viz light up for free per adapter.

## ⚡ Quick wins

- RSS / Atom / JSON Feed per repo and per range — pure serialization of data already fetched, edge-cacheable, no DB.
- One-click GitHub Release drafter — URL-prefill deep link to releases/new extending the existing markdown export; zero auth.
- Dynamic per-page OG / social share cards — Satori/@vercel/og over already-cached data; turns every permalink into a branded unfurl.
- Read/unread 'new since your last visit' — localStorage badge and counter, no backend.
- One-click social share intents — pre-composed X/Bluesky/Mastodon/LinkedIn/HN/Reddit posts and a 'Copy for Slack' snippet.
- Release codename generator — deterministic rule-based mapping of dominant category to a curated wordlist.
- Bug-fix & regression quality trend — reuses the existing categorizer over data already fetched; no new calls.
- 'Shape of a Release' fingerprint — a radial signature derived entirely from existing per-release stats.
- Cadence calendar + ship punch-card + velocity burnup — all from commit/release timestamps already available.
- Locale-aware dates, numbers & relative time — swap in Intl APIs; small change, outsized clarity.
- Reader-preference persistence + accessible permalinks — localStorage + query params for theme/font/motion/language.
- Zero-config automation export (cliff.toml / workflow YAML) — emit a reproducible config from the settings the user already chose.
- Uncertainty flagging on categorization — surface confidence on the existing pass so maintainers fix only the ambiguous few.
- Machine-readable JSON + llms.txt endpoint — expose the structured model already computed for AI agents.
- Expanded badge suite + attribution loop — latest-release/freshness/cadence badges and 'Made with Changeloom' credit on existing /api/badge infra.

## 🌌 Moonshots

- Loom Gate CI check + GitHub App auto-draft-on-tag — the sticky, org-adoption hook: enforce changelog hygiene as a required status check and auto-open the CHANGELOG.md PR the moment a tag lands, turning a one-off visit into always-on infrastructure that spreads virally across a company's repos.
- Public Changelog Quality Index (Loom Index) — a crawled, SEO-indexed directory ranking thousands of repos by changelog hygiene, creating a network-effect moat, an enormous organic-search surface (every popular repo becomes a landing page), and the industry benchmark people cite.
- Ask-the-Repo-History natural-language Q&A (RAG with SHA citations) — turn years of commits/PRs/releases into a queryable knowledge base ('when did dark mode ship? which release broke the config?'), the interface people don't yet know they want and can't get from GitHub — deeply sticky and demo-able.
- Cross-repo dependency ripple ('watch my whole stack') — paste a lockfile and map which of YOUR dependencies just shipped breaking changes with a personalized blast radius; flips Changeloom from 'look at one repo' to fleet-wide upgrade intelligence, the killer B2B/team use case.
- Changelog Time-Machine + Semver-Violation Radar — reconstruct a repo's public API surface at any past tag and diff exported symbols to catch releases that secretly shipped breaking changes under a patch/minor bump — a trust/forensics layer no changelog tool offers that feeds every upgrade-risk feature.
- Docker / OCI image-tag changelog mode — resolve container tags to source commits via OCI labels and generate 'what changed between image tag X and Y' with base-image/layer/env deltas; a category-defining entry point that bridges the git changelog to the actually-shipped artifact.
- Hosted white-label Changelog-as-a-Service + custom domain — an auto-updating, zero-writing branded release-notes site on the customer's own domain, directly replacing Headway/Beamer/LaunchNotes; the flagship recurring-revenue product and cleanest 'free OSS alternative' wedge.

## Full catalog

### 1. Core Engine & Categorization

- ✅ **Categorized changelog with Ship-vs-Plumbing split**  `M` — Breaking/feature/fix/perf/docs/refactor/test/chore/other buckets, TL;DR strip, breaking-change callout, live search, filters, pagination, keyboard nav.
- ✅ **Keyword-heuristic categorizer + PR-body '## Changelog' extraction**  `M` — Rescues non-conventional commits from an 'Other' flood and harvests curated changelog sections from PR bodies.
- ✅ **AI categorizer upgrade to rescue the 'Other' flood** ✦ `M` — Opt-in LLM pass that classifies ambiguous/non-conventional commits and infers scope where keyword heuristics fail.
- **PR-label / issue-type / gitmoji categorization** ✦ `M` — Use GitHub PR labels, linked issue types and gitmoji as richer categorization signals, falling back to keywords only when absent — survives squash-merges.
- **Group-by-Component / scope pivot** ✦ `M` — Pivot the changelog by conventional-commit scope or top-level directory ('Billing', 'CLI') instead of by commit type.
- **Persistent categorization overrides + custom taxonomy** ✦ `M` — Reclassify any commit, define your own categories/labels, and have Changeloom remember the mapping by commit/author/pattern on future runs.
- **Diff-to-English commit enrichment** ✦ `M` — For cryptic one-word commits, peek at the diff (files/functions touched, migrations added) to synthesize a clearer summary and shrink 'Other' further.
- **Uncertainty flagging on categorization** ✦ `S` — Mark low-confidence auto-categorized or AI-summarized entries with a 'review me' badge so maintainers fix only the ambiguous few.
- **Non-semver tag-scheme engine (CalVer, date, sequential, prefixed)** ✦ `M` — Replace semver-only parsing with a scheme detector that sorts CalVer/date/sequential/monorepo-prefixed tags correctly and adapts next-version logic.
- **Zero-config changelog fragments (towncrier/changesets-style)** ✦ `M` — Read small 'news fragment' files or an unreleased/ folder and stitch them at release time — merge-conflict-free authoring without adopting a whole toolchain.
- **Render & understand an existing CHANGELOG.md** ✦ `M` — Parse a repo's hand-written CHANGELOG/HISTORY/NEWS (Keep-a-Changelog, conventional, freeform) into the structured model, then apply search, insights, Loom Score, and re-export.
- **Convention config generator** ✦ `M` — Infer the conventional-commit prefix each raw commit should have carried and emit a ready-to-commit commitlint + release-please/changesets + label-map bundle tuned to the repo's patterns.
- **Zero-config automation export (cliff.toml / workflow YAML)** ✦ `S` — After the user likes the output, emit a ready-to-commit git-cliff cliff.toml, release-please config, or GitHub Actions workflow that reproduces it in CI.
- **.changeloomrc / .changeloom.yml config-as-code with shareable presets** ✦ `M` — Repo-root config declaring categories, keyword/regex rules, section order, ignore filters, contributor aliases, audience defaults — with ESLint-style extends presets, read identically by CLI/web/Action.

### 2. Maintainer Release Cockpit

- **The Staging Dock (unreleased-changes preview)** ✦ `M` — Auto-diff latest tag against default-branch HEAD to show the fully categorized changelog of everything not yet released, with a staleness meter ('27 commits, 4 breaking, 13 days unreleased').
- **One-click GitHub Release drafter** ✦ `S` — Generate a release-optimized notes body and deep-link to releases/new prefilled with tag, title and body so the maintainer lands one click from Publish.
- **Format-aware CHANGELOG.md PR drafter** 🚀 `L` — Detect the repo's changelog convention, splice the new version section in the right place, and emit a git-apply patch or (via GitHub App) open the PR directly.
- **Loom Gate — changelog quality CI check** 🚀 `L` — Publishable GitHub Action/check that fails a PR introducing user-facing change without a changelog line, an unflagged breaking change, or a Loom Score drop below threshold, with inline annotations.
- **Silent-change detector** ✦ `M` — Flag commits/PRs touching user-facing surfaces (public API files, exported symbols, CLI entrypoints, config schemas, migrations) that carry bare/chore messages — changes shipped without a changelog line.
- **Omission detector / release-note linter** ✦ `M` — Diff every merged PR + commit in a range against what the notes mention and flag gaps: missing PRs, unflagged breaking changes, no upgrade instructions, unreleased work — feeding the Loom Score.
- **GitHub auto-notes reconciler** ✦ `M` — Show the complete change set — direct-to-main commits, cherry-picks, and PRs — and diff it against what GitHub's own auto-notes would show, exposing silent drops and wrong base-tag choices.
- **Monorepo per-package changelogs** 🚀 `L` — Detect workspaces (pnpm/npm/Nx/Turbo/Lerna/Cargo/Go), attribute commits to packages by path, parse per-package tag prefixes, and produce a separate changelog + version suggestion per package.
- **Full-history CHANGELOG backfill** 🚀 `L` — Iterate every adjacent tag pair and stitch a complete historical CHANGELOG.md in one action — a 4-year-old repo gets its whole back-catalog generated at once.
- ✅ **Interactive semver planner** ✦ `M` — Live planner showing which commits force major vs minor, letting maintainers reclassify borderline ones ('internal-only') and recomputing the suggested version instantly.
- **Predictive next-release date** ✦ `M` — Forecast WHEN the next release ships and at what version ('next minor ≈ Aug 14, 78% confidence') from cadence, unreleased-commit velocity, and open-PR/milestone burndown.
- **Release readiness checklist** ✦ `M` — Auto-populated pre-flight scorecard: version bumped? breaking changes have migration notes? milestone blockers cleared? PRs labeled? — as a checkable list with a readiness percentage.
- **New-contributor shoutouts / first-timer spotlight** ✦ `M` — Detect first-ever contributions in the range (diff range authors against full history) and emit a '🎉 New Contributors' block linking each first merged PR.
- **Migration / upgrade guide compiler** ✦ `M` — Harvest every BREAKING CHANGE footer plus '## Migration'/'## Upgrade' sections from range PR bodies and stitch them into one ordered upgrade guide, exportable alongside the changelog.
- **Persistent Unreleased + deprecation tracker** ✦ `M` — Always show commits since the last tag as 'Unreleased', and maintain a running list of every deprecation/removal spotted across versions (Keep-a-Changelog compliance, automated).
- **Ready-to-merge Release PR bundle** ✦ `M` — Emit the exact artifacts release-please produces: computed version bump, the CHANGELOG.md diff to append, and a GitHub Release body — as one copy-paste/download bundle.
- **Publish-back to GitHub (Release body + CHANGELOG.md PR)** ✦ `M` — One click writes the curated changelog into the GitHub Release body or opens a PR updating CHANGELOG.md.
- **Release codename generator** ✦ `S` — Propose a shippable codename from the release's dominant theme (mostly-perf → 'The Velocity Release') via a rule-based wordlist, with optional AI flair.
- **Cadence forecast & backlog-pressure alerts** 🚀 `L` — Predict when the next release is due and quantify unreleased pressure ('you ship every 14 days; it's been 22 with 41 commits + 3 breaking'), with subscribe-when-threshold-crossed.

### 3. Reader Experience & 'What's New'

- **Public 'What's New' reader page**  `M` — Marketing-grade surface at /owner/repo/whatsnew: human titles, hero media, Ship-only view, per-entry anchors, SEO/OpenGraph/JSON-LD, persistent Subscribe CTA — distinct from the developer analysis permalink.
- **Read/unread + 'new since your last visit'**  `S` — Track last-seen release locally, badge newer entries with 'NEW', show an 'N new updates' counter, mark-all-read and jump-to-first-unread.
- **Reactions & upvotes on entries**  `M` — Per-entry emoji reactions, a 'most loved release' rollup, and a 'was this helpful?' thumbs feeding a maintainer view of what landed.
- **Dual-audience rendering (user vs developer)** ✦ `M` — One dataset, two lenses: 'For Developers' shows everything; 'For Users' hides refactor/test/chore and rephrases into benefit language ('You can now sign in with SSO').
- **Screenshots & media per entry**  `M` — Auto-extract images/GIFs/video already embedded in release bodies and merged PR descriptions and render the first as a hero card, plus an optional pinned curated-media slot.
- **Roadmap → shipped board** ✦ `M` — Three-lane Planned / In Progress / Shipped view sourced from open milestones + roadmap-labeled issues, in-flight PRs, and changelog releases.
- **'Is my bug fixed?' issue → release lookup** 🚀 `M` — Reader pastes an issue number/URL/keyword and Changeloom answers which release fixed it (parsing fixes/closes #N) or that it's still open, with a 'notify me when this ships' watch.
- **Rich entries with embedded media / demos** ✦ `M` — Render Loom/YouTube/Wistia and GIF demos found in PR bodies or release assets so a feature entry shows the feature.
- **Scheduled publishing & pinned / draft entries** ✦ `M` — Schedule a generated release for a future time and pin a highlighted entry to the top of the public page.
- **Listen mode (audio changelog / TTS)** 🚀 `M` — A 'Listen to this release' control that reads the TL;DR and breaking changes aloud via the Web Speech API, with an optional downloadable narrated audio file.

### 4. Distribution, Feeds & Integrations

- **RSS / Atom / JSON Feed per repo (and per range)**  `S` — Zero-config feeds at /api/feed/owner/repo(.rss|.atom|.json) emitting each release with title, human summary, category tags and permalink, with auto-discovery link tags.
- **Embeddable in-app 'What's New' widget** ✦ `L` — Drop-in script/iframe rendering a bell icon + unread badge + slide-out panel of recent updates inside the user's own product, themeable to their brand.
- **Subscribe hub: email digest, web push, chat** ✦ `XL` — Double-opt-in delivery of new releases via email (instant or weekly), browser web-push, and Slack/Discord/Teams webhooks, with per-channel category filters.
- **Filtered / smart subscriptions** ✦ `M` — Subscribe to only breaking changes, only a package/scope, or only security fixes — clean email/Slack instead of GitHub Watch's noisy inbox.
- **Release Radar → Slack / Discord / Teams** ✦ `L` — Point a repo at a chat webhook (or install the app) and post a rich categorized changelog card the moment a new release ships.
- **OG social cards + rich link unfurls** ✦ `S` — Auto-generated OpenGraph/Twitter images and oEmbed metadata for every permalink so a link unfurls into a branded changelog card in Slack, Discord, X, and iMessage.
- **One-click social share intents + launch kit**  `S` — 'Share this release' opens pre-composed X/Bluesky/Mastodon/LinkedIn/HN/Reddit posts and a Show-HN/Product-Hunt launch kit with a clean hero screenshot.
- **Changeloom GitHub Action** ✦ `M` — Published action that, on tag push, generates CHANGELOG.md and release-notes body via the existing API and commits or attaches them in CI, optionally gating on the Loom Score.
- **Changeloom GitHub App (auto-draft + PR gate)** 🚀 `XL` — One-click install that auto-writes release notes on each release, posts a changelog-preview comment on PRs, and adds a Loom-Score status check.
- **Outbound webhooks + iPaaS connectors (Zapier / Make / n8n)** ✦ `M` — Register a webhook URL, or use published connectors, to receive a structured JSON payload on every new release — wiring 'new release' into 6,000+ apps.
- **PM-tool sync (Notion / Linear / Jira / Confluence)** ✦ `XL` — OAuth into planning tools and auto-append each categorized release into a changelog database or doc, cross-linking fixed issues to tickets.
- **Editor & browser overlays (VS Code / JetBrains + extension)** 🚀 `L` — IDE extensions showing the changelog delta since your pinned version on hover in manifests, plus a browser extension injecting 'View in Changeloom' and summaries on GitHub/npm/PyPI pages.
- **Developer command surfaces (npx CLI + Raycast / Alfred)** ✦ `M` — `npx changeloom owner/repo` (generate, compare, pipe to file), plus Raycast and Alfred extensions for instant launcher lookups; an ASCII changelog for `curl changeloom.dev/owner/repo`.
- **Embeddable live viz + contributors-wall widgets** ✦ `M` — Beyond the badge: embeddable SVG/iframe mini-charts (category sparkline, cadence heatmap, contributor constellation, release fingerprint) and an auto-updating contributors wall (no all-contributors bot needed).

### 5. AI & Agent Layer (opt-in, BYO-key / local)

- **Prose Mode — human-friendly release notes**  `M` — One toggle rewrites the terse categorized list into flowing readable notes (headline + 2-3 paragraphs per section) grounded strictly in commit/PR text.
- **Audience-tailored registers (dev / user / exec / marketing)** ✦ `M` — A segmented control re-renders the same release in different registers and reading levels — terse dev notes, plain 'what's new', one-line exec summary, hype-free marketing copy.
- **Auto migration guide generator** 🚀 `L` — For each breaking change, pull the relevant diffs and generate a step-by-step upgrade guide with before/after snippets, renamed-API tables, and codemod hints.
- **Breaking-change explainer + blast radius** ✦ `M` — Click any breaking change for a plain-English 'why this breaks / who is affected / how to fix', plus an estimated blast radius from the files/exports/public APIs the diff touched.
- **Semantic theme clustering** ✦ `L` — Use embeddings/LLM to detect emergent themes across a range ('Auth overhaul', 'Perf push', 'Windows support') and group commits under narrative headings.
- **PR / commit diff summarizer** ✦ `M` — Inline 'summarize this' on any PR or commit: fetch the diff and produce a 1-3 sentence plain-language summary of what changed and why, with the SHA linked.
- **Per-release AI/rule walkthrough narrative** ✦ `M` — A short 'what this release does and why it matters' summary grouped by theme — rule-based skeleton from categorized commits with optional AI polish.
- **Release announcement & social copy studio** ✦ `M` — Generate blog post, tweet/X thread, LinkedIn post, Discord/Slack announcement, and changelog email from a release — each editable with tone controls, in one panel.
- **Multilingual changelog translation** ✦ `M` — Translate the full changelog (or any register) into N languages on demand, preserving code, structure and links, with locale-suffixed permalinks and hreflang for SEO.
- **Repo-history Q&A chat (RAG over releases & commits)** 🚀 `XL` — Chat answering NL questions over the whole history — 'When did dark mode ship?', 'What changed in auth since v2?' — every answer citing commit SHAs / tags.
- **Diff-grounded citations (anti-hallucination)** ✦ `M` — Every AI-generated sentence anchors to the specific SHA(s)/PR(s) it summarizes as hover-to-verify citations; ungrounded claims are flagged or suppressed.
- **AI ghostwriter → CHANGELOG.md / Release write-back** 🚀 `XL` — Draft a polished CHANGELOG.md entry or Release body, edit inline, then optionally open a PR or publish the Release straight back to the repo.
- **BYO-key / local-model privacy layer + editable prompts** 🚀 `L` — Settings to plug in OpenAI/Anthropic/OpenRouter keys or a local endpoint (Ollama/LM Studio/WebLLM), pick the model, cap spend, and view/edit every prompt template.

### 6. Upgrade & Dependency Intelligence (the reader/consumer niche)

- ✅ **Compare any two tags (base…head upgrade digest)** ✦ `M` — Categorized diff of everything between two tags — the 'everything since my version' upgrade digest.
- **'Safe to upgrade?' verdict + risk/bake-time score** ✦ `M` — A traffic-light verdict and 0-100 risk score from breaking-change count, major-version delta, churn in files you use, revert/hotfix density, and days-since-release ('Wait ~2 weeks: 4 hotfixes landed within 48h').
- ✅ **Personalized 'upgrade impact for me'** 🚀 `L` — Reader states current version (or pastes package.json/import list) and gets only the breaking changes and features between their version and latest, cross-referenced against the symbols/files they actually use.
- **Dependency & lockfile diff across tags** ✦ `M` — Parse package.json/lockfiles/go.mod/requirements.txt/Cargo.toml at two refs and surface added/removed/upgraded/downgraded deps per release, classifying each bump by semver risk.
- **Multi-dependency upgrade digest (paste your manifest)** 🚀 `L` — Paste package.json / requirements.txt / go.mod / Cargo.toml and get one consolidated 'everything that changed across ALL your outdated deps since your pinned versions' report with per-package breaking flags.
- **Cross-repo dependency ripple (watch my whole stack)** 🚀 `L` — From a manifest/lockfile, map which of YOUR dependencies just shipped breaking changes and render the blast radius: 'this upstream release affects 3 of your deps, 1 breaking you use.'
- **Undeclared / inferred breaking-change detector** 🚀 `L` — Diff the public surface (exported TS symbols/.d.ts, package.json exports, removed public files, changed signatures) between tags to catch breaks the commit messages never declared.
- **OpenAPI / GraphQL API-diff changelog section** 🚀 `L` — Detect an OpenAPI/GraphQL schema, fetch it at both refs, diff it, and render an 'API Changes' section — added/removed/changed endpoints, new required params, flagged breaking contract changes.
- **Staleness / 'time to upgrade' advisor** ✦ `M` — Quantify how far behind latest you are: number of releases, breaking changes in between, months of drift, and a composite upgrade-risk score.
- **Package-registry mode (npm / PyPI / crates / Go / RubyGems)** 🚀 `L` — Enter a package name → resolve its source repo and published versions → generate the changelog between two published versions, surfacing publish dates, dist-tags, tarball-size delta, deprecations, and a dependency diff.
- **Cross-registry package-update changelogs** 🚀 `L` — Accept a package identifier instead of a repo URL across ecosystems and render the upgrade digest between the version you have installed and latest.
- **MCP server / agent-ready release-context API** 🚀 `M` — An official MCP server exposing changelog, compare, insights, breaking-change, and loom-score as callable tools so Claude/Cursor/agents can pull 'what changed between v2 and v3' into a coding session.
- **Machine-readable changelog API (JSON + llms.txt)** ✦ `S` — Stable /api/changelog/owner/repo endpoints returning clean JSON plus an llms.txt-style structured feed of releases, breaking changes and migrations, so AI upgrade agents query reliably.
- **Fork drift compare** ✦ `M` — Compare a fork against its upstream (or vice-versa) to show what each has that the other doesn't — a changelog for divergence for long-lived forks.

### 7. Security, Compliance & Supply Chain

- **Security-fix spotlight** ✦ `M` — Scan commits/PRs/issues in a range for security signals (CVE/GHSA IDs, RCE/XSS/SQLi/auth-bypass keywords) and pin a dedicated Security section to the top, enriched with severity/CVSS from the GitHub Advisory DB.
- **'Does this upgrade patch a CVE?' digest** 🚀 `L` — Map the repo to its package identity and query the Advisory DB for advisories whose fixed-version falls in the range: 'upgrading vX→vY closes N advisories (max CVSS 8.1).'
- **Vulnerable-dependency scan of the delta** 🚀 `L` — For every dependency added or bumped in the range, cross-check the resulting version against the Advisory DB and flag whether the range introduces or resolves a known advisory.
- **License-change detection** ✦ `M` — Diff the project's own LICENSE/SPDX and every dependency's license across the range, flagging relicensing events and dependency license shifts (MIT→AGPL/BSL/commercial).
- **Provenance & signature surfacing** ✦ `M` — Read GitHub's per-commit verification and tag signatures to compute a provenance score — % of commits GPG/SSH/Sigstore-verified, whether the release tag is signed, which unsigned commits came from outsiders.
- **Supply-chain risk radar** 🚀 `L` — Heuristics flag supply-chain-attack tells: edits to CI workflows, added postinstall scripts, unpinned Actions (mutable @v vs SHA), new network calls in build steps, large/obfuscated blobs, first-timers touching release config.
- **Secret-leak scan of the range** ✦ `M` — Scan only the added lines in the range's diff with known-secret regexes and entropy checks (AWS keys, GitHub tokens, private keys) and flag credentials committed in shipped commits.
- **Security Loom Score (repo posture panel)** 🚀 `L` — An OpenSSF-Scorecard-lite grade: SECURITY.md, branch protection, Dependabot, CodeQL/SAST, signed releases, SHA-pinned Actions — rolled into a 0-100 gauge with an embeddable badge.
- **Advisory timeline + 'Am I affected?' checker** ✦ `M` — Pull the repo's published advisories, map each onto the release timeline (embargo→disclosure→fixed-in), and offer a widget where a user enters their version to learn which advisories hit them and the minimum safe upgrade.
- **Compliance-ready audit-trail export** ✦ `L` — Emit a changelog where every entry carries full provenance (SHA, author, timestamp, PR, reviewers, signature status, CI outcome) as a tamper-evident manifest for SOC 2 / ISO 27001 / FDA evidence (PDF/CSV/JSON).
- **Signed / tamper-evident changelog** 🚀 `M` — Compute a deterministic SHA-256 over canonical changelog content, embed the digest, and host a verify endpoint (plus optional Sigstore/cosign attestation).
- **SBOM export & SBOM diff (SPDX / CycloneDX)** 🚀 `L` — Generate a standards-format SBOM at a ref from parsed lockfiles and diff two SBOMs into a machine-readable component delta, with optional CycloneDX VEX for known-vulnerable components.
- **Release provenance & compliance reports (enterprise)** 🚀 `L` — Paid, exportable release audit artifacts: signed release notes, change-diff attestations, dependency-delta/SBOM reports, and 'what changed since last audit' summaries for GRC teams.

### 8. Analytics & Repo Intelligence

- ✅ **Existing insights suite** ✦ `M` — Release cadence ribbon, release anatomy (category mix), suggested next version, code hotspots (+/- churn), and the Loom Score (0-100 changelog-hygiene grade with animated gauge).
- **Repo Health Score (composite pulse + badge)** ✦ `L` — A single 0-100 project-health grade aggregating maintenance recency, release velocity, bus factor, issue/PR responsiveness, docs/CI presence and security signals, as a gauge and README badge.
- **'Is it still maintained?' liveness verdict** ✦ `M` — Plain-English Active / Slowing / Dormant / Abandoned from commit recency, cadence drift, issue/PR first-response latency and active-contributor count, with evidence shown.
- ✅ **Release-velocity time-series & trend engine** ✦ `M` — Full-history charts of commits/LOC-churn/days-between per release with accelerating/steady/decelerating trend detection.
- **Contributor churn & retention cohorts** 🚀 `L` — New vs returning vs departed contributors per period, a retention/cohort curve, and bus-factor-over-time — is the maintainer base growing, stable, or eroding.
- **DORA-style delivery metrics (reconstructed from git)** 🚀 `L` — Proxy deployment frequency, lead-time (commit→tag), change-failure-rate (hotfix/revert ratio), and MTTR inferred purely from history and tags.
- **Issue & PR responsiveness analytics** ✦ `L` — Time-to-first-response, time-to-close, open/close ratio trend, stale-backlog aging, and issues/PRs-shipped-per-release via #-reference parsing.
- **Comparative benchmarking vs peer repos** 🚀 `XL` — Pick or auto-suggest peer projects and benchmark health, velocity, cadence, bus factor and Loom Score side by side in a radar/table.
- **Compare two REPOS head-to-head** ✦ `M` — Side-by-side cadence, Loom Score, velocity, contributor counts and bus-factor for two repos (React vs Vue, fork vs upstream) — argument-bait and SEO-friendly.
- ✅ **Hotspot risk map & co-change coupling** ✦ `L` — Beyond churn: fragile files that change every release, files that always change together (hidden coupling), and a churn-vs-age risk quadrant.
- **Bug-fix & regression quality trend** ✦ `S` — Track fix/revert ratio vs features over time plus a regression signal when fix floods spike right after a release — reusing the categorizer at near-zero cost.
- **Release regression radar** ✦ `M` — Cross-reference issues opened shortly AFTER a release that reference its version, or a post-release bug-report spike, to flag 'this release may have introduced regressions.'
- **Commit-cadence heatmap & working-pattern analytics** ✦ `M` — Day/hour punch-card of when work happens, contributor timezone spread, and weekend/after-hours ratio as a burnout/sustainability signal.
- **Anomaly & risky-release detection** ✦ `M` — Z-score flagging of outlier releases — 10x churn, contributor exodus, sudden fix flood, abnormal silence — annotated on the timeline with a plain-English 'why flagged.'
- **Adoption & momentum signals** ✦ `M` — Star-velocity, fork ratio, stars-per-release curves distilled into a Momentum Index (Rising/Steady/Declining) with drivers listed.
- **Maintenance / abandonment indicator (OpenSSF-style)** ✦ `S` — An 'actively maintained vs stale/abandoned' signal (90-day activity, release recency, cadence trend) beside the Loom Score to answer 'should I depend on this repo at all?'
- **Code cohort / new-vs-legacy & survival curves** ✦ `L` — Show how much of a release's touched code is brand-new vs churn on old code (cohort stack plot), and optionally a Kaplan-Meier survival curve of the repo's lines.
- **Historical snapshot time-machine + decline alerts** 🚀 `XL` — Periodically store each tracked repo's metrics so trends are real, show 'health 30/90 days ago vs now', and alert a watcher when health drops or a breaking change ships.

### 9. Data Viz & Visual Storytelling

- ✅ **People viz suite (existing)** ✦ `M` — Range-scoped contributor leaderboard, contributor-warp visualization, and bus-factor concentration.
- **Loom Tapestry (full-history generative timeline art)** 🚀 `L` — A poster-grade woven visualization of the entire repo history where each release is a band and thread density/color encodes commit volume, category mix and breaking-ness.
- **Animated release replay (git time-lapse)** 🚀 `XL` — A play/scrub control animating the repo's evolution release-by-release — bars grow, contributors light up, the tapestry weaves itself — with record-to-GIF/WebM/MP4.
- **Shareable release card + exportable poster/wallpaper** 🚀 `M` — Auto-generated OG image per release/compare (stats, sparkline, contributors, breaking flag, Loom Score) plus print-ready PNG/SVG/PDF poster and phone/desktop wallpaper presets.
- **Commit-type streamgraph (category flow across releases)** ✦ `M` — A flowing streamgraph showing how the category mix swells and shrinks release-over-release — revealing stabilizing vs feature-sprint vs refactor phases.
- **Author → Category → Area Sankey** 🚀 `L` — A Sankey routing commits from contributors, through change categories, into the directories/areas they touched — 'who works on what kind of change, and where.'
- **File-heat treemap** ✦ `M` — An interactive treemap sized by churn and colored by change frequency/recency, with directory drill-down — a spatial upgrade of the hotspots list.
- **Contributor constellation (co-commit network)** 🚀 `L` — A force-directed constellation where contributors are stars sized by contribution and edges connect people who co-touch the same files, clustering into teams/subsystems.
- **Dependency-change graph (upgrade diff viz)** 🚀 `L` — Parse manifests at two tags and visualize added/removed/upgraded dependencies with major-bump flags as a bump chart or graph.
- **'Shape of a Release' fingerprint** ✦ `S` — A compact radial/polar signature per release encoding category proportions, size, contributor count and breaking-ness, so releases are recognizable at a glance and comparable side by side.
- **Visual compare dashboard (base…head, seen not read)** ✦ `M` — A dedicated visual diff for two tags: category deltas, contributor deltas, churn, velocity change and side-by-side fingerprints.
- **Cadence calendar + ship punch-card + velocity burnup** ✦ `S` — A contributions-style release calendar heatmap, a day×hour ship punch-card, and a cumulative commits/LOC burnup with release markers.
- **Repo Genome / DNA fingerprint** 🚀 `M` — A deterministic 'genome' from commit rhythm, category mix, cadence, contributor topology and dependency DNA rendered as a generative-art strand, plus genome-similarity matching to find repos that evolve alike.
- **Repo Constellation (ecosystem release map)** ✦ `M` — Visualize a whole org/ecosystem as a living constellation showing coordinated release waves, cross-package version alignment, and monorepo 'release weather' over time.
- **3D release skyline + ASCII terminal changelog** ✦ `M` — A WebGL 3D skyline of releases over time (optional STL export) plus a plain-text/ASCII changelog for `curl` terminal rendering.

### 10. Developer Platform, API & Self-Host

- ✅ **Documented public REST API + OpenAPI 3.1 + keys/console**  `L` — Promote the callable CI endpoint into a versioned REST API (/v1/changelog, /compare, /insights, /people, /loom-score) with a published OpenAPI spec, hosted docs, ETag caching, and GitHub-login API keys with quotas.
- **GraphQL endpoint for composite queries** ✦ `L` — A single /graphql endpoint letting clients request exactly the slices they want (changelog + anatomy + leaderboard for a range) in one round trip.
- **Typed SDKs (TypeScript + Python), auto-generated** ✦ `M` — Publish @changeloom/sdk (npm) and changeloom (pip) generated from the OpenAPI spec, with typed models, retry/backoff and tree-shakeable imports.
- **npx changeloom CLI (extracted @changeloom/core)** ✦ `L` — Ship the categorizer/compare/insights logic as a standalone core package plus a zero-install CLI that reads local git history (offline, no rate limits, private repos), generates CHANGELOG.md, and exits non-zero on --check drift.
- **Custom template engine + live playground** 🚀 `L` — Supply a Handlebars/Nunjucks/Liquid template rendered against the structured model to emit any shape (Slack Block Kit, Discord embed, HTML email, Jira/Confluence markup), with a browser playground live-previewing against a real repo.
- **Webhook-driven auto-regeneration (GitHub App)** 🚀 `XL` — Install the app; on each new release/tag it regenerates the changelog and opens a CHANGELOG.md PR, posts to chat, or fires a signed webhook — hands-off continuous release notes.
- **One-click self-host: Docker image + deploy buttons** ✦ `M` — Official multi-arch Docker image + compose, Deploy-to-Vercel/Railway/Render/Fly buttons, and a documented env surface (BYO token, optional Redis, configurable GHES base URL).
- **Plugin system + multi-forge source adapters** 🚀 `XL` — A hook-based plugin API (source, categorize, transform, render) discovered via npm naming, with first-party source adapters for GitLab, Bitbucket, Gitea and local git alongside GitHub.
- **White-label theming + embeddable web component** ✦ `M` — Config-driven theming (swap the OKLCH palette, logo, fonts, hide branding) plus a <changeloom-widget repo> component/iframe so any docs site drops a live on-brand changelog in one tag.

### 11. Collaboration & Team Workflow

- **GitHub OAuth + saved repos & home dashboard**  `L` — Sign in to pin repos into a dashboard that remembers last-compared ranges and opens straight to a fresh changelog — the identity on-ramp for all team features.
- **Team workspaces with roles & invites** ✦ `XL` — Shared workspaces where you invite teammates by handle/email and assign owner/editor/viewer roles over a set of tracked repos.
- **Draft mode — manual edit-before-publish** ✦ `L` — Promote a generated changelog into an editable draft where you rewrite entry text, add human context, and cut noise before exporting or publishing.
- **Entry curation — hide / merge / rename / reorder (persistent)** ✦ `L` — Curate the entry list by hiding noise commits, merging duplicates into one bullet, renaming, and drag-reordering — remembered per repo and release.
- **Comments & annotations on entries** ✦ `L` — Threaded comments with @mentions and resolve/unresolve pinned to a specific entry ('is this actually breaking?').
- **Approval / sign-off flow (changelog-as-PR)** 🚀 `L` — A draft moves through draft → in-review → approved → published with required approvers — a pull request for your release notes, with an audit log.
- **Stakeholder review links (no-account)** ✦ `M` — Share a read-plus-comment link with PM/marketing/execs who approve or leave feedback without creating an account — upgrading the read-only permalink into a collaboration surface.
- **Scheduled / recurring generation**  `M` — Set a cadence (nightly/weekly) or 'on every new tag' trigger to auto-regenerate the changelog and refresh the shared workspace view.
- **GitHub App — webhook auto-draft on tag push** 🚀 `XL` — Install the app; on every tag/release push it auto-builds a draft changelog, opens a PR (or a review task), and notifies the team — zero-touch release notes wired into CI.
- **Multi-repo / monorepo aggregated team release digest** ✦ `L` — Combine changelogs across several repos or monorepo packages into one curated product-level 'what shipped this month' digest for a date range or version train.
- **Multi-repo release radar dashboard** ✦ `M` — Pin several repos and see a unified dark feed of their latest releases in one place (localStorage first, accounts later) — the 'follow my whole stack' view GitHub lacks.

### 12. Multi-Platform & Beyond-GitHub

- **Universal Git-provider adapter spine**  `M` — Refactor the hardcoded GitHub client into a GitProvider interface with pluggable adapters and a host-aware parseRepoRef — the single unlock that lights up categorizer/score/insights/viz on any new host for free.
- **GitLab support (SaaS + self-hosted, subgroup-aware)** ✦ `M` — A GitLab REST v4 adapter handling nested group/subgroup paths, working against gitlab.com or any self-hosted instance with a BYO token.
- **Gitea / Forgejo / Codeberg adapter** ✦ `S` — One adapter covering the near-GitHub-compatible Gitea API family, instantly supporting Codeberg and self-hosted Gitea/Forgejo.
- **Bitbucket support (Cloud + Server/Data Center)**  `L` — A Bitbucket 2.0 adapter handling values/next pagination, /refs/tags, and reconstructing a base…head range via the commits-between endpoint.
- **Paste-anything host detection + self-hosted profiles + instance directory** ✦ `M` — Sniff any pasted URL/SSH/clone string to auto-route, probe unknown hosts for GitLab/Gitea signatures, remember private host+token profiles in localStorage, and ship a curated directory of known instances (KDE, GNOME, Debian Salsa).
- **Docker / OCI image-tag mode** 🚀 `XL` — Enter a container image, list registry tags, resolve each tag to its source commit via OCI labels, generate the changelog between two image tags, and show base-image/layer/size/env/label deltas.
- **Bring-your-own-repo: git bundle & git log paste** ✦ `L` — Upload a .bundle/archive or paste `git log --pretty=` output and get the full portal parsed server-side with no host API and no token — unlocking private/air-gapped/internal git.
- **Cross-host mirror detection & rate-limit/outage failover** 🚀 `L` — Detect repos mirrored across hosts (matching SHAs), treat them interchangeably, stitch history across a host migration, and fail over to a mirror when the primary is rate-limited or down.
- **Long-tail VCS adapters (sourcehut, Mercurial, Fossil, cgit/gitweb)** 🚀 `XL` — Adapters for the forgotten hosts — sourcehut, hgweb JSON, Fossil's JSON API, and a generic scraper for cgit/gitweb Atom/RSS tag feeds.

### 13. Accessibility, i18n & Inclusivity

- **Light + high-contrast + low-blue-light theme suite**  `M` — Add a light theme, a WCAG-AAA high-contrast theme, and a sepia/low-blue-light theme, driven by prefers-color-scheme and prefers-contrast with a persistent switcher.
- **Screen-reader-optimized view + clean semantic export** ✦ `L` — Landmark/heading-correct DOM, ARIA live regions announcing result counts, skip-links to breaking changes, alt text on charts, and a semantic-HTML export mode giving each viz a data-table fallback.
- **Interface internationalization (localized UI chrome)**  `M` — Translate the portal's own strings into a set of locales via community message files, with a locale switcher.
- **Full RTL layout support** ✦ `M` — Mirror the layout for Arabic/Hebrew/Farsi/Urdu using CSS logical properties with bidi-safe rendering so code tokens in RTL prose don't scramble.
- **Plain-language / de-jargon mode** 🚀 `L` — Rewrite terse conventional-commit jargon into human sentences and expand acronyms/scopes via a rule-based glossary baseline with optional AI polish.
- **Dyslexia & reading-friendliness mode** ✦ `M` — Toggle Atkinson Hyperlegible / OpenDyslexic fonts, adjustable size and spacing, a reading ruler, and strict prefers-reduced-motion that stills all loom animations.
- **Locale-aware dates, numbers & relative time**  `S` — Render every date, count, cadence interval and 'time ago' through Intl APIs respecting locale, separators, 12h/24h and calendar system.
- **Colorblind-safe encoding across categories & charts**  `M` — Encode meaning with icons/patterns/labels not color alone, ship deuter/prot/tritanopia-safe palettes, and add a colorblind-simulation preview toggle.
- ✅ **Keyboard-only power mode with command palette** ✦ `M` — Promote existing keyboard nav into a Cmd-K fuzzy palette (jump to tag, compare, switch export, toggle theme/language, filter) with focus-visible rings, roving tabindex, and a '?' cheat-sheet.
- **Printable & tagged-PDF changelog export** ✦ `M` — A print stylesheet plus a server-rendered accessibility-tagged PDF laying release notes out as a paginated document for offline distribution, release binders and audit archives (also CSV export).
- **Changelog readability score & audit** ✦ `M` — Extend the Loom Score with a readability grade — Flesch-Kincaid level, jargon/acronym density, share of non-descriptive commits — plus concrete fix suggestions.
- **Reader-preference persistence & accessible permalinks** ✦ `S` — Persist theme/font/size/motion/language in localStorage and encode them in shareable permalinks so a maintainer can embed a French plain-language reduced-motion changelog.

### 14. Growth, Community & Monetization

- **Repo Wrapped / Changelog Wrapped (year-in-review)** 🚀 `L` — A Spotify-Wrapped-style swipeable animated recap (releases, biggest release, top contributors, busiest month, churn, new contributors, release personas) as a downloadable card deck or short video.
- **Public Changelog Quality Index / Loom Index directory** 🚀 `L` — A crawled, SEO-indexed directory ranking popular OSS by Loom Score, browsable by language/ecosystem/topic, with per-repo report-card permalinks — the changelog leaderboard of open source.
- ✅ **SEO release pages + structured data** ✦ `M` — Each release gets a crawlable URL with meta tags, JSON-LD (SoftwareApplication/release schema), canonical tags and an auto-generated sitemap.xml.
- **Best-Changelog leaderboard + repo compare** ✦ `L` — Public rankings by Loom Score, filterable by language/topic, refreshed weekly, with a 'Top 100 Changelog' badge and side-by-side repo-hygiene comparisons.
- ✅ **Expanded badge suite + Changelog Certified tiers**  `M` — Beyond the Loom Score badge: latest-release, freshness, contributor-count, cadence and graded S/A/B/C 'Changelog Certified' badges — themeable, each linking to a public verify page.
- **Contributor Passport + trading card** 🚀 `L` — A shareable /@user profile aggregating a person's shipped work across every indexed repo (features/fixes/breaking led, Ship ratio, badges), plus an auto-generated PNG trading card sized for X/LinkedIn.
- **Contributor achievement badges + release streaks** ✦ `L` — Rule-based unlockable badges (Bug Slayer, Perf Wizard, Docs Hero, Marathoner, First Blood) plus ship-cadence streaks and on-time achievements shown on cards and the repo page.
- **Kudos / thank-you generator + sponsor callouts** ✦ `M` — One click drafts a polished release thank-you (markdown + social post crediting every contributor, first-timers highlighted) and pulls FUNDING.yml/Sponsors into a 'Support these maintainers' module injected into exports.
- **Adopt-a-Changelog + Changelog of the Week** 🚀 `L` — For repos with poor/missing changelogs, generate a ready-to-merge CHANGELOG.md and open it as a PR in one click; plus a curated/community-voted weekly spotlight with a public archive.
- **'Shipped this week' live homepage feed + ecosystem aggregator** 🚀 `L` — A live auto-updating feed of notable OSS releases (major versions, high-churn, trending) and weekly 'what shipped across React/Rust/Python' rollups — turning the homepage into a daily habit and SEO magnet.
- ✅ **Changeloom attribution + referral loop**  `S` — Subtle 'Made with Changeloom →' baked into every shared artifact (OG cards, embeds, exports, badges, wrapped decks) plus a contextual 'generate yours free' CTA on public pages.
- **Changeloom social bot (auto-release threads)** 🚀 `XL` — An opt-in X/Bluesky/Mastodon bot that auto-posts a formatted release thread (OG card + link) when a followed repo ships and replies with a mini-report when @-mentioned.
- **Private & org repo support (the #1 conversion gate)** ✦ `L` — Keep free public + no-signup; Pro adds a GitHub App install to run the full stack against private and org repos — the cleanest, least-controversial paywall.
- **Accounts, billing & Pro paywall (foundation)**  `XL` — GitHub-OAuth accounts, a Stripe metering layer, and the free/Pro/Team entitlement gate every paid feature checks — with a generous no-signup free tier preserved.
- **Hosted white-label Changelog-as-a-Service + custom domain** 🚀 `XL` — An auto-generated public changelog site at changelog.yourco.com — custom domain, branding removed, RSS + email subscribe — kept fresh from the repo with zero manual writing; the flagship recurring-revenue product.
- **Remove branding / white-label (Pro)** ✦ `S` — Strip Changeloom branding from the hosted page, badge and exports; allow a logo + accent-color swap — the universal low-friction first upsell.
- **AI-polished notes as metered credits (Pro)** ✦ `M` — Keep the rule-based core free; sell the optional LLM rewrite/audience-tailoring pass as metered AI credits on top of Pro so cost tracks usage.
- **Team workspaces + seats + org release-health dashboard (Team)** ✦ `L` — Shared saved repos with flat per-seat billing and roles, plus an org-wide Loom Score / cadence dashboard trending every repo — priced flat, not per-MAU.
- ✅ **Metered public API + usage billing (Pro)** ✦ `M` — Issued API keys, a free monthly quota, usage-based overage, and a spend dashboard — turning the callable API into self-serve land-and-expand revenue.
- ✅ **Priority rate limits / dedicated token pool + deep history (Pro)**  `M` — Free shares a throttled token with capped history; Pro gets a dedicated high-throughput pool, faster refresh, and full-history deep scans — monetizing the one genuinely scarce resource.
- **GitHub Marketplace app + paid Action** ✦ `L` — List Changeloom on GitHub Marketplace with plans billed through GitHub, plus a paid Action that generates and commits CHANGELOG.md on every tag — distribution and billing where buyers already live.
- **Open-core self-host license (free MIT core, paid enterprise key)** ✦ `M` — Keep the full core MIT and self-hostable, gate enterprise extras (SSO/SAML, unlimited private repos, audit log, SLA) behind a runtime-validated commercial license key.
- **Sponsorship, powered-by wall & sponsorware**  `S` — Wire GitHub Sponsors/OpenCollective tiers, a sponsor logo wall, and sponsorware features that unlock publicly once a funding goal is reached — zero-ops early revenue aligned with OSS culture.


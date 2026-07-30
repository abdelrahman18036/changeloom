# Launch checklist

Everything needed to take Changeloom public. Tick these off in order.

## 1. Before you post anything

- [ ] **Set `GITHUB_TOKEN` in Vercel** → Project → Settings → Environment Variables.
      Create it at https://github.com/settings/tokens/new with **no scopes**
      (public read only). Without it the demo is capped at GitHub's 60
      requests/hour and dies the moment it gets traffic. **Never** use a
      `repo`-scoped token here — it would expose your private repos to every
      visitor (see [SECURITY.md](../SECURITY.md)).
- [ ] Confirm the deploy is green and `/honojs/hono` loads cold in a private window.
- [ ] Check the OG card unfurls: paste `https://changeloom.vercel.app/honojs/hono`
      into Slack or https://cards-dev.twitter.com/validator.

## 2. Dress the repo

GitHub's repo sidebar is the first thing visitors read.

- [ ] **Description:** `Paste a GitHub repo URL, get a categorized changelog — plus release insights, contributor intelligence and a Loom Score. Open source, no signup.`
- [ ] **Website:** `https://changeloom.vercel.app`
- [ ] **Topics:** `changelog` `release-notes` `github-api` `developer-tools`
      `nextjs` `typescript` `open-source` `conventional-commits` `semver`
      `release-management`
- [ ] **Social preview image** (Settings → General → Social preview): save
      `https://changeloom.vercel.app/api/og/honojs/hono` as a PNG and upload it.
- [ ] Enable **Discussions** (the issue templates already link to it).

## 3. Launch posts

**Show HN** — title (no emoji, no hype, HN hates both):

> Show HN: Changeloom – paste a GitHub repo URL, get a categorized changelog

First comment:

> I kept wanting a changelog for repos I didn't maintain — to answer "what
> actually changed, and will upgrading break me?" GitHub's release notes are a
> flat list of PR titles, git-cliff needs a terminal and a config file, and the
> hosted tools are closed and paywalled.
>
> Changeloom is a web portal: paste `owner/repo` (or open
> changeloom.vercel.app/owner/repo) and it categorizes the range from commits
> and PRs, splits "affects you" from "under the hood", scores the repo's
> changelog hygiene, and shows release cadence, code hotspots and a
> range-scoped contributor leaderboard — which GitHub can't show you anywhere.
>
> No account, no install. It's MIT and self-hostable; the categorizer is
> rule-based so it works with no AI and no API key. Rough edges: it's
> GitHub-only for now, and GitHub's compare API caps a range at 250 commits,
> which the UI flags rather than silently truncating.
>
> Try honojs/hono or your own repo. Feedback very welcome.

**r/opensource / r/programming** — lead with the problem, not the tool. Link a
concrete example (`/honojs/hono`) rather than the homepage; people click a
result faster than a landing page.

**Bluesky / X** — attach the OG card, keep it to one line:

> Paste any GitHub repo → get a categorized changelog, release insights and a
> changelog-hygiene score. No signup, MIT licensed.
> changeloom.vercel.app

## 4. After launch

- [ ] Watch `/api/changelog` error rates — rate limiting is the likely failure.
- [ ] Add the badge to a repo you own so the loop is visible in the wild.
- [ ] Log feature requests as issues; the [ROADMAP](../ROADMAP.md) already has
      194 candidates to triage against.

## 5. Known limitations to answer honestly

People will ask. Prepared answers:

| Question | Answer |
|---|---|
| Why not AI? | The baseline is deterministic and free. AI is planned as opt-in with your own key, layered on top — never required. |
| Private repos? | Supported: paste your own token. It's validated, kept in your browser, and never stored server-side. |
| GitLab? | Not yet. Everything normalizes to one internal commit shape, so an adapter is the plan. |
| Big ranges? | GitHub's compare API caps at 250 commits; Changeloom flags the range as truncated instead of quietly undercounting. |
| Monorepos? | Per-package changelogs are on the roadmap, not built. |

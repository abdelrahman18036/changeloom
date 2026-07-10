# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Changeloom, please **do not open a
public issue**. Instead, report it privately using GitHub's
[Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository, or email the maintainers.

We will acknowledge your report within 72 hours and aim to provide a fix or
mitigation timeline within 7 days.

## Scope

Changeloom is a stateless web app. It:

- Stores **no** user data server-side and has **no** database.
- Accepts an optional GitHub personal access token, which is used **only** for
  the duration of a single request to the GitHub API and is never logged or
  persisted.

Please pay particular attention to:

- Token handling in `src/app/api/**` and `src/lib/changelog/github.ts`
- Any reflected input in rendered Markdown/SVG output
- Server-side request forgery via the repository URL parser

Thank you for helping keep Changeloom and its users safe.

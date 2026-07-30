import { describe, expect, it } from "vitest";
import { renderKeepAChangelog, renderMarkdown, renderPlainText } from "./render";
import { parseVersion } from "./generate";
import type { ChangelogEntry, ChangelogGroup } from "./types";

function entry(over: Partial<ChangelogEntry> = {}): ChangelogEntry {
  return {
    text: "Add streaming",
    category: "feature",
    audience: "ship",
    sha: "a1b2c3d4e5f6",
    shortSha: "a1b2c3d",
    prNumber: 482,
    scope: null,
    author: "octocat",
    avatarUrl: null,
    breakingNote: null,
    isSecurity: false,
    isDependency: false,
    date: null,
    ...over,
  };
}

const groups: ChangelogGroup[] = [
  { category: "feature", entries: [entry()] },
  { category: "fix", entries: [entry({ text: "Fix a crash", category: "fix", prNumber: null })] },
];

const args = { owner: "o", name: "r", base: "v1.0.0", head: "v1.1.0", groups };

describe("renderMarkdown", () => {
  it("includes the range header and grouped sections", () => {
    const md = renderMarkdown({ ...args, rangeMode: "tags" });
    expect(md).toContain("# Changelog");
    expect(md).toContain("v1.0.0...v1.1.0 · o/r");
    expect(md).toContain("Features");
    expect(md).toContain("Fixes");
  });

  it("links PRs by number and commits by sha", () => {
    const md = renderMarkdown({ ...args, rangeMode: "tags" });
    expect(md).toContain("[#482](https://github.com/o/r/pull/482)");
    expect(md).toContain("https://github.com/o/r/commit/a1b2c3d4e5f6");
  });

  it("renders a scope in bold when present", () => {
    const md = renderMarkdown({
      ...args,
      rangeMode: "tags",
      groups: [{ category: "feature", entries: [entry({ scope: "api" })] }],
    });
    expect(md).toContain("**api:**");
  });

  it("ends with exactly one trailing newline", () => {
    const md = renderMarkdown({ ...args, rangeMode: "tags" });
    expect(md.endsWith("\n")).toBe(true);
    expect(md.endsWith("\n\n")).toBe(false);
  });
});

describe("renderKeepAChangelog", () => {
  it("maps categories onto Keep a Changelog sections", () => {
    const md = renderKeepAChangelog(args);
    expect(md).toContain("### Added");
    expect(md).toContain("### Fixed");
    expect(md).toContain("keepachangelog.com");
  });

  it("emits a compare link for the version", () => {
    expect(renderKeepAChangelog(args)).toContain(
      "https://github.com/o/r/compare/v1.0.0...v1.1.0",
    );
  });
});

describe("renderPlainText", () => {
  it("contains no markdown formatting", () => {
    const txt = renderPlainText(args);
    // Plain "-" bullets and bare #482 refs are fine; markdown links, bold and
    // code fences are not.
    expect(txt).not.toMatch(/\[.+\]\(.+\)/); // links
    expect(txt).not.toMatch(/\*\*/); // bold
    expect(txt).not.toMatch(/`/); // code
    expect(txt).toContain("FEATURES");
  });
});

describe("parseVersion", () => {
  it("parses a v-prefixed semver", () => {
    expect(parseVersion("v1.2.3")).toMatchObject({ major: 1, minor: 2, patch: 3 });
  });

  it("defaults a missing patch to 0", () => {
    expect(parseVersion("2.5")).toMatchObject({ major: 2, minor: 5, patch: 0 });
  });

  it("detects prereleases", () => {
    expect(parseVersion("v2.0.0-rc.1")!.isPrerelease).toBe(true);
    expect(parseVersion("v2.0.0")!.isPrerelease).toBe(false);
  });

  it("handles monorepo-prefixed tags", () => {
    expect(parseVersion("@scope/pkg@1.4.0")).toMatchObject({ major: 1, minor: 4 });
  });

  it("returns null for unversioned tags", () => {
    expect(parseVersion("nightly")).toBeNull();
  });
});

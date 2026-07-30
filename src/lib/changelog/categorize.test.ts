import { describe, expect, it } from "vitest";
import {
  categorizeCommit,
  detectDependency,
  detectSecurity,
  isNoise,
  isValidRepo,
  normalizeRepoInput,
  parseRepoUrl,
  releaseCodename,
} from "./categorize";
import type { RawCommit } from "./types";

function commit(message: string, over: Partial<RawCommit> = {}): RawCommit {
  return {
    sha: "a1b2c3d4e5f6a7b8c9d0",
    message,
    authorLogin: "octocat",
    authorName: "Octo Cat",
    avatarUrl: null,
    date: "2026-07-01T12:00:00Z",
    ...over,
  };
}

describe("parseRepoUrl", () => {
  it("accepts owner/repo shorthand", () => {
    expect(parseRepoUrl("honojs/hono")).toEqual({ owner: "honojs", name: "hono" });
  });

  it("accepts a full https URL", () => {
    expect(parseRepoUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      name: "next.js",
    });
  });

  it("strips a .git suffix", () => {
    expect(parseRepoUrl("https://github.com/a/b.git")).toEqual({
      owner: "a",
      name: "b",
    });
  });

  it("ignores extra path segments (tree/branch URLs)", () => {
    expect(parseRepoUrl("github.com/a/b/tree/main/src")).toEqual({
      owner: "a",
      name: "b",
    });
  });

  it("rejects non-GitHub hosts", () => {
    expect(parseRepoUrl("https://gitlab.com/a/b")).toBeNull();
  });

  it("rejects incomplete or empty input", () => {
    expect(parseRepoUrl("")).toBeNull();
    expect(parseRepoUrl("just-a-word")).toBeNull();
    expect(parseRepoUrl("https://github.com/owner")).toBeNull();
  });
});

describe("normalizeRepoInput / isValidRepo", () => {
  it("collapses a pasted URL to owner/repo", () => {
    expect(normalizeRepoInput("https://github.com/abc/def.git")).toBe("abc/def");
  });

  it("leaves partial input alone so typing isn't disrupted", () => {
    expect(normalizeRepoInput("hono")).toBe("hono");
  });

  it("validates only complete repos", () => {
    expect(isValidRepo("honojs/hono")).toBe(true);
    expect(isValidRepo("hono")).toBe(false);
  });
});

describe("categorizeCommit — conventional commits", () => {
  it("maps feat: to feature and keeps the scope", () => {
    const e = categorizeCommit(commit("feat(api): add streaming"));
    expect(e.category).toBe("feature");
    expect(e.scope).toBe("api");
    expect(e.text).toBe("Add streaming");
  });

  it("treats a bang as breaking", () => {
    expect(categorizeCommit(commit("feat!: drop node 16")).category).toBe("breaking");
  });

  it("treats a BREAKING CHANGE footer as breaking and keeps the note", () => {
    const e = categorizeCommit(
      commit("feat: new config\n\nBREAKING CHANGE: config schema changed"),
    );
    expect(e.category).toBe("breaking");
    expect(e.breakingNote).toBe("config schema changed");
  });

  it("accepts the hyphenated BREAKING-CHANGE spelling", () => {
    expect(
      categorizeCommit(commit("feat: x\n\nBREAKING-CHANGE: gone")).category,
    ).toBe("breaking");
  });

  it("does NOT flag prose that merely mentions breaking changes", () => {
    // Regression: a case-insensitive match anywhere in the body used to flag
    // any commit describing its own work, inflating upgrade risk.
    const e = categorizeCommit(
      commit(
        "feat: add the loom score\n\nGrades hygiene (conventional commits, PR linkage, documented breaking changes) with a gauge.",
      ),
    );
    expect(e.category).toBe("feature");
    expect(e.breakingNote).toBeNull();
  });

  it("does not treat a mid-line mention as a footer", () => {
    expect(
      categorizeCommit(commit("fix: y\n\nsee BREAKING CHANGE: notes above"))
        .category,
    ).toBe("fix");
  });

  it("maps ci/build/chore to chore", () => {
    for (const p of ["ci", "build", "chore"]) {
      expect(categorizeCommit(commit(`${p}: bump runner`)).category).toBe("chore");
    }
  });

  it("extracts a trailing PR number", () => {
    expect(categorizeCommit(commit("fix: a bug (#482)")).prNumber).toBe(482);
  });

  it("marks plumbing vs ship audience", () => {
    expect(categorizeCommit(commit("feat: x")).audience).toBe("ship");
    expect(categorizeCommit(commit("chore: x")).audience).toBe("plumbing");
  });
});

describe("categorizeCommit — non-conventional heuristics", () => {
  // The differentiator vs git-cliff: real repos without a convention must not
  // collapse into one giant "Other" bucket.
  const cases: [string, string][] = [
    ["Fix crash on startup", "fix"],
    ["Add dark mode toggle", "feature"],
    ["Update the README typo", "docs"],
    ["Bump lodash from 4.17.20 to 4.17.21", "chore"],
    ["Refactor the router internals", "refactor"],
    ["Optimize bundle size", "perf"],
    ["Optimized the hot path", "perf"],
    ["Reorganized the modules", "refactor"],
    ["Add tests for the parser", "test"],
    ["Revert \"bad change\"", "fix"],
  ];

  it.each(cases)("categorizes %j as %s", (subject, expected) => {
    expect(categorizeCommit(commit(subject)).category).toBe(expected);
  });

  it("falls back to other for genuinely opaque subjects", () => {
    expect(categorizeCommit(commit("wip")).category).toBe("other");
  });
});

describe("categorizeCommit — authored changelog section", () => {
  it("prefers an explicit ## Changelog line over the derived subject", () => {
    const e = categorizeCommit(
      commit("fix: internal thing\n\n## Changelog\nDark mode no longer flickers"),
    );
    expect(e.text).toBe("Dark mode no longer flickers");
    expect(e.category).toBe("fix");
  });
});

describe("detectSecurity", () => {
  it.each([
    "fix: patch CVE-2024-51999",
    "security fix for the parser",
    "fix XSS in the renderer",
    "resolve prototype pollution",
    // Regression: prefix stems must match their inflections, not just the
    // bare stem — a trailing \b once made these silently unmatchable.
    "fix a vulnerability in the router",
    "security advisory for the parser",
    "sanitize user input",
    "patch a known exploitable path",
  ])("flags %j", (msg) => {
    expect(detectSecurity(msg)).toBe(true);
  });

  it("does not flag ordinary commits", () => {
    expect(detectSecurity("feat: add a button")).toBe(false);
  });
});

describe("detectDependency", () => {
  it("flags bot authors", () => {
    expect(detectDependency("anything", "dependabot[bot]")).toBe(true);
    expect(detectDependency("anything", "renovate[bot]")).toBe(true);
  });

  it("flags bump/lockfile subjects", () => {
    expect(detectDependency("bump zod from 3.22.0 to 3.23.0", "human")).toBe(true);
    expect(detectDependency("chore: update pnpm-lock.yaml", "human")).toBe(true);
  });

  it("leaves feature work alone", () => {
    expect(detectDependency("feat: add caching", "human")).toBe(false);
  });
});

describe("isNoise", () => {
  it("drops merge commits", () => {
    expect(isNoise(commit("Merge pull request #12 from x/y"))).toBe(true);
    expect(isNoise(commit("Merge branch 'main'"))).toBe(true);
  });

  it("keeps real commits", () => {
    expect(isNoise(commit("feat: real work"))).toBe(false);
  });
});

describe("releaseCodename", () => {
  it("is deterministic for the same inputs", () => {
    expect(releaseCodename("feature", "v1.2.3")).toBe(
      releaseCodename("feature", "v1.2.3"),
    );
  });

  it("always produces two real words (no undefined)", () => {
    for (const seed of ["v1.0.0", "v99.99.99", "", "zzz", "a"]) {
      for (const cat of ["breaking", "feature", "fix", "perf", "docs", "other"]) {
        const name = releaseCodename(cat, seed);
        expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
        expect(name).not.toContain("undefined");
      }
    }
  });
});

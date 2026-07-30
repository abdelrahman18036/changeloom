import { describe, expect, it } from "vitest";
import { computeLoomScore } from "./score";
import type { ChangelogEntry } from "./types";

function entry(over: Partial<ChangelogEntry> = {}): ChangelogEntry {
  return {
    text: "Something",
    category: "feature",
    audience: "ship",
    sha: "abc1234def",
    shortSha: "abc1234",
    prNumber: 1,
    scope: "api",
    author: "octocat",
    avatarUrl: null,
    breakingNote: null,
    isSecurity: false,
    isDependency: false,
    date: "2026-07-01T00:00:00Z",
    ...over,
  };
}

describe("computeLoomScore", () => {
  it("gives a perfect repo an A+", () => {
    const entries = [entry(), entry(), entry()];
    const subjects = ["feat(api): a", "fix(api): b", "feat(api): c"];
    const s = computeLoomScore(entries, subjects);
    expect(s.score).toBe(100);
    expect(s.grade).toBe("A+");
  });

  it("fails a repo with no convention, no PRs and no scopes", () => {
    const entries = [
      entry({ prNumber: null, scope: null }),
      entry({ prNumber: null, scope: null }),
    ];
    const s = computeLoomScore(entries, ["did stuff", "more stuff"]);
    // 20, not 0: breakingDocs (weight .2) is vacuously satisfied because the
    // range has no breaking changes to leave undocumented.
    expect(s.score).toBe(20);
    expect(s.grade).toBe("F");
  });

  it("does not punish a range that simply has no breaking changes", () => {
    // breakingDocs is vacuously satisfied when there is nothing to document.
    const s = computeLoomScore([entry()], ["feat(api): a"]);
    const factor = s.factors.find((f) => f.key === "breakingDocs")!;
    expect(factor.value).toBe(1);
  });

  it("punishes undocumented breaking changes", () => {
    const entries = [
      entry({ category: "breaking", breakingNote: null }),
      entry({ category: "breaking", breakingNote: "explained" }),
    ];
    const s = computeLoomScore(entries, ["feat!: a", "feat!: b"]);
    expect(s.factors.find((f) => f.key === "breakingDocs")!.value).toBe(0.5);
  });

  it("weights sum to 1 so the score is a true percentage", () => {
    const s = computeLoomScore([entry()], ["feat: a"]);
    const total = s.factors.reduce((n, f) => n + f.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it("never divides by zero on an empty range", () => {
    const s = computeLoomScore([], []);
    expect(Number.isFinite(s.score)).toBe(true);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
  });

  it("clamps the score into 0..100 and always yields a grade", () => {
    const s = computeLoomScore([entry()], ["feat(api): a"]);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
    expect(["A+", "A", "B", "C", "D", "F"]).toContain(s.grade);
  });
});

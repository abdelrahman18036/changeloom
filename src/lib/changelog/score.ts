import type { ChangelogEntry } from "./types";

export type LoomGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export interface LoomScoreFactor {
  key: "conventional" | "prLinkage" | "scopes" | "breakingDocs";
  label: string;
  /** 0..1 */
  value: number;
  /** contribution weight, sums to 1 */
  weight: number;
  hint: string;
}

export interface LoomScore {
  /** 0..100 */
  score: number;
  grade: LoomGrade;
  factors: LoomScoreFactor[];
}

const CONVENTIONAL_RE = /^(\w+)(\([^)]+\))?!?:\s/;

function grade(score: number): LoomGrade {
  if (score >= 95) return "A+";
  if (score >= 88) return "A";
  if (score >= 72) return "B";
  if (score >= 55) return "C";
  if (score >= 35) return "D";
  return "F";
}

/**
 * The Loom Score — a 0–100 grade of a range's changelog hygiene. Measures how
 * "weavable" the history is: conventional-commit adoption, PR linkage, scope
 * usage, and whether breaking changes come with explanations. Deterministic,
 * derived entirely from data already fetched.
 */
export function computeLoomScore(
  entries: ChangelogEntry[],
  rawSubjects: string[],
): LoomScore {
  const total = Math.max(1, entries.length);

  const conventional =
    rawSubjects.filter((s) => CONVENTIONAL_RE.test(s)).length /
    Math.max(1, rawSubjects.length);

  const prLinkage = entries.filter((e) => e.prNumber !== null).length / total;

  const scopes = entries.filter((e) => e.scope !== null).length / total;

  const breaking = entries.filter((e) => e.category === "breaking");
  const breakingDocs =
    breaking.length === 0
      ? 1
      : breaking.filter((e) => e.breakingNote !== null).length / breaking.length;

  const factors: LoomScoreFactor[] = [
    {
      key: "conventional",
      label: "Conventional commits",
      value: conventional,
      weight: 0.4,
      hint: "commits following the feat:/fix:/… convention",
    },
    {
      key: "prLinkage",
      label: "PR linkage",
      value: prLinkage,
      weight: 0.25,
      hint: "entries traceable to a pull request",
    },
    {
      key: "scopes",
      label: "Scoped changes",
      value: scopes,
      weight: 0.15,
      hint: "entries naming the area they touch",
    },
    {
      key: "breakingDocs",
      label: "Breaking changes explained",
      value: breakingDocs,
      weight: 0.2,
      hint: "breaking entries with a BREAKING CHANGE note",
    },
  ];

  const score = Math.round(
    factors.reduce((sum, f) => sum + f.value * f.weight, 0) * 100,
  );

  return { score, grade: grade(score), factors };
}

import { ExternalLink, GitFork, Lock, Scale, Star } from "lucide-react";
import type { ChangelogResult } from "@/lib/changelog/types";
import { GithubIcon } from "@/components/logo";

function compact(n: number): string {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function VitalSigns({ result }: { result: ChangelogResult }) {
  const v = result.vitals;
  const repoUrl = `https://github.com/${result.repo}`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <GithubIcon className="size-4 text-muted-foreground" />
          <span className="font-mono">{result.repo}</span>
          <ExternalLink className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
        {v?.isPrivate && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cat-fix/30 bg-cat-fix/10 px-2 py-0.5 text-xs font-medium text-cat-fix">
            <Lock className="size-3" /> Private
          </span>
        )}
      </div>

      {v?.description && (
        <p className="max-w-2xl text-sm text-muted-foreground">{v.description}</p>
      )}

      {v && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" /> {compact(v.stars)}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="size-3.5" /> {compact(v.forks)}
          </span>
          {v.language && (
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary" />
              {v.language}
            </span>
          )}
          {v.license && (
            <span className="inline-flex items-center gap-1">
              <Scale className="size-3.5" /> {v.license}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

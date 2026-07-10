import { GithubIcon, LoomMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoomMark className="size-4 text-muted-foreground" />
          <span>
            Changeloom — open source under MIT. No accounts, no tracking.
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-4" />
          Source
        </a>
      </div>
    </footer>
  );
}

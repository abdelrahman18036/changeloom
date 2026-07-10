import { GithubIcon, LoomMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-start">
          <div className="flex items-center gap-2.5">
            <LoomMark className="size-5 text-muted-foreground" />
            <span>
              Change<span className="font-display italic">loom</span> — MIT
              licensed. No accounts, no tracking.
            </span>
          </div>
          <span className="text-xs text-muted-foreground/80">
            Created by{" "}
            <a
              href="https://www.abdorange.me/"
              target="_blank"
              rel="noreferrer"
              className="text-primary transition-colors hover:underline"
            >
              abdorange
            </a>
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <a
            href="https://github.com/abdelrahman18036/changeloom"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            Source
          </a>
          <a
            href="https://github.com/abdelrahman18036/changeloom/issues"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Issues
          </a>
        </div>
      </div>
    </footer>
  );
}

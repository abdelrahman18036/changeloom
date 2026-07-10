import { GithubIcon, Wordmark } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <a href="/" className="transition-opacity hover:opacity-80">
          <Wordmark />
        </a>
        <nav className="flex items-center gap-1 text-sm">
          <a
            href="https://github.com/abdelrahman18036/changeloom"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

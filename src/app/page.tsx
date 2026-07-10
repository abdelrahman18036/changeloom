import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChangeloomApp } from "@/components/app/changeloom-app";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ChangeloomApp />
      </main>
      <SiteFooter />
    </div>
  );
}

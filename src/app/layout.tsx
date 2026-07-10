import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Editorial accent for display type only — the "woven" word in the hero. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://changeloom.vercel.app"),
  title: {
    default: "Changeloom — Paste a repo URL, get a changelog",
    template: "%s · Changeloom",
  },
  description:
    "Weave your commits into a clean, categorized changelog. Paste any public GitHub repo URL — no install, no config, no account.",
  keywords: [
    "changelog generator",
    "github changelog",
    "release notes",
    "open source",
    "conventional commits",
  ],
  openGraph: {
    title: "Changeloom — Paste a repo URL, get a changelog",
    description:
      "Weave your commits into a clean, categorized changelog. No install, no config, no account.",
    url: "https://changeloom.vercel.app",
    siteName: "Changeloom",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

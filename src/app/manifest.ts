import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Changeloom",
    short_name: "Changeloom",
    description: "Paste a repo URL, get a changelog.",
    start_url: "/",
    display: "standalone",
    background_color: "#12161d",
    theme_color: "#12161d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

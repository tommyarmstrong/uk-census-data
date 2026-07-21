import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UK Census Data",
    short_name: "UK Census",
    description:
      "Explore UK Census 2021 statistics by topic and region via NOMIS.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#212121",
    lang: "en-GB",
    categories: ["education", "government", "reference"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

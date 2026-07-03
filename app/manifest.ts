import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Legacy 83 Business Inc | Business Growth & Transformation",
    short_name: "Legacy 83",
    description:
      "We help businesses grow, optimize operations, and achieve strategic goals through expert consulting, technology, and business development solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#37ca37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/legacy83Logo.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
    categories: ["business", "productivity"],
    lang: "en-US",
    dir: "ltr",
  };
}

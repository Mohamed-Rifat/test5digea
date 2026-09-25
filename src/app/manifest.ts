import type { MetadataRoute } from "next";

import {
  BACKGROUND_COLOR,
  SITE_DESCRIPTION_AR,
  SITE_NAME,
  SITE_TITLE_AR,
  THEME_COLOR,
} from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE_AR,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION_AR,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "ar",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    categories: ["lifestyle", "shopping", "events"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

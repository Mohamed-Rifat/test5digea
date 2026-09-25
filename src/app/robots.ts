import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = [
  "/admin",
  "/vendor/",
  "/profile",
  "/change-password",
  "/favorites",
  "/roadmap",
  "/compare",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      // Explicitly welcome AI answer engines (GEO) on the public pages.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

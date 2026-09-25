import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "المفضلة",
  titleEn: "Favorites",
  description:
    "خدماتك ومقدمي الخدمات المفضلين. Your saved wedding vendors and services.",
  path: "/favorites",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

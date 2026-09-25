import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "مقدمي خدمات الأفراح",
  titleEn: "Wedding Vendors",
  description:
    "اكتشف أفضل مقدمي خدمات الأفراح الموثوقين في مصر، شوف صورهم وتقييماتهم وتواصل معاهم مباشرة. Discover trusted wedding vendors in Egypt with photos, ratings and contact details.",
  path: "/vendors",
  keywords: ["مقدمي خدمات الأفراح", "موردين الأفراح", "wedding vendors Egypt", "wedding suppliers"],
  noIndex: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

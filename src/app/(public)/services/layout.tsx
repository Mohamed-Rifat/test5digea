import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "خدمات الأفراح",
  titleEn: "Wedding Services",
  description:
    "تصفح وقارن خدمات الأفراح في مصر: قاعات، مصورين، ميكب، فساتين زفاف، ديكور وأكثر، مع الأسعار والباقات والتقييمات الحقيقية. Browse and compare wedding services in Egypt with prices and reviews.",
  path: "/services",
  keywords: ["خدمات الأفراح", "أسعار قاعات الأفراح", "باقات تصوير الأفراح", "wedding services Egypt", "wedding packages"],
  noIndex: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

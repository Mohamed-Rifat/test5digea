import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "مقارنة الخدمات",
  titleEn: "Compare Services",
  description:
    "قارن خدمات الأفراح جنب بعض: الأسعار والباقات والتقييمات. Compare wedding services side by side.",
  path: "/compare",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

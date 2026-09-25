import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "عن 5Digea",
  titleEn: "About Us",
  description:
    "تعرّف على 5Digea، المنصة المصرية اللي بتجمع العرسان مع أفضل مقدمي خدمات الأفراح وبتسهّل تخطيط الفرح من أول خطوة ليوم الفرح. Learn about 5Digea, Egypt's wedding planning platform.",
  path: "/about",
  noIndex: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

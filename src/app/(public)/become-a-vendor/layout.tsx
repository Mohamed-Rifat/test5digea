import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "انضم كمقدم خدمة",
  titleEn: "Become a Vendor",
  description:
    "سجّل نشاطك في 5Digea ووصل لآلاف العرسان اللي بيخططوا لفرحهم في مصر. List your wedding business on 5Digea and reach couples planning their wedding.",
  path: "/become-a-vendor",
  keywords: [
    "تسجيل مقدم خدمة أفراح",
    "إعلان قاعة أفراح",
    "list wedding business",
  ],
  noIndex: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

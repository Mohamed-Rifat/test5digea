import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "خطة الفرح",
  titleEn: "Wedding Roadmap",
  description:
    "خطة فرحك خطوة بخطوة مع عدّاد تنازلي لليوم الكبير. Your step-by-step wedding roadmap.",
  path: "/roadmap",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

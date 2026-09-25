import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "إنشاء حساب",
  titleEn: "Create Account",
  description:
    "أنشئ حسابك المجاني في 5Digea وابدأ تخطيط فرحك. Create your free 5Digea account.",
  path: "/register",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

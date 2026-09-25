import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تسجيل الدخول",
  titleEn: "Sign In",
  description:
    "سجّل دخولك إلى 5Digea لمتابعة خطة فرحك ومفضلتك. Sign in to 5Digea.",
  path: "/login",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "نسيت كلمة المرور",
  titleEn: "Forgot Password",
  description:
    "استعادة كلمة المرور. Reset your password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

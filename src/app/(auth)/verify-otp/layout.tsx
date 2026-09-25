import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تأكيد الرمز",
  titleEn: "Verify Code",
  description:
    "تأكيد رمز التحقق. Verify your code.",
  path: "/verify-otp",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

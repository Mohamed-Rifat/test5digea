import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تعيين كلمة مرور جديدة",
  titleEn: "Reset Password",
  description:
    "تعيين كلمة مرور جديدة. Set a new password.",
  path: "/reset-password",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تغيير كلمة المرور",
  titleEn: "Change Password",
  description: "تغيير كلمة مرور حسابك. Change your account password.",
  path: "/change-password",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

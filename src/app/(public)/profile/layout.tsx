import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "حسابي",
  titleEn: "My Profile",
  description:
    "إدارة بيانات حسابك في 5Digea. Manage your 5Digea account.",
  path: "/profile",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

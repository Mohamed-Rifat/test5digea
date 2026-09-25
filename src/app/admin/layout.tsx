import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import { SITE_NAME } from "@/lib/site";

// Dashboards are private: keep them out of search engines.
export const metadata: Metadata = {
  title: {
    default: "لوحة الإدارة",
    template: `%s | لوحة الإدارة | ${SITE_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}

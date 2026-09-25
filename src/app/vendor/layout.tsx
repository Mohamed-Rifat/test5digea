import type { Metadata } from "next";

import VendorShell from "@/components/vendor/VendorShell";
import { SITE_NAME } from "@/lib/site";

// Dashboards are private: keep them out of search engines.
export const metadata: Metadata = {
  title: {
    default: "لوحة مقدم الخدمة",
    template: `%s | لوحة مقدم الخدمة | ${SITE_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <VendorShell>{children}</VendorShell>;
}

import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تواصل معانا",
  titleEn: "Contact Us",
  description:
    "تواصل مع فريق 5Digea للاستفسارات أو الدعم أو الشراكات، بالعربي والإنجليزي. Contact the 5Digea team for questions, support or partnerships.",
  path: "/contact",
  noIndex: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

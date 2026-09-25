import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import ar from "@/locales/ar/support";
import en from "@/locales/en/support";

export const metadata: Metadata = buildMetadata({
  title: "مركز المساعدة",
  titleEn: "Help Center",
  description:
    "مركز مساعدة 5Digea: إجابات الأسئلة الشائعة وطرق التواصل مع الدعم للعرسان ومقدمي الخدمات. 5Digea help center with FAQs and support contacts.",
  path: "/support",
  noIndex: false,
});

const faqs = (["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const).flatMap(
  (key) => [
    { q: ar.faq.items[key].q, a: ar.faq.items[key].a },
    { q: en.faq.items[key].q, a: en.faq.items[key].a },
  ],
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      {children}
    </>
  );
}

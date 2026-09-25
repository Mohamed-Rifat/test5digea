"use client";

import { ChevronRight, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

import { FAQ_KEYS } from "@/components/support/hub/supportConfig";

/** Frequently asked questions. */
export function SupportFaq() {
  const { t } = useLanguage();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mt-6 scroll-mt-24 rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-[#a47e43]" aria-hidden="true" />
        <h2
          id="faq-title"
          className="text-base font-semibold text-[#30251f] sm:text-lg"
        >
          {t("support.faq.title")}
        </h2>
      </div>
      <p className="mt-1 text-xs text-[#756b65] sm:text-sm">
        {t("support.faq.subtitle")}
      </p>

      <div className="mt-4 divide-y divide-[#f0eae5]">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="group py-3 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-semibold text-[#30251f] sm:text-[15px]">
              <span>{t(`support.faq.items.${key}.q` as TranslationKey)}</span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-[#a47e43] transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-2 text-sm leading-7 text-[#5f544d]">
              {t(`support.faq.items.${key}.a` as TranslationKey)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

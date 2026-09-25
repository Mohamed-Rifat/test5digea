"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Page title and subtitle. */
export function MessagesHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7d]">
          {t("admin.messages.eyebrow")}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
          {t("admin.messages.title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8a7d75]">
          {t("admin.messages.subtitle")}
        </p>
      </div>
    </div>
  );
}

"use client";

import { CalendarDays } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales";

export default function DashboardHeader() {
  const { t, language } = useLanguage();

  return (
    <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7d]">
          {t('admin.dashboard.overview')}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
          {t('admin.dashboard.title')}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8a7d75]">
          {t('admin.dashboard.overviewDesc')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#e8dfd9] bg-white px-4 py-2.5 text-sm font-medium text-[#665951] shadow-sm">
          <CalendarDays size={16} />
          <span>{new Intl.DateTimeFormat(LANGUAGE_DATE_LOCALE[language], { month: 'long', year: 'numeric' }).format(new Date())}</span>
        </div>
      </div>
    </div>
  );
}

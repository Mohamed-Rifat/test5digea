"use client";

import { CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function DoneSectionHeading({ count }: { count: number }) {
  const { t } = useLanguage();

  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
        <CheckCircle2 size={18} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-lg font-bold text-[#30251f]">
          {t("roadmap.doneSection.title")}{" "}
          <span className="text-sm font-semibold text-[#8b7e76]">
            ({count})
          </span>
        </h3>
        <p className="text-sm text-[#8b7e76]">
          {t("roadmap.doneSection.sub")}
        </p>
      </div>
    </div>
  );
}

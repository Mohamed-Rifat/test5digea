"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { CompareData } from "./useCompareData";

/** Back button + "clear all". */
export function CompareTopBar({ data }: { data: CompareData }) {
  const { t } = useLanguage();
  const { router, selected, clearAll, isServiceComparison } = data;

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <ArrowLeft
              size={15}
              className="transition group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
            />
            {t("common.back")}
          </button>

          {isServiceComparison && selected.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearAll();
                router.replace("/services");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#fef2f2] hover:text-[#b91c1c]"
            >
              <Trash2 size={14} />
              {t("compare.clearAll")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

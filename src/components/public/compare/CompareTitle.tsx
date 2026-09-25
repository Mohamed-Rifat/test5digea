"use client";

import { GitCompare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { CompareData } from "./useCompareData";

/** Title + "show only differences" switch. */
export function CompareTitle({ data }: { data: CompareData }) {
  const { t } = useLanguage();
  const {
    loading,
    error,
    showOnlyDiff,
    setShowOnlyDiff,
    isServiceComparison,
    items,
  } = data;

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <GitCompare size={18} className="text-[#111827]" />
          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#111827]">
            {isServiceComparison
              ? t("compare.titleServices")
              : t("compare.titleVendors")}
          </h1>
        </div>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          {t("compare.description")}
        </p>
      </div>

      {!loading && !error && items.length >= 2 && (
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-[#374151]">
            <button
              type="button"
              role="switch"
              aria-checked={showOnlyDiff}
              onClick={() => setShowOnlyDiff((v) => !v)}
              className={`relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full transition-colors ${
                showOnlyDiff ? "bg-[#111827]" : "bg-[#d1d5db]"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                  showOnlyDiff ? "translate-x-[15px]" : "translate-x-[2px]"
                }`}
              />
            </button>
            {t("compare.showOnlyDifferences")}
          </label>
        </div>
      )}
    </div>
  );
}

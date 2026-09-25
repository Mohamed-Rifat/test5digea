"use client";

import Link from "next/link";
import { Info, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Help footer shown when categories exist. */
export function CategoriesFooter({
  page,
}: {
  page: VendorCategoriesPageState;
}) {
  const { t } = useLanguage();
  const { sortedCategories, loading } = page;

  return (
    <>
      {!loading && sortedCategories.length > 0 && (
        <div className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                <Info size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#40342e] sm:text-sm">
                  {t("vendor.categories.needUpdateTitle")}
                </p>
                <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                  {t("vendor.categories.needUpdateText")}
                </p>
              </div>
            </div>

            <Link
              href="/vendor/support"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {t("vendor.categories.contactSupport")}
              <ChevronRight
                size={14}
                className="sm:h-4 sm:w-4 rtl:rotate-180"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

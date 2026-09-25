"use client";

import { useLanguage } from "@/context/LanguageContext";

import { VENDOR_STATUS } from "./categoriesConfig";
import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Assigned / available counters. */
export function CategoriesStats({ page }: { page: VendorCategoriesPageState }) {
  const { t } = useLanguage();
  const { stats, sortedCategories, vendor, loading } = page;

  return (
    <>
      {!loading && sortedCategories.length > 0 && (
        <section className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 lg:gap-4">
          <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#8d8077] sm:text-xs">
              {t("vendor.categories.totalTitle")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#30251f] sm:mt-2 sm:text-3xl">
              {stats.total}
            </p>
            <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
              {t("vendor.categories.totalSub")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#8d8077] sm:text-xs">
              {t("vendor.categories.statusTitle")}
            </p>
            <div className="mt-1.5 flex items-center gap-2 sm:mt-2">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${(VENDOR_STATUS[vendor?.status ?? ""] ?? VENDOR_STATUS.Pending).dot}`}
              />
              <span className="text-sm font-semibold text-[#30251f] sm:text-base">
                {t(
                  (VENDOR_STATUS[vendor?.status ?? ""] ?? VENDOR_STATUS.Pending)
                    .labelKey,
                )}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
              {vendor?.businessName || t("vendor.categories.fallbackBusiness")}
            </p>
          </div>
        </section>
      )}
    </>
  );
}

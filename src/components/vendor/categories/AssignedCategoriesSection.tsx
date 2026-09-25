"use client";

import { Tags, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Categories the vendor is assigned to. */
export function AssignedCategoriesSection({
  page,
}: {
  page: VendorCategoriesPageState;
}) {
  const { t, localize } = useLanguage();
  const { handleRefresh, sortedCategories, loading } = page;

  return (
    <section className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 lg:p-8">
      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded-xl bg-[#f3ebe6] sm:h-12"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      ) : sortedCategories.length === 0 ? (
        <div className="py-8 text-center sm:py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-16 sm:w-16">
            <Tags size={24} strokeWidth={1.7} className="sm:h-7 sm:w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#40342e] sm:mt-5 sm:text-base">
            {t("vendor.categories.emptyTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b817a] sm:text-sm sm:leading-6">
            {t("vendor.categories.emptyText")}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
          >
            <RefreshCw size={14} />
            {t("vendor.categories.checkAgain")}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">
              {t("vendor.categories.yourCategories")}
            </h2>
            <span className="text-[10px] text-[#9b8f86] sm:text-xs">
              {t(
                sortedCategories.length === 1
                  ? "vendor.categories.countOne"
                  : "vendor.categories.countMany",
                { count: sortedCategories.length },
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {sortedCategories.map((name) => (
              <span
                key={name}
                className="group inline-flex items-center gap-1.5 rounded-full border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-1.5 text-xs font-medium text-[#40352f] transition-all hover:border-[#a47e43] hover:bg-[#fbf6f1] hover:shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Tags className="h-3 w-3 text-[#a47e43] transition-transform group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
                {localize(name)}
                <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                  <ChevronRight size={12} className="text-[#a47e43]" />
                </span>
              </span>
            ))}
          </div>

          {sortedCategories.length > 6 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#fbf6f1] px-3 py-2 text-[10px] text-[#8b817a] sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs">
              <AlertCircle
                size={13}
                className="text-[#a47e43] sm:h-3.75 sm:w-3.75"
              />
              <span>
                {t("vendor.categories.showingAll", {
                  count: sortedCategories.length,
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

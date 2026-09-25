"use client";

import { AlertCircle, Check, CheckCircle2, Loader2, Save } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

import type { AdminVendorDetails } from "./useAdminVendorDetails";

/** Assign categories to the vendor. */
export function VendorCategoriesSection({
  details,
}: {
  vendor: Vendor;
  details: AdminVendorDetails;
}) {
  const { t, localize } = useLanguage();
  const {
    highlightCategoryId,
    hasAppliedHighlight,
    categoriesSectionRef,
    categories,
    selectedCategoryIds,
    savingCategories,
    categoriesError,
    categoriesSuccess,
    toggleCategory,
    handleSaveCategories,
  } = details;

  return (
    <section
      ref={categoriesSectionRef}
      className="mt-5 rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#30251f]">
            {t("admin.vendorDetails.categories.title")}
          </h2>

          <p className="mt-1 text-sm text-[#9b918b]">
            {t("admin.vendorDetails.categories.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveCategories}
          disabled={savingCategories || categories.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#40332c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingCategories ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("admin.vendorDetails.categories.saving")}
            </>
          ) : (
            <>
              <Save size={16} />
              {t("admin.vendorDetails.categories.save")}
            </>
          )}
        </button>
      </div>

      {/* Requested-category banner (deep link from the messages inbox) */}
      {highlightCategoryId && hasAppliedHighlight && !categoriesSuccess && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#e6cfa1] bg-[#fdf6e8] p-3 text-sm text-[#8a6a2a] sm:flex-row sm:items-center sm:justify-between">
          <span>
            {t("admin.vendorDetails.categories.requestedNotice", {
              category:
                categories.find(
                  (category) => category.id === highlightCategoryId,
                )?.name ?? "",
            })}
          </span>
          <button
            type="button"
            onClick={handleSaveCategories}
            disabled={savingCategories}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#a47e43] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#8f6b37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingCategories ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            {t("admin.vendorDetails.categories.activateNow")}
          </button>
        </div>
      )}

      {/* Error */}
      {categoriesError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} />
          {categoriesError}
        </div>
      )}

      {/* Success */}
      {categoriesSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          {categoriesSuccess}
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const selected = selectedCategoryIds.includes(category.id);
            const isRequested = category.id === highlightCategoryId;

            return (
              <label
                key={category.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  isRequested
                    ? "border-[#a47e43] bg-[#fdf6e8] ring-2 ring-[#e6cfa1]"
                    : selected
                      ? "border-[#8b7464] bg-[#faf7f5]"
                      : "border-[#eee8e4] bg-[#fdfcfb] hover:border-[#d8ccc4]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 accent-[#8b7464]"
                />

                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-[#403630]">
                    {localize(category.name)}
                    {isRequested && (
                      <span className="rounded-full bg-[#a47e43] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        {t("admin.vendorDetails.categories.requestedBadge")}
                      </span>
                    )}
                  </p>

                  {category.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#9b918b]">
                      {localize(category.description)}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-[#e3d9d2] p-6 text-center">
          <p className="text-sm text-[#9b918b]">
            {t("admin.vendorDetails.categories.none")}
          </p>
        </div>
      )}
    </section>
  );
}

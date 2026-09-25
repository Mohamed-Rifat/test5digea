"use client";

import { AlertCircle, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { Category } from "@/types/category";

interface CategoryPickerProps {
  categories: Category[];
  loading: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
  showError: boolean;
}

/** Multi-select category chips. */
export function CategoryPicker({
  categories: activeCategories,
  loading: categoriesLoading,
  selectedIds: selectedCategoryIds,
  onToggle: toggleCategory,
  showError,
}: CategoryPickerProps) {
  const { t, localize } = useLanguage();

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#493b32]">
            {t("becomeVendor.fields.categories.label")}
            <span className="ml-1 text-[#b77b70]">*</span>
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#9a8f87]">
            {t("becomeVendor.fields.categories.helper")}
          </p>
        </div>

        {selectedCategoryIds.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#f5efe7] px-2.5 py-1 text-[9px] font-semibold text-[#8e7044]">
            {t("becomeVendor.fields.categories.selectedCount", {
              count: selectedCategoryIds.length,
            })}
          </span>
        )}
      </div>

      {categoriesLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-10 animate-pulse rounded-xl bg-[#f7f3ef]"
            />
          ))}
        </div>
      ) : activeCategories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e4dbd3] bg-[#faf7f4] px-4 py-6 text-center text-xs text-[#9a8f87]">
          {t("becomeVendor.fields.categories.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {activeCategories.map((category) => {
            const selected = selectedCategoryIds.includes(category.id);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-pressed={selected}
                className={`group flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] font-medium transition-all duration-200 ${
                  selected
                    ? "border-[#30251f] bg-[#30251f] text-white shadow-[0_5px_15px_rgba(48,37,31,0.12)]"
                    : "border-[#e7ded7] bg-[#fcfaf8] text-[#5f544d] hover:-translate-y-0.5 hover:border-[#c8ab79] hover:bg-white hover:shadow-sm"
                }`}
              >
                <span className="min-w-0 truncate">
                  {localize(category.name)}
                </span>

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-[#ded4cc] bg-white text-transparent group-hover:border-[#c8ab79]"
                  }`}
                >
                  <Check size={11} strokeWidth={2.5} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {showError &&
        selectedCategoryIds.length === 0 &&
        !categoriesLoading &&
        activeCategories.length > 0 && (
          <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
            <AlertCircle size={11} />
            {t("becomeVendor.fields.categories.error")}
          </p>
        )}
    </div>
  );
}

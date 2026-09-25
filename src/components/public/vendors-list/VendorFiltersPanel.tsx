"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SlidersHorizontal, X, MapPin, Star, Tag, Check } from "lucide-react";
import GovernorateSelect from "@/components/shared/GovernorateSelect";

import type { VendorsListState } from "./useVendorsList";

/** Category / location / rating filters dropdown. */
export function VendorFiltersPanel({ state }: { state: VendorsListState }) {
  const { t, localize } = useLanguage();
  const {
    categoryId,
    governorate,
    setGovernorate,
    minRating,
    setMinRating,
    setPage,
    setFiltersOpen,
    chooseCategory,
    clearAllFilters,
    activeFiltersCount,
    categories,
  } = state;

  return (
    <div className="relative z-30 mt-3 rounded-3xl border border-[#eee7e1] bg-white shadow-[0_24px_60px_-12px_rgba(48,37,31,0.18)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f1ece6] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9f1e9]">
            <SlidersHorizontal size={14} className="text-[#a47e43]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#30251f]">
              {t("vendors.list.refineTitle")}
            </p>
            <p className="text-[11px] text-[#9b8f86]">
              {t("vendors.list.refineSubtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          aria-label={t("vendors.list.closeFilters")}
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: Category */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-[#b99a62]" />
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                {t("vendors.list.category")}
              </label>
            </div>
            {categoryId && (
              <button
                type="button"
                onClick={() => chooseCategory("")}
                className="text-[11px] font-medium text-[#a47e43] transition hover:text-[#8c6a3c]"
              >
                {t("vendors.list.reset")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => chooseCategory("")}
              className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                !categoryId
                  ? "border-[#30251f] bg-[#30251f] text-white"
                  : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
              }`}
            >
              <span>{t("vendors.list.allCategories")}</span>
              {!categoryId && <Check size={12} />}
            </button>

            {categories.map((c) => {
              const active = categoryId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => chooseCategory(c.id)}
                  className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                    active
                      ? "border-[#a47e43] bg-[#f9f1e9] text-[#8c6a3c]"
                      : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                  }`}
                >
                  <span className="truncate">{localize(c.name)}</span>
                  {active && <Check size={12} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Location + Rating */}
        <div className="space-y-6">
          {/* Location */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={13} className="text-[#b99a62]" />
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                {t("vendors.list.location")}
              </label>
            </div>
            <GovernorateSelect
              value={governorate}
              onChange={(value) => {
                setPage(1);
                setGovernorate(value);
              }}
            />
          </div>

          {/* Rating */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Star size={13} className="text-[#b99a62]" />
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                {t("vendors.list.minimumRating")}
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "", label: t("vendors.list.anyRating") },
                { value: "3", label: "3+" },
                { value: "4", label: "4+" },
                { value: "4.5", label: "4.5+" },
              ].map((option) => {
                const active = minRating === option.value;
                return (
                  <button
                    key={option.value || "any"}
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setMinRating(option.value);
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[#a47e43] bg-[#a47e43] text-white"
                        : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                    }`}
                  >
                    {option.value && (
                      <Star
                        size={11}
                        className={
                          active
                            ? "fill-white text-white"
                            : "fill-[#e8c98a] text-[#e8c98a]"
                        }
                      />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-b-3xl border-t border-[#f1ece6] bg-[#faf7f4] px-6 py-4">
        <button
          type="button"
          onClick={clearAllFilters}
          disabled={activeFiltersCount === 0}
          className="text-xs font-semibold text-[#8c6a3c] transition hover:text-[#30251f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("vendors.list.clearAllFilters")}
        </button>

        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="rounded-full bg-[#30251f] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#42332a]"
        >
          {t("vendors.list.showResults")}
        </button>
      </div>
    </div>
  );
}

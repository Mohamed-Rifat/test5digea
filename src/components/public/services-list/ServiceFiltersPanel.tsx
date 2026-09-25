"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  SlidersHorizontal,
  X,
  Tag,
  Check,
  Banknote,
  ArrowUpDown,
} from "lucide-react";

import { TextField } from "@/components/ui";
import type { TranslationKey } from "@/locales";
import type { ServicesListState } from "./useServicesList";

// The API does not document what each sortBy value maps to beyond
// its existence (0, 1, 2). We expose these as a best-effort ordering.
const sortOptions: { value: number; labelKey: TranslationKey }[] = [
  { value: 0, labelKey: "services.list.sort.relevant" },
  { value: 1, labelKey: "services.list.sort.priceLow" },
  { value: 2, labelKey: "services.list.sort.priceHigh" },
];

/** Category / price / sort filters dropdown. */
export function ServiceFiltersPanel({ state }: { state: ServicesListState }) {
  const { t, localize } = useLanguage();
  const {
    categoryId,
    setCategoryId,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setPage,
    setFiltersOpen,
    clearAllFilters,
    activeFiltersCount,
    categories,
  } = state;

  return (
    <div className="relative z-30 mt-3 overflow-hidden rounded-3xl border border-[#eee7e1] bg-white shadow-[0_24px_60px_-12px_rgba(48,37,31,0.18)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f1ece6] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9f1e9]">
            <SlidersHorizontal size={14} className="text-[#a47e43]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#30251f]">
              {t("services.list.refineTitle")}
            </p>
            <p className="text-[11px] text-[#9b8f86]">
              {t("services.list.refineSubtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          aria-label={t("services.list.closeFilters")}
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
                {t("services.list.category")}
              </label>
            </div>
            {categoryId && (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setCategoryId("");
                }}
                className="text-[11px] font-medium text-[#a47e43] transition hover:text-[#8c6a3c]"
              >
                {t("services.list.reset")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryId("");
                setFiltersOpen(false);
              }}
              className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                !categoryId
                  ? "border-[#30251f] bg-[#30251f] text-white"
                  : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
              }`}
            >
              <span>{t("services.list.allCategories")}</span>
              {!categoryId && <Check size={12} />}
            </button>

            {categories.map((c) => {
              const active = categoryId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setCategoryId(c.id);
                    setFiltersOpen(false);
                  }}
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

        {/* RIGHT: Price + Sort */}
        <div className="space-y-6">
          {/* Price */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Banknote size={13} className="text-[#b99a62]" />
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                {t("services.list.priceRange")}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                type="number"
                min={0}
                label={t("services.list.minPrice")}
                value={minPrice}
                onChange={(e) => {
                  setPage(1);
                  setMinPrice(e.target.value);
                }}
                placeholder="0"
                size="sm"
              />
              <TextField
                type="number"
                min={0}
                label={t("services.list.maxPrice")}
                value={maxPrice}
                onChange={(e) => {
                  setPage(1);
                  setMaxPrice(e.target.value);
                }}
                placeholder={t("services.list.anyPrice")}
                size="sm"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ArrowUpDown size={13} className="text-[#b99a62]" />
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                {t("services.list.sortBy")}
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => {
                const active = sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setSortBy(option.value);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[#a47e43] bg-[#a47e43] text-white"
                        : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#f1ece6] bg-[#faf7f4] px-6 py-4">
        <button
          type="button"
          onClick={clearAllFilters}
          disabled={activeFiltersCount === 0}
          className="text-xs font-semibold text-[#8c6a3c] transition hover:text-[#30251f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("services.list.clearAllFilters")}
        </button>

        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="rounded-full bg-[#30251f] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#42332a]"
        >
          {t("services.list.showResults")}
        </button>
      </div>
    </div>
  );
}

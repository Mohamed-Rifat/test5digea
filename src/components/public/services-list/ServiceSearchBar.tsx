"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Search, SlidersHorizontal } from "lucide-react";

import { TextField } from "@/components/ui";
import { ServiceFiltersPanel } from "./ServiceFiltersPanel";
import type { ServicesListState } from "./useServicesList";

/** Search input + filters toggle + search button. */
export function ServiceSearchBar({ state }: { state: ServicesListState }) {
  const { t } = useLanguage();
  const {
    searchInput,
    setSearchInput,
    filtersOpen,
    setFiltersOpen,
    handleSearchSubmit,
    activeFiltersCount,
  } = state;

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="mt-7 grid gap-2.5 sm:mt-8 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
    >
      <TextField
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={t("services.list.searchPlaceholder")}
        aria-label={t("services.list.searchPlaceholder")}
        startIcon={<Search className="h-4 w-4" />}
        containerClassName="flex-1"
      />

      <button
        type="button"
        onClick={() => setFiltersOpen((v) => !v)}
        className={`relative flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
          filtersOpen
            ? "border-[#b99a62] bg-[#f9f1e9] text-[#8c6a3c]"
            : "border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#b99a62]"
        }`}
      >
        <SlidersHorizontal size={16} />
        {t("services.list.filters")}
        {activeFiltersCount > 0 && (
          <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#a47e43] text-[10px] font-bold text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <button
        type="submit"
        className="min-h-12 rounded-full bg-[#30251f] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#42332a]"
      >
        {t("services.list.search")}
      </button>
    </form>
  );
}

/** Search bar + the filters dropdown under it (closes on outside click). */
export function ServiceSearchArea({ state }: { state: ServicesListState }) {
  const { filtersRef, filtersOpen } = state;

  return (
    <div ref={filtersRef} className="relative">
      <ServiceSearchBar state={state} />
      {filtersOpen && <ServiceFiltersPanel state={state} />}
    </div>
  );
}

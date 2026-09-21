"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  GitCompare,
  X,
  Tag,
  Check,
  Banknote,
  ArrowUpDown,
} from "lucide-react";

import ServiceCard from "@/components/public/ServiceCard";
import Pagination from "@/components/shared/Pagination";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCompare } from "@/context/CompareContext";
import { searchServices } from "@/features/services/api";
import { FavoriteTargetType } from "@/types/favorite";
import type { TranslationKey } from "@/locales";
import type {
  SearchServicesParams,
  SearchServicesResponse,
} from "@/types/service";

const PAGE_SIZE = 12;

// The API does not document what each sortBy value maps to beyond
// its existence (0, 1, 2). We expose these as a best-effort ordering.
const sortOptions: { value: number; labelKey: TranslationKey }[] = [
  { value: 0, labelKey: "services.list.sort.relevant" },
  { value: 1, labelKey: "services.list.sort.priceLow" },
  { value: 2, labelKey: "services.list.sort.priceHigh" },
];

const priceInputClass =
  "w-full rounded-xl border border-[#eee7e1] bg-[#faf7f4] px-3 py-2.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#b0a69c] focus:border-[#b99a62] focus:bg-white focus:ring-4 focus:ring-[#b99a62]/10";

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { selected, isSelected, toggleService, clearAll } = useCompare();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sortBy, setSortBy] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  // Opened only by the user; a category coming from the URL is applied
  // without popping the panel open.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [result, setResult] = useState<SearchServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);

  const params: SearchServicesParams = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      page,
      pageSize: PAGE_SIZE,
    }),
    [searchTerm, categoryId, minPrice, maxPrice, sortBy, page]
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await searchServices(params);

      setResult(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.searchTerm,
    params.categoryId,
    params.minPrice,
    params.maxPrice,
    params.sortBy,
    params.page,
  ]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Keep the filters in sync when the URL changes while this page is already
  // mounted (e.g. picking another category or searching from the navbar).
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId") || "";
    const searchFromUrl = searchParams.get("search") || "";

    setCategoryId(categoryFromUrl);
    setSearchInput(searchFromUrl);
    setSearchTerm(searchFromUrl);
    setPage(1);
  }, [searchParams]);

  // Close the filters panel on outside click or Escape.
  useEffect(() => {
    if (!filtersOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [filtersOpen]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const clearAllFilters = () => {
    setPage(1);
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy(0);
    setSearchInput("");
    setSearchTerm("");
  };

  const activeFiltersCount =
    [categoryId, minPrice, maxPrice, searchTerm].filter(Boolean).length +
    (sortBy !== 0 ? 1 : 0);

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <main className="min-h-screen bg-[#faf8f6]">

      {/* Header */}
      <section className="relative overflow-visible border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto lg:max-w-10/12">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] rtl:tracking-normal text-[#9b8367]">
              {t("services.list.eyebrow")}
            </span>
          </div>

          <h1 className="max-w-3xl font-serif text-2xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
            {t("services.list.titlePrefix")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">{t("services.list.titleHighlight")}</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            {t("services.list.description")}
          </p>

          {/* Search bar + filters panel */}
          <div ref={filtersRef} className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className="mt-7 grid gap-2.5 sm:mt-8 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8f86]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("services.list.searchPlaceholder")}
                  className="w-full rounded-full border border-[#e4dbd0] bg-white py-3.5 ps-11 pe-4 text-sm text-[#30251f] outline-none transition focus:border-[#b99a62]"
                />
              </div>

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

            {/* ============ FILTERS PANEL ============ */}
            {filtersOpen && (
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
                            }}
                            className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                              active
                                ? "border-[#a47e43] bg-[#f9f1e9] text-[#8c6a3c]"
                                : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-[11px] font-medium text-[#9b8f86]">
                            {t("services.list.minPrice")}
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={(e) => {
                              setPage(1);
                              setMinPrice(e.target.value);
                            }}
                            placeholder="0"
                            className={priceInputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[11px] font-medium text-[#9b8f86]">
                            {t("services.list.maxPrice")}
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={(e) => {
                              setPage(1);
                              setMaxPrice(e.target.value);
                            }}
                            placeholder={t("services.list.anyPrice")}
                            className={priceInputClass}
                          />
                        </div>
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
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto lg:max-w-10/12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Compare bar */}
        {selected.length > 0 && (
          <div className="sticky bottom-3 z-20 mb-6 flex flex-col gap-3 rounded-2xl bg-[#30251f] px-4 py-3 text-white shadow-[0_16px_40px_rgba(48,37,31,0.22)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="text-sm">
              {selected.length > 1
                ? t("services.list.selectedMany", {
                    count: selected.length,
                    category: selected[0].categoryName,
                  })
                : t("services.list.selectedOne", {
                    count: selected.length,
                    category: selected[0].categoryName,
                  })}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:text-white"
              >
                {t("compare.clearAll")}
              </button>

              <Link
                href={
                  selected.length >= 2
                    ? `/compare?type=service&ids=${selected.map((s) => s.id).join(",")}&categoryId=${selected[0].categoryId}`
                    : "#"
                }
                aria-disabled={selected.length < 2}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
                  selected.length >= 2
                    ? "bg-white text-[#30251f]"
                    : "pointer-events-none bg-white/30 text-white/60"
                }`}
              >
                <GitCompare size={15} />
                {t("services.list.compareButton", { count: selected.length })}
              </Link>
            </div>
          </div>
        )}

        {/* Loading skeleton: a full page of cards, so the layout doesn't jump */}
        {loading && (
          <>
            <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#f0e8dd]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className={`h-100 animate-pulse rounded-2xl border border-[#eee7e1] bg-white ${
                    i >= 3 ? "hidden sm:block" : ""
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">
              {t("services.list.loadError")}
            </p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
            <p className="text-[#766d67]">
              {t("services.list.empty")}
            </p>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#42332a]"
              >
                {t("services.list.clearAllFilters")}
              </button>
            )}
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9b8f86]">
                {t("services.list.found", {
                  count: result?.totalCount ?? items.length,
                })}
              </p>

              {selectedCategory && (
                <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                  {selectedCategory.name}
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  favorited={isFavorited(FavoriteTargetType.Service, service.id)}
                  favoriteLoading={
                    actionLoading === `${FavoriteTargetType.Service}:${service.id}`
                  }
                  onToggleFavorite={toggleFavorite}
                  selected={isSelected(service.id)}
                  onSelect={(s) =>
                    toggleService({
                      id: s.id,
                      categoryId: s.categoryId,
                      categoryName: s.categoryName,
                      name: s.name,
                    })
                  }
                />
              ))}

              {/* Invisible placeholders that fill a short last page up to a
                  full page, so the pagination below never moves up. */}
              {totalPages > 1 &&
                Array.from({ length: Math.max(0, PAGE_SIZE - items.length) }).map(
                  (_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      aria-hidden="true"
                      className="pointer-events-none invisible hidden sm:block"
                    >
                      <ServiceCard service={items[0]} />
                    </div>
                  )
                )}
            </div>
          </>
        )}

        {/* Pagination: always at the bottom, in the same place */}
        {!error && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              disabled={loading}
            />
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitCompare,
} from "lucide-react";

import ServiceCard from "@/components/public/ServiceCard";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCompare } from "@/context/CompareContext";
import { searchServices } from "@/features/services/api";
import { FavoriteTargetType } from "@/types/favorite";
import type {
  SearchServicesParams,
  SearchServicesResponse,
} from "@/types/service";

const PAGE_SIZE = 12;

// The API does not document what each sortBy value maps to beyond
// its existence (0, 1, 2). We expose these as a best-effort ordering.
const sortOptions = [
  { value: 0, label: "Most Relevant" },
  { value: 1, label: "Price: Low to High" },
  { value: 2, label: "Price: High to Low" },
];

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { selected, isSelected, toggleService, clearAll } = useCompare();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sortBy, setSortBy] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(!!initialCategoryId);

  const [result, setResult] = useState<SearchServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);

      const data = await searchServices(params);

      setResult(data);
    } catch (err) {
      setError("We couldn't load services right now. Please try again.");
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

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <main className="min-h-screen bg-[#faf8f6]">

      {/* Header */}
      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Browse
            </span>
          </div>

          <h1 className="max-w-3xl font-serif text-2xl font-light leading-tight text-[#30251f] sm:text-4xl">
            Find the Perfect{" "}
            <span className="italic text-[#a47e43]">Wedding Services</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            Compare packages and pricing from trusted vendors across every
            category, all in one place.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-7 grid gap-2.5 sm:mt-8 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8f86]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search services, e.g. photography, catering..."
                className="w-full rounded-full border border-[#e4dbd0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#b99a62]"
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-3 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62]"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#30251f] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#42332a]"
            >
              Search
            </button>
          </form>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="mt-4 grid gap-4 rounded-2xl border border-[#eee7e1] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setPage(1);
                    setCategoryId(e.target.value);
                  }}
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Min Price
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
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Max Price
                </label>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => {
                    setPage(1);
                    setMaxPrice(e.target.value);
                  }}
                  placeholder="Any"
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setPage(1);
                    setSortBy(Number(e.target.value));
                  }}
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
            <p className="text-[#766d67]">
              No services match your search yet. Try different filters.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {selected.length > 0 && (
              <div className="sticky bottom-3 z-20 mb-6 flex flex-col gap-3 rounded-2xl bg-[#30251f] px-4 py-3 text-white shadow-[0_16px_40px_rgba(48,37,31,0.22)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <span className="text-sm">
                  {selected.length} {selected[0].categoryName} service
                  {selected.length > 1 ? "s" : ""} selected
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:text-white"
                  >
                    Clear All
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
                    Compare ({selected.length})
                  </Link>
                </div>
              </div>
            )}

            <p className="mb-6 text-sm text-[#9b8f86]">
              {result?.totalCount ?? items.length} services found
            </p>

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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-sm text-[#766d67]">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

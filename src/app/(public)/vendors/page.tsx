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
  X,
} from "lucide-react";

import VendorCard from "@/components/public/VendorCard";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToast } from "@/components/providers/ToastProvider";
import { searchVendorList } from "@/features/vendors/api";
import { FavoriteTargetType } from "@/types/favorite";
import type { VendorSearchParams, VendorSearchResponse } from "@/types/vendor";

const PAGE_SIZE = 12;
const MAX_COMPARE = 4;

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(!!initialCategoryId);
  const [selected, setSelected] = useState<string[]>([]);

  const [result, setResult] = useState<VendorSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params: VendorSearchParams = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      categoryId: categoryId || undefined,
      location: location || undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: 0,
      page,
      pageSize: PAGE_SIZE,
    }),
    [searchTerm, categoryId, location, minRating, page]
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchVendorList(params);

      setResult(data);
    } catch {
      setError("We couldn't load vendors right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    params.searchTerm,
    params.categoryId,
    params.location,
    params.minRating,
    params.page,
  ]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId") || "";
    const searchFromUrl = searchParams.get("search") || "";

    setCategoryId(categoryFromUrl);
    setFiltersOpen((prev) => prev || !!categoryFromUrl);

    if (searchFromUrl) {
      setSearchInput(searchFromUrl);
      setSearchTerm(searchFromUrl);
    }

    setPage(1);
  }, [searchParams]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const toggleSelected = (vendorId: string) => {
    setSelected((previous) => {
      if (previous.includes(vendorId)) {
        return previous.filter((id) => id !== vendorId);
      }

      if (!categoryId) {
        toast("Select a category before comparing vendors.", "error");
        return previous;
      }

      if (previous.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} vendors at once.`, "error");
        return previous;
      }

      return [...previous, vendorId];
    });
  };

  const clearAllFilters = () => {
    setPage(1);
    setCategoryId("");
    setLocation("");
    setMinRating("");
    setSearchInput("");
    setSearchTerm("");
    setSelected([]);
  };

  const activeFiltersCount = [categoryId, location, minRating, searchTerm].filter(
    Boolean
  ).length;

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden border-b border-[#eee7e1] bg-linear-to-b from-[#f8f5ef] to-[#faf8f6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b99a62]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#a47e43]/5 blur-3xl" />

        <div className="relative mx-auto lg:max-w-10/12">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b99a62]/15">
              <Sparkles className="h-3 w-3 text-[#b99a62]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9b8367]">
              Our Vendors
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-serif text-3xl font-light leading-tight text-[#30251f] sm:text-4xl lg:text-5xl">
            Trusted Vendors for{" "}
            <span className="italic text-[#a47e43]">Your Big Day</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67] sm:text-base">
            Discover approved wedding professionals, compare ratings and
            locations, and find the right fit for every part of your day.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8f86]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search vendors by name..."
                className="w-full rounded-full border border-[#e4dbd0] bg-white py-3.5 pl-12 pr-4 text-sm text-[#30251f] shadow-sm outline-none transition placeholder:text-[#b0a69c] focus:border-[#b99a62] focus:ring-4 focus:ring-[#b99a62]/10"
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
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#a47e43] text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#30251f] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42332a] hover:shadow-md"
            >
              Search
            </button>
          </form>

          {/* Filters Panel */}
          {filtersOpen && (
            <div className="mt-4 grid gap-5 rounded-2xl border border-[#eee7e1] bg-white p-5 shadow-sm sm:grid-cols-3">
              {/* Category */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9b8367]">
                    Category
                  </label>
                  {categoryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setCategoryId("");
                        setSelected([]);
                      }}
                      className="text-[10px] font-medium text-[#a47e43] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setCategoryId("");
                      setSelected([]);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      !categoryId
                        ? "bg-[#30251f] text-white shadow-sm"
                        : "bg-[#faf7f4] text-[#6f625a] hover:bg-[#f1e9e3]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setCategoryId(c.id);
                        setSelected([]);
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        categoryId === c.id
                          ? "bg-[#a47e43] text-white shadow-sm"
                          : "bg-[#faf7f4] text-[#6f625a] hover:bg-[#f1e9e3]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9b8367]">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => {
                    setPage(1);
                    setLocation(e.target.value);
                  }}
                  placeholder="e.g. Cairo"
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3.5 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#b99a62] focus:ring-4 focus:ring-[#b99a62]/10"
                />
              </div>

              {/* Min Rating */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9b8367]">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setPage(1);
                    setMinRating(e.target.value);
                  }}
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3.5 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#b99a62] focus:ring-4 focus:ring-[#b99a62]/10"
                >
                  <option value="">Any rating</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="4.5">4.5+ stars</option>
                </select>
              </div>

              {/* Clear All */}
              {activeFiltersCount > 0 && (
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a47e43] hover:underline"
                  >
                    <X size={12} />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ RESULTS SECTION ============ */}
      <section className="mx-auto lg:max-w-10/12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Compare Bar */}
        {selected.length > 0 && (
          <div className="sticky bottom-4 z-20 mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-[#30251f] to-[#42332a] px-4 py-3.5 text-white shadow-[0_16px_40px_rgba(48,37,31,0.28)] sm:flex sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                {selected.length}
              </span>
              <span className="text-sm font-medium">
                {selected.length === 1 ? "vendor selected" : "vendors selected"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:text-white"
              >
                Clear All
              </button>
              <Link
                href={
                  selected.length >= 2 && categoryId
                    ? `/compare?type=vendor&ids=${selected.join(
                        ","
                      )}&categoryId=${categoryId}`
                    : "#"
                }
                aria-disabled={selected.length < 2 || !categoryId}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  selected.length >= 2 && categoryId
                    ? "bg-white text-[#30251f] hover:bg-[#f5efe8]"
                    : "pointer-events-none bg-white/20 text-white/50"
                }`}
              >
                <GitCompare size={15} />
                Compare ({selected.length})
              </Link>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#eee7e1] bg-white"
              >
                <div className="aspect-4/3 animate-pulse bg-[#f0e9e2]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#f0e9e2]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchResults}
              className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5ef]">
              <Search className="h-6 w-6 text-[#b99a62]" />
            </div>
            <p className="font-serif text-lg text-[#30251f]">No vendors found</p>
            <p className="mt-2 text-sm text-[#766d67]">
              Try adjusting your filters or search terms.
            </p>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#42332a]"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9b8f86]">
                <span className="font-semibold text-[#30251f]">
                  {result?.totalCount ?? items.length}
                </span>{" "}
                vendors found
              </p>
              {selectedCategory && (
                <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                  {selectedCategory.name}
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  favorited={isFavorited(FavoriteTargetType.Vendor, vendor.id)}
                  favoriteLoading={
                    actionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`
                  }
                  onToggleFavorite={toggleFavorite}
                  selected={selected.includes(vendor.id)}
                  onSelect={toggleSelected}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] bg-white text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#f9f1e9] disabled:opacity-40 disabled:hover:border-[#e4dbd0] disabled:hover:bg-white"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                          page === pageNum
                            ? "bg-[#30251f] text-white"
                            : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#b99a62] hover:bg-[#f9f1e9]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] bg-white text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#f9f1e9] disabled:opacity-40 disabled:hover:border-[#e4dbd0] disabled:hover:bg-white"
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
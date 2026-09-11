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

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
    const fromUrl = searchParams.get("categoryId") || "";
    setCategoryId(fromUrl);
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

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-10/12">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Our Vendors
            </span>
          </div>

          <h1 className="max-w-3xl font-serif text-2xl font-light leading-tight text-[#30251f] sm:text-4xl">
            Trusted Vendors for{" "}
            <span className="italic text-[#a47e43]">Your Big Day</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            Discover approved wedding professionals, compare ratings and
            locations, and find the right fit for every part of your day.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-7 grid gap-2.5 sm:mt-8 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8f86]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search vendors by name..."
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

          {filtersOpen && (
            <div className="mt-4 grid gap-4 rounded-2xl border border-[#eee7e1] bg-white p-5 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setCategoryId("");
                      setSelected([]);
                    }}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      !categoryId
                        ? "bg-[#30251f] text-white"
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
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
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

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => {
                    setPage(1);
                    setLocation(e.target.value);
                  }}
                  placeholder="e.g. Cairo"
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setPage(1);
                    setMinRating(e.target.value);
                  }}
                  className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
                >
                  <option value="">Any rating</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="4.5">4.5+ stars</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-10/12 px-4 py-12 sm:px-6 lg:px-8">
        {selected.length > 0 && (
          <div className="sticky bottom-3 z-20 mb-6 flex flex-col gap-3 rounded-2xl bg-[#30251f] px-4 py-3 text-white shadow-[0_16px_40px_rgba(48,37,31,0.22)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="text-sm">{selected.length} vendors selected</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSelected([])} className="rounded-lg px-3 py-2 text-xs font-semibold text-white/75 hover:text-white">Clear All</button>
              <Link
                href={selected.length >= 2 && categoryId ? `/compare?type=vendor&ids=${selected.join(",")}&categoryId=${categoryId}` : "#"}
                aria-disabled={selected.length < 2 || !categoryId}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${selected.length >= 2 && categoryId ? "bg-white text-[#30251f]" : "pointer-events-none bg-white/30 text-white/60"}`}
              >
                <GitCompare size={15} />
                Compare ({selected.length})
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
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
              No vendors match your search yet. Try different filters.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9b8f86]">
                {result?.totalCount ?? items.length} vendors found
              </p>
              {selectedCategory && (
                <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                  {selectedCategory.name}
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

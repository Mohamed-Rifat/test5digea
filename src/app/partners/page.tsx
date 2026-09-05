"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";

import SiteNavbar from "@/components/site/SiteNavbar";
import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { searchVendorList } from "@/services/vendors.service";
import { FavoriteTargetType } from "@/types/favorite";
import type {
  Vendor,
  VendorSearchParams,
  VendorSearchResponse,
} from "@/types/vendor";

const PAGE_SIZE = 12;

export default function PartnersPage() {
  return (
    <Suspense fallback={null}>
      <PartnersPageContent />
    </Suspense>
  );
}

function PartnersPageContent() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(!!initialCategoryId);

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
    } catch (err) {
      setError("We couldn't load partners right now. Please try again.");
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

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <SiteNavbar />

      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Our Partners
            </span>
          </div>

          <h1 className="font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
            Trusted Vendors for{" "}
            <span className="italic text-[#a47e43]">Your Big Day</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            Discover approved wedding professionals, compare ratings and
            locations, and find the right fit for every part of your day.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
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
              className="flex items-center justify-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-3.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62]"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <button
              type="submit"
              className="rounded-full bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#42332a]"
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
                  <button type="button" onClick={() => { setPage(1); setCategoryId(""); }} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${!categoryId ? "bg-[#30251f] text-white" : "bg-[#faf7f4] text-[#6f625a] hover:bg-[#f1e9e3]"}`}>All</button>
                  {categories.map((c) => (
                    <button key={c.id} type="button" onClick={() => { setPage(1); setCategoryId(c.id); }} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${categoryId === c.id ? "bg-[#a47e43] text-white shadow-sm" : "bg-[#faf7f4] text-[#6f625a] hover:bg-[#f1e9e3]"}`}>{c.name}</button>
                  ))}
                </div>
                {categoryId && (
                  <p className="mt-2 text-[11px] font-medium text-[#a47e43]">Showing vendors in the selected category</p>
                )}
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
              No partners match your search yet. Try different filters.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9b8f86]">{result?.totalCount ?? items.length} partners found</p>
              {categoryId && (
                <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                  {categories.find((c) => c.id === categoryId)?.name || "Selected category"}
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

function VendorCard({
  vendor,
  favorited,
  favoriteLoading,
  onToggleFavorite,
}: {
  vendor: Vendor;
  favorited: boolean;
  favoriteLoading: boolean;
  onToggleFavorite: (
    targetType: FavoriteTargetType,
    targetId: string
  ) => void;
}) {
  return (
    <Link
      href={`/partners/${vendor.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#eee7e1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,37,31,0.1)]"
    >
      <div className="relative h-32 w-full bg-gradient-to-br from-[#f0e9e0] to-[#e4d8c8]">
        <FavoriteButton
          targetType={FavoriteTargetType.Vendor}
          targetId={vendor.id}
          isFavorited={favorited}
          loading={favoriteLoading}
          onToggle={onToggleFavorite}
          className="absolute right-3 top-3 shadow-sm"
        />

        <div className="absolute -bottom-8 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f4eee9] shadow-sm">
          {vendor.profileImageUrl ? (
            <img
              src={vendor.profileImageUrl}
              alt={vendor.businessName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 size={24} className="text-[#a47e43]" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-11">
        <h3 className="line-clamp-1 text-base font-semibold text-[#30251f]">
          {vendor.businessName}
        </h3>

        {vendor.slogan && (
          <p className="mt-1 line-clamp-1 text-xs italic text-[#a47e43]">
            {vendor.slogan}
          </p>
        )}

        <div className="mt-3">
          <RatingStars
            rating={vendor.averageRating}
            reviewsCount={vendor.reviewsCount}
          />
        </div>

        {vendor.location && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[#9b8f86]">
            <MapPin size={12} />
            {vendor.location}
          </p>
        )}

        {vendor.categories && vendor.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#f0e9e0] pt-4">
            {vendor.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-[#f0e9e0] px-2.5 py-1 text-[11px] font-medium text-[#5f544d]"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Sparkles,
} from "lucide-react";

import SiteNavbar from "@/components/site/SiteNavbar";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { searchServices } from "@/services/services.service";
import { formatPrice, startingPrice } from "@/lib/format";
import { FavoriteTargetType } from "@/types/favorite";
import type {
  Service,
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
      <SiteNavbar />

      {/* Header */}
      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Browse
            </span>
          </div>

          <h1 className="font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
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
            className="mt-8 flex flex-col gap-3 sm:flex-row"
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

function ServiceCard({
  service,
  favorited,
  favoriteLoading,
  onToggleFavorite,
}: {
  service: Service;
  favorited: boolean;
  favoriteLoading: boolean;
  onToggleFavorite: (
    targetType: FavoriteTargetType,
    targetId: string
  ) => void;
}) {
  const price = startingPrice(service.prices);
  const image = service.images?.[0]?.url;

  return (
    <Link
      href={`/services/${service.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#eee7e1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,37,31,0.1)]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#f4eee9]">
        {image ? (
          <img
            src={image}
            alt={service.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
            <ImageOff size={28} />
          </div>
        )}

        <FavoriteButton
          targetType={FavoriteTargetType.Service}
          targetId={service.id}
          isFavorited={favorited}
          loading={favoriteLoading}
          onToggle={onToggleFavorite}
          className="absolute right-3 top-3 shadow-sm"
        />

        {service.categoryName && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#5f544d] backdrop-blur">
            {service.categoryName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-[#30251f]">
          {service.name}
        </h3>

        <p className="mt-1 text-xs text-[#9b8f86]">
          by {service.vendorBusinessName}
        </p>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[#766d67]">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#f0e9e0] pt-4">
          <span className="text-xs text-[#9b8f86]">Starting at</span>
          <span className="font-serif text-lg text-[#a47e43]">
            {price !== null ? `${formatPrice(price)} EGP` : "Contact"}
          </span>
        </div>
      </div>
    </Link>
  );
}

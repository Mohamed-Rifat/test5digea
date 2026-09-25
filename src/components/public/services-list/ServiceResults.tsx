"use client";

import { useLanguage } from "@/context/LanguageContext";
import ServiceCard from "@/components/public/ServiceCard";
import Pagination from "@/components/shared/Pagination";
import { FavoriteTargetType } from "@/types/favorite";

import type { ServicesListState } from "./useServicesList";

/** Loading / error / empty states, the service grid and pagination. */
export function ServiceResults({ state }: { state: ServicesListState }) {
  const { t, localize } = useLanguage();
  const {
    page,
    setPage,
    result,
    loading,
    error,
    clearAllFilters,
    activeFiltersCount,
    items,
    totalPages,
    selectedCategory,
    isFavorited,
    toggleFavorite,
    actionLoading,
    selected,
    isSelected,
    toggleService,
    PAGE_SIZE,
  } = state;

  return (
    <section
      className={`mx-auto lg:max-w-10/12 px-4 py-12 sm:px-6 lg:px-8 ${
        selected.length > 0 ? "pb-32 sm:pb-28" : ""
      }`}
    >
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
          <p className="text-[#766d67]">{t("services.list.empty")}</p>
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
                {localize(selectedCategory.name)}
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
                  actionLoading ===
                  `${FavoriteTargetType.Service}:${service.id}`
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
              Array.from({
                length: Math.max(0, PAGE_SIZE - items.length),
              }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  aria-hidden="true"
                  className="pointer-events-none invisible hidden sm:block"
                >
                  <ServiceCard service={items[0]} />
                </div>
              ))}
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
  );
}

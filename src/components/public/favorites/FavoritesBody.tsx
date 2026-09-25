"use client";

import { GitCompare } from "lucide-react";
import ServiceCard from "@/components/public/ServiceCard";
import VendorCard from "@/components/public/VendorCard";
import { useLanguage } from "@/context/LanguageContext";
import { FavoriteTargetType } from "@/types/favorite";

import type { FavoritesPageState } from "./useFavoritesPage";
import {
  EmptyState,
  FavoriteCardSkeleton,
  FavoriteFallbackCard,
  FavoritesSkeleton,
} from "@/components/public/favorites/FavoriteCards";

/** Loading / error / empty states, compare bar and the favourites grid. */
export function FavoritesBody({ state }: { state: FavoritesPageState }) {
  const { t } = useLanguage();
  const {
    tab,
    compare,
    setCompareOpen,
    filtered,
    compareCategoryLabel,
    clearCompare,
    isCompareSelected,
    toggleCompareService,
    toggleCompareVendor,
    favorites,
    loading,
    error,
    remove,
    actionLoading,
    getDetail,
  } = state;

  return (
    <section className="mx-auto lg:max-w-10/12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Loading — skeleton cards */}
      {loading && <FavoritesSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="text-sm font-medium text-red-600">
            {t("favorites.loadError")}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState tab={tab} hasAny={favorites.length > 0} />
      )}

      {/* Compare hint (shown until the first pick) */}
      {!loading &&
        !error &&
        favorites.length >= 2 &&
        compare.ids.length === 0 && (
          <p className="mb-6 flex items-center gap-2 text-xs text-[#9b8f86]">
            <GitCompare className="h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
            {t("favorites.compare.hint")}
          </p>
        )}

      {/* Compare bar */}
      {!loading && !error && compare.ids.length > 0 && (
        <div className="sticky bottom-3 z-20 mb-6 flex flex-col gap-3 rounded-2xl bg-[#30251f] px-4 py-3 text-white shadow-[0_16px_40px_rgba(48,37,31,0.22)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-sm">
            {compare.type === FavoriteTargetType.Service
              ? t("favorites.compare.selectedServices", {
                  count: compare.ids.length,
                  category: compareCategoryLabel,
                })
              : t("favorites.compare.selectedVendors", {
                  count: compare.ids.length,
                  category: compareCategoryLabel,
                })}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:text-white"
            >
              {t("compare.clearAll")}
            </button>

            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              disabled={compare.ids.length < 2}
              title={
                compare.ids.length < 2
                  ? t("compare.errors.selectTwo")
                  : undefined
              }
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
                compare.ids.length >= 2
                  ? "bg-white text-[#30251f]"
                  : "cursor-not-allowed bg-white/30 text-white/60"
              }`}
            >
              <GitCompare size={15} />
              {t("favorites.compare.button", { count: compare.ids.length })}
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((favorite) => {
            const key = `${favorite.targetType}:${favorite.targetId}`;
            const isRemoving = actionLoading === key;
            const detail = getDetail(favorite);

            // Full vendor / service record loaded -> same card as the rest
            // of the site (rating, location, categories, prices, ...).
            if (detail.status === "ready" && detail.vendor) {
              const vendorItem = detail.vendor;

              return (
                <VendorCard
                  key={favorite.id}
                  vendor={vendorItem}
                  favorited
                  favoriteLoading={isRemoving}
                  onToggleFavorite={remove}
                  selected={isCompareSelected(
                    FavoriteTargetType.Vendor,
                    vendorItem.id,
                  )}
                  onSelect={() => toggleCompareVendor(vendorItem)}
                />
              );
            }

            if (detail.status === "ready" && detail.service) {
              return (
                <ServiceCard
                  key={favorite.id}
                  service={detail.service}
                  favorited
                  favoriteLoading={isRemoving}
                  onToggleFavorite={remove}
                  selected={isCompareSelected(
                    FavoriteTargetType.Service,
                    detail.service.id,
                  )}
                  onSelect={toggleCompareService}
                />
              );
            }

            if (detail.status === "loading") {
              return <FavoriteCardSkeleton key={favorite.id} />;
            }

            return (
              <FavoriteFallbackCard
                key={favorite.id}
                favorite={favorite}
                isRemoving={isRemoving}
                onRemove={remove}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

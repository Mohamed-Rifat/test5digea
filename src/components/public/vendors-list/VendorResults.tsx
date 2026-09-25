"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Map as MapIcon } from "lucide-react";
import CompareCategoryDialog from "@/components/public/CompareCategoryDialog";
import VendorCard from "@/components/public/VendorCard";
import RoadmapPickButton from "@/components/roadmap/RoadmapPickButton";
import Pagination from "@/components/shared/Pagination";
import { FavoriteTargetType } from "@/types/favorite";

import type { VendorsListState } from "./useVendorsList";

/** Loading / error / empty states, the vendor grid and pagination. */
export function VendorResults({ state }: { state: VendorsListState }) {
  const { t, localize } = useLanguage();
  const {
    roadmapPicker,
    categoryId,
    page,
    setPage,
    selected,
    categoryPicker,
    setCategoryPicker,
    result,
    loading,
    error,
    fetchResults,
    startCompareInCategory,
    toggleSelected,
    clearAllFilters,
    activeFiltersCount,
    items,
    totalPages,
    selectedCategory,
    roadmapStep,
    isFavorited,
    toggleFavorite,
    actionLoading,
    PAGE_SIZE,
  } = state;

  return (
    <>
      {/* Loading skeleton: a full page of cards, so the layout doesn't jump */}
      {loading && (
        <>
          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#f0e9e2]" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border border-[#eee7e1] bg-white ${
                  i >= 4 ? "hidden sm:block" : ""
                }`}
              >
                <div className="h-36 animate-pulse bg-[#f0e9e2] sm:h-40" />
                <div className="space-y-3 p-4 pt-11">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#f0e9e2]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#f0e9e2]" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Came from the roadmap: keep the couple oriented */}
      {roadmapStep && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#ecd9bf] bg-[#fdf6ec] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm font-medium text-[#6f5433]">
            <MapIcon
              size={18}
              className="mt-0.5 shrink-0 text-[#a47e43]"
              aria-hidden="true"
            />
            <span>
              {t("roadmap.pick.browsingFor", {
                category: localize(roadmapStep.categoryName),
              })}
              {roadmapStep.selectedVendorName && (
                <span className="mt-0.5 block text-xs text-[#9b8367]">
                  {t("roadmap.pick.currently", {
                    name: roadmapStep.selectedVendorName,
                  })}
                </span>
              )}
            </span>
          </p>
          <Link
            href="/roadmap"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-sm font-semibold text-white transition hover:bg-[#46382f]"
          >
            {t("roadmap.pick.backToRoadmap")}
          </Link>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="font-medium text-red-600">
            {t("vendors.list.loadError")}
          </p>
          <button
            type="button"
            onClick={fetchResults}
            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("vendors.list.tryAgain")}
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5ef]">
            <Search className="h-6 w-6 text-[#b99a62]" />
          </div>
          <p className="font-serif text-lg text-[#30251f]">
            {t("vendors.list.emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-[#766d67]">
            {t("vendors.list.emptyText")}
          </p>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-5 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#42332a]"
            >
              {t("vendors.list.clearAllFilters")}
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
              {t("vendors.list.found")}
            </p>
            {selectedCategory && (
              <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                {localize(selectedCategory.name)}
              </span>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                href={
                  categoryId
                    ? `/vendors/${vendor.id}?categoryId=${encodeURIComponent(categoryId)}`
                    : undefined
                }
                footer={
                  roadmapStep ? (
                    <RoadmapPickButton
                      picker={roadmapPicker}
                      vendor={{ id: vendor.id, name: vendor.businessName }}
                      item={roadmapStep}
                      size="sm"
                      showHelpers={false}
                    />
                  ) : undefined
                }
                favorited={isFavorited(FavoriteTargetType.Vendor, vendor.id)}
                favoriteLoading={
                  actionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`
                }
                onToggleFavorite={toggleFavorite}
                selected={selected.includes(vendor.id)}
                onSelect={toggleSelected}
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
                  <VendorCard vendor={items[0]} />
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

      {categoryPicker && (
        <CompareCategoryDialog
          vendorName={categoryPicker.vendor.businessName}
          options={categoryPicker.options}
          onPick={(id) => startCompareInCategory(categoryPicker.vendor.id, id)}
          onClose={() => setCategoryPicker(null)}
        />
      )}
    </>
  );
}

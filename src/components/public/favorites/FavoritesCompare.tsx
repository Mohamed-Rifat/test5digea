"use client";

import FavoritesCompareModal from "@/components/public/FavoritesCompareModal";
import { FavoriteTargetType } from "@/types/favorite";

import type { FavoritesPageState } from "./useFavoritesPage";

/** Side-by-side comparison modal for the picked favourites. */
export function FavoritesCompare({ state }: { state: FavoritesPageState }) {
  const {
    compare,
    compareOpen,
    selectedServices,
    selectedVendors,
    compareFullPageHref,
    closeCompare,
    removeFromCompare,
  } = state;

  return (
    <>
      {compare.type && (
        <FavoritesCompareModal
          open={compareOpen}
          onClose={closeCompare}
          type={
            compare.type === FavoriteTargetType.Service ? "service" : "vendor"
          }
          services={selectedServices}
          vendors={selectedVendors}
          fullPageHref={compareFullPageHref}
          onRemove={removeFromCompare}
        />
      )}
    </>
  );
}

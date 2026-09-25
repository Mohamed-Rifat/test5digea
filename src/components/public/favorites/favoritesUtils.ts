import { FavoriteTargetType } from "@/types/favorite";
import type { Vendor } from "@/types/vendor";

export type Tab =
  "all" | FavoriteTargetType.Vendor | FavoriteTargetType.Service;

// Same limit as the services / vendors compare flows.
export const MAX_COMPARE = 4;

// What the user picked for comparison: only one kind at a time.
export interface CompareSelection {
  type: FavoriteTargetType.Vendor | FavoriteTargetType.Service | null;
  ids: string[];
}

export const EMPTY_COMPARE: CompareSelection = { type: null, ids: [] };

/** Category names shared by every vendor in the list. */
export const commonCategoryNames = (vendors: Vendor[]): string[] => {
  if (vendors.length === 0) return [];

  return (vendors[0].categories ?? []).filter((name) =>
    vendors.every((vendor) => (vendor.categories ?? []).includes(name)),
  );
};

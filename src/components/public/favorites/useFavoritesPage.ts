"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavoriteDetails } from "@/features/favorites/hooks/useFavoriteDetails";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoriteTargetType } from "@/types/favorite";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import {
  type CompareSelection,
  EMPTY_COMPARE,
  MAX_COMPARE,
  type Tab,
  commonCategoryNames,
} from "@/components/public/favorites/favoritesUtils";

/** Favorites list, tabs, per-item details and the compare selection. */
export function useFavoritesPage() {
  const { favorites, loading, error, remove, actionLoading } = useFavorites();
  const { t, localize } = useLanguage();
  const { toast } = useToast();
  const { categories } = useCategories();
  const { getDetail } = useFavoriteDetails(favorites);
  const [tab, setTab] = useState<Tab>("all");
  const [compare, setCompare] = useState<CompareSelection>(EMPTY_COMPARE);
  const [compareOpen, setCompareOpen] = useState(false);

  // ============================================================
  // COMPUTED
  // ============================================================

  const counts = useMemo(() => {
    const vendorCount = favorites.filter(
      (f) => f.targetType === FavoriteTargetType.Vendor,
    ).length;
    const serviceCount = favorites.filter(
      (f) => f.targetType === FavoriteTargetType.Service,
    ).length;

    return {
      all: favorites.length,
      vendor: vendorCount,
      service: serviceCount,
    };
  }, [favorites]);

  const filtered = useMemo(() => {
    if (tab === "all") return favorites;
    return favorites.filter((f) => f.targetType === tab);
  }, [favorites, tab]);

  // ============================================================
  // COMPARE
  // ============================================================

  // Selected items are loaded through the same details cache the cards use,
  // so the popup never needs an extra request.
  const selectedServices = useMemo<Service[]>(() => {
    if (compare.type !== FavoriteTargetType.Service) return [];

    return compare.ids.flatMap((id) => {
      const favorite = favorites.find(
        (f) => f.targetType === FavoriteTargetType.Service && f.targetId === id,
      );
      const detail = favorite ? getDetail(favorite) : null;
      return detail?.status === "ready" && detail.service
        ? [detail.service]
        : [];
    });
  }, [compare, favorites, getDetail]);

  const selectedVendors = useMemo<Vendor[]>(() => {
    if (compare.type !== FavoriteTargetType.Vendor) return [];

    return compare.ids.flatMap((id) => {
      const favorite = favorites.find(
        (f) => f.targetType === FavoriteTargetType.Vendor && f.targetId === id,
      );
      const detail = favorite ? getDetail(favorite) : null;
      return detail?.status === "ready" && detail.vendor ? [detail.vendor] : [];
    });
  }, [compare, favorites, getDetail]);

  const sharedVendorCategory = useMemo(
    () => commonCategoryNames(selectedVendors)[0] ?? "",
    [selectedVendors],
  );

  const compareCategoryLabel = localize(
    compare.type === FavoriteTargetType.Service
      ? (selectedServices[0]?.categoryName ?? "")
      : sharedVendorCategory,
  );

  // Link to the full comparison page (needs a category id).
  const compareFullPageHref = useMemo(() => {
    if (compare.ids.length < 2) return undefined;

    if (compare.type === FavoriteTargetType.Service) {
      const categoryId = selectedServices[0]?.categoryId;
      return categoryId
        ? `/compare?type=service&ids=${compare.ids.join(",")}&categoryId=${categoryId}`
        : undefined;
    }

    const categoryId = categories.find(
      (c) => c.name === sharedVendorCategory,
    )?.id;
    return categoryId
      ? `/compare?type=vendor&ids=${compare.ids.join(",")}&categoryId=${categoryId}`
      : undefined;
  }, [compare, selectedServices, categories, sharedVendorCategory]);

  // Drop selected items that are no longer in the favorites (removed).
  useEffect(() => {
    setCompare((previous) => {
      if (previous.ids.length === 0) return previous;

      const ids = previous.ids.filter((id) =>
        favorites.some(
          (f) => f.targetType === previous.type && f.targetId === id,
        ),
      );

      if (ids.length === previous.ids.length) return previous;
      return ids.length > 0 ? { type: previous.type, ids } : EMPTY_COMPARE;
    });
  }, [favorites]);

  // The popup needs at least two items.
  useEffect(() => {
    if (compareOpen && compare.ids.length < 2) setCompareOpen(false);
  }, [compareOpen, compare.ids.length]);

  const closeCompare = useCallback(() => setCompareOpen(false), []);

  const clearCompare = useCallback(() => {
    setCompare(EMPTY_COMPARE);
    setCompareOpen(false);
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompare((previous) => {
      const ids = previous.ids.filter((item) => item !== id);
      return ids.length > 0 ? { type: previous.type, ids } : EMPTY_COMPARE;
    });
  }, []);

  const isCompareSelected = (type: FavoriteTargetType, id: string) =>
    compare.type === type && compare.ids.includes(id);

  const toggleCompareService = (service: Service) => {
    if (isCompareSelected(FavoriteTargetType.Service, service.id)) {
      removeFromCompare(service.id);
      return;
    }

    if (compare.type === FavoriteTargetType.Vendor) {
      toast(t("favorites.compare.errors.mixedTypes"), "error");
      return;
    }

    const first = selectedServices[0];
    if (first && first.categoryId !== service.categoryId) {
      toast(t("compare.errors.sameCategory"), "error");
      return;
    }

    if (compare.ids.length >= MAX_COMPARE) {
      toast(t("compare.errors.maxItems", { max: MAX_COMPARE }), "error");
      return;
    }

    setCompare({
      type: FavoriteTargetType.Service,
      ids: [...compare.ids, service.id],
    });
  };

  const toggleCompareVendor = (vendor: Vendor) => {
    if (isCompareSelected(FavoriteTargetType.Vendor, vendor.id)) {
      removeFromCompare(vendor.id);
      return;
    }

    if (compare.type === FavoriteTargetType.Service) {
      toast(t("favorites.compare.errors.mixedTypes"), "error");
      return;
    }

    // Vendors are compared inside one category, so they must share one.
    if (commonCategoryNames([...selectedVendors, vendor]).length === 0) {
      toast(t("favorites.compare.errors.noCommonCategory"), "error");
      return;
    }

    if (compare.ids.length >= MAX_COMPARE) {
      toast(t("compare.errors.maxItems", { max: MAX_COMPARE }), "error");
      return;
    }

    setCompare({
      type: FavoriteTargetType.Vendor,
      ids: [...compare.ids, vendor.id],
    });
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: t("favorites.tabs.all"), count: counts.all },
    {
      key: FavoriteTargetType.Vendor,
      label: t("favorites.tabs.vendors"),
      count: counts.vendor,
    },
    {
      key: FavoriteTargetType.Service,
      label: t("favorites.tabs.services"),
      count: counts.service,
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return {
    tab,
    setTab,
    compare,
    setCompare,
    compareOpen,
    setCompareOpen,
    counts,
    filtered,
    selectedServices,
    selectedVendors,
    sharedVendorCategory,
    compareCategoryLabel,
    compareFullPageHref,
    closeCompare,
    clearCompare,
    removeFromCompare,
    isCompareSelected,
    toggleCompareService,
    toggleCompareVendor,
    tabs,
    favorites,
    loading,
    error,
    remove,
    actionLoading,
    toast,
    categories,
    getDetail,
  };
}

export type FavoritesPageState = ReturnType<typeof useFavoritesPage>;

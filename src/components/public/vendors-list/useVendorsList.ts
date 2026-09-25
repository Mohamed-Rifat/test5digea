"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToast } from "@/components/providers/ToastProvider";
import { searchVendorList } from "@/features/vendors/api";
import { findGovernorate, governorateLabel } from "@/lib/governorates";
import type {
  Vendor,
  VendorSearchParams,
  VendorSearchResponse,
} from "@/types/vendor";

const PAGE_SIZE = 12;
const MAX_COMPARE = 4;

/** Filters, paging, compare selection and data for the public vendors list. */
export function useVendorsList() {
  const searchParams = useSearchParams();
  const { t, language, localize } = useLanguage();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const roadmapPicker = useRoadmapPicker();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  // English name of the chosen governorate (the API gets it in the page language).
  const [governorate, setGovernorate] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);
  // The panel only opens when the user asks for it. A category coming from
  // the URL (navbar) is applied silently: it shows in the filter badge and in
  // the category chip above the results.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  // true when the category filter was set automatically by picking a vendor
  // to compare (so it goes back to "All" once nothing is selected anymore).
  const [categoryFromCompare, setCategoryFromCompare] = useState(false);
  // vendor working in several categories: ask which one to compare in.
  const [categoryPicker, setCategoryPicker] = useState<{
    vendor: Vendor;
    options: { id: string; name: string }[];
  } | null>(null);

  const [result, setResult] = useState<VendorSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);

  const locationParam = useMemo(() => {
    const match = findGovernorate(governorate);
    return match ? governorateLabel(match, language) : "";
  }, [governorate, language]);

  const params: VendorSearchParams = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      categoryId: categoryId || undefined,
      location: locationParam || undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: 0,
      page,
      pageSize: PAGE_SIZE,
    }),
    [searchTerm, categoryId, locationParam, minRating, page],
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await searchVendorList(params);

      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId") || "";
    const searchFromUrl = searchParams.get("search") || "";

    setCategoryId(categoryFromUrl);
    setCategoryFromCompare(false);

    if (searchFromUrl) {
      setSearchInput(searchFromUrl);
      setSearchTerm(searchFromUrl);
    }

    setPage(1);
  }, [searchParams]);

  // Close filters panel on outside click or Escape
  useEffect(() => {
    if (!filtersOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [filtersOpen]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  // Goes back to "All categories" if that filter only exists because of a
  // comparison that is now over.
  const releaseCompareCategory = () => {
    if (!categoryFromCompare) return;

    setCategoryFromCompare(false);
    setCategoryId("");
    setPage(1);
  };

  const startCompareInCategory = (vendorId: string, newCategoryId: string) => {
    setPage(1);
    setCategoryId(newCategoryId);
    setCategoryFromCompare(true);
    setSelected([vendorId]);
    setCategoryPicker(null);
  };

  const clearSelected = () => {
    setSelected([]);
    releaseCompareCategory();
  };

  // Manual category choice from the filters panel.
  const chooseCategory = (newCategoryId: string) => {
    setPage(1);
    setCategoryId(newCategoryId);
    setCategoryFromCompare(false);
    setSelected([]);
  };

  const toggleSelected = (vendorId: string) => {
    if (selected.includes(vendorId)) {
      const remaining = selected.filter((id) => id !== vendorId);
      setSelected(remaining);
      if (remaining.length === 0) releaseCompareCategory();
      return;
    }

    // Toasts must not be fired from inside a state updater (React warns
    // "Cannot update a component while rendering a different component").
    if (!categoryId) {
      // No category filter yet: use the vendor's own category, so the list
      // narrows down to the vendors it can be compared with.
      const vendor = (result?.items ?? []).find((item) => item.id === vendorId);
      const options = categories.filter((category) =>
        (vendor?.categories ?? []).includes(category.name),
      );

      if (!vendor || options.length === 0) {
        toast(t("compare.errors.selectCategory"), "error");
        return;
      }

      if (options.length === 1) {
        startCompareInCategory(vendorId, options[0].id);
        return;
      }

      setCategoryPicker({
        vendor,
        options: options.map((category) => ({
          id: category.id,
          name: localize(category.name),
        })),
      });
      return;
    }

    if (selected.length >= MAX_COMPARE) {
      toast(t("vendors.list.maxCompare", { max: MAX_COMPARE }), "error");
      return;
    }

    setSelected((previous) => [...previous, vendorId]);
  };

  const clearAllFilters = () => {
    setPage(1);
    setCategoryId("");
    setCategoryFromCompare(false);
    setGovernorate("");
    setMinRating("");
    setSearchInput("");
    setSearchTerm("");
    setSelected([]);
  };

  const activeFiltersCount = [
    categoryId,
    governorate,
    minRating,
    searchTerm,
  ].filter(Boolean).length;

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);
  // Couple browsing a category that is part of their roadmap: each card gets
  // a one-click "Choose for my wedding" button.
  const roadmapStep =
    categoryId && roadmapPicker.canUse
      ? roadmapPicker.findItem(categoryId, selectedCategory?.name)
      : null;

  return {
    PAGE_SIZE,
    MAX_COMPARE,
    searchParams,
    initialCategoryId,
    initialSearch,
    roadmapPicker,
    searchInput,
    setSearchInput,
    searchTerm,
    setSearchTerm,
    categoryId,
    setCategoryId,
    governorate,
    setGovernorate,
    minRating,
    setMinRating,
    page,
    setPage,
    filtersOpen,
    setFiltersOpen,
    selected,
    setSelected,
    categoryFromCompare,
    setCategoryFromCompare,
    categoryPicker,
    setCategoryPicker,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
    filtersRef,
    locationParam,
    params,
    fetchResults,
    handleSearchSubmit,
    releaseCompareCategory,
    startCompareInCategory,
    clearSelected,
    chooseCategory,
    toggleSelected,
    clearAllFilters,
    activeFiltersCount,
    items,
    totalPages,
    selectedCategory,
    roadmapStep,
    categories,
    isFavorited,
    toggleFavorite,
    actionLoading,
    toast,
  };
}

export type VendorsListState = ReturnType<typeof useVendorsList>;

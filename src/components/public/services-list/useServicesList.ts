"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCompare } from "@/context/CompareContext";
import { searchServices } from "@/features/services/api";
import type {
  SearchServicesParams,
  SearchServicesResponse,
} from "@/types/service";

const PAGE_SIZE = 12;

/** Filters, paging, compare selection and data for the public services list. */
export function useServicesList() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { selected, isSelected, toggleService, clearAll } = useCompare();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sortBy, setSortBy] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  // Opened only by the user; a category coming from the URL is applied
  // without popping the panel open.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [result, setResult] = useState<SearchServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);

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
    [searchTerm, categoryId, minPrice, maxPrice, sortBy, page],
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await searchServices(params);

      setResult(data);
    } catch {
      setError(true);
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

  // Keep the filters in sync when the URL changes while this page is already
  // mounted (e.g. picking another category or searching from the navbar).
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId") || "";
    const searchFromUrl = searchParams.get("search") || "";

    setCategoryId(categoryFromUrl);
    setSearchInput(searchFromUrl);
    setSearchTerm(searchFromUrl);
    setPage(1);
  }, [searchParams]);

  // Close the filters panel on outside click or Escape.
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

  // Clearing the compare tray should also let go of the category the page
  // locked onto automatically while comparing — otherwise the list stays
  // filtered with no obvious reason once there's nothing left to compare.
  const handleClearCompare = () => {
    clearAll();
    setPage(1);
    setCategoryId("");
  };

  const clearAllFilters = () => {
    setPage(1);
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy(0);
    setSearchInput("");
    setSearchTerm("");
  };

  const activeFiltersCount =
    [categoryId, minPrice, maxPrice, searchTerm].filter(Boolean).length +
    (sortBy !== 0 ? 1 : 0);

  // Once the user starts a comparison from the "all categories" view, keep
  // pushing manual filtering back on them serves no purpose: only services
  // from the same category can ever be compared together, so lock the list
  // to that category automatically the moment the first item is selected —
  // and let go of that lock again the moment nothing is left to compare
  // (whether that's from "Clear all" or from un-selecting the last item),
  // as long as the person hasn't since changed the filter themselves.
  const compareLockedCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    if (selected.length > 0) {
      const compareCategoryId = selected[0].categoryId || null;
      if (compareCategoryId && categoryId !== compareCategoryId) {
        setCategoryId(compareCategoryId);
        setPage(1);
      }
      compareLockedCategoryRef.current = compareCategoryId;
      return;
    }

    if (
      compareLockedCategoryRef.current &&
      categoryId === compareLockedCategoryRef.current
    ) {
      setCategoryId("");
      setPage(1);
    }
    compareLockedCategoryRef.current = null;
  }, [selected, categoryId]);

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return {
    PAGE_SIZE,
    searchParams,
    initialCategoryId,
    initialSearch,
    searchTerm,
    setSearchTerm,
    searchInput,
    setSearchInput,
    categoryId,
    setCategoryId,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    page,
    setPage,
    filtersOpen,
    setFiltersOpen,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
    filtersRef,
    params,
    fetchResults,
    handleSearchSubmit,
    handleClearCompare,
    clearAllFilters,
    activeFiltersCount,
    compareLockedCategoryRef,
    items,
    totalPages,
    selectedCategory,
    categories,
    isFavorited,
    toggleFavorite,
    actionLoading,
    selected,
    isSelected,
    toggleService,
    clearAll,
  };
}

export type ServicesListState = ReturnType<typeof useServicesList>;

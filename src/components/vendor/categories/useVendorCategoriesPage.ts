"use client";

import { useMemo, useState } from "react";
import { useVendorContext } from "@/context/VendorContext";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/types/category";

/** Vendor categories: assigned list, catalogue search and the contact-admin dialog. */
export function useVendorCategoriesPage() {
  const { t } = useLanguage();
  const { vendor, loading, refetch } = useVendorContext();
  const { categories: allCategories, loading: categoriesLoading } =
    useCategories();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState("");

  const assignedCategoryNames = useMemo(
    () => new Set(vendor?.categories || []),
    [vendor],
  );

  const stats = useMemo(() => {
    return {
      total: assignedCategoryNames.size,
    };
  }, [assignedCategoryNames]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const sortedCategories = useMemo(() => {
    return [...(vendor?.categories ?? [])].sort((a, b) => a.localeCompare(b));
  }, [vendor]);

  const filteredAllCategories = useMemo(() => {
    const activeCategories = allCategories.filter((c) => c.isActive);

    if (!categorySearch.trim()) return activeCategories;

    const query = categorySearch.toLowerCase();
    return activeCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query),
    );
  }, [allCategories, categorySearch]);

  const assignedCountInFiltered = useMemo(
    () =>
      filteredAllCategories.filter((c) => assignedCategoryNames.has(c.name))
        .length,
    [filteredAllCategories, assignedCategoryNames],
  );

  const handleContactAdmin = (category: Category) => {
    setSelectedCategory(category);
    setContactDialogOpen(true);
  };

  const handleContactSuccess = () => {
    setToastMessage(t("vendor.services.detail.toastText"));
    setTimeout(() => setToastMessage(""), 4000);
  };

  return {
    isRefreshing,
    setIsRefreshing,
    categorySearch,
    setCategorySearch,
    contactDialogOpen,
    setContactDialogOpen,
    selectedCategory,
    setSelectedCategory,
    toastMessage,
    setToastMessage,
    assignedCategoryNames,
    stats,
    handleRefresh,
    sortedCategories,
    filteredAllCategories,
    assignedCountInFiltered,
    handleContactAdmin,
    handleContactSuccess,
    vendor,
    loading,
    refetch,
    allCategories,
    categoriesLoading,
  };
}

export type VendorCategoriesPageState = ReturnType<
  typeof useVendorCategoriesPage
>;

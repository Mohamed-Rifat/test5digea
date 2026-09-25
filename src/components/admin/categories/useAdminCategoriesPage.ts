"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";
import { useServices } from "@/features/services/hooks/useServices";
import {
  createCategory,
  deleteCategory,
  toggleCategoryActive,
  updateCategory,
} from "@/features/categories/api";
import type { Category } from "@/types/category";
import {
  decodeBilingual,
  encodeBilingual,
  type BilingualText,
} from "@/lib/bilingual";

import {
  EMPTY_BILINGUAL,
  validateBilingual,
  type ModalType,
  type StatusFilter,
} from "./categoryForm";

/** State + actions of the admin categories page. */
export function useAdminCategoriesPage() {
  const { t, localize } = useLanguage();
  const { categories, loading, error, refetch } = useAdminCategories();

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();

  const [modal, setModal] = useState<ModalType>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [filterOpen, setFilterOpen] = useState(false);

  // =========================
  // CREATE
  // =========================

  // Name/description are entered in Arabic + English and stored together
  // in the single API field ("عربي ‖ English") - see src/lib/bilingual.ts.
  const [name, setName] = useState<BilingualText>(EMPTY_BILINGUAL);
  const [description, setDescription] =
    useState<BilingualText>(EMPTY_BILINGUAL);
  const [iconUrl, setIconUrl] = useState("");

  // =========================
  // EDIT
  // =========================

  const [editName, setEditName] = useState<BilingualText>(EMPTY_BILINGUAL);
  const [editDescription, setEditDescription] =
    useState<BilingualText>(EMPTY_BILINGUAL);
  const [editIconUrl, setEditIconUrl] = useState("");

  // =========================
  // ACTION STATES
  // =========================

  const [actionLoading, setActionLoading] = useState(false);

  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetMessages = () => {
    setActionError(null);
    setSuccessMessage(null);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (actionLoading) return;

    setModal(null);
    setSelectedCategory(null);
    resetMessages();
  };

  // =========================
  // SERVICES
  // =========================

  const getCategoryServices = (categoryId: string) => {
    return services.filter((service) => service.categoryId === categoryId);
  };

  // =========================
  // STATISTICS
  // =========================

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = totalCategories - activeCategories;

  // =========================
  // FILTERED CATEGORIES
  // =========================

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name.toLowerCase().includes(normalizedSearch) ||
        category.description.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // =========================
  // CREATE
  // =========================

  const openCreateModal = () => {
    setName(EMPTY_BILINGUAL);
    setDescription(EMPTY_BILINGUAL);
    setIconUrl("");
    resetMessages();
    setSelectedCategory(null);
    setOpenMenuId(null);
    setFilterOpen(false);
    setModal("create");
  };

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createError = validateBilingual(name, description, iconUrl);
    if (createError) {
      setActionError(t(createError));
      return;
    }

    try {
      setActionLoading(true);
      resetMessages();

      await createCategory({
        name: encodeBilingual(name.ar, name.en),
        description: encodeBilingual(description.ar, description.en),
        iconUrl: iconUrl.trim(),
      });

      await refetch();

      setModal(null);

      setName(EMPTY_BILINGUAL);
      setDescription(EMPTY_BILINGUAL);
      setIconUrl("");

      setSuccessMessage(t("admin.categories.createdSuccess"));
    } catch {
      setActionError(t("admin.categories.createFailedRetry"));
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);

    setEditName(decodeBilingual(category.name));
    setEditDescription(decodeBilingual(category.description));
    setEditIconUrl(category.iconUrl);

    resetMessages();
    setOpenMenuId(null);
    setFilterOpen(false);

    setModal("edit");
  };

  const handleUpdateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategory) return;

    const editError = validateBilingual(editName, editDescription, editIconUrl);
    if (editError) {
      setActionError(t(editError));
      return;
    }

    try {
      setActionLoading(true);
      resetMessages();

      await updateCategory(selectedCategory.id, {
        id: selectedCategory.id,
        name: encodeBilingual(editName.ar, editName.en),
        description: encodeBilingual(editDescription.ar, editDescription.en),
        iconUrl: editIconUrl.trim(),
      });

      await refetch();

      setModal(null);
      setSelectedCategory(null);

      setSuccessMessage(t("admin.categories.updated"));
    } catch {
      setActionError(t("admin.categories.updateFailedRetry"));
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // TOGGLE ACTIVE
  // =========================

  const handleToggleCategory = async (category: Category) => {
    try {
      setToggleLoadingId(category.id);
      resetMessages();
      setOpenMenuId(null);

      await toggleCategoryActive(category.id, !category.isActive);

      await refetch();

      setSuccessMessage(
        category.isActive
          ? t("admin.categories.disabledMsg", { name: localize(category.name) })
          : t("admin.categories.activatedMsg", {
              name: localize(category.name),
            }),
      );
    } catch {
      setActionError(t("admin.categories.statusFailed"));
    } finally {
      setToggleLoadingId(null);
    }
  };

  // =========================
  // DELETE
  // =========================

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    resetMessages();
    setOpenMenuId(null);
    setFilterOpen(false);
    setModal("delete");
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setActionLoading(true);
      resetMessages();

      const deletedName = localize(selectedCategory.name);

      await deleteCategory(selectedCategory.id);

      await refetch();

      setModal(null);
      setSelectedCategory(null);

      setSuccessMessage(
        t("admin.categories.deletedMsg", { name: deletedName }),
      );
    } catch {
      setActionError(t("admin.categories.deleteFailedRetry"));
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // STATUS LABEL
  // =========================

  const statusLabel =
    statusFilter === "all"
      ? t("admin.categories.allStatus")
      : statusFilter === "active"
        ? t("admin.categories.active")
        : t("admin.categories.inactive");

  return {
    categories,
    loading,
    error,
    refetch,
    servicesLoading,
    servicesError,
    getCategoryServices,
    totalCategories,
    activeCategories,
    inactiveCategories,
    filteredCategories,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusLabel,
    filterOpen,
    setFilterOpen,
    openMenuId,
    setOpenMenuId,
    modal,
    selectedCategory,
    closeModal,
    // form
    name,
    setName,
    description,
    setDescription,
    iconUrl,
    setIconUrl,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editIconUrl,
    setEditIconUrl,
    // actions
    actionLoading,
    toggleLoadingId,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    handleCreateCategory,
    handleUpdateCategory,
    handleToggleCategory,
    handleDeleteCategory,
  };
}

export type AdminCategoriesState = ReturnType<typeof useAdminCategoriesPage>;

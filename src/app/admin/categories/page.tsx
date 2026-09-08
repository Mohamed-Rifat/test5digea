"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Archive,
    Check,
    ChevronDown,
    Edit3,
    Filter,
    Image as ImageIcon,
    Loader2,
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    Tags,
    Trash2,
    X,
    Zap,
} from "lucide-react";

import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";
import { useServices } from "@/features/services/hooks/useServices";

import {
    createCategory,
    updateCategory,
    toggleCategoryActive,
    deleteCategory,
} from "@/features/categories/api";

import type { Category } from "@/types/category";

type ModalType = "create" | "edit" | "delete" | null;
type StatusFilter = "all" | "active" | "inactive";

export default function AdminCategoriesPage() {
    const {
        categories,
        loading,
        error,
        refetch,
    } = useAdminCategories();

    const {
        services,
        loading: servicesLoading,
        error: servicesError,
    } = useServices();

    const [modal, setModal] = useState<ModalType>(null);

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [openMenuId, setOpenMenuId] = useState<string | null>(
        null
    );

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [filterOpen, setFilterOpen] = useState(false);

    // =========================
    // CREATE
    // =========================

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [iconUrl, setIconUrl] = useState("");

    // =========================
    // EDIT
    // =========================

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] =
        useState("");
    const [editIconUrl, setEditIconUrl] = useState("");

    // =========================
    // ACTION STATES
    // =========================

    const [actionLoading, setActionLoading] =
        useState(false);

    const [toggleLoadingId, setToggleLoadingId] =
        useState<string | null>(null);

    const [actionError, setActionError] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

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
        return services.filter(
            (service) => service.categoryId === categoryId
        );
    };

    // =========================
    // STATISTICS
    // =========================

    const totalCategories = categories.length;

    const activeCategories = categories.filter(
        (category) => category.isActive
    ).length;

    const inactiveCategories =
        totalCategories - activeCategories;

    // =========================
    // FILTERED CATEGORIES
    // =========================

    const filteredCategories = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return categories.filter((category) => {
            const matchesSearch =
                !normalizedSearch ||
                category.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                category.description
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    category.isActive) ||
                (statusFilter === "inactive" &&
                    !category.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [categories, search, statusFilter]);

    // =========================
    // CREATE
    // =========================

    const openCreateModal = () => {
        setName("");
        setDescription("");
        setIconUrl("");
        resetMessages();
        setSelectedCategory(null);
        setOpenMenuId(null);
        setFilterOpen(false);
        setModal("create");
    };

    const handleCreateCategory = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !name.trim() ||
            !description.trim() ||
            !iconUrl.trim()
        ) {
            setActionError("Please fill in all required fields.");
            return;
        }

        try {
            setActionLoading(true);
            resetMessages();

            await createCategory({
                name: name.trim(),
                description: description.trim(),
                iconUrl: iconUrl.trim(),
            });

            await refetch();

            setModal(null);

            setName("");
            setDescription("");
            setIconUrl("");

            setSuccessMessage(
                "Category created successfully."
            );
        } catch (error) {
            console.error(
                "Failed to create category:",
                error
            );

            setActionError(
                "Failed to create category. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // EDIT
    // =========================

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);

        setEditName(category.name);
        setEditDescription(category.description);
        setEditIconUrl(category.iconUrl);

        resetMessages();
        setOpenMenuId(null);
        setFilterOpen(false);

        setModal("edit");
    };

    const handleUpdateCategory = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!selectedCategory) return;

        if (
            !editName.trim() ||
            !editDescription.trim() ||
            !editIconUrl.trim()
        ) {
            setActionError("Please fill in all required fields.");
            return;
        }

        try {
            setActionLoading(true);
            resetMessages();

            await updateCategory(selectedCategory.id, {
                id: selectedCategory.id,
                name: editName.trim(),
                description: editDescription.trim(),
                iconUrl: editIconUrl.trim(),
            });

            await refetch();

            setModal(null);
            setSelectedCategory(null);

            setSuccessMessage(
                "Category updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update category:",
                error
            );

            setActionError(
                "Failed to update category. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // TOGGLE ACTIVE
    // =========================

    const handleToggleCategory = async (
        category: Category
    ) => {
        try {
            setToggleLoadingId(category.id);
            resetMessages();
            setOpenMenuId(null);

            await toggleCategoryActive(
                category.id,
                !category.isActive
            );

            await refetch();

            setSuccessMessage(
                category.isActive
                    ? `"${category.name}" has been disabled.`
                    : `"${category.name}" has been activated.`
            );
        } catch (error) {
            console.error(
                "Failed to toggle category:",
                error
            );

            setActionError(
                "Failed to update category status."
            );
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

            const deletedName = selectedCategory.name;

            await deleteCategory(selectedCategory.id);

            await refetch();

            setModal(null);
            setSelectedCategory(null);

            setSuccessMessage(
                `"${deletedName}" was deleted successfully.`
            );
        } catch (error) {
            console.error(
                "Failed to delete category:",
                error
            );

            setActionError(
                "Failed to delete category. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // STATUS LABEL
    // =========================

    const statusLabel =
        statusFilter === "all"
            ? "All Status"
            : statusFilter === "active"
                ? "Active"
                : "Inactive";

    return (
        <div className="mx-auto">
            {/* ========================= */}
            {/* SUCCESS MESSAGE */}
            {/* ========================= */}

            {successMessage && !modal && (
                <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#d9e8dc] bg-[#f7fbf8] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e4f0e6] text-[#628069]">
                            <Check size={14} />
                        </div>

                        <p className="truncate text-xs font-medium text-[#58705f]">
                            {successMessage}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSuccessMessage(null)}
                        className="shrink-0 rounded-lg p-1 text-[#819187] transition hover:bg-[#e8f1ea]"
                        aria-label="Dismiss success message"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* ========================= */}
            {/* PAGE HEADER */}
            {/* ========================= */}

            {loading ? (
                <CategoriesHeaderSkeleton />
            ) : (
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2.5 flex items-center gap-2 text-[11px] font-medium text-[#9b8e86]">
                            <Tags size={13} />

                            <span>Management</span>

                            <span>/</span>

                            <span className="text-[#6f6057]">
                                Categories
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                            Categories
                        </h1>

                        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#8b7e76]">
                            Manage the categories that organize
                            services across the 5Digea marketplace.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={loading || actionLoading}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#e8e0da] bg-white px-3.5 py-2.5 text-xs font-medium text-[#665951] shadow-sm transition hover:bg-[#faf7f4] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    loading ? "animate-spin" : ""
                                }
                            />

                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#43342c] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus size={16} />

                            Add Category
                        </button>
                    </div>
                </div>
            )}

            {/* ========================= */}
            {/* SERVICES WARNING */}
            {/* ========================= */}

            {servicesError && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#ead9b9] bg-[#fffaf0] px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8edcf] text-[#9b7945]">
                        <Zap size={15} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#725a35]">
                            Services could not be loaded
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#9a8567]">
                            Service counts may not be accurate.
                        </p>
                    </div>
                </div>
            )}

            {/* ========================= */}
            {/* ACTION ERROR */}
            {/* ========================= */}

            {actionError && !modal && (
                <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
                    <p className="text-xs font-medium text-[#a34f49]">
                        {actionError}
                    </p>

                    <button
                        type="button"
                        onClick={() => setActionError(null)}
                        className="rounded-lg p-1 text-[#b76b65] transition hover:bg-[#fce8e6]"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* ========================= */}
            {/* STATISTICS */}
            {/* ========================= */}

            {loading ? (
                <StatsSkeleton />
            ) : !error ? (
                <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-4">
                    <StatCard
                        label="Total"
                        value={totalCategories}
                        icon={<Tags size={17} />}
                        description="All categories"
                    />

                    <StatCard
                        label="Active"
                        value={activeCategories}
                        icon={<Check size={17} />}
                        description="Visible"
                    />

                    <StatCard
                        label="Inactive"
                        value={inactiveCategories}
                        icon={<Archive size={17} />}
                        description="Disabled"
                    />
                </div>
            ) : null}

            {/* ========================= */}
            {/* TOOLBAR */}
            {/* ========================= */}

            {loading ? (
                <ToolbarSkeleton />
            ) : !error && categories.length > 0 ? (
                <div className="mb-5 rounded-xl border border-[#ebe3dd] bg-white p-3 shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
                    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
                        {/* Search */}

                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a99b92]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search categories..."
                                className="h-10 w-full rounded-lg border border-[#eee6e1] bg-[#fcfaf8] pl-10 pr-9 text-xs text-[#30251f] outline-none transition placeholder:text-[#afa39b] focus:border-[#cdbeb3] focus:bg-white"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#a99b92] transition hover:bg-[#f3ece7] hover:text-[#5f5048]"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Filter */}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setFilterOpen((current) => !current)
                                }
                                className="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-[#eee6e1] bg-[#fcfaf8] px-3.5 text-xs font-medium text-[#665951] transition hover:bg-white sm:min-w-36.25"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter size={14} />

                                    {statusLabel}
                                </span>

                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${filterOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {filterOpen && (
                                <div className="absolute right-0 top-11 z-50 w-full min-w-36.25 overflow-hidden rounded-xl border border-[#e9e0da] bg-white p-1.5 shadow-xl">
                                    {[
                                        {
                                            value: "all",
                                            label: "All Status",
                                        },
                                        {
                                            value: "active",
                                            label: "Active",
                                        },
                                        {
                                            value: "inactive",
                                            label: "Inactive",
                                        },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setStatusFilter(
                                                    option.value as StatusFilter
                                                );
                                                setFilterOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${statusFilter === option.value
                                                    ? "bg-[#f5eee9] text-[#30251f]"
                                                    : "text-[#756960] hover:bg-[#faf7f4]"
                                                }`}
                                        >
                                            {option.label}

                                            {statusFilter === option.value && (
                                                <Check size={13} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="hidden h-7 w-px bg-[#eee6e1] lg:block" />

                        <div className="px-1 text-[11px] text-[#9a8d85]">
                            Showing{" "}
                            <span className="font-semibold text-[#64564e]">
                                {filteredCategories.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-[#64564e]">
                                {categories.length}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}


            {/* ========================= */}
            {/* CATEGORY SKELETON */}
            {/* ========================= */}

            {loading && <CategoriesSkeleton />}
            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {!loading && error && (
                <div className="rounded-2xl border border-[#f0d4d1] bg-white p-8 text-center shadow-sm sm:p-10">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ee]">
                        <RefreshCw
                            size={23}
                            className="text-[#ad5b54]"
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
                        Something went wrong
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f8179]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#43342c]"
                    >
                        <RefreshCw size={15} />

                        Try Again
                    </button>
                </div>
            )}

            {/* ========================= */}
            {/* EMPTY */}
            {/* ========================= */}

            {!loading &&
                !error &&
                categories.length === 0 && (
                    <div className="rounded-2xl border border-[#ebe3dd] bg-white p-10 text-center shadow-sm sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7f1ed] text-[#806d61]">
                            <Tags size={28} strokeWidth={1.7} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
                            No categories yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#93857c]">
                            Create your first category to start
                            organizing services on the 5Digea
                            marketplace.
                        </p>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#43342c]"
                        >
                            <Plus size={16} />

                            Add Category
                        </button>
                    </div>
                )}

            {/* ========================= */}
            {/* NO SEARCH RESULTS */}
            {/* ========================= */}

            {!loading &&
                !error &&
                categories.length > 0 &&
                filteredCategories.length === 0 && (
                    <div className="rounded-2xl border border-[#ebe3dd] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f1ed] text-[#806d61]">
                            <Search size={24} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
                            No matching categories
                        </h2>

                        <p className="mt-2 text-sm text-[#93857c]">
                            Try a different search term or status
                            filter.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                            }}
                            className="mt-5 rounded-xl border border-[#e7ded8] px-4 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4]"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

            {/* ========================= */}
            {/* CATEGORY GRID */}
            {/* ========================= */}

            {!loading &&
                !error &&
                filteredCategories.length > 0 && (
                    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {filteredCategories.map((category) => {
                            const categoryServices =
                                getCategoryServices(category.id);

                            const isToggling =
                                toggleLoadingId === category.id;

                            return (
                                <article
                                    key={category.id}
                                    className="group relative overflow-visible rounded-xl border border-[#ebe3dd] bg-white shadow-[0_2px_10px_rgba(48,37,31,0.025)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(48,37,31,0.07)]"
                                >
                                    {/* CARD IMAGE */}

                                    <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-t-xl bg-[#faf8f6] p-5">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,195,185,0.18),transparent_65%)]" />

                                        {category.iconUrl ? (
                                            <img
                                                src={category.iconUrl}
                                                alt={category.name}
                                                className="relative h-16 w-16 object-contain transition duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
                                                <ImageIcon
                                                    size={24}
                                                    className="text-[#b0a39b]"
                                                />
                                            </div>
                                        )}

                                        {/* STATUS */}

                                        <div className="absolute left-3 top-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold shadow-sm ${category.isActive
                                                        ? "bg-white text-[#638069]"
                                                        : "bg-white text-[#9a5d57]"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${category.isActive
                                                            ? "bg-[#719179]"
                                                            : "bg-[#b66a63]"
                                                        }`}
                                                />

                                                {category.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>

                                        {/* MENU */}

                                        <div className="absolute right-3 top-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId === category.id
                                                            ? null
                                                            : category.id
                                                    )
                                                }
                                                disabled={
                                                    actionLoading || isToggling
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#756960] shadow-sm transition hover:bg-[#30251f] hover:text-white disabled:opacity-50"
                                                aria-label={`Actions for ${category.name}`}
                                            >
                                                <MoreVertical size={15} />
                                            </button>

                                            {openMenuId === category.id && (
                                                <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl border border-[#e9e0da] bg-white p-1.5 shadow-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(category)
                                                        }
                                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#65574f] transition hover:bg-[#faf7f4]"
                                                    >
                                                        <Edit3 size={14} />

                                                        Edit category
                                                    </button>

                                                    <div className="my-1 border-t border-[#f0e9e4]" />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(category)
                                                        }
                                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#b35f58] transition hover:bg-[#fff4f2]"
                                                    >
                                                        <Trash2 size={14} />

                                                        Delete category
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CARD CONTENT */}

                                    <div className="p-3.5">
                                        <div className="min-h-14.5">
                                            <h2 className="line-clamp-1 text-sm font-semibold text-[#30251f]">
                                                {category.name}
                                            </h2>

                                            <p className="mt-1.5 line-clamp-2 text-[11px] leading-4.5 text-[#91847c]">
                                                {category.description ||
                                                    "No description available."}
                                            </p>
                                        </div>

                                        {/* SERVICE COUNT */}

                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#faf8f6] px-3 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#806d61] shadow-sm">
                                                    <Zap size={13} />
                                                </div>

                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#a2948b]">
                                                        Services
                                                    </p>

                                                    <p className="mt-0.5 text-xs font-semibold text-[#4c3e36]">
                                                        {servicesLoading
                                                            ? "..."
                                                            : categoryServices.length}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* TOGGLE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleCategory(category)
                                                }
                                                disabled={
                                                    actionLoading || isToggling
                                                }
                                                className="group/toggle inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                aria-label={`${category.isActive
                                                        ? "Disable"
                                                        : "Activate"
                                                    } ${category.name}`}
                                            >
                                                <span className="text-[9px] font-semibold text-[#8c7d74]">
                                                    {isToggling
                                                        ? "Updating..."
                                                        : category.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                </span>

                                                <span
                                                    className={`relative h-5 w-9 rounded-full p-0.5 transition-colors ${category.isActive
                                                            ? "bg-[#718b77]"
                                                            : "bg-[#c9beb7]"
                                                        }`}
                                                >
                                                    <span
                                                        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${category.isActive
                                                                ? "translate-x-4"
                                                                : "translate-x-0"
                                                            }`}
                                                    />

                                                    {isToggling && (
                                                        <Loader2
                                                            size={11}
                                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#6f625a]"
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        </div>

                                        {/* CARD FOOTER */}

                                        <div className="mt-3 flex items-center justify-between border-t border-[#f1ebe7] pt-3">
                                            <div>
                                                <p className="text-[9px] text-[#a39790]">
                                                    Created
                                                </p>

                                                <p className="mt-0.5 text-[10px] font-medium text-[#6e6058]">
                                                    {new Date(
                                                        category.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(category)
                                                }
                                                disabled={
                                                    actionLoading || isToggling
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8dfd9] px-2.5 py-1.5 text-[10px] font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] disabled:opacity-50"
                                            >
                                                <Edit3 size={12} />

                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

            {/* ========================= */}
            {/* CREATE / EDIT MODAL */}
            {/* ========================= */}

            {(modal === "create" || modal === "edit") && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#211914]/45 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee7e2] bg-white px-6 py-5">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a18d7f]">
                                    Category Management
                                </p>

                                <h2 className="mt-1 text-xl font-semibold text-[#30251f]">
                                    {modal === "create"
                                        ? "Create Category"
                                        : "Edit Category"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={actionLoading}
                                className="rounded-xl p-2.5 text-[#9c8e85] transition hover:bg-[#f7f2ef] hover:text-[#30251f] disabled:opacity-50"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                modal === "create"
                                    ? handleCreateCategory
                                    : handleUpdateCategory
                            }
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label
                                    htmlFor="category-name"
                                    className="mb-2 block text-xs font-semibold text-[#55483f]"
                                >
                                    Category Name
                                </label>

                                <input
                                    id="category-name"
                                    type="text"
                                    value={
                                        modal === "create"
                                            ? name
                                            : editName
                                    }
                                    onChange={(event) =>
                                        modal === "create"
                                            ? setName(event.target.value)
                                            : setEditName(
                                                event.target.value
                                            )
                                    }
                                    placeholder="e.g. Photography"
                                    required
                                    disabled={actionLoading}
                                    className="h-12 w-full rounded-xl border border-[#e7ded8] bg-[#fcfaf8] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="category-description"
                                    className="mb-2 block text-xs font-semibold text-[#55483f]"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="category-description"
                                    value={
                                        modal === "create"
                                            ? description
                                            : editDescription
                                    }
                                    onChange={(event) =>
                                        modal === "create"
                                            ? setDescription(
                                                event.target.value
                                            )
                                            : setEditDescription(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Describe what this category represents..."
                                    rows={4}
                                    required
                                    disabled={actionLoading}
                                    className="w-full resize-none rounded-xl border border-[#e7ded8] bg-[#fcfaf8] px-4 py-3 text-sm leading-6 text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="category-icon-url"
                                    className="mb-2 block text-xs font-semibold text-[#55483f]"
                                >
                                    Icon URL
                                </label>

                                <input
                                    id="category-icon-url"
                                    type="url"
                                    value={
                                        modal === "create"
                                            ? iconUrl
                                            : editIconUrl
                                    }
                                    onChange={(event) =>
                                        modal === "create"
                                            ? setIconUrl(event.target.value)
                                            : setEditIconUrl(
                                                event.target.value
                                            )
                                    }
                                    placeholder="https://example.com/icon.png"
                                    required
                                    disabled={actionLoading}
                                    className="h-12 w-full rounded-xl border border-[#e7ded8] bg-[#fcfaf8] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7]"
                                />

                                {(modal === "create"
                                    ? iconUrl
                                    : editIconUrl) && (
                                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#eee7e2] bg-[#faf8f6] p-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                                                <img
                                                    src={
                                                        modal === "create"
                                                            ? iconUrl
                                                            : editIconUrl
                                                    }
                                                    alt="Category icon preview"
                                                    className="h-9 w-9 object-contain"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-[#55483f]">
                                                    Icon preview
                                                </p>

                                                <p className="mt-0.5 max-w-87.5 truncate text-[10px] text-[#9d9087]">
                                                    {modal === "create"
                                                        ? iconUrl
                                                        : editIconUrl}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {actionError && (
                                <div className="rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
                                    <p className="text-xs font-medium text-[#a34f49]">
                                        {actionError}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-[#eee7e2] pt-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={actionLoading}
                                    className="rounded-xl border border-[#e5dcd6] px-5 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#43342c] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionLoading && (
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {modal === "create"
                                        ? actionLoading
                                            ? "Creating..."
                                            : "Create Category"
                                        : actionLoading
                                            ? "Saving..."
                                            : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================= */}
            {/* DELETE MODAL */}
            {/* ========================= */}

            {modal === "delete" && selectedCategory && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#211914]/45 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0ee] text-[#b45e57]">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#30251f]">
                            Delete Category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#8f8179]">
                            You&apos;re about to permanently delete{" "}
                            <strong className="font-semibold text-[#50423a]">
                                {selectedCategory.name}
                            </strong>
                            . This action cannot be undone.
                        </p>

                        {actionError && (
                            <div className="mt-5 rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
                                <p className="text-xs font-medium text-[#a34f49]">
                                    {actionError}
                                </p>
                            </div>
                        )}

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={actionLoading}
                                className="rounded-xl border border-[#e5dcd6] px-5 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#b85e57] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#a9514b] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {actionLoading && (
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}

                                {actionLoading
                                    ? "Deleting..."
                                    : "Delete Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
    label,
    value,
    icon,
    description,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    description: string;
}) {
    return (
        <div className="group rounded-xl border border-[#ebe3dd] bg-white px-3 py-3 shadow-[0_2px_10px_rgba(48,37,31,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(48,37,31,0.06)] sm:p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f1ed] text-[#806d61] transition group-hover:bg-[#30251f] group-hover:text-white sm:h-9 sm:w-9">
                    {icon}
                </div>

                <span className="hidden text-[9px] font-medium uppercase tracking-widest text-[#b0a29a] sm:block">
                    Overview
                </span>
            </div>

            <p className="mt-2 text-[10px] font-medium text-[#94867e] sm:mt-3 sm:text-xs">
                {label}
            </p>

            <div className="mt-0.5 flex items-end justify-between gap-2">
                <p className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl">
                    {value}
                </p>

                <p className="hidden pb-0.5 text-[9px] text-[#aaa098] sm:block">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ========================================================= */
/* HEADER SKELETON */
/* ========================================================= */

function CategoriesHeaderSkeleton() {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2.5">
                <div className="h-3 w-28 animate-pulse rounded bg-[#eee8e3]" />

                <div className="h-8 w-44 animate-pulse rounded-lg bg-[#eee8e3]" />

                <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#f3eee9]" />
            </div>

            <div className="flex gap-2.5">
                <div className="h-10 w-24 animate-pulse rounded-xl bg-[#eee8e3]" />

                <div className="h-10 w-32 animate-pulse rounded-xl bg-[#eee8e3]" />
            </div>
        </div>
    );
}

/* ========================================================= */
/* STATS SKELETON */
/* ========================================================= */

function StatsSkeleton() {
    return (
        <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-[#ebe3dd] bg-white px-3 py-3 shadow-[0_2px_10px_rgba(48,37,31,0.03)] sm:p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-[#eee8e3] sm:h-9 sm:w-9" />

                        <div className="hidden h-2.5 w-14 animate-pulse rounded bg-[#f3eee9] sm:block" />
                    </div>

                    <div className="mt-3 h-2.5 w-14 animate-pulse rounded bg-[#f0e9e4]" />

                    <div className="mt-1.5 h-6 w-10 animate-pulse rounded bg-[#eee8e3]" />
                </div>
            ))}
        </div>
    );
}

/* ========================================================= */
/* TOOLBAR SKELETON */
/* ========================================================= */

function ToolbarSkeleton() {
    return (
        <div className="mb-5 rounded-xl border border-[#ebe3dd] bg-white p-3">
            <div className="flex flex-col gap-2.5 lg:flex-row">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-[#f1ece8]" />

                <div className="h-10 w-full animate-pulse rounded-lg bg-[#f1ece8] sm:w-36" />

                <div className="hidden h-7 w-20 animate-pulse rounded bg-[#f5efeb] lg:block" />
            </div>
        </div>
    );
}

/* ========================================================= */
/* CATEGORY CARDS SKELETON */
/* ========================================================= */

function CategoriesSkeleton() {
    return (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-[#ebe3dd] bg-white shadow-[0_2px_10px_rgba(48,37,31,0.025)]"
                >
                    {/* IMAGE AREA */}

                    <div className="relative h-32 animate-pulse bg-[#f3eee9]">
                        {/* Fake status */}

                        <div className="absolute left-3 top-3 h-5 w-14 rounded-full bg-[#e9e2dd]" />

                        {/* Fake menu */}

                        <div className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-[#e9e2dd]" />

                        {/* Fake icon */}

                        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#e9e2dd]" />
                    </div>

                    {/* CONTENT */}

                    <div className="p-3.5">
                        {/* Name + Description */}

                        <div className="min-h-14.5">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-[#eee8e3]" />

                            <div className="mt-2.5 space-y-2">
                                <div className="h-2.5 w-full animate-pulse rounded bg-[#f2ede9]" />

                                <div className="h-2.5 w-4/5 animate-pulse rounded bg-[#f2ede9]" />
                            </div>
                        </div>

                        {/* SERVICES + TOGGLE */}

                        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f8f4f1] px-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                                {/* Icon */}

                                <div className="h-7 w-7 animate-pulse rounded-md bg-white" />

                                {/* Text */}

                                <div>
                                    <div className="h-2 w-12 animate-pulse rounded bg-[#e8e1dc]" />

                                    <div className="mt-1.5 h-3 w-6 animate-pulse rounded bg-[#e8e1dc]" />
                                </div>
                            </div>

                            {/* Toggle */}

                            <div className="flex items-center gap-2">
                                <div className="hidden h-2 w-12 animate-pulse rounded bg-[#e8e1dc] sm:block" />

                                <div className="h-5 w-9 animate-pulse rounded-full bg-[#dcd4ce]" />
                            </div>
                        </div>

                        {/* FOOTER */}

                        <div className="mt-3 flex items-center justify-between border-t border-[#f1ebe7] pt-3">
                            {/* Created */}

                            <div>
                                <div className="h-2 w-10 animate-pulse rounded bg-[#eee8e3]" />

                                <div className="mt-1.5 h-2.5 w-16 animate-pulse rounded bg-[#f2ede9]" />
                            </div>

                            {/* Edit */}

                            <div className="h-7 w-14 animate-pulse rounded-lg bg-[#f0e9e4]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
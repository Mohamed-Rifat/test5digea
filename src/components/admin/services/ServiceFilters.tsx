"use client";

import { Search } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextField, fieldClass } from "@/components/ui";
import type { Category } from "@/types/category";

interface ServiceFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  categoryFilter: string;
  onCategoryFilter: (value: string) => void;
  statusFilter: string;
  onStatusFilter: (value: string) => void;
  categories: Category[];
  categoriesLoading: boolean;
  statusOptions: string[];
  getStatusLabel: (status: string) => string;
  shown: number;
  total: number;
  onClear: () => void;
}

/** Search + category / status filters for the admin services list. */
export function ServiceFilters({
  search,
  onSearch,
  categoryFilter,
  onCategoryFilter,
  statusFilter,
  onStatusFilter,
  categories,
  categoriesLoading,
  statusOptions,
  getStatusLabel,
  shown,
  total,
  onClear,
}: ServiceFiltersProps) {
  const { t, localize } = useLanguage();
  const selectClass = `${fieldClass({ size: "sm" })} cursor-pointer`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_220px_220px]">
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t("admin.services.searchPlaceholder")}
          aria-label={t("admin.services.searchPlaceholder")}
          startIcon={<Search size={18} />}
          size="sm"
        />

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilter(event.target.value)}
          disabled={categoriesLoading}
          aria-label={t("admin.services.allCategories")}
          className={selectClass}
        >
          <option value="">{t("admin.services.allCategories")}</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {localize(category.name)}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => onStatusFilter(event.target.value)}
          aria-label={t("admin.services.allStatuses")}
          className={selectClass}
        >
          <option value="">{t("admin.services.allStatuses")}</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      {(search || categoryFilter || statusFilter) && (
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-800">{shown}</span>{" "}
            of <span className="font-medium text-gray-800">{total}</span>{" "}
            services
          </p>

          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-gray-600 transition hover:text-gray-900"
          >
            {t("admin.services.clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}

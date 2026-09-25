"use client";

import { Search, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import Select from "@/components/shared/Select";
import { TextField } from "@/components/ui";
import { SORT_OPTIONS, STATUS_FILTERS, VISIBILITY_FILTERS } from "./reviewUtils";
import type { ReviewFilters } from "./useVendorReviewsPage";

interface ReviewFilterFieldsProps {
  filters: ReviewFilters;
  serviceOptions: { id: string; name: string }[];
  className?: string;
}

/** Search + service / status / visibility / sort pickers (desktop bar & mobile drawer). */
export function ReviewFilterFields({ filters, serviceOptions, className = "" }: ReviewFilterFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className={className}>
      <TextField
        value={filters.searchQuery}
        onChange={(e) => filters.setSearchQuery(e.target.value)}
        placeholder={t("vendor.reviews.filters.searchPlaceholder")}
        aria-label={t("vendor.reviews.drawer.search")}
        startIcon={<Search size={16} />}
        endAdornment={
          filters.searchQuery ? (
            <button
              type="button"
              onClick={() => filters.setSearchQuery("")}
              aria-label={t("common.close")}
              className="text-[#9b8f86] hover:text-[#30251f]"
            >
              <X size={16} />
            </button>
          ) : undefined
        }
      />

      <Select
        value={filters.serviceFilter}
        onChange={filters.setServiceFilter}
        placeholder={t("vendor.reviews.filters.allServices")}
        emptyMessage={t("vendor.reviews.filters.noServices")}
        options={[
          { value: "all", label: t("vendor.reviews.filters.allServices") },
          ...serviceOptions.map((service) => ({ value: service.id, label: service.name })),
        ]}
      />

      <Select
        value={filters.statusFilter}
        onChange={filters.setStatusFilter}
        options={STATUS_FILTERS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
      />

      <Select
        value={filters.visibilityFilter}
        onChange={filters.setVisibilityFilter}
        options={VISIBILITY_FILTERS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
      />

      <Select
        value={filters.sortBy}
        onChange={(value) => filters.setSortBy(value as ReviewFilters["sortBy"])}
        placeholder={t("vendor.reviews.filters.sortPlaceholder")}
        options={SORT_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
      />
    </div>
  );
}

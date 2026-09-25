"use client";

import { Eye, EyeOff, Filter, Menu as MenuIcon } from "lucide-react";
import { Chip } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import { ReviewFilterFields } from "./ReviewFilterFields";
import { STATUS_FILTERS, VISIBILITY_FILTERS } from "./reviewUtils";
import type { ReviewFilters } from "./useVendorReviewsPage";

interface ReviewFiltersBarProps {
  filters: ReviewFilters;
  serviceOptions: { id: string; name: string }[];
  resultCount: number;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  onOpenDrawer: () => void;
  onClear: () => void;
}

/** Filters card: title, result count, the filter fields and active-filter chips. */
export function ReviewFiltersBar({
  filters,
  serviceOptions,
  resultCount,
  hasActiveFilters,
  activeFiltersCount,
  onOpenDrawer,
  onClear,
}: ReviewFiltersBarProps) {
  const { t } = useLanguage();

  return (
    <section className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm sm:mt-6 sm:p-4 lg:mt-8 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
            <Filter size={14} className="text-[#a47e43] sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">{t("vendor.reviews.filters.title")}</h2>
            <p className="hidden text-[10px] text-[#9b8f86] sm:mt-0.5 sm:block sm:text-[11px]">
              {t("vendor.reviews.filters.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[10px] text-[#91867f] sm:text-xs">
            <span className="font-medium text-[#5e5149]">{resultCount}</span>
            <span className="hidden sm:inline">
              {" "}{resultCount === 1 ? t("vendor.reviews.filters.resultOne") : t("vendor.reviews.filters.resultMany")}
            </span>
          </div>

          <button
            onClick={onOpenDrawer}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#665950] transition hover:border-[#cfc1b7] hover:bg-[#faf8f6] md:hidden"
          >
            <MenuIcon size={14} />
            {t("vendor.reviews.filters.button")}
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#a47e43] text-[8px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="hidden text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs md:inline"
            >
              {t("vendor.reviews.filters.clearAll")}
            </button>
          )}
        </div>
      </div>

      <ReviewFilterFields
      filters={filters}
      serviceOptions={serviceOptions}
      className="mt-4 hidden grid-cols-1 items-end gap-4 md:grid lg:grid-cols-[1fr_180px_170px_170px_180px]"
    />

    {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1ece8] pt-3 sm:gap-2 sm:pt-4">
          <span className="me-0.5 text-[9px] font-medium text-[#958a83] sm:me-1 sm:text-[11px]">{t("vendor.reviews.filters.active")}</span>

          {filters.searchQuery && (
            <Chip
              label={`"${filters.searchQuery}"`}
              onDelete={() => filters.setSearchQuery("")}
              size="small"
              sx={{
                height: 24,
                borderRadius: "6px",
                backgroundColor: "#f5eee9",
                color: "#5e5047",
                fontSize: "10px",
                fontWeight: 600,
                maxWidth: "120px",
                "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
              }}
            />
          )}

          {filters.serviceFilter !== "all" && (
            <Chip
              label={serviceOptions.find(s => s.id === filters.serviceFilter)?.name || t("vendor.reviews.filters.unknown")}
              onDelete={() => filters.setServiceFilter("all")}
              size="small"
              sx={{
                height: 24,
                borderRadius: "6px",
                backgroundColor: "#f5eee9",
                color: "#5e5047",
                fontSize: "10px",
                fontWeight: 600,
                maxWidth: "120px",
                "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
              }}
            />
          )}

          {filters.statusFilter !== "all" && (
            <Chip
              label={(() => { const f = STATUS_FILTERS.find(s => s.value === filters.statusFilter); return f ? t(f.labelKey) : t("vendor.reviews.filters.unknown"); })()}
              onDelete={() => filters.setStatusFilter("all")}
              size="small"
              sx={{
                height: 24,
                borderRadius: "6px",
                backgroundColor: "#f5eee9",
                color: "#5e5047",
                fontSize: "10px",
                fontWeight: 600,
                "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
              }}
            />
          )}

          {/* ✅ Chip للـ Visibility */}
          {filters.visibilityFilter !== "all" && (
            <Chip
              icon={filters.visibilityFilter === "visible" ? <Eye size={12} /> : <EyeOff size={12} />}
              label={(() => { const f = VISIBILITY_FILTERS.find(s => s.value === filters.visibilityFilter); return f ? t(f.labelKey) : t("vendor.reviews.filters.unknown"); })()}
              onDelete={() => filters.setVisibilityFilter("all")}
              size="small"
              sx={{
                height: 24,
                borderRadius: "6px",
                backgroundColor: filters.visibilityFilter === "visible" ? "#ecfdf5" : "#fef2f2",
                color: filters.visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                fontSize: "10px",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: filters.visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                },
                "& .MuiChip-deleteIcon": {
                  width: 13,
                  height: 13,
                  color: filters.visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                },
              }}
            />
          )}

          <button
            onClick={onClear}
            className="text-[9px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
          >
            {t("vendor.reviews.filters.clearAll")}
          </button>
        </div>
      )}
    </section>
  );
}

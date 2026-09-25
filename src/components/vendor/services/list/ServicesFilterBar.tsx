"use client";

import { Filter, Search, X } from "lucide-react";
import { Chip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import SharedSelect from "@/components/shared/Select";
import { TextField } from "@/components/ui";
import type { VendorServicesListState } from "./useVendorServicesList";
import {
  STATUS_FILTERS,
  type StatusFilter,
} from "@/components/vendor/services/list/servicesListConfig";

/** Search box, status filter and active-filter chips. */
export function ServicesFilterBar({ list }: { list: VendorServicesListState }) {
  const { t } = useLanguage();
  const {
    statusFilter,
    searchQuery,
    setSearchQuery,
    handleStatusFilterChange,
    handleClearSearch,
  } = list;

  return (
    <div className="mb-4 rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5eee9] sm:h-8 sm:w-8">
            <Filter size={12} className="text-[#a47e43] sm:h-3.5 sm:w-3.5" />
          </div>
          <span className="text-xs font-medium text-[#40352f] sm:text-sm">
            {t("vendor.services.list.filter")}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* Search */}
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("vendor.services.list.searchPlaceholder")}
            aria-label={t("vendor.services.list.searchPlaceholder")}
            startIcon={<Search size={15} />}
            size="sm"
            containerClassName="flex-1"
            endAdornment={
              searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#9b8f86] hover:text-[#30251f]"
                >
                  <X size={15} />
                </button>
              ) : undefined
            }
          />

          {/* Status Filter Buttons - Desktop */}
          <div className="hidden flex-wrap gap-1 sm:flex">
            {STATUS_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    handleStatusFilterChange(filter.value as StatusFilter)
                  }
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${
                    isActive
                      ? "bg-[#30251f] text-white"
                      : "border border-[#e3d9d1] bg-white text-[#514740] hover:bg-[#f7f2ef]"
                  }`}
                >
                  <Icon
                    size={12}
                    className={isActive ? "text-white" : "text-[#8d8077]"}
                  />
                  {t(filter.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Status Filter - Mobile Dropdown */}
          <div className="sm:hidden">
            <SharedSelect
              value={statusFilter}
              onChange={(value) =>
                handleStatusFilterChange(value as StatusFilter)
              }
              options={STATUS_FILTERS.map((filter) => ({
                value: filter.value,
                label: t(filter.labelKey),
              }))}
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(statusFilter !== "All" || searchQuery) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1ece8] pt-3">
          <span className="text-[9px] font-medium text-[#958a83] sm:text-[10px]">
            {t("vendor.services.list.activeFilters")}
          </span>

          {statusFilter !== "All" && (
            <Chip
              label={t(
                STATUS_FILTERS.find((f) => f.value === statusFilter)
                  ?.labelKey ?? "vendor.services.list.filterAll",
              )}
              onDelete={() => handleStatusFilterChange("All")}
              size="small"
              sx={{
                height: 22,
                borderRadius: "6px",
                backgroundColor: "#f5eee9",
                color: "#5e5047",
                fontSize: "9px",
                fontWeight: 600,
                "& .MuiChip-deleteIcon": {
                  width: 12,
                  height: 12,
                  color: "#8b776a",
                },
              }}
            />
          )}

          {searchQuery && (
            <Chip
              label={`"${searchQuery}"`}
              onDelete={handleClearSearch}
              size="small"
              sx={{
                height: 22,
                borderRadius: "6px",
                backgroundColor: "#f5eee9",
                color: "#5e5047",
                fontSize: "9px",
                fontWeight: 600,
                maxWidth: "120px",
                "& .MuiChip-deleteIcon": {
                  width: 12,
                  height: 12,
                  color: "#8b776a",
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

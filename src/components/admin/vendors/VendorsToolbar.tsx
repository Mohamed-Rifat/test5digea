"use client";

import { ChevronDown, Search, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import { TextField, fieldClass } from "@/components/ui";
import { getStatusClasses, getStatusDot, type VendorStatusFilter } from "./vendorStatus";

interface VendorsToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  statusFilter: VendorStatusFilter;
  onStatusFilter: (value: VendorStatusFilter) => void;
  shown: number;
  total: number;
}

/** Search box, status dropdown and the "showing X of Y" line. */
export default function VendorsToolbar({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  shown,
  total,
}: VendorsToolbarProps) {
  const { t } = useLanguage();
  const hasFilters = Boolean(search || statusFilter !== "all");

  const clearFilters = () => {
    onSearch("");
    onStatusFilter("all");
  };

  return (
    <>
      <section className="mb-5 rounded-[24px] border border-[#e9e1dc] bg-white p-4 shadow-[0_8px_30px_rgba(48,37,31,0.035)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <TextField
            type="text"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={t("admin.vendors.searchPlaceholder")}
            aria-label={t("admin.vendors.searchPlaceholder")}
            startIcon={<Search size={17} />}
            containerClassName="min-w-0 flex-1"
            endAdornment={
              search ? (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8c817a] transition hover:bg-[#f3efec] hover:text-[#30251f]"
                  aria-label={t("admin.ui.clearSearch")}
                >
                  <X size={14} />
                </button>
              ) : undefined
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end xl:w-auto">
            <div className="relative min-w-[190px]">
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilter(event.target.value as VendorStatusFilter)}
                aria-label={t("admin.vendors.status")}
                className={`${fieldClass()} pe-8 font-medium`}
              >
                <option value="all">{t("admin.vendors.allStatuses")}</option>
                <option value="Pending">{t("admin.vendors.statusPending")}</option>
                <option value="Approved">{t("admin.vendors.statusApproved")}</option>
                <option value="Rejected">{t("admin.vendors.statusRejected")}</option>
                <option value="Inactive">{t("admin.vendors.statusInactive")}</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-[#8f857f]"
              />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-2xl border border-[#e0d8d3] bg-white px-4 text-sm font-semibold text-[#675b54] transition hover:bg-[#f8f5f3]"
              >
                {t("admin.vendors.clearFilters")}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm font-medium text-[#766b65]">
          {shown === total
            ? t("admin.vendors.allCount", { count: shown })
            : t("admin.vendors.showingCount", { shown, total })}
        </p>

        {statusFilter !== "all" && (
          <button
            type="button"
            onClick={() => onStatusFilter("all")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
              statusFilter as Vendor["status"]
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(statusFilter as Vendor["status"])}`}
            />
            {statusFilter}
            <X size={12} />
          </button>
        )}
      </div>
    </>
  );
}

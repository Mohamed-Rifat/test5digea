"use client";

import { Search, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import Select from "@/components/shared/Select";
import { TextField } from "@/components/ui";
import { VISIBILITY_FILTERS } from "./reviewAdminUtils";
import type { ApprovedReviewsState } from "./useApprovedReviews";

type Props = Pick<
  ApprovedReviewsState,
  | "vendors"
  | "servicesForVendor"
  | "vendorFilter"
  | "setVendorFilter"
  | "serviceFilter"
  | "setServiceFilter"
  | "visibilityFilter"
  | "setVisibilityFilter"
  | "searchQuery"
  | "setSearchQuery"
>;

/** Vendor / service / visibility pickers + search box. */
export function ApprovedReviewsFilters({
  vendors,
  servicesForVendor,
  vendorFilter,
  setVendorFilter,
  serviceFilter,
  setServiceFilter,
  visibilityFilter,
  setVisibilityFilter,
  searchQuery,
  setSearchQuery,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="border-b border-[#f0eae5] bg-[#fcfaf8] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FilterLabel text={t("admin.reviews.vendor")}>
          <Select
            value={vendorFilter}
            onChange={(value) => {
              setVendorFilter(value);
              setServiceFilter("all");
            }}
            options={[
              {
                value: "all",
                label: `${t("admin.reviews.allVendors")} (${vendors.length})`,
              },
              ...vendors.map((v) => ({
                value: v.id,
                label: v.name,
                description: String(v.count),
              })),
            ]}
          />
        </FilterLabel>

        <FilterLabel text={t("admin.reviews.service")}>
          <Select
            value={serviceFilter}
            onChange={setServiceFilter}
            options={[
              {
                value: "all",
                label: `${t("admin.reviews.allServices")} (${servicesForVendor.length})`,
              },
              ...servicesForVendor.map((s) => ({
                value: s.id,
                label: s.name,
                description: String(s.count),
              })),
            ]}
          />
        </FilterLabel>

        <FilterLabel text={t("admin.reviews.visibility")}>
          <Select
            value={visibilityFilter}
            onChange={setVisibilityFilter}
            options={VISIBILITY_FILTERS.map((option) => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
          />
        </FilterLabel>
      </div>

      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("admin.reviews.searchPlaceholder")}
        aria-label={t("admin.reviews.searchPlaceholder")}
        startIcon={<Search size={15} />}
        containerClassName="mt-4"
        endAdornment={
          searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[#9b8f86] hover:text-[#30251f]"
            >
              <X size={15} />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}

function FilterLabel({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-[#a59a92]">{text}</p>
      {children}
    </div>
  );
}

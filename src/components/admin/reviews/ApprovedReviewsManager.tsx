"use client";

import { AlertCircle, Eye, EyeOff, RefreshCw, Search, X } from "lucide-react";
import { Chip } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import { ApprovedManagerSkeleton } from "./AdminReviewsSkeletons";
import { ApprovedReviewItem } from "./ApprovedReviewItem";
import { ApprovedReviewsFilters } from "./ApprovedReviewsFilters";
import { VisibilityStatButtons } from "./VisibilityStatButtons";
import { VISIBILITY_FILTERS } from "./reviewAdminUtils";
import { useApprovedReviews } from "./useApprovedReviews";

/** Admin panel listing approved reviews with show / hide toggles. */
export function ApprovedReviewsManager() {
  const { t } = useLanguage();
  const state = useApprovedReviews();
  const {
    allReviews,
    loading,
    error,
    busyId,
    vendors,
    filteredReviews,
    stats,
    visibilityFilter,
    setVisibilityFilter,
    searchQuery,
    setSearchQuery,
    loadReviews,
    handleToggle,
    hasActiveFilters,
    hasReviewFilters,
    clearAll,
    clearReviewFilters,
  } = state;

  if (loading) {
    return <ApprovedManagerSkeleton />;
  }

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
      <div className="border-b border-[#f0eae5] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5eee9]">
            <Eye size={18} className="text-[#a47e43]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
              {t("admin.reviews.manageApproved")}
            </h3>
            <p className="mt-0.5 text-[11px] text-[#9b8f86] sm:text-xs">
              {allReviews.length} approved reviews across {vendors.length}{" "}
              vendors
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadReviews}
              disabled={loading}
              aria-label={t("admin.reviews.refresh")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#665950] transition hover:bg-[#faf8f6] disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">
                {t("admin.reviews.refresh")}
              </span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="hidden items-center gap-1.5 rounded-lg border border-[#e3d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#665950] transition hover:bg-[#faf8f6] sm:inline-flex"
              >
                <X size={12} />
                {t("admin.reviews.clearAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      <ApprovedReviewsFilters
        vendors={state.vendors}
        servicesForVendor={state.servicesForVendor}
        vendorFilter={state.vendorFilter}
        setVendorFilter={state.setVendorFilter}
        serviceFilter={state.serviceFilter}
        setServiceFilter={state.setServiceFilter}
        visibilityFilter={visibilityFilter}
        setVisibilityFilter={setVisibilityFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {error && (
        <div className="p-5">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {t("admin.reviews.error")}
              </p>
              <p className="mt-0.5 text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <div className="p-4 sm:p-5">
          <VisibilityStatButtons
            stats={stats}
            visibilityFilter={visibilityFilter}
            onChange={setVisibilityFilter}
          />

          {hasReviewFilters && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-[#f1ece8] pb-3">
              <span className="text-[10px] font-medium text-[#958a83]">
                {t("admin.reviews.activeFilter")}
              </span>

              {visibilityFilter !== "all" && (
                <Chip
                  icon={
                    visibilityFilter === "visible" ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )
                  }
                  label={(() => {
                    const filter = VISIBILITY_FILTERS.find(
                      (f) => f.value === visibilityFilter,
                    );
                    return filter ? t(filter.labelKey) : "";
                  })()}
                  onDelete={() => setVisibilityFilter("all")}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor:
                      visibilityFilter === "visible" ? "#ecfdf5" : "#fef2f2",
                    color:
                      visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    "& .MuiChip-icon": {
                      color:
                        visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                    "& .MuiChip-deleteIcon": {
                      width: 13,
                      height: 13,
                      color:
                        visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                  }}
                />
              )}

              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    "& .MuiChip-deleteIcon": {
                      width: 13,
                      height: 13,
                      color: "#8b776a",
                    },
                  }}
                />
              )}

              <button
                onClick={clearReviewFilters}
                className="text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f]"
              >
                {t("admin.reviews.clear")}
              </button>
            </div>
          )}

          {filteredReviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] px-4 py-8 text-center">
              <Search className="mx-auto h-6 w-6 text-[#a47e43]" />
              <p className="mt-2 text-xs text-[#756b65] sm:text-sm">
                {allReviews.length === 0
                  ? t("admin.reviews.noApproved")
                  : t("admin.reviews.noMatch")}
              </p>
              {hasReviewFilters && (
                <button
                  onClick={clearReviewFilters}
                  className="mt-2 text-xs font-medium text-[#a47e43] hover:underline"
                >
                  {t("admin.reviews.clearFilters")}
                </button>
              )}
            </div>
          )}

          {filteredReviews.length > 0 && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                  Showing{" "}
                  <span className="font-semibold text-[#30251f]">
                    {filteredReviews.length}
                  </span>{" "}
                  of {allReviews.length} reviews
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-[#9b8f86] sm:text-[10px]">
                      {t("admin.reviews.visible")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-[9px] text-[#9b8f86] sm:text-[10px]">
                      {t("admin.reviews.hidden")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {filteredReviews.map((review) => (
                  <ApprovedReviewItem
                    key={review.id}
                    review={review}
                    isBusy={busyId === review.id}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

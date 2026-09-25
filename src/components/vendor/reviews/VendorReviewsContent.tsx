"use client";

import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { ReviewDetailModal } from "./ReviewDetailModal";
import { ReviewFiltersBar } from "./ReviewFiltersBar";
import { ReviewStatsGrid } from "./ReviewStatsGrid";
import { ReviewsPageHeader } from "./ReviewsPageHeader";
import { ReviewsResults } from "./ReviewsResults";
import { useVendorReviewsPage } from "./useVendorReviewsPage";

/** Vendor "My reviews" page body; state lives in `useVendorReviewsPage`. */
export function VendorReviewsContent() {
  const page = useVendorReviewsPage();

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <ReviewsPageHeader
          isRefreshing={page.isRefreshing}
          onRefresh={page.handleRefresh}
          onExport={page.handleExportAll}
          canExport={page.reviews.length > 0}
        />

        <ReviewStatsGrid stats={page.stats} />

        <ReviewFiltersBar
          filters={page.filters}
          serviceOptions={page.serviceOptions}
          resultCount={page.filteredReviews.length}
          hasActiveFilters={page.hasActiveFilters}
          activeFiltersCount={page.activeFiltersCount}
          onOpenDrawer={() => page.setFilterDrawerOpen(true)}
          onClear={page.handleClearFilters}
        />

        <ReviewsResults
          loading={page.loading}
          error={page.error}
          total={page.reviews.length}
          filteredCount={page.filteredReviews.length}
          displayedReviews={page.displayedReviews}
          hasMore={page.hasMore}
          onRefresh={page.handleRefresh}
          onClearFilters={page.handleClearFilters}
          onLoadMore={page.handleLoadMore}
          onView={page.setPickedReview}
        />

        <MobileFilterDrawer
          open={page.filterDrawerOpen}
          onClose={() => page.setFilterDrawerOpen(false)}
          filters={page.filters}
          serviceOptions={page.serviceOptions}
          hasActiveFilters={page.hasActiveFilters}
          clearFilters={page.handleClearFilters}
        />

        {page.selectedReview && (
          <ReviewDetailModal review={page.selectedReview} onClose={page.closeReview} />
        )}
      </div>
    </div>
  );
}

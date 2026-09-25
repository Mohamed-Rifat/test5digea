"use client";

import { useMemo, useState, useCallback } from "react";
import { useVendorContext } from "@/context/VendorContext";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { ReviewStatus } from "@/types/review";

/** Vendor + services + reviews for the dashboard, and the derived stats. */
export function useVendorDashboard() {
  const {
    vendor,
    loading: vendorLoading,
    error: vendorError,
    refetch: refetchVendor,
  } = useVendorContext();
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useVendorServices();
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useVendorReviews();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loading = vendorLoading || servicesLoading || reviewsLoading;

  const stats = useMemo(() => {
    const totalServices = services.length;
    const approvedServices = services.filter(
      (s) => s.status === "Approved",
    ).length;
    const pendingServices = services.filter(
      (s) => s.status === "Pending",
    ).length;
    const rejectedServices = services.filter(
      (s) => s.status === "Rejected",
    ).length;

    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(
      (r) => r.status === ReviewStatus.Approved,
    ).length;
    const pendingReviews = reviews.filter(
      (r) => r.status === ReviewStatus.Pending,
    ).length;
    const rejectedReviews = reviews.filter(
      (r) => r.status === ReviewStatus.Rejected,
    ).length;

    const avgRating =
      approvedReviews > 0
        ? reviews
            .filter((r) => r.status === ReviewStatus.Approved)
            .reduce((acc, r) => acc + r.rating, 0) / approvedReviews
        : 0;

    const approvalRate =
      totalServices > 0 ? (approvedServices / totalServices) * 100 : 0;

    const ratingCounts = [0, 0, 0, 0, 0];
    reviews
      .filter((r) => r.status === ReviewStatus.Approved)
      .forEach((r) => {
        if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
      });
    const fiveStarRate =
      approvedReviews > 0 ? (ratingCounts[4] / approvedReviews) * 100 : 0;

    return {
      totalServices,
      approvedServices,
      pendingServices,
      rejectedServices,
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      avgRating,
      approvalRate,
      fiveStarRate,
      ratingCounts,
    };
  }, [services, reviews]);

  // "Latest reviews" must really be the newest ones, whatever order the API returns.
  const recentReviews = useMemo(
    () =>
      [...reviews]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [reviews],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchVendor(), refetchServices(), refetchReviews()]);
    setIsRefreshing(false);
  }, [refetchVendor, refetchServices, refetchReviews]);

  return {
    vendor,
    services,
    reviews,
    loading,
    hasError: !!(vendorError || servicesError || reviewsError),
    stats,
    recentReviews,
    isRefreshing,
    handleRefresh,
  };
}

export type VendorDashboardStats = ReturnType<
  typeof useVendorDashboard
>["stats"];

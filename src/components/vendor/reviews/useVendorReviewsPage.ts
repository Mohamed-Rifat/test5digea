"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";

import { exportReviewsToExcel } from "./exportReviews";
import { PAGE_SIZE } from "./reviewUtils";

export type ReviewSort = "newest" | "oldest" | "highest" | "lowest";

export interface ReviewFilters {
  serviceFilter: string;
  setServiceFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  visibilityFilter: string;
  setVisibilityFilter: (value: string) => void;
  sortBy: ReviewSort;
  setSortBy: (value: ReviewSort) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

/** State, filtering and actions of the vendor "My reviews" page. */
export function useVendorReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { vendor } = useVendorContext();
  const { services } = useVendorServices();
  const { reviews, loading, error, refetch } = useVendorReviews();

  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<ReviewSort>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pickedReview, setPickedReview] = useState<Review | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  /* =======================================================
     Review details (opened by the "View" button or by a link
     such as /vendor/reviews?review=<id> from the dashboard)
  ======================================================= */

  const deepLinkId = searchParams.get("review");

  const linkedReview = useMemo(
    () =>
      deepLinkId
        ? reviews.find((review) => review.id === deepLinkId) ?? null
        : null,
    [deepLinkId, reviews]
  );

  const selectedReview = pickedReview ?? linkedReview;

  const closeReview = useCallback(() => {
    setPickedReview(null);

    if (deepLinkId) {
      router.replace("/vendor/reviews", { scroll: false });
    }
  }, [deepLinkId, router]);

  useEffect(() => {
    if (!selectedReview) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeReview();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedReview, closeReview]);

  /* =======================================================
     Stats
  ======================================================= */

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
    const pending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
    const rejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
    const visible = reviews.filter(r => r.status === ReviewStatus.Approved && r.isDisplayed).length;
    const hidden = reviews.filter(r => r.status === ReviewStatus.Approved && !r.isDisplayed).length;
    const averageRating = reviews
      .filter(r => r.status === ReviewStatus.Approved)
      .reduce((acc, r) => acc + r.rating, 0) / (approved || 1);

    return {
      total,
      approved,
      pending,
      rejected,
      visible,
      hidden,
      averageRating: averageRating || 0,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
    };
  }, [reviews]);

  /* =======================================================
     Service Options
  ======================================================= */

  const serviceOptions = useMemo(() => {
    const known = new Map<string, string>();
    services.forEach((service) => known.set(service.id, service.name));
    reviews.forEach((review) => {
      if (!known.has(review.serviceId)) known.set(review.serviceId, review.serviceName);
    });
    return Array.from(known.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ id, name }));
  }, [services, reviews]);

  /* =======================================================
     ✅ Filtering - مع فلتر الـ Visibility
  ======================================================= */

  const filteredReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const matchesService = serviceFilter === "all" || review.serviceId === serviceFilter;
      const matchesStatus = statusFilter === "all" || String(review.status) === statusFilter;
      const matchesSearch = searchQuery === "" ||
        review.userFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      // ✅ فلتر الـ Visibility
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && review.status === ReviewStatus.Approved && review.isDisplayed) ||
        (visibilityFilter === "hidden" && review.status === ReviewStatus.Approved && !review.isDisplayed);

      return matchesService && matchesStatus && matchesSearch && matchesVisibility;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, serviceFilter, statusFilter, visibilityFilter, searchQuery, sortBy]);

  const displayedReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const hasMore = displayedReviews.length < filteredReviews.length;
  const hasActiveFilters =
    serviceFilter !== "all" ||
    statusFilter !== "all" ||
    visibilityFilter !== "all" ||
    searchQuery !== "";

  const activeFiltersCount = [
    serviceFilter !== "all",
    statusFilter !== "all",
    visibilityFilter !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  /* =======================================================
     Handlers
  ======================================================= */

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setServiceFilter("all");
    setStatusFilter("all");
    setVisibilityFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const vendorDisplayName = vendor?.businessName || t("vendor.header.vendor");

  const runExport = useCallback(
    (list: Review[]) => {
      try {
        const exported = exportReviewsToExcel(list, t, language, vendorDisplayName);
        if (exported) {
          toast(t("vendor.reviews.excel.exportSuccess"), "success");
        } else {
          toast(t("vendor.reviews.excel.nothingToExport"), "warning");
        }
      } catch {
        toast(t("common.errorTitle"), "error");
      }
    },
    [vendorDisplayName, t, language, toast]
  );

  const handleExportAll = useCallback(() => runExport(reviews), [runExport, reviews]);


  const filters: ReviewFilters = {
    serviceFilter,
    setServiceFilter,
    statusFilter,
    setStatusFilter,
    visibilityFilter,
    setVisibilityFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };

  return {
    reviews,
    loading,
    error,
    stats,
    serviceOptions,
    filters,
    filteredReviews,
    displayedReviews,
    hasMore,
    hasActiveFilters,
    activeFiltersCount,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
    handleClearFilters,
    handleExportAll,
    filterDrawerOpen,
    setFilterDrawerOpen,
    selectedReview,
    setPickedReview,
    closeReview,
  };
}

export type VendorReviewsPageState = ReturnType<typeof useVendorReviewsPage>;

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import {
  fetchApprovedReviews,
  toggleReviewDisplay,
} from "@/features/reviews/api";
import type { Review } from "@/types/review";

/** Approved reviews + vendor / service / visibility / search filters. */
export function useApprovedReviews() {
  const { t } = useLanguage();

  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApprovedReviews();
      setAllReviews(data);
    } catch {
      setError(t("admin.reviews.loadApprovedFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const vendors = useMemo(() => {
    const vendorMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();

    allReviews.forEach((r) => {
      const vendorName = r.vendorBusinessName || t("admin.dashboard.unknown");
      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          id: vendorName,
          name: vendorName,
          count: 0,
        });
      }
      vendorMap.get(vendorName)!.count += 1;
    });

    return Array.from(vendorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allReviews, t]);

  const servicesForVendor = useMemo(() => {
    let filtered = allReviews;

    if (vendorFilter !== "all") {
      filtered = filtered.filter((r) => r.vendorBusinessName === vendorFilter);
    }

    const serviceMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();

    filtered.forEach((r) => {
      if (!serviceMap.has(r.serviceId)) {
        serviceMap.set(r.serviceId, {
          id: r.serviceId,
          name: r.serviceName,
          count: 0,
        });
      }
      serviceMap.get(r.serviceId)!.count += 1;
    });

    return Array.from(serviceMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allReviews, vendorFilter]);

  const filteredReviews = useMemo(() => {
    let result = allReviews;

    if (vendorFilter !== "all") {
      result = result.filter((r) => r.vendorBusinessName === vendorFilter);
    }

    if (serviceFilter !== "all") {
      result = result.filter((r) => r.serviceId === serviceFilter);
    }

    if (visibilityFilter === "visible") {
      result = result.filter((r) => r.isDisplayed);
    } else if (visibilityFilter === "hidden") {
      result = result.filter((r) => !r.isDisplayed);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.userFullName?.toLowerCase().includes(query) ||
          r.comment?.toLowerCase().includes(query) ||
          r.serviceName?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [allReviews, vendorFilter, serviceFilter, visibilityFilter, searchQuery]);

  const stats = useMemo(() => {
    let baseReviews = allReviews;
    if (vendorFilter !== "all") {
      baseReviews = baseReviews.filter(
        (r) => r.vendorBusinessName === vendorFilter,
      );
    }
    if (serviceFilter !== "all") {
      baseReviews = baseReviews.filter((r) => r.serviceId === serviceFilter);
    }

    const total = baseReviews.length;
    const visible = baseReviews.filter((r) => r.isDisplayed).length;
    const hidden = total - visible;

    return { total, visible, hidden };
  }, [allReviews, vendorFilter, serviceFilter]);

  const handleToggle = async (review: Review) => {
    try {
      setBusyId(review.id);
      await toggleReviewDisplay(review.id, {
        isDisplayed: !review.isDisplayed,
      });
      setAllReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, isDisplayed: !r.isDisplayed } : r,
        ),
      );
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const hasActiveFilters =
    vendorFilter !== "all" ||
    serviceFilter !== "all" ||
    visibilityFilter !== "all" ||
    searchQuery !== "";

  const clearAll = () => {
    setVendorFilter("all");
    setServiceFilter("all");
    setVisibilityFilter("all");
    setSearchQuery("");
  };

  const clearReviewFilters = () => {
    setVisibilityFilter("all");
    setSearchQuery("");
  };

  const hasReviewFilters = visibilityFilter !== "all" || searchQuery !== "";

  return {
    allReviews,
    loading,
    error,
    busyId,
    vendors,
    servicesForVendor,
    filteredReviews,
    stats,
    vendorFilter,
    setVendorFilter,
    serviceFilter,
    setServiceFilter,
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
  };
}

export type ApprovedReviewsState = ReturnType<typeof useApprovedReviews>;

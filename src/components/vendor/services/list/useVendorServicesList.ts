"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { type StatusFilter } from "@/components/vendor/services/list/servicesListConfig";

/** Vendor services list: stats, search / status filter and actions. */
export function useVendorServicesList() {
  const {
    services,
    loading,
    error,
    actionLoading,
    actionError,
    refetch,
    resubmit,
  } = useVendorServices();

  const searchParams = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const urlQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);

  // The header search box navigates to /vendor/services?q=... - follow it
  // even when this page is already open (state initialised only once).
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ إحصائيات سريعة
  const stats = useMemo(() => {
    const total = services.length;
    const approved = services.filter((s) => s.status === "Approved").length;
    const pending = services.filter((s) => s.status === "Pending").length;
    const rejected = services.filter((s) => s.status === "Rejected").length;
    const inactive = services.filter((s) => s.status === "Inactive").length;

    return {
      total,
      approved,
      pending,
      rejected,
      inactive,
    };
  }, [services]);

  // ✅ فلترة الخدمات
  const filteredServices = useMemo(() => {
    let filtered = services;

    // فلترة حسب الحالة
    if (statusFilter !== "All") {
      filtered = filtered.filter((service) => service.status === statusFilter);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.categoryName?.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [services, statusFilter, searchQuery]);

  // ✅ تحديث البيانات
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // ✅ إعادة الإرسال
  const handleResubmit = useCallback(
    async (id: string) => {
      await resubmit(id);
    },
    [resubmit],
  );

  // ✅ تغيير الفلتر
  const handleStatusFilterChange = useCallback((filter: StatusFilter) => {
    setStatusFilter(filter);
  }, []);

  // ✅ مسح البحث
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchParams,
    statusFilter,
    setStatusFilter,
    urlQuery,
    searchQuery,
    setSearchQuery,
    lastUrlQuery,
    setLastUrlQuery,
    isRefreshing,
    setIsRefreshing,
    stats,
    filteredServices,
    handleRefresh,
    handleResubmit,
    handleStatusFilterChange,
    handleClearSearch,
    services,
    loading,
    error,
    actionLoading,
    actionError,
    refetch,
    resubmit,
  };
}

export type VendorServicesListState = ReturnType<typeof useVendorServicesList>;

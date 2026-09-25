"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVendorContext } from "@/context/VendorContext";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { ReviewStatus } from "@/types/review";

/** Sidebar data: vendor status, counters, active-link check and logout. */
export function useVendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const { vendor, loading: vendorLoading } = useVendorContext();
  const { services, loading: servicesLoading } = useVendorServices();
  const { reviews, loading: reviewsLoading } = useVendorReviews();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await logout();

    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/vendor") {
      return pathname === "/vendor";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // حساب الإحصائيات الحقيقية
  const totalServices = services.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(
    (r) => r.status === ReviewStatus.Pending,
  ).length;

  // Vendor status config
  const statusConfig = {
    Approved: {
      labelKey: "vendor.status.approved" as const,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    Pending: {
      labelKey: "vendor.status.pending" as const,
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dotColor: "bg-amber-500",
    },
    Rejected: {
      labelKey: "vendor.status.rejected" as const,
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    },
    Inactive: {
      labelKey: "vendor.status.inactive" as const,
      className: "bg-gray-100 text-gray-600 border-gray-200",
      dotColor: "bg-gray-500",
    },
  };

  const status = vendor?.status
    ? statusConfig[vendor.status as keyof typeof statusConfig]
    : statusConfig.Pending;

  const loading = vendorLoading || servicesLoading || reviewsLoading;

  return {
    pathname,
    router,
    isLoggingOut,
    setIsLoggingOut,
    handleLogout,
    isActive,
    totalServices,
    totalReviews,
    pendingReviews,
    statusConfig,
    status,
    loading,
    logout,
    vendor,
    vendorLoading,
    services,
    servicesLoading,
    reviews,
    reviewsLoading,
  };
}

export type VendorSidebarState = ReturnType<typeof useVendorSidebar>;

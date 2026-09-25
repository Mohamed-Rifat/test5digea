"use client";

import { useMemo } from "react";
import {
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  Mail,
  MessageSquare,
  ShieldCheck,
  Star,
  Store,
  Tags,
  UserX,
  Users,
} from "lucide-react";

import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";
import { useModerationDashboard } from "@/features/moderation/hooks/useModerationDashboard";
import { useServices } from "@/features/services/hooks/useServices";
import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";
import { useContactMessagesAdmin } from "@/features/contactMessages/hooks/useContactMessagesAdmin";
import type { ModerationQueueItem } from "@/types/moderation";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales";

import {
  CHART_COLORS,
  buildGrowthSeries,
  buildRatingDistribution,
  formatRating,
  isApproved,
  isInactive,
  isPending,
  isRejected,
} from "./utils";

export interface DashboardStat {
  title: string;
  value: number | string;
  description: string;
  icon: typeof Tags;
  href?: string;
}

export type VendorStats = ReturnType<typeof useAdminDashboard>["vendorStats"];

/**
 * Loads everything the admin dashboard shows and derives the numbers,
 * chart series and lists from it. The page only lays the sections out.
 */
export function useAdminDashboard() {
  const { t, language, localize } = useLanguage();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAdminCategories();

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();

  const {
    vendors,
    loading: vendorsLoading,
    error: vendorsError,
  } = useAdminVendors();

  const {
    summary: dashboardSummary,
    loading: dashboardLoading,
    error: dashboardError,
  } = useModerationDashboard();

  // Only need the count, so page 1 with a small page size is enough.
  const { totalCount: unhandledMessagesCount } = useContactMessagesAdmin({
    isHandled: false,
    page: 1,
    pageSize: 1,
  });

  const loading =
    categoriesLoading || servicesLoading || vendorsLoading || dashboardLoading;

  const error =
    categoriesError || servicesError || vendorsError || dashboardError;

  const recentRequests: ModerationQueueItem[] =
    dashboardSummary?.recentRequests ?? [];

  /* ========================================================= */
  /* CATEGORY STATS */
  /* ========================================================= */

  const totalCategories = categories.length;

  const totalServices = services.length;

  const categoryStats = useMemo(() => {
    return categories
      .map((category) => {
        const serviceCount = services.filter(
          (service) => service.categoryId === category.id
        ).length;

        return { ...category, name: localize(category.name), serviceCount };
      })
      .sort((a, b) => b.serviceCount - a.serviceCount);
  }, [categories, services, localize]);

  const topCategories = categoryStats.slice(0, 6);

  /* ========================================================= */
  /* VENDOR STATS */
  /* ========================================================= */

  const vendorStats = useMemo(() => {
    const total = vendors.length;

    const approved = vendors.filter((vendor) => isApproved(vendor.status)).length;
    const pending = vendors.filter((vendor) => isPending(vendor.status)).length;
    const rejected = vendors.filter((vendor) => isRejected(vendor.status)).length;
    const inactive = vendors.filter((vendor) => isInactive(vendor.status)).length;

    const totalReviews = vendors.reduce(
      (sum, vendor) => sum + (Number(vendor.reviewsCount) || 0),
      0
    );

    const ratingSum = vendors.reduce(
      (sum, vendor) => sum + (Number(vendor.averageRating) || 0),
      0
    );

    const averageRating = total > 0 ? ratingSum / total : 0;

    const now = new Date();

    const newThisMonth = vendors.filter((vendor) => {
      const date = new Date(vendor.createdAt);

      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }).length;

    return {
      total,
      approved,
      pending,
      rejected,
      inactive,
      totalReviews,
      averageRating,
      newThisMonth,
    };
  }, [vendors]);

  const vendorStatusChartData = useMemo(
    () => [
      { name: t('admin.dashboard.approved'), value: vendorStats.approved, color: CHART_COLORS.approved },
      { name: t('admin.dashboard.pending'), value: vendorStats.pending, color: CHART_COLORS.pending },
      { name: t('admin.dashboard.rejected'), value: vendorStats.rejected, color: CHART_COLORS.rejected },
      { name: t('admin.dashboard.inactive'), value: vendorStats.inactive, color: CHART_COLORS.inactive },
    ].filter((item) => item.value > 0),
    [vendorStats, t]
  );

  /* ========================================================= */
  /* GROWTH + RATING DISTRIBUTION */
  /* ========================================================= */

  const growthData = useMemo(
    () => buildGrowthSeries(vendors, services, 6, LANGUAGE_DATE_LOCALE[language]),
    [vendors, services, language]
  );

  const ratingDistribution = useMemo(
    () => buildRatingDistribution(vendors),
    [vendors]
  );

  /* ========================================================= */
  /* TOP VENDORS */
  /* ========================================================= */

  const topVendorsByRating = useMemo(() => {
    return [...vendors]
      .filter((vendor) => Number(vendor.averageRating) > 0)
      .sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
      .slice(0, 5);
  }, [vendors]);

  const mostReviewedVendors = useMemo(() => {
    return [...vendors]
      .filter((vendor) => Number(vendor.reviewsCount) > 0)
      .sort((a, b) => Number(b.reviewsCount) - Number(a.reviewsCount))
      .slice(0, 5);
  }, [vendors]);

  /* ========================================================= */
  /* LOCATIONS */
  /* ========================================================= */

  const locationStats = useMemo(() => {
    const locationMap = new Map<string, number>();

    vendors.forEach((vendor) => {
      const location = vendor.location?.trim() || t('admin.dashboard.unknown');

      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [vendors, t]);

  /* ========================================================= */
  /* RECENT VENDORS */
  /* ========================================================= */

  const recentVendors = useMemo(() => {
    return [...vendors]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [vendors]);

  /* ========================================================= */
  /* DASHBOARD STATS */
  /* ========================================================= */

  const stats: DashboardStat[] = [
    {
      title: t('admin.dashboard.stats.totalCategories'),
      value: totalCategories,
      description: t('admin.dashboard.stats.allCategories'),
      icon: Tags,
      href: "/admin/categories",
    },
    {
      title: t('admin.dashboard.stats.totalServices'),
      value: totalServices,
      description: t('admin.dashboard.stats.marketplaceServices'),
      icon: BriefcaseBusiness,
      href: "/admin/services",
    },
    {
      title: t('admin.dashboard.stats.totalVendors'),
      value: vendorStats.total,
      description: t('admin.dashboard.stats.registeredVendors'),
      icon: Store,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.approved'),
      value: vendorStats.approved,
      description: t('admin.dashboard.currentlyApproved'),
      icon: ShieldCheck,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.pending'),
      value: vendorStats.pending,
      description: t('admin.dashboard.vendorStatus.pendingLegend'),
      icon: Clock3,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorPerformance.reviews'),
      value: vendorStats.totalReviews,
      description: t('admin.dashboard.vendorReviews'),
      icon: MessageSquare,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.averageRating'),
      value: formatRating(vendorStats.averageRating),
      description: t('admin.dashboard.acrossAllVendors'),
      icon: Star,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.inactive'),
      value: vendorStats.inactive,
      description: t('admin.dashboard.vendorStatus.inactiveLegend'),
      icon: UserX,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.stats.totalUsers'),
      value: dashboardSummary?.totalUsers ?? 0,
      description: t('admin.dashboard.stats.registeredAccounts'),
      icon: Users,
      href: undefined,
    },
    {
      title: t('admin.dashboard.pendingReviews'),
      value: dashboardSummary?.pendingReviews ?? 0,
      description: t('admin.dashboard.awaitingModeration'),
      icon: ClipboardList,
      href: "/admin/moderation",
    },
    {
      title: t('admin.dashboard.unhandledMessages'),
      value: unhandledMessagesCount,
      description: t('admin.dashboard.unhandledMessagesDesc'),
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return {
    loading,
    error,
    stats,
    vendorStats,
    vendorStatusChartData,
    growthData,
    ratingDistribution,
    topCategories,
    totalServices,
    topVendorsByRating,
    mostReviewedVendors,
    locationStats,
    recentVendors,
    recentRequests,
  };
}

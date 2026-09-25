"use client";

import { useLanguage } from "@/context/LanguageContext";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import GrowthChart from "@/components/admin/dashboard/GrowthChart";
import MostReviewedList from "@/components/admin/dashboard/MostReviewedList";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import RatingDistributionChart from "@/components/admin/dashboard/RatingDistributionChart";
import RecentRequestsList from "@/components/admin/dashboard/RecentRequestsList";
import RecentVendorsGrid from "@/components/admin/dashboard/RecentVendorsGrid";
import ServicesByCategoryChart from "@/components/admin/dashboard/ServicesByCategoryChart";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import TopVendorsList from "@/components/admin/dashboard/TopVendorsList";
import VendorLocationsChart from "@/components/admin/dashboard/VendorLocationsChart";
import VendorOverviewSection from "@/components/admin/dashboard/VendorOverviewSection";
import { useAdminDashboard } from "@/components/admin/dashboard/useAdminDashboard";

/**
 * Admin dashboard. All data loading / number crunching lives in
 * `useAdminDashboard`; every block below is its own component in
 * `src/components/admin/dashboard/`, so sections can be edited or
 * re-ordered here without touching their internals.
 */
export default function AdminPage() {
  const { t } = useLanguage();
  const dashboard = useAdminDashboard();
  const { loading, error } = dashboard;

  return (
    <div className="mx-auto">
      <DashboardHeader />

      {error && !loading && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <p className="mt-1 text-xs text-red-500">{t("admin.dashboard.loadError")}</p>
        </div>
      )}

      <StatsGrid stats={dashboard.stats} loading={loading} />

      <VendorOverviewSection
        loading={loading}
        vendorStats={dashboard.vendorStats}
        chartData={dashboard.vendorStatusChartData}
      />

      <GrowthChart loading={loading} data={dashboard.growthData} />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <ServicesByCategoryChart
          loading={loading}
          topCategories={dashboard.topCategories}
          totalServices={dashboard.totalServices}
        />
        <TopVendorsList loading={loading} vendors={dashboard.topVendorsByRating} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <RatingDistributionChart loading={loading} data={dashboard.ratingDistribution} />
        <VendorLocationsChart loading={loading} data={dashboard.locationStats} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <MostReviewedList vendors={dashboard.mostReviewedVendors} />
        <RecentRequestsList requests={dashboard.recentRequests} />
      </div>

      <RecentVendorsGrid vendors={dashboard.recentVendors} />

      <QuickActions pendingVendors={dashboard.vendorStats.pending} />

      <div className="py-7 text-center">
        <p className="text-[11px] text-[#aa9c93]">{t("admin.dashboard.footer")}</p>
      </div>
    </div>
  );
}

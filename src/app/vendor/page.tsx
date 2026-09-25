"use client";

import { Activity, BarChart3, LineChart, PieChart } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import AttentionPanel from "@/components/vendor/dashboard/AttentionPanel";
import ProfileCompleteness from "@/components/vendor/dashboard/ProfileCompleteness";
import { ChartCard } from "@/components/vendor/dashboard/ChartCard";
import { DashboardHeader } from "@/components/vendor/dashboard/DashboardHeader";
import { ErrorState, LoadingSkeleton } from "@/components/vendor/dashboard/DashboardStates";
import { KpiGrid } from "@/components/vendor/dashboard/KpiGrid";
import { MonthlyActivity } from "@/components/vendor/dashboard/MonthlyActivity";
import { PerformanceRadar } from "@/components/vendor/dashboard/PerformanceRadar";
import { QuickStatsCard } from "@/components/vendor/dashboard/QuickStatsCard";
import { RatingDistribution } from "@/components/vendor/dashboard/RatingDistribution";
import { RecentReviewsCard } from "@/components/vendor/dashboard/RecentReviewsCard";
import { RecentServicesGrid } from "@/components/vendor/dashboard/RecentServicesGrid";
import { StatusDistribution } from "@/components/vendor/dashboard/StatusDistribution";
import { VendorStatusAlert } from "@/components/vendor/dashboard/VendorStatusAlert";
import { useVendorDashboard } from "@/components/vendor/dashboard/useVendorDashboard";

/** Vendor dashboard. Data: `useVendorDashboard`; blocks: `components/vendor/dashboard`. */
export default function VendorDashboardPage() {
  const { t } = useLanguage();
  const dashboard = useVendorDashboard();
  const { vendor, services, reviews, stats } = dashboard;

  if (dashboard.loading) return <LoadingSkeleton />;
  if (dashboard.hasError) return <ErrorState onRefresh={dashboard.handleRefresh} />;
  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <DashboardHeader
          businessName={vendor.businessName}
          isRefreshing={dashboard.isRefreshing}
          onRefresh={dashboard.handleRefresh}
        />

        <VendorStatusAlert vendor={vendor} />

        <KpiGrid stats={stats} />

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <AttentionPanel services={services} />
          <ProfileCompleteness vendor={vendor} />
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={t("vendor.dashboard.charts.serviceStatus")}
            subtitle={t("vendor.dashboard.charts.serviceStatusSub")}
            icon={PieChart}
          >
            <StatusDistribution services={services} />
          </ChartCard>

          <ChartCard
            title={t("vendor.dashboard.charts.ratingDistribution")}
            subtitle={t("vendor.dashboard.charts.ratingDistributionSub")}
            icon={BarChart3}
          >
            <RatingDistribution reviews={reviews} />
          </ChartCard>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <ChartCard
            title={t("vendor.dashboard.charts.monthlyActivity")}
            subtitle={t("vendor.dashboard.charts.monthlyActivitySub")}
            icon={LineChart}
            className="lg:col-span-2"
          >
            <MonthlyActivity reviews={reviews} />
          </ChartCard>

          <ChartCard
            title={t("vendor.dashboard.charts.performance")}
            subtitle={t("vendor.dashboard.charts.performanceSub")}
            icon={Activity}
          >
            <PerformanceRadar reviews={reviews} services={services} />
          </ChartCard>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <RecentReviewsCard reviews={dashboard.recentReviews} />
          <QuickStatsCard stats={stats} />
        </div>

        <RecentServicesGrid services={services} />
      </div>
    </div>
  );
}

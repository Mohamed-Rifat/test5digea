"use client";

import { BriefcaseBusiness, Star, TrendingUp, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { KPICard } from "@/components/vendor/dashboard/KPICard";

import type { VendorDashboardStats } from "./useVendorDashboard";

export function KpiGrid({ stats }: { stats: VendorDashboardStats }) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        title={t("vendor.dashboard.kpi.totalServices")}
        value={stats.totalServices}
        icon={BriefcaseBusiness}
        subtitle={t("vendor.dashboard.kpi.activeCount", {
          count: stats.approvedServices,
        })}
        color="#a47e43"
        badge={t("vendor.dashboard.kpi.active")}
      />

      <KPICard
        title={t("vendor.dashboard.kpi.avgRating")}
        value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
        icon={Star}
        subtitle={t("vendor.dashboard.kpi.reviewsCount", {
          count: stats.totalReviews,
        })}
        color="#f59e0b"
        badge={
          stats.fiveStarRate > 50
            ? t("vendor.dashboard.kpi.topRated")
            : t("vendor.dashboard.kpi.good")
        }
      />

      <KPICard
        title={t("vendor.dashboard.kpi.approvalRate")}
        value={`${stats.approvalRate.toFixed(0)}%`}
        icon={TrendingUp}
        subtitle={t("vendor.dashboard.kpi.ofTotal", {
          approved: stats.approvedServices,
          total: stats.totalServices,
        })}
        progress={stats.approvalRate}
        color="#10b981"
        badge={
          stats.approvalRate > 70
            ? t("vendor.dashboard.kpi.excellent")
            : t("vendor.dashboard.kpi.needsWork")
        }
      />

      <KPICard
        title={t("vendor.dashboard.kpi.pendingReviews")}
        value={stats.pendingReviews}
        icon={Clock}
        subtitle={t("vendor.dashboard.kpi.rejectedCount", {
          count: stats.rejectedReviews,
        })}
        color="#f59e0b"
        badge={
          stats.pendingReviews > 0
            ? t("vendor.dashboard.kpi.actionRequired")
            : t("vendor.dashboard.kpi.allClear")
        }
      />
    </div>
  );
}

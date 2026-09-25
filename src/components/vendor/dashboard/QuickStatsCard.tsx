"use client";

import { CheckCircle2, Clock3, Star, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorDashboardStats } from "./useVendorDashboard";

export function QuickStatsCard({ stats }: { stats: VendorDashboardStats }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-[#30251f]">
        {t("vendor.dashboard.quickStats.title")}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-[#9a8d85]">
                {t("vendor.dashboard.quickStats.approved")}
              </p>
              <p className="text-sm font-semibold text-[#30251f]">
                {stats.approvedServices}
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium">
            +{stats.approvedServices > 0 ? Math.round(stats.approvalRate) : 0}%
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Clock3 size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[#9a8d85]">
                {t("vendor.dashboard.quickStats.pending")}
              </p>
              <p className="text-sm font-semibold text-[#30251f]">
                {stats.pendingServices}
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-600 font-medium">
            {t("vendor.dashboard.quickStats.awaiting")}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <XCircle size={14} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-[#9a8d85]">
                {t("vendor.dashboard.quickStats.rejected")}
              </p>
              <p className="text-sm font-semibold text-[#30251f]">
                {stats.rejectedServices}
              </p>
            </div>
          </div>
          <span className="text-xs text-red-600 font-medium">
            {t("vendor.dashboard.quickStats.needsReview")}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Star size={14} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-[#9a8d85]">
                {t("vendor.dashboard.quickStats.fiveStar")}
              </p>
              <p className="text-sm font-semibold text-[#30251f]">
                {stats.fiveStarRate.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

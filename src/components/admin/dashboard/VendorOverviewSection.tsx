"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Clock3, Star, Store, UserCheck, UserPlus, type LucideIcon } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import ChartTooltip from "./ChartTooltip";
import DashboardSection from "./DashboardSection";
import type { VendorStats } from "./useAdminDashboard";
import { CHART_COLORS, formatNumber, formatRating } from "./utils";

interface VendorOverviewSectionProps {
  loading: boolean;
  vendorStats: VendorStats;
  chartData: { name: string; value: number; color: string }[];
}

/** Vendor status donut + key vendor metrics. */
export default function VendorOverviewSection({
  loading,
  vendorStats,
  chartData,
}: VendorOverviewSectionProps) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      className="mt-5"
      icon={Store}
      title={t("admin.dashboard.vendorPerformance.title")}
      subtitle={t("admin.dashboard.subtitle")}
      action={{ href: "/admin/vendors", label: t("admin.dashboard.quickActions.manageVendors") }}
    >
      {loading ? (
        <VendorOverviewSkeleton />
      ) : (
        <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
          <VendorStatusDonut vendorStats={vendorStats} chartData={chartData} />
          <VendorInsights vendorStats={vendorStats} />
        </div>
      )}
    </DashboardSection>
  );
}

function VendorStatusDonut({
  vendorStats,
  chartData,
}: Omit<VendorOverviewSectionProps, "loading">) {
  const { t } = useLanguage();

  const pieData =
    chartData.length > 0
      ? chartData
      : [{ name: t("admin.dashboard.noData"), value: 1, color: "#eee8e3" }];

  const rows = [
    { label: t("admin.dashboard.approved"), value: vendorStats.approved, color: CHART_COLORS.approved },
    { label: t("admin.dashboard.pending"), value: vendorStats.pending, color: CHART_COLORS.pending },
    { label: t("admin.dashboard.rejected"), value: vendorStats.rejected, color: CHART_COLORS.rejected },
    { label: t("admin.dashboard.inactive"), value: vendorStats.inactive, color: CHART_COLORS.inactive },
  ];

  return (
    <div className="border-b border-[#f0e9e4] p-5 lg:border-b-0 lg:border-r sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold text-[#40342d]">
          {t("admin.dashboard.vendorStatus.title")}
        </p>
        <p className="mt-1 text-[10px] text-[#a39790]">
          {t("admin.dashboard.vendorStatus.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center">
        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={chartData.length > 1 ? 3 : 0}
                stroke="none"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              {chartData.length > 0 && <Tooltip content={<ChartTooltip />} />}
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-[#30251f]">{vendorStats.total}</span>
            <span className="text-[10px] text-[#9b8e86]">
              {t("admin.dashboard.stats.totalVendors")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <VendorStatusRow key={row.label} {...row} total={vendorStats.total} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VendorInsights({ vendorStats }: { vendorStats: VendorStats }) {
  const { t } = useLanguage();

  const approvalRate =
    vendorStats.total > 0
      ? `${Math.round((vendorStats.approved / vendorStats.total) * 100)}%`
      : "0%";

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold text-[#40342d]">
          {t("admin.dashboard.insights.title")}
        </p>
        <p className="mt-1 text-[10px] text-[#a39790]">
          {t("admin.dashboard.metricsSubtitle")}
        </p>
      </div>

      <div className="space-y-3">
        <InsightCard
          icon={Star}
          title={t("admin.dashboard.averageRating")}
          value={formatRating(vendorStats.averageRating)}
          suffix="/ 5"
          description={t("admin.dashboard.acrossAllVendors")}
        />
        <InsightCard
          icon={UserCheck}
          title={t("admin.dashboard.approvalRate")}
          value={approvalRate}
          description={t("admin.dashboard.vendorStatus.approvedLegend")}
        />
        <InsightCard
          icon={UserPlus}
          title={t("admin.dashboard.newThisMonth")}
          value={formatNumber(vendorStats.newThisMonth)}
          description={t("admin.dashboard.vendorsJoined")}
        />
        <InsightCard
          icon={Clock3}
          title={t("admin.dashboard.pendingReview")}
          value={formatNumber(vendorStats.pending)}
          description={t("admin.dashboard.insights.needsAttention")}
        />
      </div>
    </div>
  );
}

function VendorStatusRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />

          <span className="text-[10px] font-semibold text-[#665951]">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#a39790]">{percentage}%</span>

          <span className="text-[11px] font-semibold text-[#40342d]">
            {value}
          </span>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#f3eee9]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  suffix,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  suffix?: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#fcfaf8] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3ebe5] text-[#806d61]">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#91847c]">{title}</p>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-lg font-semibold text-[#30251f]">{value}</span>

          {suffix && <span className="text-[9px] text-[#a39790]">{suffix}</span>}
        </div>
      </div>

      <p className="hidden text-[9px] text-[#a39790] sm:block">{description}</p>
    </div>
  );
}

function VendorOverviewSkeleton() {
  return (
    <div className="grid animate-pulse lg:grid-cols-[1.4fr_0.8fr]">
      <div className="border-b border-[#f0e9e4] p-6 lg:border-b-0 lg:border-r">
        <div className="mb-6 h-3 w-28 rounded bg-[#eee8e3]" />

        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div className="mx-auto h-40 w-40 rounded-full bg-[#eee8e3]" />

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-2 h-2.5 w-full rounded bg-[#f2ede9]" />
                <div className="h-1.5 rounded bg-[#f3eee9]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <div className="mb-5 h-3 w-28 rounded bg-[#eee8e3]" />

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-[#f4efeb]" />
        ))}
      </div>
    </div>
  );
}

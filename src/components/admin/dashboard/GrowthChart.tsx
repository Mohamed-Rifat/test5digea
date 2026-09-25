"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import ChartTooltip from "./ChartTooltip";
import { CHART_COLORS } from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function GrowthChart({ loading, data }: { loading: boolean; data: { month: string; vendors: number; services: number }[] }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      className="mt-5"
      icon={TrendingUp}
      title={t("admin.dashboard.growth.title")}
      subtitle={t("admin.dashboard.growth.subtitle")}
      aside={
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <span className="flex items-center gap-1.5 text-[#665951]">
            <span className="h-2 w-2 rounded-full bg-[#30251f]" />
            {t("admin.dashboard.vendorLocations.vendors")}
          </span>
          <span className="flex items-center gap-1.5 text-[#665951]">
            <span className="h-2 w-2 rounded-full bg-[#c9a877]" />
            {t("admin.dashboard.servicesByCategory.services")}
          </span>
        </div>
      }
    >
      {loading ? (
        <div className="h-72 animate-pulse bg-[#fcfaf8] p-6" />
      ) : (
        <div className="h-72 p-5 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="vendorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30251f" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#30251f" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a877" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a877" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#a39790" }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#a39790" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />

              <Tooltip content={<ChartTooltip />} />

              <Area
                type="monotone"
                dataKey="vendors"
                name={t('admin.dashboard.growth.newVendors')}
                stroke="#30251f"
                strokeWidth={2}
                fill="url(#vendorsGradient)"
              />

              <Area
                type="monotone"
                dataKey="services"
                name={t('admin.dashboard.growth.newServices')}
                stroke="#c9a877"
                strokeWidth={2}
                fill="url(#servicesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSection>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Tags } from "lucide-react";

import ChartTooltip from "./ChartTooltip";
import EmptyState from "./EmptyState";
import { CHART_COLORS, formatNumber } from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function ServicesByCategoryChart({ loading, topCategories, totalServices }: { loading: boolean; topCategories: { name: string; serviceCount: number }[]; totalServices: number }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      icon={BarChart3}
      title={t("admin.dashboard.servicesByCategory.title")}
      subtitle={t("admin.dashboard.servicesByCategory.subtitle")}
      aside={
        <span className="self-start rounded-lg bg-[#f8f4f1] px-2.5 py-1.5 text-[10px] font-semibold text-[#806d61] sm:self-auto">
          {formatNumber(totalServices)} services
        </span>
      }
    >
      {loading ? (
        <div className="h-80 animate-pulse bg-[#fcfaf8] p-6" />
      ) : topCategories.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={Tags} text={t('admin.dashboard.servicesByCategory.empty')} />
        </div>
      ) : (
        <div className="h-80 p-5 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCategories}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#a39790" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11, fill: "#4b3e36" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

              <Bar
                dataKey="serviceCount"
                name={t('admin.dashboard.servicesByCategory.services')}
                fill={CHART_COLORS.dark}
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSection>
  );
}

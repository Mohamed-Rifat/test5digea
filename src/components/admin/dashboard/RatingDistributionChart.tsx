"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Star } from "lucide-react";

import ChartTooltip from "./ChartTooltip";
import { CHART_COLORS } from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function RatingDistributionChart({ loading, data }: { loading: boolean; data: { stars: string; count: number }[] }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      icon={Star}
      title={t("admin.dashboard.ratingDistribution.title")}
      subtitle={t("admin.dashboard.ratingDistribution.subtitle")}
    >
      {loading ? (
        <div className="h-64 animate-pulse bg-[#fcfaf8] p-6" />
      ) : (
        <div className="h-64 p-5 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />

              <XAxis
                dataKey="stars"
                tick={{ fontSize: 11, fill: "#a39790" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#a39790" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />

              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

              <Bar
                dataKey="count"
                name={t('admin.dashboard.vendorLocations.vendors')}
                fill="#d7a85d"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSection>
  );
}

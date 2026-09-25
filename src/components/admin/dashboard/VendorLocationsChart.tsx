"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapPin } from "lucide-react";

import ChartTooltip from "./ChartTooltip";
import EmptyState from "./EmptyState";
import { CHART_COLORS } from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function VendorLocationsChart({ loading, data }: { loading: boolean; data: { location: string; count: number }[] }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      icon={MapPin}
      title={t("admin.dashboard.vendorLocations.title")}
      subtitle={t("admin.dashboard.vendorLocations.subtitle")}
    >
      {loading ? (
        <div className="h-64 animate-pulse bg-[#fcfaf8] p-6" />
      ) : data.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={MapPin} text={t('admin.dashboard.vendorLocations.empty')} />
        </div>
      ) : (
        <div className="h-64 p-5 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
                dataKey="location"
                width={90}
                tick={{ fontSize: 11, fill: "#4b3e36" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

              <Bar
                dataKey="count"
                name={t('admin.dashboard.vendorLocations.vendors')}
                fill="#8c786b"
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

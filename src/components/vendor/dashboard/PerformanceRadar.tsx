"use client";

import { useMemo } from "react";
import { ReviewStatus, type Review } from "@/types/review";
import type { Service } from "@/types/service";
import { useLanguage } from "@/context/LanguageContext";
import {
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import type { ChartTooltipPayload } from "@/components/vendor/dashboard/dashboardConfig";

// ✅ Performance Radar Chart
export const PerformanceRadar = ({
  reviews,
  services,
}: {
  reviews: Review[];
  services: Service[];
}) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(
      (r) => r.status === ReviewStatus.Approved,
    ).length;
    const avgRating =
      approvedReviews > 0
        ? reviews
            .filter((r) => r.status === ReviewStatus.Approved)
            .reduce((acc, r) => acc + r.rating, 0) / approvedReviews
        : 0;
    const totalServices = services.length;
    const approvedServices = services.filter(
      (s) => s.status === "Approved",
    ).length;

    return [
      {
        category: t("vendor.dashboard.charts.quality"),
        value: avgRating > 0 ? (avgRating / 5) * 100 : 0,
        fullMark: 100,
      },
      {
        category: t("vendor.dashboard.charts.approvalRate"),
        value: totalServices > 0 ? (approvedServices / totalServices) * 100 : 0,
        fullMark: 100,
      },
      {
        category: t("vendor.dashboard.charts.customerTrust"),
        value:
          totalReviews > 0
            ? Math.min((approvedReviews / totalReviews) * 100, 100)
            : 0,
        fullMark: 100,
      },
      {
        category: t("vendor.dashboard.charts.serviceDiversity"),
        value: Math.min((totalServices / 10) * 100, 100),
        fullMark: 100,
      },
      {
        category: t("vendor.dashboard.charts.engagement"),
        value: Math.min((totalReviews / 20) * 100, 100),
        fullMark: 100,
      },
    ];
  }, [reviews, services, t]);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noPerformance")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#f0eae5" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#9a8d85", fontSize: 10 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#9a8d85", fontSize: 9 }}
          />
          <Radar
            name={t("vendor.dashboard.charts.performanceSeries")}
            dataKey="value"
            stroke="#a47e43"
            fill="#a47e43"
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={1500}
          />
          <ReTooltip
            content={({ active, payload: rawPayload }) => {
              const payload = rawPayload as
                readonly ChartTooltipPayload[] | undefined;
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-lg">
                    <p className="text-sm font-semibold text-[#30251f]">
                      {payload[0]?.payload?.category}
                    </p>
                    <p className="text-xs text-[#a47e43] font-medium">
                      {Number(payload[0]?.value ?? 0).toFixed(0)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

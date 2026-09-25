"use client";

import { useMemo } from "react";
import { ReviewStatus, type Review } from "@/types/review";
import { useLanguage } from "@/context/LanguageContext";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { CustomTooltip } from "@/components/vendor/dashboard/CustomTooltip";
import { COLORS } from "@/components/vendor/dashboard/dashboardConfig";

// ✅ Rating Distribution Chart
export const RatingDistribution = ({ reviews }: { reviews: Review[] }) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    const approvedReviews = reviews.filter(
      (r) => r.status === ReviewStatus.Approved,
    );
    const total = approvedReviews.length || 1;
    approvedReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts.map((count, index) => ({
      name: `${index + 1}⭐`,
      value: count,
      percentage: ((count / total) * 100).toFixed(0),
    }));
  }, [reviews]);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noRatings")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0eae5"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9a8d85", fontSize: 11 }}
            axisLine={false}
          />
          <YAxis tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <ReTooltip
            content={
              <CustomTooltip unit={t("vendor.dashboard.charts.unitReviews")} />
            }
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                opacity={entry.value > 0 ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

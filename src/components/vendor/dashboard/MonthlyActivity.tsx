"use client";

import { useMemo } from "react";
import { ReviewStatus, type Review } from "@/types/review";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart,
} from "recharts";

import { CustomTooltip } from "@/components/vendor/dashboard/CustomTooltip";

// ✅ Monthly Activity Chart - كلها خطوط
export const MonthlyActivity = ({ reviews }: { reviews: Review[] }) => {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];
  const data = useMemo(() => {
    // Buckets are keyed by year + month so a review from the same month of
    // last year is never counted in this year's bar.
    const bucketKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
    const months: Record<
      string,
      {
        month: string;
        total: number;
        approved: number;
        pending: number;
        rejected: number;
      }
    > = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[bucketKey(d)] = {
        month: d.toLocaleString(dateLocale, { month: "short" }),
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };
    }
    reviews.forEach((r) => {
      const bucket = months[bucketKey(new Date(r.createdAt))];
      if (bucket) {
        bucket.total++;
        if (r.status === ReviewStatus.Approved) bucket.approved++;
        else if (r.status === ReviewStatus.Pending) bucket.pending++;
        else if (r.status === ReviewStatus.Rejected) bucket.rejected++;
      }
    });
    return Object.values(months);
  }, [reviews, dateLocale]);

  if (data.every((d) => d.total === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noActivity")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a47e43" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a47e43" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientApproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientRejected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0eae5"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9a8d85", fontSize: 11 }}
            axisLine={false}
          />
          <YAxis tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <ReTooltip
            content={
              <CustomTooltip unit={t("vendor.dashboard.charts.unitReviews")} />
            }
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#9a8d85" }} />
          {/* ✅ Total - Area Chart (خط مع تعبئة) */}
          <Area
            type="monotone"
            dataKey="total"
            stroke="#a47e43"
            strokeWidth={3}
            fill="url(#gradientTotal)"
            name={t("vendor.dashboard.charts.total")}
          />
          {/* ✅ Approved - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: "#10b981", r: 4 }}
            name={t("vendor.dashboard.charts.approved")}
          />
          {/* ✅ Pending - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ fill: "#f59e0b", r: 4 }}
            name={t("vendor.dashboard.charts.pending")}
          />
          {/* ✅ Rejected - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ fill: "#ef4444", r: 4 }}
            name={t("vendor.dashboard.charts.rejected")}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

"use client";

import { useLanguage } from "@/context/LanguageContext";

import type {
  ChartTooltipPayload,
  ChartTooltipProps,
} from "@/components/vendor/dashboard/dashboardConfig";

export const CustomTooltip = ({
  active,
  payload: rawPayload,
  label,
  unit = "",
  prefix = "",
}: ChartTooltipProps) => {
  const payload = rawPayload as readonly ChartTooltipPayload[] | undefined;
  const { t } = useLanguage();

  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-lg max-w-50 sm:max-w-none">
        <p className="text-xs sm:text-sm font-semibold text-[#30251f] truncate">
          {label ||
            payload[0]?.payload?.name ||
            payload[0]?.payload?.month ||
            payload[0]?.payload?.category}
        </p>
        <p className="text-[10px] sm:text-xs text-[#9b8f86]">
          {prefix}
          {String(payload[0]?.value ?? "")} {unit}
        </p>
        {payload[0]?.payload?.percentage && (
          <p className="text-[10px] sm:text-xs text-[#a47e43] font-medium">
            {t("vendor.dashboard.charts.percentOfTotal", {
              percent: payload[0].payload.percentage,
            })}
          </p>
        )}
      </div>
    );
  }
  return null;
};

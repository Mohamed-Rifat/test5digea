"use client";

import { useMemo } from "react";
import type { Service } from "@/types/service";
import { useLanguage } from "@/context/LanguageContext";
import {
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

import { CustomTooltip } from "@/components/vendor/dashboard/CustomTooltip";
import { COLORS } from "@/components/vendor/dashboard/dashboardConfig";

// ✅ Service Status Pie Chart
export const StatusDistribution = ({ services }: { services: Service[] }) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    const statusLabels: Record<string, string> = {
      Approved: t("vendor.dashboard.itemStatus.approved"),
      Pending: t("vendor.dashboard.itemStatus.pending"),
      Rejected: t("vendor.dashboard.itemStatus.rejected"),
      Inactive: t("vendor.dashboard.itemStatus.inactive"),
    };
    return Object.entries(counts).map(([name, value]) => ({
      name: statusLabels[name] ?? name,
      value,
    }));
  }, [services, t]);

  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noServices")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={65}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <ReTooltip
            content={
              <CustomTooltip unit={t("vendor.dashboard.charts.unitServices")} />
            }
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#9a8d85" }}
            iconType="circle"
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

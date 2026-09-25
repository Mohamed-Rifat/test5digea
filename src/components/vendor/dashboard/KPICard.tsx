"use client";

import { LinearProgress } from "@mui/material";

export const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  progress,
  color = "#a47e43",
  badge,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle: string;
  trend?: { value: number; label: string; isPositive: boolean };
  progress?: number;
  color?: string;
  badge?: string;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute inset-e-8 -top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125" />

    <div className="relative">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[10px] sm:text-sm text-[#81746d] truncate">
              {title}
            </p>
            {badge && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#f5eee9] px-1.5 sm:px-2 py-0.5 text-[7px] sm:text-[9px] font-medium text-[#a47e43]">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xl sm:text-3xl font-bold tracking-tight text-[#30251f]">
            {value}
          </p>
          <p className="mt-0.5 text-[9px] sm:text-xs text-[#9a8d85] truncate">
            {subtitle}
          </p>
        </div>
        <div
          className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
        </div>
      </div>

      {trend && (
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
          <span
            className={`inline-flex items-center gap-0.5 text-[9px] sm:text-xs font-medium ${
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-[9px] sm:text-xs text-[#9a8d85] truncate">
            {trend.label}
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-2 sm:mt-3">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 3,
              borderRadius: "4px",
              backgroundColor: "#f0eae5",
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
                borderRadius: "4px",
              },
            }}
          />
        </div>
      )}
    </div>
  </div>
);

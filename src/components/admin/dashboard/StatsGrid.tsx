"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { DashboardStat } from "./useAdminDashboard";
import { formatNumber } from "./utils";

const CARD =
  "group rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-5";

export default function StatsGrid({
  stats,
  loading,
}: {
  stats: DashboardStat[];
  loading: boolean;
}) {
  if (loading) return <StatsGridSkeleton />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) =>
        stat.href ? (
          <Link
            key={stat.title}
            href={stat.href}
            className={`${CARD} transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(48,37,31,0.06)]`}
          >
            <StatCardContent stat={stat} />
          </Link>
        ) : (
          <div key={stat.title} className={CARD}>
            <StatCardContent stat={stat} />
          </div>
        )
      )}
    </div>
  );
}

function StatCardContent({ stat }: { stat: DashboardStat }) {
  const { t } = useLanguage();
  const Icon = stat.icon;

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1ed] text-[#79675c] transition group-hover:bg-[#30251f] group-hover:text-white">
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#f8f4f1] px-2.5 py-1 text-[10px] font-semibold text-[#8a786d]">
          <TrendingUp size={11} />
          {t("admin.dashboard.live")}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-[#91847c]">{stat.title}</p>

        <div className="mt-1 flex items-end justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight text-[#30251f]">
            {typeof stat.value === "number" ? formatNumber(stat.value) : stat.value}
          </p>
          <p className="pb-1 text-[10px] text-[#a4978e]">{stat.description}</p>
        </div>
      </div>
    </>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-5"
        >
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#eee8e3]" />

              <div className="h-5 w-12 rounded-full bg-[#f1ece8]" />
            </div>

            <div className="mt-4">
              <div className="h-3 w-24 rounded bg-[#eee8e3]" />

              <div className="mt-2 flex items-end justify-between">
                <div className="h-7 w-16 rounded bg-[#e9e2dd]" />

                <div className="h-2.5 w-20 rounded bg-[#f2ede9]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Plus, RefreshCw, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function DashboardHeader({
  businessName,
  isRefreshing,
  onRefresh,
}: {
  businessName: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();

  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mt-1.5 flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
              <Award
                size={16}
                className="text-[#a47e43] sm:h-5 sm:w-5"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                {t("vendor.dashboard.welcome", {
                  name: businessName,
                })}
              </h1>
            </div>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 sm:mt-2">
            <p className="text-xs text-[#756b65] sm:text-sm">
              {t("vendor.dashboard.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={t("vendor.dashboard.refresh")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <RefreshCw
              size={13}
              className={
                isRefreshing ? "animate-spin sm:h-5 sm:w-5" : "sm:h-5 sm:w-5"
              }
            />
          </button>

          <Link
            href="/vendor/services/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#30251f] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#463831] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Plus size={13} className="sm:h-4 sm:w-4" />{" "}
            <span>{t("vendor.dashboard.addServices")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

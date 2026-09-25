"use client";

import Link from "next/link";
import { BriefcaseBusiness, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorServicesListState } from "./useVendorServicesList";

/** Title, refresh and "add service". */
export function ServicesListHeader({
  list,
}: {
  list: VendorServicesListState;
}) {
  const { t } = useLanguage();
  const { isRefreshing, handleRefresh, services, loading } = list;

  return (
    <header className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
              {t("vendor.services.list.title")}
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
            {t("vendor.services.list.subtitle")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            aria-label={t("vendor.services.list.refresh")}
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
            <Plus size={13} className="sm:h-5 sm:w-5" />
            <span>{t("vendor.services.list.addService")}</span>
          </Link>

          {/* Badge with count */}
          {!loading && services.length > 0 && (
            <Badge
              badgeContent={services.length}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#a47e43",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "11px",
                  height: 20,
                  minWidth: 20,
                  padding: "0 6px",
                },
              }}
            >
              <div className="h-8 w-8 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-10 sm:w-10">
                <BriefcaseBusiness
                  size={14}
                  className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                />
              </div>
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}

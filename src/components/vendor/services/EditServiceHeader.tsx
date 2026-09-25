"use client";

import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Loader2, RotateCcw, Sparkles, Tag } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import { getServiceStatusConfig } from "./serviceStatus";

interface EditServiceHeaderProps {
  service: Service;
  isResubmitting: boolean;
  onResubmit: () => void;
}

/** Back link, service name, category chip, status and "resubmit" button. */
export default function EditServiceHeader({
  service,
  isResubmitting,
  onResubmit,
}: EditServiceHeaderProps) {
  const { t, localize } = useLanguage();
  const status = getServiceStatusConfig(service.status);
  const StatusIcon = status.icon;

  return (
    <>
      <Link
        href="/vendor/services"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#756b65] transition hover:text-[#30251f] sm:mb-6 sm:gap-2 sm:text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl:rotate-180" />
        {t("vendor.services.detail.back")}
      </Link>

      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rtl:tracking-normal text-[#9b8171] sm:mb-2 sm:text-xs">
              <Sparkles size={11} className="sm:h-3.25 sm:w-3.25" />
              {t("vendor.services.detail.editService")}
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                <BriefcaseBusiness size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
              </div>

              <h1 className="min-w-0 flex-1 truncate text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                {service.name}
              </h1>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3">
              <span className="inline-flex h-6.5 items-center gap-1.5 rounded-full bg-[#f5eee9] px-2.5 text-[11px] font-medium text-[#5f544d]">
                <Tag size={12} className="text-[#a47e43]" />
                {localize(service.categoryName) || t("vendor.dashboard.services.uncategorized")}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${status.className}`}
              >
                <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {t(status.labelKey)}
              </span>
            </div>
          </div>

          {service.status === "Rejected" && (
            <button
              type="button"
              onClick={onResubmit}
              disabled={isResubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
            >
              {isResubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
              {t("vendor.services.detail.resubmitForReview")}
            </button>
          )}
        </div>
      </header>
    </>
  );
}

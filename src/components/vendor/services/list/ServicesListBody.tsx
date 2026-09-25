"use client";

import Link from "next/link";
import {
  AlertCircle,
  BriefcaseBusiness,
  Banknote,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorServicesListState } from "./useVendorServicesList";
import { statusConfig } from "@/components/vendor/services/list/servicesListConfig";

/** Result counter, loading / error / empty states and the service rows. */
export function ServicesListBody({ list }: { list: VendorServicesListState }) {
  const { t, localize } = useLanguage();
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredServices,
    handleRefresh,
    handleResubmit,
    services,
    loading,
    error,
    actionLoading,
  } = list;

  return (
    <>
      {!loading && !error && filteredServices.length > 0 && (
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <p className="text-[10px] text-[#9b8f86] sm:text-xs">
            {t(
              filteredServices.length === 1
                ? "vendor.services.list.showingOne"
                : "vendor.services.list.showingMany",
              { count: filteredServices.length },
            )}
            {services.length > 0 &&
              filteredServices.length !== services.length && (
                <span className="text-[#bbb2ac]">
                  {" "}
                  {t("vendor.services.list.ofTotal", {
                    total: services.length,
                  })}
                </span>
              )}
          </p>
        </div>
      )}

      {/* =================================================
        Content
    ================================================= */}

      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-white shadow-sm sm:h-32"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm text-red-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={14} />
            {t("vendor.services.list.tryAgain")}
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-16 sm:w-16">
            <BriefcaseBusiness className="h-6 w-6 text-[#806b5e] sm:h-7 sm:w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#40352f] sm:mt-5 sm:text-base">
            {searchQuery || statusFilter !== "All"
              ? t("vendor.services.list.noMatchTitle")
              : t("vendor.services.list.noneTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#81746d] sm:text-sm sm:leading-6">
            {searchQuery || statusFilter !== "All"
              ? t("vendor.services.list.noMatchText")
              : t("vendor.services.list.noneText")}
          </p>
          {searchQuery || statusFilter !== "All" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
            >
              <X size={14} />
              {t("vendor.services.list.clearFilters")}
            </button>
          ) : (
            <Link
              href="/vendor/services/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
            >
              <Plus className="h-4 w-4" />
              {t("vendor.services.list.addFirst")}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredServices.map((service) => {
            const status = statusConfig[service.status] ?? statusConfig.Pending;
            const StatusIcon = status.icon;
            const isResubmitting = actionLoading === `resubmit-${service.id}`;

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:border-[#d5c8be] hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* Title & Status */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                        {service.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px] ${status.className}`}
                      >
                        <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {t(status.labelKey)}
                      </span>
                    </div>

                    {/* Category */}
                    <p className="mt-0.5 text-[11px] text-[#81746d] sm:mt-1 sm:text-sm">
                      {localize(service.categoryName) ||
                        t("vendor.services.list.uncategorized")}
                    </p>

                    {/* Description */}
                    {service.description && (
                      <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#625852] sm:mt-2 sm:text-sm sm:leading-6">
                        {service.description}
                      </p>
                    )}

                    {/* Rejection Reason */}
                    {service.status === "Rejected" &&
                      service.rejectionReason && (
                        <div className="mt-2 rounded-xl bg-red-50 px-2.5 py-1.5 text-[10px] text-red-700 sm:mt-3 sm:px-3 sm:py-2 sm:text-xs">
                          <span className="font-medium">
                            {t("vendor.services.list.rejectionReason")}
                          </span>{" "}
                          {service.rejectionReason}
                        </div>
                      )}

                    {/* Prices */}
                    {service.prices.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                        <Banknote className="h-3 w-3 text-[#9a8d85] sm:h-4 sm:w-4" />
                        {service.prices.map((price) => (
                          <span
                            key={price.id}
                            className="rounded-full bg-[#f7f1ed] px-2 py-0.5 text-[9px] font-medium text-[#66564c] sm:px-3 sm:py-1 sm:text-xs"
                          >
                            {price.label}: {price.price} {t("common.currency")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    {service.status === "Rejected" && (
                      <Tooltip
                        title={t("vendor.services.list.resubmitTooltip")}
                        arrow
                      >
                        <button
                          type="button"
                          onClick={() => handleResubmit(service.id)}
                          disabled={isResubmitting}
                          className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-[#e3d9d1] bg-white px-2.5 text-[10px] font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60 sm:h-10 sm:gap-2 sm:px-3.5 sm:text-sm"
                        >
                          {isResubmitting ? (
                            <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                          ) : (
                            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                          <span className="hidden xs:inline">
                            {t("vendor.services.list.resubmit")}
                          </span>
                        </button>
                      </Tooltip>
                    )}

                    <Link
                      href={`/vendor/services/${service.id}`}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-xl bg-[#30251f] px-2.5 text-[10px] font-medium text-white transition hover:bg-[#463831] sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">
                        {t("vendor.services.list.manage")}
                      </span>
                      <span className="xs:hidden">
                        {t("vendor.services.list.edit")}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

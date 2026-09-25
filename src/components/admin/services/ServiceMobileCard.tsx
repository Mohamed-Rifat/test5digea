"use client";

import Link from "next/link";
import { Check, Eye, Loader2, Power, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import {
  formatDate,
  getServiceActionState,
  getStartingPrice,
  getStatusStyles,
} from "./serviceAdminUtils";
import type { ServiceRowHandlers } from "./useAdminServicesPage";

/** Service summary + moderation buttons (phones). */
export function ServiceMobileCard({
  service,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
  getStatusLabel,
  money,
  dateLocale,
  actionLoading,
}: { service: Service } & ServiceRowHandlers) {
  const { t, localize } = useLanguage();
  const statusStyles = getStatusStyles(service.status);
  const StatusIcon = statusStyles.icon;
  const startingPrice = getStartingPrice(service);
  const {
    isApproving,
    isRejecting,
    isActivating,
    isDeactivating,
    busy,
    canApprove,
    canReject,
    canActivate,
    canDeactivate,
  } = getServiceActionState(service, actionLoading);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          {service.images?.[0]?.url ? (
            <img
              loading="lazy"
              decoding="async"
              src={service.images[0].url}
              alt={service.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-400">
              {service.name?.charAt(0)?.toUpperCase() || "S"}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {service.name}
          </p>

          <p className="mt-0.5 truncate text-xs text-gray-500">
            {service.vendorBusinessName || "-"}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${statusStyles.wrapper}`}
        >
          <StatusIcon size={11} />
          {getStatusLabel(service.status)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
          {localize(service.categoryName) || "-"}
        </span>

        <span>
          {startingPrice !== null
            ? `${money(startingPrice)}${
                service.prices?.length > 1
                  ? ` · ${t("admin.services.priceOptionsCount", { count: service.prices.length })}`
                  : ""
              }`
            : t("admin.services.noPrice")}
        </span>

        <span>{formatDate(service.createdAt, dateLocale)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
        <Link
          href={`/admin/services/${service.id}`}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Eye size={14} />
          {t("admin.services.view")}
        </Link>

        {canApprove && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onApprove(service)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isApproving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {t("admin.services.approveLabel")}
          </button>
        )}

        {canReject && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onReject(service)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRejecting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <X size={14} />
            )}
            {t("admin.services.rejectLabel")}
          </button>
        )}

        {canActivate && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onActivate(service)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isActivating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Power size={14} />
            )}
            {t("admin.services.activateLabel")}
          </button>
        )}

        {canDeactivate && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onDeactivate(service)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 text-xs font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeactivating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Power size={14} />
            )}
            {t("admin.services.deactivateLabel")}
          </button>
        )}
      </div>
    </div>
  );
}

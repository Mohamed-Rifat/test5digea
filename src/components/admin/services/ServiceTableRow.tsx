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

/** One row of the desktop services table. */
export function ServiceTableRow({
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
    <tr className="transition hover:bg-gray-50/70">
      {/* Service */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
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

          <div className="min-w-0">
            <p className="max-w-55 truncate text-sm font-semibold text-gray-900">
              {service.name}
            </p>

            <p className="mt-0.5 max-w-55 truncate text-xs text-gray-500">
              {service.description || t("admin.services.noDescription")}
            </p>
          </div>
        </div>
      </td>

      {/* Vendor */}

      <td className="px-5 py-4">
        <p className="max-w-45 truncate text-sm font-medium text-gray-800">
          {service.vendorBusinessName || "-"}
        </p>
      </td>

      {/* Category */}

      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {localize(service.categoryName) || "-"}
        </span>
      </td>

      {/* Price */}

      <td className="px-5 py-4">
        {startingPrice !== null ? (
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {money(startingPrice)}
            </p>

            {service.prices?.length > 1 && (
              <p className="mt-0.5 text-xs text-gray-500">
                {t("admin.services.priceOptionsCount", {
                  count: service.prices.length,
                })}
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">
            {t("admin.services.noPrice")}
          </span>
        )}
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles.wrapper}`}
        >
          <StatusIcon size={13} />

          {getStatusLabel(service.status)}
        </span>
      </td>

      {/* Created */}

      <td className="px-5 py-4">
        <span className="text-sm text-gray-600">
          {formatDate(service.createdAt, dateLocale)}
        </span>
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1.5">
          {/* View */}

          <Link
            href={`/admin/services/${service.id}`}
            title={t("admin.services.view")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <Eye size={16} />
          </Link>

          {/* Approve */}

          {canApprove && (
            <button
              type="button"
              title={t("admin.services.approveAction")}
              disabled={busy}
              onClick={() => onApprove(service)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isApproving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
          )}

          {/* Reject */}

          {canReject && (
            <button
              type="button"
              title={t("admin.services.rejectAction")}
              disabled={busy}
              onClick={() => onReject(service)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRejecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <X size={16} />
              )}
            </button>
          )}

          {/* Activate */}

          {canActivate && (
            <button
              type="button"
              title={t("admin.services.activateAction")}
              disabled={busy}
              onClick={() => onActivate(service)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActivating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Power size={16} />
              )}
            </button>
          )}

          {/* Deactivate */}

          {canDeactivate && (
            <button
              type="button"
              title={t("admin.services.deactivateAction")}
              disabled={busy}
              onClick={() => onDeactivate(service)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeactivating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Power size={16} />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

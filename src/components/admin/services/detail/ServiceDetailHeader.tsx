"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Power,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import { getStatusStyles } from "../serviceAdminUtils";
import type { AdminServiceDetails } from "./useAdminServiceDetails";

type SectionProps = { service: Service; detail: AdminServiceDetails };

function useSectionVars({ service, detail }: SectionProps) {
  const statusStyles = getStatusStyles(service.status);
  return {
    ...detail,
    statusStyles,
    StatusIcon: statusStyles.icon,
    totalPriceOptions: service.prices?.length || 0,
  };
}

/** Breadcrumb, title, status and the moderation buttons. */
export function ServiceDetailHeader({ service, detail }: SectionProps) {
  const { t } = useLanguage();
  const {
    getStatusLabel,
    actionLoading,
    canApprove,
    canReject,
    canActivate,
    canDeactivate,
    handleApprove,
    handleActivate,
    handleDeactivate,
    openRejectModal,
    statusStyles,
    StatusIcon,
  } = useSectionVars({ service, detail });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="transition hover:text-gray-900">
            {t("admin.services.breadcrumb")}
          </Link>

          <ChevronRight size={15} />

          <Link
            href="/admin/services"
            className="transition hover:text-gray-900"
          >
            {t("admin.services.servicePlural")}
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-900">
            {t("admin.serviceDetails.details")}
          </span>
        </div>

        <Link
          href="/admin/services"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={16} />

          {t("admin.serviceDetails.backToServices")}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
            {service.name}
          </h1>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles.wrapper}`}
          >
            <StatusIcon size={14} />

            {getStatusLabel(service.status)}
          </span>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          {t("admin.serviceDetails.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {canApprove && (
          <button
            type="button"
            disabled={Boolean(actionLoading)}
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading === "approve" ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Check size={17} />
            )}

            {t("admin.services.approveLabel")}
          </button>
        )}

        {canReject && (
          <button
            type="button"
            disabled={Boolean(actionLoading)}
            onClick={openRejectModal}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />

            {t("admin.services.rejectLabel")}
          </button>
        )}

        {canActivate && (
          <button
            type="button"
            disabled={Boolean(actionLoading)}
            onClick={handleActivate}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading === "activate" ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Power size={17} />
            )}

            {t("admin.services.activateLabel")}
          </button>
        )}

        {canDeactivate && (
          <button
            type="button"
            disabled={Boolean(actionLoading)}
            onClick={handleDeactivate}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading === "deactivate" ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Power size={17} />
            )}

            {t("admin.services.deactivateLabel")}
          </button>
        )}
      </div>
    </div>
  );
}

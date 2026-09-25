"use client";

import { Tag, User } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import { formatDateTime, getStatusStyles } from "../serviceAdminUtils";
import { TechnicalRow } from "./ServiceDetailBits";
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

/** Vendor who owns the service. */
export function ServiceVendorCard({ service }: SectionProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <User size={19} className="text-[#c59b6d]" />

          <h2 className="font-semibold text-gray-900">
            {t("admin.services.vendor")}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
            {service.vendorBusinessName?.charAt(0)?.toUpperCase() || "V"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {service.vendorBusinessName ||
                t("admin.serviceDetails.unknownVendor")}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              {t("admin.services.vendor")}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("admin.serviceDetails.vendorId")}
          </p>

          <p className="mt-1 break-all font-mono text-xs text-gray-600">
            {service.vendorId}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Service category. */
export function ServiceCategoryCard({ service }: SectionProps) {
  const { t, localize } = useLanguage();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Tag size={19} className="text-[#c59b6d]" />

          <h2 className="font-semibold text-gray-900">
            {t("admin.services.category")}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm font-semibold text-gray-900">
          {localize(service.categoryName) ||
            t("admin.serviceDetails.uncategorized")}
        </p>

        <p className="mt-2 break-all font-mono text-xs text-gray-400">
          {service.categoryId}
        </p>
      </div>
    </section>
  );
}

/** Status + dates. */
export function ServiceStatusCard({ service, detail }: SectionProps) {
  const { t } = useLanguage();
  const { dateLocale, getStatusLabel, statusStyles, StatusIcon } =
    useSectionVars({ service, detail });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          {t("admin.serviceDetails.serviceStatus")}
        </h2>
      </div>

      <div className="space-y-4 p-5">
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${statusStyles.wrapper}`}
        >
          <StatusIcon size={22} />

          <div>
            <p className="text-xs opacity-70">
              {t("admin.serviceDetails.currentStatus")}
            </p>

            <p className="mt-0.5 font-semibold">
              {getStatusLabel(service.status)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("admin.serviceDetails.createdAt")}
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {formatDateTime(service.createdAt, dateLocale)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("admin.serviceDetails.updatedAt")}
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {formatDateTime(service.updatedAt, dateLocale)}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Technical ids. */
export function ServiceIdCard({ service }: SectionProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          {t("admin.serviceDetails.technicalInfo")}
        </h2>
      </div>

      <div className="space-y-4 p-5">
        <TechnicalRow
          label={t("admin.serviceDetails.serviceId")}
          value={service.id}
        />

        <TechnicalRow
          label={t("admin.serviceDetails.vendorId")}
          value={service.vendorId}
        />

        <TechnicalRow
          label={t("admin.serviceDetails.categoryId")}
          value={service.categoryId}
        />
      </div>
    </section>
  );
}

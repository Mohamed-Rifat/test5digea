"use client";

import {
  Clock3,
  ImageIcon,
  Tag,
  XCircle,
  Package,
  CalendarDays,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import {
  formatDate,
  formatDateTime,
  getStatusStyles,
} from "../serviceAdminUtils";
import { InfoBox } from "./ServiceDetailBits";
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

/** Name, description and key facts. */
export function ServiceOverviewSection({ service, detail }: SectionProps) {
  const { t, localize } = useLanguage();
  const { dateLocale, totalPriceOptions } = useSectionVars({ service, detail });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <Package size={19} className="text-[#c59b6d]" />

          <h2 className="font-semibold text-gray-900">
            {t("admin.serviceDetails.overview")}
          </h2>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("admin.serviceDetails.serviceName")}
          </p>

          <p className="text-base font-medium text-gray-900">{service.name}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("admin.serviceDetails.description")}
          </p>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
            {service.description || t("admin.serviceDetails.noDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoBox
            icon={Tag}
            label={t("admin.services.category")}
            value={localize(service.categoryName) || "-"}
          />

          <InfoBox
            icon={CalendarDays}
            label={t("admin.services.created")}
            value={formatDate(service.createdAt, dateLocale)}
          />

          <InfoBox
            icon={Clock3}
            label={t("admin.serviceDetails.lastUpdated")}
            value={formatDateTime(service.updatedAt, dateLocale)}
          />

          <InfoBox
            icon={Package}
            label={t("admin.serviceDetails.priceOptions")}
            value={`${totalPriceOptions}`}
          />
        </div>
      </div>
    </section>
  );
}

/** Image gallery (opens the lightbox). */
export function ServiceImagesSection({ service, detail }: SectionProps) {
  const { t } = useLanguage();
  const { setLightboxIndex } = useSectionVars({ service, detail });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <ImageIcon size={19} className="text-[#c59b6d]" />

          <h2 className="font-semibold text-gray-900">
            {t("admin.serviceDetails.images")}
          </h2>

          <span className="ml-auto text-xs text-gray-400">
            {service.images?.length || 0} images
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {service.images?.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {service.images
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100 text-left"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image.url}
                    alt={`${service.name} image ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent px-3 pb-2 pt-8">
                    <span className="text-xs font-medium text-white">
                      {t("admin.serviceDetails.imageN", { n: index + 1 })}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        ) : (
          <div className="flex min-h-45 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
            <ImageIcon size={28} className="text-gray-300" />

            <p className="mt-2 text-sm text-gray-500">
              {t("admin.serviceDetails.noImages")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Price options table. */
export function ServicePricesSection({ service, detail }: SectionProps) {
  const { t } = useLanguage();
  const { money } = useSectionVars({ service, detail });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <Tag size={19} className="text-[#c59b6d]" />

          <h2 className="font-semibold text-gray-900">
            {t("admin.serviceDetails.pricing")}
          </h2>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {service.prices?.length ? (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("admin.serviceDetails.label")}
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("admin.services.price")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {service.prices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                      {price.label || t("admin.serviceDetails.standard")}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                      {money(price.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">
              {t("admin.serviceDetails.noPricing")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Why the service was rejected (if it was). */
export function RejectionReasonSection({ service }: SectionProps) {
  const { t } = useLanguage();

  if (!service.rejectionReason) return null;

  return (
    <>
      <section className="rounded-2xl border border-red-200 bg-red-50 shadow-sm">
        <div className="border-b border-red-100 px-5 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <XCircle size={19} className="text-red-600" />

            <h2 className="font-semibold text-red-800">
              {t("admin.services.rejectionReason")}
            </h2>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <p className="whitespace-pre-line text-sm leading-7 text-red-700">
            {service.rejectionReason}
          </p>
        </div>
      </section>
    </>
  );
}

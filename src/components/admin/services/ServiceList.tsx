"use client";

import { Search } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import { ServiceMobileCard } from "./ServiceMobileCard";
import { ServiceTableRow } from "./ServiceTableRow";
import type { ServiceRowHandlers } from "./useAdminServicesPage";

interface ServiceListProps extends ServiceRowHandlers {
  services: Service[];
}

/** Cards on phones, a table from `md` up. */
export function ServiceList({
  services: filteredServices,
  ...handlers
}: ServiceListProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-3 md:hidden">
        {filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Search size={22} className="text-gray-400" />
            </div>

            <h3 className="font-medium text-gray-900">
              {t("admin.services.noServices")}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t("admin.services.adjustFilters")}
            </p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <ServiceMobileCard
              key={service.id}
              service={service}
              {...handlers}
            />
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.service")}
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.vendor")}
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.category")}
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.price")}
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.status")}
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.created")}
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("admin.services.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Search size={22} className="text-gray-400" />
                      </div>

                      <h3 className="font-medium text-gray-900">
                        {t("admin.services.noServices")}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {t("admin.services.adjustFilters")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <ServiceTableRow
                    key={service.id}
                    service={service}
                    {...handlers}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredServices.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-800">
                {filteredServices.length}
              </span>{" "}
              services
            </p>
          </div>
        )}
      </div>
    </>
  );
}

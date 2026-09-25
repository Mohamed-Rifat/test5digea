"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceStatus } from "@/components/vendor/dashboard/StatusBadges";

import type { Service } from "@/types/service";

export function RecentServicesGrid({ services }: { services: Service[] }) {
  const { t, localize } = useLanguage();

  if (services.length === 0) return null;

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#30251f]">
            {t("vendor.dashboard.services.title")}
          </h3>
          <p className="text-xs text-[#9b8f86]">
            {t("vendor.dashboard.services.subtitle")}
          </p>
        </div>
        <Link
          href="/vendor/services"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#a47e43] hover:text-[#8b6d55]"
        >
          {t("vendor.dashboard.reviews.viewAll")}{" "}
          <ChevronRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.slice(0, 4).map((service) => (
          <Link
            key={service.id}
            href={`/vendor/services/${service.id}`}
            className="group rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-4 transition hover:border-[#a47e43] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-[#30251f]">
                  {service.name}
                </h4>
                <p className="mt-0.5 text-xs text-[#9a8d85]">
                  {localize(service.categoryName) ||
                    t("vendor.dashboard.services.uncategorized")}
                </p>
              </div>
              <ServiceStatus status={service.status} />
            </div>
            {service.prices.length > 0 && (
              <p className="mt-2 text-xs text-[#a47e43] font-medium">
                {t("vendor.dashboard.services.from", {
                  price: `${Math.min(...service.prices.map((p) => p.price))} ${t("common.currency")}`,
                })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

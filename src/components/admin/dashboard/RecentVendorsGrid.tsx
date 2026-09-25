"use client";

import { MapPin, Star, Store, UserPlus, Users } from "lucide-react";

import type { Vendor } from "@/types/vendor";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { formatDate, formatRating } from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function RecentVendorsGrid({ vendors }: { vendors: Vendor[] }) {
  const { t, language } = useLanguage();

  return (
    <DashboardSection
      className="mt-5"
      icon={UserPlus}
      title={t("admin.dashboard.insights.recentVendors")}
      subtitle={t("admin.dashboard.insights.subtitle")}
      action={{ href: "/admin/vendors", label: t("admin.dashboard.quickActions.manageVendors") }}
    >
      {vendors.length === 0 ? (
        <div className="p-8">
          <EmptyState icon={Users} text={t('admin.dashboard.noVendorsAdded')} />
        </div>
      ) : (
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group rounded-xl border border-[#eee6e1] p-4 transition hover:border-[#dcd0c7] hover:bg-[#fcfaf8]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#f6f0ec]">
                  {vendor.profileImageUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={vendor.profileImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store size={17} className="text-[#806d61]" />
                  )}
                </div>

                <StatusBadge status={vendor.status} />
              </div>

              <p className="mt-3 truncate text-xs font-semibold text-[#40342d]">
                {vendor.businessName}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9b8e86]">
                <MapPin size={11} />
                <span className="truncate">
                  {vendor.location || t('admin.dashboard.locationNotProvided')}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-[#8a786d]">
                  <Star size={11} fill="currentColor" />

                  {formatRating(Number(vendor.averageRating) || 0)}
                </div>

                <span className="text-[9px] text-[#b0a39b]">
                  {formatDate(vendor.createdAt, LANGUAGE_DATE_LOCALE[language])}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}

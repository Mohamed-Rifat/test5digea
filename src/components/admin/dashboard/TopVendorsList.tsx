"use client";

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

import type { Vendor } from "@/types/vendor";
import EmptyState from "./EmptyState";
import VendorListItem from "./VendorListItem";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function TopVendorsList({ loading, vendors }: { loading: boolean; vendors: Vendor[] }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      icon={Star}
      title={t("admin.dashboard.topVendors")}
      subtitle={t("admin.dashboard.vendorPerformance.subtitle")}
    >
      {loading ? (
        <div className="space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#eee8e3]" />

              <div className="flex-1">
                <div className="h-2.5 w-28 rounded bg-[#eee8e3]" />
                <div className="mt-2 h-2 w-20 rounded bg-[#f2ede9]" />
              </div>

              <div className="h-5 w-10 rounded-full bg-[#f1ece8]" />
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={Star} text={t('admin.dashboard.vendorPerformance.empty')} />
        </div>
      ) : (
        <div className="divide-y divide-[#f5efeb]">
          {vendors.map((vendor, index) => (
            <VendorListItem
              key={vendor.id}
              vendor={vendor}
              rank={index + 1}
              showRating
            />
          ))}
        </div>
      )}

      <div className="border-t border-[#f0e9e4] p-4">
        <Link
          href="/admin/vendors"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9e0da] px-4 py-2.5 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
        >
          {t('admin.dashboard.quickActions.viewAllVendors')}
          <ChevronRight size={14} />
        </Link>
      </div>
    </DashboardSection>
  );
}

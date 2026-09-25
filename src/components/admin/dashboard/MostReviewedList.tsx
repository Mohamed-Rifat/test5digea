"use client";

import { MessageSquare } from "lucide-react";

import type { Vendor } from "@/types/vendor";
import EmptyState from "./EmptyState";
import VendorListItem from "./VendorListItem";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function MostReviewedList({ vendors }: { vendors: Vendor[] }) {
  const { t } = useLanguage();

  return (
    <DashboardSection
      icon={MessageSquare}
      title={t("admin.dashboard.mostReviewed")}
      subtitle={t("admin.dashboard.mostReviewedSubtitle")}
    >
      {vendors.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={MessageSquare} text={t('admin.dashboard.ratingDistribution.empty')} />
        </div>
      ) : (
        <div className="divide-y divide-[#f5efeb]">
          {vendors.map((vendor, index) => (
            <VendorListItem
              key={vendor.id}
              vendor={vendor}
              rank={index + 1}
              showReviews
            />
          ))}
        </div>
      )}
    </DashboardSection>
  );
}

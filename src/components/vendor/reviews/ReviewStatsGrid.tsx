"use client";

import { Clock3, Eye, EyeOff, MessageSquareText, Star } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { StatCard } from "./ReviewBits";
import type { VendorReviewsPageState } from "./useVendorReviewsPage";

export function ReviewStatsGrid({ stats }: { stats: VendorReviewsPageState["stats"] }) {
  const { t } = useLanguage();

  return (
    <section aria-label={t("vendor.reviews.statsAria")} className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5 lg:gap-4">
      <StatCard
        title={t("vendor.reviews.stats.avgRating")}
        value={stats.averageRating.toFixed(1)}
        icon={Star}
        description={t("vendor.reviews.stats.approvedCount", { count: stats.approved })}
        highlight
      />

      <StatCard
        title={t("vendor.reviews.stats.total")}
        value={stats.total}
        icon={MessageSquareText}
        description={t("vendor.reviews.stats.allReviews")}
      />

      <StatCard
        title={t("vendor.reviews.stats.visible")}
        value={stats.visible}
        icon={Eye}
        description={t("vendor.reviews.stats.shownOnListing")}
      />

      <StatCard
        title={t("vendor.reviews.stats.hidden")}
        value={stats.hidden}
        icon={EyeOff}
        description={t("vendor.reviews.stats.hiddenByAdmin")}
      />

      <StatCard
        title={t("vendor.reviews.stats.pending")}
        value={stats.pending}
        icon={Clock3}
        description={t("vendor.reviews.stats.rejectedCount", { count: stats.rejected })}
      />
    </section>
  );
}

"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Eye,
  MessageSquareText,
  AlertCircle,
  Clock3,
  CheckCircle2,
  Shield,
  Building2,
} from "lucide-react";
import { useAdminReviews } from "@/features/reviews/hooks/useAdminReviews";
import { useAdminServices } from "@/features/services/hooks/useAdminServices";

import { AdminReviewsPageSkeleton } from "@/components/admin/reviews/AdminReviewsSkeletons";
import { ApprovedReviewsManager } from "@/components/admin/reviews/ApprovedReviewsManager";
import { PendingReviews } from "@/components/admin/reviews/PendingReviews";
import { StatCard } from "@/components/admin/reviews/StatCard";

export default function AdminReviewsPage() {
  const { t } = useLanguage();
  const { reviews: pendingReviews, loading: pendingLoading } = useAdminReviews();
  const { services, loading: servicesLoading } = useAdminServices();

  const isInitialLoading = pendingLoading || servicesLoading;

  // ✅ لو الصفحة بتعمل load مبدئي، اعرض الـ Skeleton
  if (isInitialLoading) {
    return <AdminReviewsPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-full space-y-5 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
      <header>
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
          <Shield size={11} className="sm:h-3.25 sm:w-3.25" />
          {t('admin.reviews.breadcrumb')}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
            <MessageSquareText
              size={16}
              className="text-[#a47e43] sm:h-5 sm:w-5"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
            {t('admin.reviews.title')}
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
          {t('admin.reviews.subtitlePart1')} {t('admin.reviews.subtitlePart2')}
        </p>
      </header>

      <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          title={t('admin.reviews.pending')}
          value={pendingReviews.length}
          icon={Clock3}
          description={t('admin.reviews.awaitingModeration')}
          color="#f59e0b"
          highlight={pendingReviews.length > 0}
        />
        <StatCard
          title={t('admin.reviews.totalServices')}
          value={services.length}
          icon={Building2}
          description={t('admin.reviews.acrossPlatform')}
          color="#a47e43"
        />
        <StatCard
          title={t('admin.reviews.yourRole')}
          value={t('admin.reviews.admin')}
          icon={Shield}
          description={t('admin.reviews.fullAccess')}
          color="#8b5cf6"
        />
        <StatCard
          title={t('admin.reviews.systemStatus')}
          value={t('admin.reviews.active')}
          icon={CheckCircle2}
          description={t('admin.reviews.allSystemsRunning')}
          color="#10b981"
        />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 sm:h-9 sm:w-9">
            <Clock3 size={14} className="text-amber-700 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
              {t('admin.reviews.pendingApproval')}
            </h2>
            <p className="text-[10px] text-[#9b8f86] sm:text-xs">
              {t('admin.reviews.pendingSubtitle')}
            </p>
          </div>
        </div>

        <PendingReviews />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 sm:h-9 sm:w-9">
            <Eye size={14} className="text-emerald-700 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
              {t('admin.reviews.manageVisibility')}
            </h2>
            <p className="text-[10px] text-[#9b8f86] sm:text-xs">
              {t('admin.reviews.manageApprovedSubtitle')}
            </p>
          </div>
        </div>

        <ApprovedReviewsManager />
      </section>

      <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:p-3.5 sm:text-xs">
        <AlertCircle
          size={13}
          className="mt-0.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4"
        />
        <span className="leading-5">
          <span className="font-medium text-[#40352f]">{t('admin.reviews.tip')}</span>{" "}
          {t('admin.reviews.tipText')}
        </span>
      </div>
    </div>
  );
}

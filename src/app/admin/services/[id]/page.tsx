"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import ImageLightbox from "@/components/shared/ImageLightbox";
import { RejectServiceModal } from "@/components/admin/services/RejectServiceModal";
import { ServiceDetailHeader } from "@/components/admin/services/detail/ServiceDetailHeader";
import {
  RejectionReasonSection,
  ServiceImagesSection,
  ServiceOverviewSection,
  ServicePricesSection,
} from "@/components/admin/services/detail/ServiceDetailMain";
import {
  ServiceCategoryCard,
  ServiceIdCard,
  ServiceStatusCard,
  ServiceVendorCard,
} from "@/components/admin/services/detail/ServiceDetailSidebar";
import { useAdminServiceDetails } from "@/components/admin/services/detail/useAdminServiceDetails";

export default function AdminServiceDetailsPage() {
  const { t } = useLanguage();
  const detail = useAdminServiceDetails();
  const { service } = detail;

  if (detail.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={34} className="animate-spin text-[#c59b6d]" />
          <p className="text-sm text-gray-500">
            {t("admin.serviceDetails.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (detail.error || !service) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-5">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            {t("admin.serviceDetails.backToServices")}
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <h2 className="font-semibold text-red-800">
                {t("admin.serviceDetails.loadFailedTitle")}
              </h2>
              <p className="mt-1 text-sm text-red-700">
                {detail.error || t("admin.serviceDetails.notFound")}
              </p>
              <button
                type="button"
                onClick={detail.fetchService}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                {t("admin.serviceDetails.tryAgain")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const section = { service, detail };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ServiceDetailHeader {...section} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <ServiceOverviewSection {...section} />
          <ServiceImagesSection {...section} />
          <ServicePricesSection {...section} />
          <RejectionReasonSection {...section} />
        </div>

        <div className="space-y-6">
          <ServiceVendorCard {...section} />
          <ServiceCategoryCard {...section} />
          <ServiceStatusCard {...section} />
          <ServiceIdCard {...section} />
        </div>
      </div>

      {detail.rejectModalOpen && (
        <RejectServiceModal
          serviceName={service.name}
          vendorName={service.vendorBusinessName}
          reason={detail.rejectReason}
          onReasonChange={detail.setRejectReason}
          onConfirm={detail.handleReject}
          onClose={detail.closeRejectModal}
          loading={detail.actionLoading === "reject"}
          subtitle={t("admin.serviceDetails.rejectSubtitle")}
          placeholder={t("admin.serviceDetails.rejectPlaceholder")}
        />
      )}

      {service.images && service.images.length > 0 && (
        <ImageLightbox
          images={[...service.images]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((image) => ({ id: image.id, url: image.url }))}
          initialIndex={detail.lightboxIndex ?? 0}
          open={detail.lightboxIndex !== null}
          onClose={() => detail.setLightboxIndex(null)}
          title={service.name}
        />
      )}
    </div>
  );
}

"use client";

import { AlertCircle, Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { RejectServiceModal } from "@/components/admin/services/RejectServiceModal";
import { ServiceFilters } from "@/components/admin/services/ServiceFilters";
import { ServiceList } from "@/components/admin/services/ServiceList";
import { ServiceStats } from "@/components/admin/services/ServiceStats";
import { ServicesHeader } from "@/components/admin/services/ServicesHeader";
import { useAdminServicesPage } from "@/components/admin/services/useAdminServicesPage";

export default function AdminServicesPage() {
  const { t } = useLanguage();
  const page = useAdminServicesPage();

  if (page.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#c59b6d]" />
          <p className="text-sm text-gray-500">{t("admin.services.loading")}</p>
        </div>
      </div>
    );
  }

  if (page.error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-red-600" size={22} />
            <div>
              <h2 className="font-semibold text-red-800">
                {t("admin.services.loadFailed")}
              </h2>
              <p className="mt-1 text-sm text-red-700">{page.error}</p>
              <button
                type="button"
                onClick={page.refetch}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                {t("admin.services.tryAgain")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ServicesHeader loading={page.loading} onRefresh={page.refetch} />

      <ServiceStats stats={page.stats} />

      <ServiceFilters
        search={page.search}
        onSearch={page.setSearch}
        categoryFilter={page.categoryFilter}
        onCategoryFilter={page.setCategoryFilter}
        statusFilter={page.statusFilter}
        onStatusFilter={page.setStatusFilter}
        categories={page.categories}
        categoriesLoading={page.categoriesLoading}
        statusOptions={page.statusOptions}
        getStatusLabel={page.getStatusLabel}
        shown={page.filteredServices.length}
        total={page.services.length}
        onClear={page.clearFilters}
      />

      <ServiceList
        services={page.filteredServices}
        onApprove={page.handleApprove}
        onReject={page.openRejectModal}
        onActivate={page.handleActivate}
        onDeactivate={page.handleDeactivate}
        getStatusLabel={page.getStatusLabel}
        money={page.money}
        dateLocale={page.dateLocale}
        actionLoading={page.actionLoading}
      />

      {page.rejectModalOpen && page.selectedService && (
        <RejectServiceModal
          serviceName={page.selectedService.name}
          vendorName={page.selectedService.vendorBusinessName}
          reason={page.rejectReason}
          onReasonChange={page.setRejectReason}
          onConfirm={page.handleReject}
          onClose={page.closeRejectModal}
          loading={Boolean(page.actionLoading)}
        />
      )}
    </div>
  );
}

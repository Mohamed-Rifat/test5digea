"use client";

import { Plus } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import CreateVendorModal from "@/components/admin/vendors/CreateVendorModal";
import DeactivateVendorModal from "@/components/admin/vendors/DeactivateVendorModal";
import EmptyVendors from "@/components/admin/vendors/EmptyVendors";
import FeedbackBanners from "@/components/admin/vendors/FeedbackBanners";
import RejectVendorModal from "@/components/admin/vendors/RejectVendorModal";
import VendorList from "@/components/admin/vendors/VendorList";
import VendorStatsCards from "@/components/admin/vendors/VendorStatsCards";
import VendorsHeader from "@/components/admin/vendors/VendorsHeader";
import VendorsSkeleton from "@/components/admin/vendors/VendorsSkeleton";
import VendorsToolbar from "@/components/admin/vendors/VendorsToolbar";
import { useAdminVendorsPage } from "@/components/admin/vendors/useAdminVendorsPage";

export default function AdminVendorsPage() {
  const { t } = useLanguage();
  const page = useAdminVendorsPage();

  if (page.loading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-0">
        <div className="mx-auto max-w-full">
          <VendorsSkeleton />
        </div>
      </div>
    );
  }

  const hasFilters = Boolean(page.search || page.statusFilter !== "all");

  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-6 pb-28 sm:px-6 lg:px-0 lg:pb-10">
      <div className="mx-auto max-w-full">
        <VendorsHeader total={page.stats.total} onAdd={page.openCreate} />

        <FeedbackBanners error={page.actionError || page.error} success={page.success} />

        <VendorStatsCards
          stats={page.stats}
          statusFilter={page.statusFilter}
          onFilter={page.setStatusFilter}
        />

        <VendorsToolbar
          search={page.search}
          onSearch={page.setSearch}
          statusFilter={page.statusFilter}
          onStatusFilter={page.setStatusFilter}
          shown={page.filteredVendors.length}
          total={page.vendors.length}
        />

        {page.filteredVendors.length === 0 ? (
          <EmptyVendors
            hasFilters={hasFilters}
            onClear={() => {
              page.setSearch("");
              page.setStatusFilter("all");
            }}
            onCreate={page.openCreate}
          />
        ) : (
          <VendorList
            vendors={page.filteredVendors}
            busyId={page.actionLoading}
            actionsFor={page.actionsFor}
          />
        )}
      </div>

      {/* Floating "add vendor" button on phones */}
      <button
        type="button"
        onClick={page.openCreate}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#30251f] text-white shadow-[0_16px_35px_-10px_rgba(48,37,31,0.65)] transition hover:-translate-y-0.5 hover:bg-[#45362e] active:scale-95 sm:hidden"
        aria-label={t("admin.vendors.add")}
      >
        <Plus size={22} />
      </button>

      {page.showCreateModal && (
        <CreateVendorModal
          form={page.createForm}
          onChange={page.setCreateForm}
          onSubmit={page.handleCreateVendor}
          onClose={() => page.setShowCreateModal(false)}
          loading={page.createLoading}
          error={page.actionError}
        />
      )}

      {page.rejectVendorId && (
        <RejectVendorModal
          reason={page.rejectReason}
          onReasonChange={page.setRejectReason}
          onConfirm={page.handleReject}
          onClose={page.closeReject}
          loading={page.actionLoading === page.rejectVendorId}
          error={page.actionError}
        />
      )}

      {page.deactivateVendorId && (
        <DeactivateVendorModal
          onConfirm={page.handleDeactivate}
          onClose={page.closeDeactivate}
          loading={page.actionLoading === page.deactivateVendorId}
          error={page.actionError}
        />
      )}
    </div>
  );
}

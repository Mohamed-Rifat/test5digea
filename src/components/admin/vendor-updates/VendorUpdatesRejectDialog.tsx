"use client";

import { RejectReasonDialog } from "@/components/admin/VendorChangesReview";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorUpdatesState } from "./useVendorUpdates";

/** Reject-with-reason dialog. */
export function VendorUpdatesRejectDialog({
  updates,
}: {
  updates: VendorUpdatesState;
}) {
  const { t } = useLanguage();
  const {
    busy,
    rejectTarget,
    setRejectTarget,
    rejectReason,
    setRejectReason,
    handleReject,
  } = updates;

  return (
    <RejectReasonDialog
      open={!!rejectTarget}
      title={t("admin.vendorDetails.review.modal.title")}
      reason={rejectReason}
      onReasonChange={setRejectReason}
      loading={busy?.action === "reject"}
      onCancel={() => setRejectTarget(null)}
      onConfirm={handleReject}
    />
  );
}

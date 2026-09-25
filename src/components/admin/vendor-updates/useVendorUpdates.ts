"use client";

import { useState } from "react";
import { useVendorsWithPendingChanges } from "@/features/vendors/hooks/useVendorsWithPendingChanges";
import { approveVendor, rejectVendor } from "@/features/vendors/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { Vendor } from "@/types/vendor";

/** Vendors with pending profile changes: scan progress and approve / reject actions. */
export function useVendorUpdates() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const { vendors, loading, error, progress, failedCount, refetch, remove } =
    useVendorsWithPendingChanges();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<{
    id: string;
    action: "approve" | "reject";
  } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Vendor | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  const handleApprove = async (vendor: Vendor) => {
    try {
      setBusy({ id: vendor.id, action: "approve" });

      await approveVendor(vendor.id);

      remove(vendor.id);
      setExpandedId((current) => (current === vendor.id ? null : current));
      showMessage("success", t("admin.vendorDetails.review.approvedChangesOk"));
    } catch (err: unknown) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed")),
      );
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage(
        "error",
        t("admin.vendorDetails.review.modal.reasonRequired"),
      );
      return;
    }

    try {
      setBusy({ id: rejectTarget.id, action: "reject" });

      await rejectVendor(rejectTarget.id, { reason });

      remove(rejectTarget.id);
      setExpandedId((current) =>
        current === rejectTarget.id ? null : current,
      );
      setRejectTarget(null);
      setRejectReason("");
      showMessage("success", t("admin.vendorDetails.review.rejectedOk"));
    } catch (err: unknown) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed")),
      );
    } finally {
      setBusy(null);
    }
  };

  const scanning = loading && progress.total > 0;

  return {
    dateLocale,
    expandedId,
    setExpandedId,
    busy,
    setBusy,
    rejectTarget,
    setRejectTarget,
    rejectReason,
    setRejectReason,
    showMessage,
    handleApprove,
    handleReject,
    scanning,
    toast,
    vendors,
    loading,
    error,
    progress,
    failedCount,
    refetch,
    remove,
  };
}

export type VendorUpdatesState = ReturnType<typeof useVendorUpdates>;

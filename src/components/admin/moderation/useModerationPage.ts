"use client";

import { useState } from "react";
import { useModerationQueue } from "@/features/moderation/hooks/useModerationQueue";
import {
  approveServiceImage,
  rejectServiceImage,
} from "@/features/services/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { ModerationEntityType, ModerationStatus } from "@/types/moderation";
import type {
  GetModerationQueueParams,
  ModerationQueueItem,
} from "@/types/moderation";

/** Moderation queue: filters, paging and approve / reject actions. */
export function useModerationPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const entityTypeOptions = [
    { value: "", label: t("admin.moderation.types.all") },
    {
      value: String(ModerationEntityType.Vendor),
      label: t("admin.moderation.types.vendors"),
    },
    {
      value: String(ModerationEntityType.Service),
      label: t("admin.moderation.types.services"),
    },
    {
      value: String(ModerationEntityType.Review),
      label: t("admin.moderation.types.reviews"),
    },
    {
      value: String(ModerationEntityType.ServiceImage),
      label: t("admin.moderation.types.images"),
    },
  ];

  const statusOptions = [
    { value: "", label: t("admin.moderation.statuses.all") },
    {
      value: String(ModerationStatus.Pending),
      label: t("admin.moderation.statuses.pending"),
    },
    {
      value: String(ModerationStatus.Approved),
      label: t("admin.moderation.statuses.approved"),
    },
    {
      value: String(ModerationStatus.Rejected),
      label: t("admin.moderation.statuses.rejected"),
    },
  ];

  const [vendorId, setVendorId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const params: GetModerationQueueParams = {
    vendorId: vendorId.trim() || undefined,
    entityType: entityType
      ? (Number(entityType) as ModerationEntityType)
      : undefined,
    status: status ? (Number(status) as ModerationStatus) : undefined,
    dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
  };

  const { items, loading, error, refetch } = useModerationQueue(params);

  // Image approve/reject — the only entity type in this queue with its
  // own dedicated endpoints, so it's actioned inline instead of via
  // reviewHref's "open the parent page" fallback.
  const [imageActionId, setImageActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ModerationQueueItem | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [previewItem, setPreviewItem] = useState<ModerationQueueItem | null>(
    null,
  );

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  const handleApproveImage = async (item: ModerationQueueItem) => {
    try {
      setImageActionId(item.entityId);

      await approveServiceImage(item.entityId);
      await refetch();

      setPreviewItem(null);
      showMessage("success", t("admin.moderation.messages.imageApproved"));
    } catch (err) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.moderation.messages.approveFailed")),
      );
    } finally {
      setImageActionId(null);
    }
  };

  const openRejectModal = (item: ModerationQueueItem) => {
    setRejectReason("");
    setPreviewItem(null);
    setRejectTarget(item);
  };

  const closeRejectModal = () => {
    if (imageActionId === rejectTarget?.entityId) return;

    setRejectTarget(null);
    setRejectReason("");
  };

  const handleRejectImage = async () => {
    if (!rejectTarget) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage("error", t("admin.moderation.messages.reasonRequired"));
      return;
    }

    try {
      setImageActionId(rejectTarget.entityId);

      await rejectServiceImage(rejectTarget.entityId, { reason });
      await refetch();

      setRejectTarget(null);
      setRejectReason("");

      showMessage("success", t("admin.moderation.messages.imageRejected"));
    } catch (err) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.moderation.messages.rejectFailed")),
      );
    } finally {
      setImageActionId(null);
    }
  };

  const hasFilters =
    !!vendorId || !!entityType || !!status || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setVendorId("");
    setEntityType("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
  };

  return {
    dateLocale,
    entityTypeOptions,
    statusOptions,
    vendorId,
    setVendorId,
    entityType,
    setEntityType,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    params,
    imageActionId,
    setImageActionId,
    rejectTarget,
    setRejectTarget,
    rejectReason,
    setRejectReason,
    previewItem,
    setPreviewItem,
    showMessage,
    handleApproveImage,
    openRejectModal,
    closeRejectModal,
    handleRejectImage,
    hasFilters,
    clearFilters,
    toast,
    items,
    loading,
    error,
    refetch,
  };
}

export type ModerationQueueState = ReturnType<typeof useModerationPage>;

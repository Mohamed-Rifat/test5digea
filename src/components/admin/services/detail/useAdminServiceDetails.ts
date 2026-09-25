"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useConfirm } from "@/components/providers/ConfirmProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import {
  activateService,
  approveService,
  deactivateService,
  getAdminService,
  rejectService,
} from "@/features/services/api";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import type { Service } from "@/types/service";

import {
  formatPrice,
  getRawStatusLabel,
  getStatusKey,
} from "../serviceAdminUtils";

/** Loads one service for the admin and exposes the moderation actions. */
export function useAdminServiceDetails() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const confirm = useConfirm();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];
  const getStatusLabel = (status: string) => {
    const key = getStatusKey(status);

    return key
      ? t(key)
      : getRawStatusLabel(status) || t("admin.services.unknown");
  };
  const money = (value: number) =>
    `${formatPrice(value)} ${t("common.currency")}`;
  const params = useParams();

  const serviceId = typeof params.id === "string" ? params.id : "";

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* =========================
     Fetch Service
  ========================= */

  const fetchService = useCallback(async () => {
    if (!serviceId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getAdminService(serviceId);

      setService(data);
    } catch {
      setError(t("admin.serviceDetails.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [serviceId, t]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  /* =========================
     Message
  ========================= */

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  /* =========================
     Refresh After Action
  ========================= */

  const refreshService = async () => {
    if (!serviceId) return;

    try {
      const data = await getAdminService(serviceId);

      setService(data);
    } catch {}
  };

  /* =========================
     Approve
  ========================= */

  const handleApprove = async () => {
    if (!service) return;

    const confirmed = await confirm({
      message: t("admin.services.confirmApprove", { name: service.name }),
    });

    if (!confirmed) return;

    try {
      setActionLoading("approve");

      await approveService(service.id);

      await refreshService();

      showMessage("success", t("admin.services.approvedSuccess"));
    } catch {
      showMessage("error", t("admin.services.approveFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Reject
  ========================= */

  const openRejectModal = () => {
    if (!service) return;

    setRejectReason(service.rejectionReason || "");

    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    if (actionLoading === "reject") return;

    setRejectModalOpen(false);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!service) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage("error", t("admin.services.reasonRequired"));
      return;
    }

    try {
      setActionLoading("reject");

      await rejectService(service.id, {
        reason,
      });

      setRejectModalOpen(false);
      setRejectReason("");

      await refreshService();

      showMessage("success", t("admin.services.rejectedSuccess"));
    } catch {
      showMessage("error", t("admin.services.rejectFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Activate
  ========================= */

  const handleActivate = async () => {
    if (!service) return;

    const confirmed = await confirm({
      message: t("admin.services.confirmActivate", { name: service.name }),
    });

    if (!confirmed) return;

    try {
      setActionLoading("activate");

      await activateService(service.id);

      await refreshService();

      showMessage("success", t("admin.services.activatedSuccess"));
    } catch {
      showMessage("error", t("admin.services.activateFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Deactivate
  ========================= */

  const handleDeactivate = async () => {
    if (!service) return;

    const confirmed = await confirm({
      message: t("admin.services.confirmDeactivate", { name: service.name }),
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      setActionLoading("deactivate");

      await deactivateService(service.id);

      await refreshService();

      showMessage("success", t("admin.services.deactivatedSuccess"));
    } catch {
      showMessage("error", t("admin.services.deactivateFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Loading
  ========================= */

  const normalizedStatus = service?.status
    ?.toLowerCase()
    .replace(/[_-\s]/g, "");

  return {
    service,
    loading,
    error,
    actionLoading,
    fetchService,
    dateLocale,
    getStatusLabel,
    money,
    canApprove: !!normalizedStatus?.includes("pending"),
    canReject: !!normalizedStatus?.includes("pending"),
    canActivate: !!(
      normalizedStatus?.includes("inactive") ||
      normalizedStatus?.includes("deactiv")
    ),
    canDeactivate: !!(
      normalizedStatus?.includes("approved") ||
      normalizedStatus?.includes("active")
    ),
    handleApprove,
    handleActivate,
    handleDeactivate,
    rejectModalOpen,
    rejectReason,
    setRejectReason,
    openRejectModal,
    closeRejectModal,
    handleReject,
    lightboxIndex,
    setLightboxIndex,
  };
}

export type AdminServiceDetails = ReturnType<typeof useAdminServiceDetails>;

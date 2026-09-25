"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useConfirm } from "@/components/providers/ConfirmProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";
import { useAdminServices } from "@/features/services/hooks/useAdminServices";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import type { Service } from "@/types/service";

import {
  formatPrice,
  getRawStatusLabel,
  getStatusKey,
} from "./serviceAdminUtils";

/** Filters, stats and moderation actions of the admin services list. */
export function useAdminServicesPage() {
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
  const {
    services,
    loading,
    error,
    actionLoading,
    refetch,
    approve,
    reject,
    activate,
    deactivate,
  } = useAdminServices();

  const { categories, loading: categoriesLoading } = useAdminCategories();

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [rejectReason, setRejectReason] = useState("");

  /* =========================
     Status Options
     ========================= */

  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(services.map((service) => service.status).filter(Boolean)),
    );

    return uniqueStatuses;
  }, [services]);

  /* =========================
     Filtered Services
     ========================= */

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name?.toLowerCase().includes(normalizedSearch) ||
        service.vendorBusinessName?.toLowerCase().includes(normalizedSearch) ||
        service.categoryName?.toLowerCase().includes(normalizedSearch) ||
        service.description?.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !categoryFilter || service.categoryId === categoryFilter;

      const matchesStatus = !statusFilter || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  /* =========================
     Stats
     ========================= */

  const stats = useMemo(() => {
    const normalized = services.map((service) => ({
      ...service,
      normalizedStatus: service.status?.toLowerCase().replace(/[_-\s]/g, ""),
    }));

    return {
      total: services.length,

      approved: normalized.filter((service) =>
        service.normalizedStatus?.includes("approved"),
      ).length,

      pending: normalized.filter((service) =>
        service.normalizedStatus?.includes("pending"),
      ).length,

      rejected: normalized.filter((service) =>
        service.normalizedStatus?.includes("reject"),
      ).length,
    };
  }, [services]);

  /* =========================
     Messages
     ========================= */

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  /* =========================
     Approve
     ========================= */

  const handleApprove = async (service: Service) => {
    const confirmed = await confirm({
      message: t("admin.services.confirmApprove", { name: service.name }),
    });

    if (!confirmed) return;

    const success = await approve(service.id);

    if (success) {
      showMessage("success", t("admin.services.approvedSuccess"));
    } else {
      showMessage("error", t("admin.services.approveFailed"));
    }
  };

  /* =========================
     Reject
     ========================= */

  const openRejectModal = (service: Service) => {
    setSelectedService(service);
    setRejectReason(service.rejectionReason || "");
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    if (actionLoading) return;

    setRejectModalOpen(false);
    setSelectedService(null);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!selectedService) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage("error", t("admin.services.reasonRequired"));
      return;
    }

    const success = await reject(selectedService.id, {
      reason,
    });

    if (success) {
      closeRejectModal();

      showMessage("success", t("admin.services.rejectedSuccess"));
    } else {
      showMessage("error", t("admin.services.rejectFailed"));
    }
  };

  /* =========================
     Activate
     ========================= */

  const handleActivate = async (service: Service) => {
    const confirmed = await confirm({
      message: t("admin.services.confirmActivate", { name: service.name }),
    });

    if (!confirmed) return;

    const success = await activate(service.id);

    if (success) {
      showMessage("success", t("admin.services.activatedSuccess"));
    } else {
      showMessage("error", t("admin.services.activateFailed"));
    }
  };

  /* =========================
     Deactivate
     ========================= */

  const handleDeactivate = async (service: Service) => {
    const confirmed = await confirm({
      message: t("admin.services.confirmDeactivate", { name: service.name }),
      tone: "danger",
    });

    if (!confirmed) return;

    const success = await deactivate(service.id);

    if (success) {
      showMessage("success", t("admin.services.deactivatedSuccess"));
    } else {
      showMessage("error", t("admin.services.deactivateFailed"));
    }
  };

  /* =========================
     Loading
     ========================= */

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  return {
    services,
    loading,
    error,
    actionLoading,
    refetch,
    categories,
    categoriesLoading,
    dateLocale,
    getStatusLabel,
    money,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    statusOptions,
    filteredServices,
    stats,
    handleApprove,
    handleActivate,
    handleDeactivate,
    openRejectModal,
    rejectModalOpen,
    selectedService,
    rejectReason,
    setRejectReason,
    closeRejectModal,
    handleReject,
  };
}

export type AdminServicesPageState = ReturnType<typeof useAdminServicesPage>;

/** Per-row callbacks shared by the table and the mobile cards. */
export interface ServiceRowHandlers {
  onApprove: (service: Service) => void;
  onReject: (service: Service) => void;
  onActivate: (service: Service) => void;
  onDeactivate: (service: Service) => void;
  getStatusLabel: (status: string) => string;
  money: (value: number) => string;
  dateLocale: string;
  actionLoading: string | null;
}

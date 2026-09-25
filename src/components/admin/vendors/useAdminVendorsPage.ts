"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import {
  activateVendor,
  approveVendor,
  createVendor,
  deactivateVendor,
  rejectVendor,
} from "@/features/vendors/api";
import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";
import { getApiErrorMessage } from "@/lib/error";
import type { Vendor } from "@/types/vendor";

import { EMPTY_CREATE_FORM, type CreateVendorForm } from "./CreateVendorModal";
import type { VendorRowActions } from "./VendorInlineActions";
import type { VendorStatusFilter } from "./vendorStatus";

/** State + actions of the admin vendors page (filters, modals, API calls). */
export function useAdminVendorsPage() {
  const { t } = useLanguage();
  const { vendors, loading, error, refetch } = useAdminVendors();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<VendorStatusFilter>("all");

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [success, setSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Reject
  const [rejectVendorId, setRejectVendorId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Deactivate
  const [deactivateVendorId, setDeactivateVendorId] = useState<string | null>(
    null
  );

  // Create
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createForm, setCreateForm] = useState<CreateVendorForm>(EMPTY_CREATE_FORM);

  const [createLoading, setCreateLoading] = useState(false);

  // Deep link from the admin messages inbox (a vendor-application message):
  // /admin/vendors?prefillName=...&prefillEmail=...[&prefillBusinessName=...]
  // opens the create-vendor modal pre-filled so the admin doesn't retype it.
  const appliedPrefillRef = useRef(false);

  useEffect(() => {
    if (appliedPrefillRef.current) return;

    const prefillName = searchParams.get("prefillName");
    const prefillEmail = searchParams.get("prefillEmail");
    const prefillBusinessName = searchParams.get("prefillBusinessName");

    if (!prefillName && !prefillEmail && !prefillBusinessName) return;

    appliedPrefillRef.current = true;

    setCreateForm((prev) => ({
      ...prev,
      fullName: prefillName ?? prev.fullName,
      email: prefillEmail ?? prev.email,
      businessName: prefillBusinessName ?? prev.businessName,
    }));
    setShowCreateModal(true);

    // Strip the params so refreshing the page doesn't reopen the modal.
    router.replace("/admin/vendors", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ============================================================
  // Stats
  // ============================================================

  const stats = useMemo(() => {
    const total = vendors.length;

    const pending = vendors.filter(
      (vendor) => vendor.status === "Pending"
    ).length;

    const approved = vendors.filter(
      (vendor) => vendor.status === "Approved"
    ).length;

    const rejected = vendors.filter(
      (vendor) => vendor.status === "Rejected"
    ).length;

    const inactive = vendors.filter(
      (vendor) => vendor.status === "Inactive"
    ).length;

    const ratedVendors = vendors.filter(
      (vendor) => Number(vendor.averageRating || 0) > 0
    );

    const averageRating =
      ratedVendors.length > 0
        ? ratedVendors.reduce(
            (sum, vendor) => sum + Number(vendor.averageRating || 0),
            0
          ) / ratedVendors.length
        : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      inactive,
      averageRating,
    };
  }, [vendors]);

  // ============================================================
  // Filter
  // ============================================================

  const filteredVendors = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return vendors.filter((vendor) => {
      const matchesSearch =
        !searchValue ||
        vendor.businessName?.toLowerCase().includes(searchValue) ||
        vendor.contactEmail?.toLowerCase().includes(searchValue) ||
        vendor.location?.toLowerCase().includes(searchValue) ||
        vendor.contactPhone?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || vendor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  // ============================================================
  // Actions
  // ============================================================

  const runAction = async (
    id: string,
    action: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      setActionLoading(id);
      setActionError("");
      setSuccess("");

      await action();

      setSuccess(successMessage);

      await refetch();
    } catch (error: unknown) {
      setActionError(
        getApiErrorMessage(error, t('admin.vendors.genericError'))
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // Reject
  // ============================================================

  const handleReject = async () => {
    if (!rejectVendorId) return;

    if (!rejectReason.trim()) {
      setActionError(t('admin.vendors.rejectReasonRequired'));
      return;
    }

    await runAction(
      rejectVendorId,
      () =>
        rejectVendor(rejectVendorId, {
          reason: rejectReason.trim(),
        }),
      t('admin.vendors.rejectedSuccess')
    );

    setRejectVendorId(null);
    setRejectReason("");
  };

  // ============================================================
  // Deactivate
  // ============================================================

  const handleDeactivate = async () => {
    if (!deactivateVendorId) return;

    await runAction(
      deactivateVendorId,
      () => deactivateVendor(deactivateVendorId),
      t('admin.vendors.deactivatedSuccess')
    );

    setDeactivateVendorId(null);
  };

  // ============================================================
  // Create
  // ============================================================

  const handleCreateVendor = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setActionError("");
    setSuccess("");

    if (
      !createForm.email.trim() ||
      !createForm.password.trim() ||
      !createForm.fullName.trim() ||
      !createForm.businessName.trim()
    ) {
      setActionError(t('admin.vendors.fillAll'));
      return;
    }

    try {
      setCreateLoading(true);

      const vendorId = await createVendor(createForm);

      setSuccess(t('admin.vendors.createdSuccess', { id: String(vendorId) }));

      setCreateForm(EMPTY_CREATE_FORM);

      setShowCreateModal(false);

      await refetch();
    } catch (error: unknown) {
      setActionError(
        getApiErrorMessage(error, t('admin.vendors.createFailed'))
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const clearFeedback = () => {
    setActionError("");
    setSuccess("");
  };

  const openCreate = () => {
    setShowCreateModal(true);
    clearFeedback();
  };

  const closeReject = () => {
    setRejectVendorId(null);
    setRejectReason("");
    setActionError("");
  };

  const closeDeactivate = () => {
    setDeactivateVendorId(null);
    setActionError("");
  };

  const actionsFor = (vendor: Vendor): VendorRowActions => ({
    onViewDetails: () => router.push(`/admin/vendors/${vendor.id}`),
    onApprove: () =>
      runAction(vendor.id, () => approveVendor(vendor.id), t("admin.vendors.approvedSuccess")),
    onReject: () => {
      setRejectVendorId(vendor.id);
      setRejectReason("");
      setActionError("");
    },
    onActivate: () =>
      runAction(vendor.id, () => activateVendor(vendor.id), t("admin.vendors.activatedSuccess")),
    onDeactivate: () => {
      setDeactivateVendorId(vendor.id);
      setActionError("");
    },
  });

  return {
    vendors,
    loading,
    error,
    stats,
    filteredVendors,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    actionLoading,
    success,
    actionError,
    actionsFor,
    // create
    showCreateModal,
    setShowCreateModal,
    openCreate,
    createForm,
    setCreateForm,
    createLoading,
    handleCreateVendor,
    // reject
    rejectVendorId,
    rejectReason,
    setRejectReason,
    handleReject,
    closeReject,
    // deactivate
    deactivateVendorId,
    handleDeactivate,
    closeDeactivate,
  };
}

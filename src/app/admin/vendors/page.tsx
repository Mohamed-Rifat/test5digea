"use client";

import { useLanguage } from "@/context/LanguageContext";

import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ChangeEvent,
} from "react";

import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import {
  approveVendor,
  createVendor,
  deactivateVendor,
  activateVendor,
  rejectVendor,
} from "@/features/vendors/api";

import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";
import { getApiErrorMessage } from "@/lib/error";

import type { Vendor } from "@/types/vendor";

// ============================================================
// Helpers
// ============================================================

const getStatusClasses = (status: Vendor["status"]): string => {
  switch (status) {
    case "Approved":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-700";

    case "Pending":
      return "border-amber-200/80 bg-amber-50 text-amber-700";

    case "Rejected":
      return "border-red-200/80 bg-red-50 text-red-700";

    case "Inactive":
      return "border-slate-200 bg-slate-100 text-slate-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const getStatusDot = (status: Vendor["status"]): string => {
  switch (status) {
    case "Approved":
      return "bg-emerald-500";

    case "Pending":
      return "bg-amber-500";

    case "Rejected":
      return "bg-red-500";

    case "Inactive":
      return "bg-slate-400";

    default:
      return "bg-slate-400";
  }
};

const getStatusIcon = (status: Vendor["status"]) => {
  switch (status) {
    case "Approved":
      return <Check size={12} strokeWidth={2.5} />;

    case "Pending":
      return <Clock3 size={12} strokeWidth={2.5} />;

    case "Rejected":
      return <X size={12} strokeWidth={2.5} />;

    case "Inactive":
      return <Ban size={12} strokeWidth={2.5} />;

    default:
      return null;
  }
};

// ============================================================
// Skeleton
// ============================================================

function VendorsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded-lg bg-[#e9e1dc]" />
        <div className="mt-4 h-10 w-72 rounded-xl bg-[#e9e1dc]" />
        <div className="mt-3 h-4 w-[420px] max-w-full rounded-lg bg-[#eee8e4]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-[#eee8e4] bg-white"
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="h-20 animate-pulse rounded-3xl border border-[#eee8e4] bg-white" />

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[#e9e1dc] bg-white">
        <div className="h-14 animate-pulse bg-[#f8f5f3]" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse border-t border-[#eee8e4] bg-white"
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Page
// ============================================================

export default function AdminVendorsPage() {
  const { t } = useLanguage();
  const { vendors, loading, error, refetch } = useAdminVendors();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
  });

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

      setCreateForm({
        email: "",
        password: "",
        fullName: "",
        businessName: "",
      });

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

  const handleCreateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-0">
        <div className="mx-auto max-w-full">
          <VendorsSkeleton />
        </div>
      </main>
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-6 pb-28 sm:px-6 lg:px-0 lg:pb-10">
      <div className="mx-auto max-w-full">

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <section className="relative mb-7 overflow-hidden">
          <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#f5eee9] blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-64 w-64 rounded-full bg-[#faf0eb] blur-3xl" />

          <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e7ddd6] bg-[#fbf9f7] px-3 py-1.5">
                <Sparkles
                  size={13}
                  className="text-[#967966]"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#806b5d]">
                  {t('admin.vendors.title')}
                </span>
              </div>

              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#30251f] sm:text-4xl">
                  {t('admin.vendors.vendors')}
                </h1>

                <span className="mb-1 rounded-full bg-[#f3efec] px-2.5 py-1 text-xs font-semibold text-[#75675e]">
                  {t('admin.vendors.totalCount', { count: stats.total })}
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#766b65]">
                {t('admin.vendors.pageDesc')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCreateModal(true);
                setActionError("");
                setSuccess("");
              }}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(48,37,31,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#45362e] hover:shadow-[0_16px_32px_-12px_rgba(48,37,31,0.7)] active:translate-y-0"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 transition group-hover:bg-white/15">
                <Plus size={16} />
              </span>

              {t('admin.vendors.add')}
            </button>
          </div>
        </section>

        {/* ======================================================
            FEEDBACK
        ====================================================== */}

        {(success || actionError || error) && (
          <div className="mb-6 space-y-3">
            {(actionError || error) && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle size={16} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    {t('admin.vendors.needAttentionMessage')}
                  </p>

                  <p className="mt-0.5 leading-5">
                    {actionError || error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 shadow-sm">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 size={16} />
                </div>

                <div>
                  <p className="font-semibold">
                    {t('admin.vendors.actionCompleted')}
                  </p>

                  <p className="mt-0.5 break-all leading-5">
                    {success}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            INSIGHT CARDS
        ====================================================== */}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
          <InsightCard
            label={t('admin.vendors.total')}
            value={stats.total}
            icon={<Store size={18} />}
            tone="neutral"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            description={t("admin.vendors.allAccounts")}
          />

          <InsightCard
            label={t('admin.vendors.pending')}
            value={stats.pending}
            icon={<Clock3 size={18} />}
            tone="amber"
            active={statusFilter === "Pending"}
            onClick={() => setStatusFilter("Pending")}
            description={t("admin.vendors.needAttention")}
          />

          <InsightCard
            label={t('admin.vendors.statusApproved')}
            value={stats.approved}
            icon={<UserCheck size={18} />}
            tone="emerald"
            active={statusFilter === "Approved"}
            onClick={() => setStatusFilter("Approved")}
            description={t("admin.vendors.active")}
          />

          <InsightCard
            label={t('admin.vendors.statusRejected')}
            value={stats.rejected}
            icon={<UserX size={18} />}
            tone="red"
            active={statusFilter === "Rejected"}
            onClick={() => setStatusFilter("Rejected")}
            description={t("admin.vendors.rejected")}
          />

          <InsightCard
            label={t('admin.vendors.statusInactive')}
            value={stats.inactive}
            icon={<Ban size={18} />}
            tone="gray"
            active={statusFilter === "Inactive"}
            onClick={() => setStatusFilter("Inactive")}
            description={
              stats.averageRating > 0
                ? t('admin.vendors.avgRating', { value: stats.averageRating.toFixed(1) })
                : t('admin.vendors.noRatings')
            }
          />
        </section>

        {/* ======================================================
            FILTER TOOLBAR
        ====================================================== */}

        <section className="mb-5 rounded-[24px] border border-[#e9e1dc] bg-white p-3 shadow-[0_8px_30px_rgba(48,37,31,0.035)] sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b918b]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.vendors.searchPlaceholder')}
                className="h-12 w-full rounded-2xl border border-[#e0d8d3] bg-[#fdfcfb] pl-11 pr-11 text-sm text-[#30251f] outline-none transition-all placeholder:text-[#aaa09a] hover:border-[#d4c9c2] focus:border-[#9b7b67] focus:bg-white focus:ring-4 focus:ring-[#9b7b67]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c817a] transition hover:bg-[#f3efec] hover:text-[#30251f]"
                  aria-label={t("admin.ui.clearSearch")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="relative min-w-[190px]">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-2xl border border-[#e0d8d3] bg-[#fdfcfb] px-4 pr-11 text-sm font-medium text-[#4b403a] outline-none transition hover:border-[#d4c9c2] focus:border-[#9b7b67] focus:bg-white focus:ring-4 focus:ring-[#9b7b67]/10"
                >
                  <option value="all">{t('admin.vendors.allStatuses')}</option>
                  <option value="Pending">{t('admin.vendors.statusPending')}</option>
                  <option value="Approved">{t('admin.vendors.statusApproved')}</option>
                  <option value="Rejected">{t('admin.vendors.statusRejected')}</option>
                  <option value="Inactive">{t('admin.vendors.statusInactive')}</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8f857f]"
                />
              </div>

              {(search || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="h-12 rounded-2xl border border-[#e0d8d3] bg-white px-4 text-sm font-semibold text-[#675b54] transition hover:border-[#cfc3bb] hover:bg-[#f8f5f3]"
                >
                  {t('admin.vendors.clearFilters')}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================
            RESULT META
        ====================================================== */}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-medium text-[#766b65]">
              {filteredVendors.length === vendors.length
                ? t('admin.vendors.allCount', { count: filteredVendors.length })
                : t('admin.vendors.showingCount', { shown: filteredVendors.length, total: vendors.length })}
            </p>
          </div>

          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                statusFilter as Vendor["status"]
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                  statusFilter as Vendor["status"]
                )}`}
              />

              {statusFilter}

              <X size={12} />
            </button>
          )}
        </div>

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {filteredVendors.length === 0 ? (
          <EmptyVendors
            hasFilters={Boolean(search || statusFilter !== "all")}
            onClear={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            onCreate={() => {
              setShowCreateModal(true);
              setActionError("");
            }}
          />
        ) : (
          <>
            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-hidden rounded-[26px] border border-[#e9e1dc] bg-white shadow-[0_12px_40px_rgba(48,37,31,0.04)] md:block">
              <div className="grid grid-cols-[minmax(280px,2.2fr)_minmax(160px,1.15fr)_minmax(120px,.85fr)_minmax(100px,.8fr)_minmax(270px,1.7fr)] items-center border-b border-[#eee8e4] bg-[#faf9f8] px-5 py-3.5">
                <TableHeader>{t('admin.vendors.vendor')}</TableHeader>
                <TableHeader>{t('admin.vendors.location')}</TableHeader>
                <TableHeader>{t('admin.vendors.status')}</TableHeader>
                <TableHeader>{t('admin.vendors.rating')}</TableHeader>
                <TableHeader className="text-right">
                  {t('admin.vendors.actions')}
                </TableHeader>
              </div>

              {filteredVendors.map((vendor) => {
                const isActionLoading =
                  actionLoading === vendor.id;

                return (
                  <VendorTableRow
                    key={vendor.id}
                    vendor={vendor}
                    loading={isActionLoading}
                    onViewDetails={() =>
                      router.push(
                        `/admin/vendors/${vendor.id}`
                      )
                    }
                    onApprove={() =>
                      runAction(
                        vendor.id,
                        () => approveVendor(vendor.id),
                        t('admin.vendors.approvedSuccess')
                      )
                    }
                    onReject={() => {
                      setRejectVendorId(vendor.id);
                      setRejectReason("");
                      setActionError("");
                    }}
                    onActivate={() =>
                      runAction(
                        vendor.id,
                        () => activateVendor(vendor.id),
                        t('admin.vendors.activatedSuccess')
                      )
                    }
                    onDeactivate={() => {
                      setDeactivateVendorId(vendor.id);
                      setActionError("");
                    }}
                  />
                );
              })}
            </div>

            {/* ==================================================
                MOBILE
            ================================================== */}

            <div className="space-y-3 md:hidden">
              {filteredVendors.map((vendor) => {
                const isActionLoading =
                  actionLoading === vendor.id;

                return (
                  <VendorMobileCard
                    key={vendor.id}
                    vendor={vendor}
                    loading={isActionLoading}
                    onViewDetails={() =>
                      router.push(
                        `/admin/vendors/${vendor.id}`
                      )
                    }
                    onApprove={() =>
                      runAction(
                        vendor.id,
                        () => approveVendor(vendor.id),
                        t('admin.vendors.approvedSuccess')
                      )
                    }
                    onReject={() => {
                      setRejectVendorId(vendor.id);
                      setRejectReason("");
                      setActionError("");
                    }}
                    onActivate={() =>
                      runAction(
                        vendor.id,
                        () => activateVendor(vendor.id),
                        t('admin.vendors.activatedSuccess')
                      )
                    }
                    onDeactivate={() => {
                      setDeactivateVendorId(vendor.id);
                      setActionError("");
                    }}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ========================================================
          MOBILE FLOATING ACTION
      ======================================================== */}

      <button
        type="button"
        onClick={() => {
          setShowCreateModal(true);
          setActionError("");
          setSuccess("");
        }}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#30251f] text-white shadow-[0_16px_35px_-10px_rgba(48,37,31,0.65)] transition hover:-translate-y-0.5 hover:bg-[#45362e] active:scale-95 sm:hidden"
        aria-label={t('admin.vendors.add')}
      >
        <Plus size={22} />
      </button>

      {/* ========================================================
          CREATE MODAL
      ======================================================== */}

      {showCreateModal && (
        <ModalOverlay
          onClose={() =>
            !createLoading && setShowCreateModal(false)
          }
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden border-b border-[#eee8e4] px-5 py-5 sm:px-6">
              <div className="absolute right-[-50px] top-[-70px] h-40 w-40 rounded-full bg-[#f5eee9] blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3efec] text-[#846e60]">
                    <Store size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b7b67]">
                      {t('admin.vendors.newAccount')}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
                      {t('admin.vendors.add')}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-[#766b65]">
                      {t('admin.vendors.createDesc')}
                    </p>
                  </div>
                </div>

                <CloseButton
                  disabled={createLoading}
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                />
              </div>
            </div>

            <form
              onSubmit={handleCreateVendor}
              className="space-y-4 p-5 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label={t('admin.vendors.fullName')}
                  name="fullName"
                  value={createForm.fullName}
                  onChange={handleCreateChange}
                  placeholder={t('admin.vendors.fullNamePlaceholder')}
                  disabled={createLoading}
                />

                <InputField
                  label={t('admin.vendors.businessName')}
                  name="businessName"
                  value={createForm.businessName}
                  onChange={handleCreateChange}
                  placeholder={t('admin.vendors.businessNamePlaceholder')}
                  disabled={createLoading}
                />
              </div>

              <InputField
                label={t('admin.vendors.email')}
                name="email"
                type="email"
                value={createForm.email}
                onChange={handleCreateChange}
                placeholder="vendor@example.com"
                disabled={createLoading}
              />

              <InputField
                label={t('admin.vendors.password')}
                name="password"
                type="password"
                value={createForm.password}
                onChange={handleCreateChange}
                placeholder={t('admin.vendors.passwordPlaceholder')}
                disabled={createLoading}
              />

              {actionError && (
                <InlineError message={actionError} />
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={createLoading}
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="h-12 flex-1 rounded-2xl border border-[#ddd4ce] bg-white px-4 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3] disabled:opacity-50"
                >
                  {t('admin.vendors.cancel')}
                </button>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(48,37,31,0.55)] transition hover:bg-[#45362e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createLoading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      {t('admin.vendors.creating')}
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      {t('admin.vendors.createTitle')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* ========================================================
          REJECT MODAL
      ======================================================== */}

      {rejectVendorId && (
        <ModalOverlay
          onClose={() => {
            setRejectVendorId(null);
            setRejectReason("");
            setActionError("");
          }}
          zIndex="z-[60]"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#eee8e4] px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <UserX size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500">
                      {t('admin.vendors.reviewAction')}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
                      {t('admin.vendors.rejectTitle')}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-[#766b65]">
                      {t('admin.vendors.rejectDesc')}
                    </p>
                  </div>
                </div>

                <CloseButton
                  onClick={() => {
                    setRejectVendorId(null);
                    setRejectReason("");
                    setActionError("");
                  }}
                />
              </div>
            </div>

            <div className="p-5">
              <label
                htmlFor="rejectReason"
                className="mb-2 block text-sm font-semibold text-[#30251f]"
              >
                {t('admin.vendors.rejectionReason')}
              </label>

              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(event) =>
                  setRejectReason(event.target.value)
                }
                placeholder={t('admin.vendors.rejectionPlaceholder')}
                rows={5}
                autoFocus
                className="w-full resize-none rounded-2xl border border-[#ddd4ce] bg-[#fdfcfb] px-4 py-3.5 text-sm leading-6 text-[#30251f] outline-none transition placeholder:text-[#aaa09a] hover:border-[#cfc3bb] focus:border-[#9b7b67] focus:bg-white focus:ring-4 focus:ring-[#9b7b67]/10"
              />

              {actionError && (
                <div className="mt-3">
                  <InlineError message={actionError} />
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectVendorId(null);
                    setRejectReason("");
                    setActionError("");
                  }}
                  className="h-12 flex-1 rounded-2xl border border-[#ddd4ce] px-4 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3]"
                >
                  {t('admin.vendors.cancel')}
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={actionLoading === rejectVendorId}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8b3d3d] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(139,61,61,0.55)] transition hover:bg-[#773535] disabled:opacity-60"
                >
                  {actionLoading === rejectVendorId ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      {t('admin.vendors.rejecting')}
                    </>
                  ) : (
                    <>
                      <UserX size={16} />
                      {t('admin.vendors.rejectTitle')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ========================================================
          DEACTIVATE MODAL
      ======================================================== */}

      {deactivateVendorId && (
        <ModalOverlay
          onClose={() => {
            setDeactivateVendorId(null);
            setActionError("");
          }}
          zIndex="z-[60]"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 sm:p-7">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Ban size={23} />
              </div>

              <div className="mt-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500">
                  {t('admin.vendors.accountAccess')}
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
                  {t('admin.vendors.deactivateConfirm')}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#766b65]">
                  {t('admin.vendors.deactivateDesc')}
                </p>
              </div>

              {actionError && (
                <div className="mt-5">
                  <InlineError message={actionError} />
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDeactivateVendorId(null)
                  }
                  className="h-12 flex-1 rounded-2xl border border-[#ddd4ce] px-4 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3]"
                >
                  {t('admin.vendors.cancel')}
                </button>

                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={
                    actionLoading === deactivateVendorId
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8b3d3d] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(139,61,61,0.55)] transition hover:bg-[#773535] disabled:opacity-60"
                >
                  {actionLoading === deactivateVendorId ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      {t('admin.vendors.deactivating')}
                    </>
                  ) : (
                    <>
                      <Ban size={16} />
                      {t('admin.vendors.deactivate')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </main>
  );
}

// ============================================================
// Insight Card
// ============================================================

function InsightCard({
  label,
  value,
  icon,
  description,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  description: string;
  tone: "neutral" | "amber" | "emerald" | "red" | "gray";
  active?: boolean;
  onClick?: () => void;
}) {
  const styles = {
    neutral: {
      icon: "bg-[#f3efec] text-[#846e60]",
      active:
        "border-[#cfc1b8] ring-2 ring-[#30251f]/10",
      accent: "bg-[#30251f]",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      active:
        "border-amber-300 ring-2 ring-amber-500/10",
      accent: "bg-amber-500",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      active:
        "border-emerald-300 ring-2 ring-emerald-500/10",
      accent: "bg-emerald-500",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      active:
        "border-red-300 ring-2 ring-red-500/10",
      accent: "bg-red-500",
    },

    gray: {
      icon: "bg-slate-100 text-slate-500",
      active:
        "border-slate-300 ring-2 ring-slate-400/10",
      accent: "bg-slate-400",
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-md border bg-white p-4 text-left shadow-[0_7px_25px_rgba(48,37,31,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(48,37,31,0.07)] ${
        active
          ? styles.active
          : "border-[#e9e1dc]"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-1 w-full opacity-0 transition group-hover:opacity-100 ${
          styles.accent
        } ${active ? "opacity-100" : ""}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>

        {active && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#30251f] text-white">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-2xl font-semibold tracking-[-0.04em] text-[#30251f]">
          {value}
        </p>

        <p className="mt-1 text-xs font-semibold text-[#5f544e]">
          {label}
        </p>

        <p className="mt-1 text-[11px] text-[#a09791]">
          {description}
        </p>
      </div>
    </button>
  );
}

// ============================================================
// Table Header
// ============================================================

function TableHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.14em] text-[#948983] ${className}`}
    >
      {children}
    </span>
  );
}

// ============================================================
// Vendor Table Row
// ============================================================

function VendorTableRow({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: {
  vendor: Vendor;
  loading: boolean;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="group grid min-h-[94px] grid-cols-[minmax(280px,2.2fr)_minmax(160px,1.15fr)_minmax(120px,.85fr)_minmax(100px,.8fr)_minmax(270px,1.7fr)] items-center border-b border-[#eee8e4] px-5 py-3 transition last:border-b-0 hover:bg-[#fdfcfb]">
      {/* Vendor */}
      <div className="flex min-w-0 items-center gap-3.5">
        <VendorAvatar vendor={vendor} size="md" />

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#30251f]">
              {vendor.businessName ||
                t('admin.vendors.unnamedVendor')}
            </p>

            {vendor.status === "Approved" && (
              <span
                title={t("admin.vendors.approvedVendor")}
                className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 lg:inline-flex"
              >
                <Check size={9} strokeWidth={3} />
                {t('admin.vendors.verified')}
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-xs text-[#8b817b]">
            {vendor.contactEmail || t('admin.vendors.noEmail')}
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="flex min-w-0 items-center gap-2 pr-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f3f0] text-[#9b7b67]">
          <MapPin size={14} />
        </div>

        <span className="truncate text-xs font-medium text-[#665b55]">
          {vendor.location || t('admin.vendors.notSpecified')}
        </span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={vendor.status} />
      </div>

      {/* Rating */}
      <div>
        <Rating
          value={vendor.averageRating}
          count={vendor.reviewsCount}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <VendorInlineActions
          vendor={vendor}
          loading={loading}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      </div>
    </div>
  );
}

// ============================================================
// Mobile Card
// ============================================================

function VendorMobileCard({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: {
  vendor: Vendor;
  loading: boolean;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const { t } = useLanguage();

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#e9e1dc] bg-white shadow-[0_8px_26px_rgba(48,37,31,0.035)]">
      <div className="p-4">
        <div className="flex items-start gap-3.5">
          <VendorAvatar vendor={vendor} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[#30251f]">
                  {vendor.businessName ||
                    t('admin.vendors.unnamedVendor')}
                </h3>

                <p className="mt-1 truncate text-xs text-[#8b817b]">
                  {vendor.contactEmail ||
                    t('admin.vendors.noEmail')}
                </p>
              </div>

              <StatusBadge status={vendor.status} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-[#faf8f6] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a09791]">
              {t('admin.vendors.rating')}
            </p>

            <div className="mt-1.5">
              <Rating
                value={vendor.averageRating}
                count={vendor.reviewsCount}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#faf8f6] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a09791]">
              {t('admin.vendors.location')}
            </p>

            <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
              <MapPin
                size={13}
                className="shrink-0 text-[#9b7b67]"
              />

              <span className="truncate text-xs font-medium text-[#665b55]">
                {vendor.location ||
                  t('admin.vendors.notSpecified')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-[#f0ebe8] pt-3">
          <VendorInlineActions
            vendor={vendor}
            loading={loading}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onReject={onReject}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        </div>
      </div>
    </article>
  );
}

// ============================================================
// Avatar
// ============================================================

function VendorAvatar({
  vendor,
  size = "md",
}: {
  vendor: Vendor;
  size?: "md" | "lg";
}) {
  const { t } = useLanguage();

  const sizeClass =
    size === "lg"
      ? "h-14 w-14 rounded-full"
      : "h-11 w-11 rounded-full";

  const initial =
    vendor.businessName?.charAt(0)?.toUpperCase() ||
    "V";

  if (vendor.profileImageUrl) {
    return (
      <img
        src={vendor.profileImageUrl}
        alt={vendor.businessName || t("admin.vendors.vendor")}
        className={`${sizeClass} shrink-0 object-cover ring-1 ring-[#eee8e4]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center bg-gradient-to-br from-[#f1ebe7] to-[#e5d9d0] font-semibold text-[#806d60]`}
    >
      {initial}
    </div>
  );
}

// ============================================================
// Status Badge
// ============================================================

function StatusBadge({
  status,
}: {
  status: Vendor["status"];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${getStatusClasses(
        status
      )}`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${getStatusDot(
          status
        )} text-white`}
      >
        {getStatusIcon(status)}
      </span>

      {status}
    </span>
  );
}

// ============================================================
// Rating
// ============================================================

function Rating({
  value,
  count,
}: {
  value?: number;
  count?: number;
}) {
  const rating = Number(value || 0);
  const reviews = Number(count || 0);

  return (
    <div className="flex items-center gap-1.5">
      <Star
        size={14}
        className="fill-current text-[#b08b55]"
      />

      <span className="text-xs font-semibold text-[#403630]">
        {rating.toFixed(1)}
      </span>

      <span className="text-[10px] text-[#9b918b]">
        ({reviews})
      </span>
    </div>
  );
}

// ============================================================
// Inline Actions
// ============================================================

function VendorInlineActions({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: {
  vendor: Vendor;
  loading: boolean;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const { t } = useLanguage();

  const isPending = vendor.status === "Pending";
  const isApproved = vendor.status === "Approved";
  const isInactive = vendor.status === "Inactive";

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <ActionButton
        icon={<Eye size={14} />}
        label={t('admin.vendors.view')}
        onClick={onViewDetails}
        disabled={loading}
        variant="neutral"
      />

      {isPending && (
        <>
          <ActionButton
            icon={
              loading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <ShieldCheck size={14} />
              )
            }
            label={t('admin.vendors.approve')}
            onClick={onApprove}
            disabled={loading}
            variant="approve"
          />

          <ActionButton
            icon={<UserX size={14} />}
            label={t('admin.vendors.reject')}
            onClick={onReject}
            disabled={loading}
            variant="reject"
          />
        </>
      )}

      {isInactive && (
        <ActionButton
          icon={
            loading ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <UserCheck size={14} />
            )
          }
          label={t('admin.vendors.activate')}
          onClick={onActivate}
          disabled={loading}
          variant="approve"
        />
      )}

      {isApproved && (
        <ActionButton
          icon={
            loading ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Ban size={14} />
            )
          }
          label={t('admin.vendors.deactivate')}
          onClick={onDeactivate}
          disabled={loading}
          variant="danger"
        />
      )}
    </div>
  );
}

// ============================================================
// Action Button
// ============================================================

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant:
    | "neutral"
    | "approve"
    | "reject"
    | "danger";
}) {
  const variants = {
    neutral:
      "border-[#ddd4ce] bg-white text-[#4f4540] hover:border-[#c9beb5] hover:bg-[#f6f2ef]",

    approve:
      "bg-emerald-600 text-white shadow-[0_5px_14px_-6px_rgba(5,150,105,0.55)] hover:bg-emerald-700",

    reject:
      "bg-red-600 text-white shadow-[0_5px_14px_-6px_rgba(220,38,38,0.55)] hover:bg-red-700",

    danger:
      "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ============================================================
// Empty State
// ============================================================

function EmptyVendors({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-[28px] border border-dashed border-[#dcd3cd] bg-white px-6 py-20 text-center shadow-[0_8px_28px_rgba(48,37,31,0.025)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f4efec] text-[#8b7464]">
        {hasFilters ? (
          <Search size={25} />
        ) : (
          <Store size={25} />
        )}
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b7b67]">
        {hasFilters ? t('admin.vendors.noMatching') : t('admin.vendors.title')}
      </p>

      <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#30251f]">
        {hasFilters ? t('admin.vendors.noVendorsFound') : t('admin.vendors.noVendorsYet')}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766b65]">
        {hasFilters ? t('admin.vendors.adjustFilters') : t('admin.vendors.noVendorsDesc')}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="h-11 rounded-xl border border-[#ddd4ce] px-5 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3]"
          >
            {t('admin.vendors.clearFilters')}
          </button>
        )}

        {!hasFilters && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white transition hover:bg-[#45362e]"
          >
            <Plus size={16} />
            {t('admin.vendors.add')}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Modal Overlay
// ============================================================

function ModalOverlay({
  children,
  onClose,
  zIndex = "z-50",
}: {
  children: ReactNode;
  onClose: () => void;
  zIndex?: string;
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center overflow-y-auto bg-[#241c18]/45 p-4 backdrop-blur-[4px]`}
      onClick={onClose}
    >
      <div className="flex max-h-[calc(100vh-2rem)] w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Close Button
// ============================================================

function CloseButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#766b65] transition hover:bg-[#f3efec] hover:text-[#30251f] disabled:opacity-50"
      aria-label={t("admin.ui.close")}
    >
      <X size={17} />
    </button>
  );
}

// ============================================================
// Input
// ============================================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-bold text-[#403630]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-12 w-full rounded-2xl border border-[#ddd4ce] bg-[#fdfcfb] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] hover:border-[#cfc3bb] focus:border-[#9b7b67] focus:bg-white focus:ring-4 focus:ring-[#9b7b67]/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

// ============================================================
// Inline Error
// ============================================================

function InlineError({
  message,
}: {
  message: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
      <AlertCircle
        size={15}
        className="mt-0.5 shrink-0"
      />

      <span>{message}</span>
    </div>
  );
}
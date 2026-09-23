"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE, type TranslationKey } from "@/locales";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ImageIcon,
  Loader2,
  Mail,
  Package,
  Power,
  Tag,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  activateService,
  approveService,
  deactivateService,
  getAdminService,
  rejectService,
} from "@/features/services/api";

import ImageLightbox from "@/components/shared/ImageLightbox";

import type { Service } from "@/types/service";

/* =========================
   Helpers
========================= */

const formatDate = (date: string, locale = "en-GB") => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (date: string, locale = "en-GB") => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(price);
};

const getStatusKey = (status: string): TranslationKey | null => {
  const n = (status || "").toLowerCase().replace(/[_\-\s]/g, "");

  if (n.includes("pending")) return "admin.services.pending";
  if (n.includes("reject")) return "admin.services.rejected";
  if (n.includes("inactive") || n.includes("deactiv")) return "admin.services.inactive";
  if (n.includes("approved") || n.includes("active")) return "admin.services.approved";

  return null;
};

const getRawStatusLabel = (status: string) => {
  if (!status) return "";

  return status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getStatusStyles = (status: string) => {
  const normalized = status
    .toLowerCase()
    .replace(/[_-\s]/g, "");

  if (
    normalized.includes("approved") ||
    normalized.includes("active")
  ) {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("review")
  ) {
    return {
      wrapper:
        "border-amber-200 bg-amber-50 text-amber-700",
      icon: AlertCircle,
    };
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("inactive") ||
    normalized.includes("deactiv")
  ) {
    return {
      wrapper:
        "border-red-200 bg-red-50 text-red-700",
      icon: XCircle,
    };
  }

  return {
    wrapper:
      "border-gray-200 bg-gray-50 text-gray-700",
    icon: AlertCircle,
  };
};

/* =========================
   Page
========================= */

export default function AdminServiceDetailsPage() {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];
  const getStatusLabel = (status: string) => {
    const key = getStatusKey(status);

    return key ? t(key) : getRawStatusLabel(status) || t("admin.services.unknown");
  };
  const money = (value: number) => `${formatPrice(value)} ${t("common.currency")}`;
  const params = useParams();
  const router = useRouter();

  const serviceId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [service, setService] =
    useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [rejectModalOpen, setRejectModalOpen] =
    useState(false);

  const [rejectReason, setRejectReason] =
    useState("");

  const [lightboxIndex, setLightboxIndex] =
    useState<number | null>(null);

  /* =========================
     Fetch Service
  ========================= */

  const fetchService = async () => {
    if (!serviceId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getAdminService(
        serviceId
      );

      setService(data);
    } catch (err) {
      console.error(
        "Failed to fetch service:",
        err
      );

      setError(
        t('admin.serviceDetails.loadFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  /* =========================
     Message
  ========================= */

  const showMessage = (
    type: "success" | "error",
    text: string
  ) => {
    setMessage({
      type,
      text,
    });

    window.setTimeout(() => {
      setMessage(null);
    }, 3500);
  };

  /* =========================
     Refresh After Action
  ========================= */

  const refreshService = async () => {
    if (!serviceId) return;

    try {
      const data = await getAdminService(
        serviceId
      );

      setService(data);
    } catch (err) {
      console.error(
        "Failed to refresh service:",
        err
      );
    }
  };

  /* =========================
     Approve
  ========================= */

  const handleApprove = async () => {
    if (!service) return;

    const confirmed = window.confirm(
      t('admin.services.confirmApprove', { name: service.name })
    );

    if (!confirmed) return;

    try {
      setActionLoading("approve");

      await approveService(service.id);

      await refreshService();

      showMessage(
        "success",
        t('admin.services.approvedSuccess')
      );
    } catch (err) {
      console.error(
        "Failed to approve service:",
        err
      );

      showMessage(
        "error",
        t('admin.services.approveFailed')
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Reject
  ========================= */

  const openRejectModal = () => {
    if (!service) return;

    setRejectReason(
      service.rejectionReason || ""
    );

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
      showMessage(
        "error",
        t('admin.services.reasonRequired')
      );
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

      showMessage(
        "success",
        t('admin.services.rejectedSuccess')
      );
    } catch (err) {
      console.error(
        "Failed to reject service:",
        err
      );

      showMessage(
        "error",
        t('admin.services.rejectFailed')
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Activate
  ========================= */

  const handleActivate = async () => {
    if (!service) return;

    const confirmed = window.confirm(
      t('admin.services.confirmActivate', { name: service.name })
    );

    if (!confirmed) return;

    try {
      setActionLoading("activate");

      await activateService(service.id);

      await refreshService();

      showMessage(
        "success",
        t('admin.services.activatedSuccess')
      );
    } catch (err) {
      console.error(
        "Failed to activate service:",
        err
      );

      showMessage(
        "error",
        t('admin.services.activateFailed')
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Deactivate
  ========================= */

  const handleDeactivate = async () => {
    if (!service) return;

    const confirmed = window.confirm(
      t('admin.services.confirmDeactivate', { name: service.name })
    );

    if (!confirmed) return;

    try {
      setActionLoading("deactivate");

      await deactivateService(service.id);

      await refreshService();

      showMessage(
        "success",
        t('admin.services.deactivatedSuccess')
      );
    } catch (err) {
      console.error(
        "Failed to deactivate service:",
        err
      );

      showMessage(
        "error",
        t('admin.services.deactivateFailed')
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={34}
            className="animate-spin text-[#c59b6d]"
          />

          <p className="text-sm text-gray-500">
            {t('admin.serviceDetails.loading')}
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error || !service) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-5">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />

            {t('admin.serviceDetails.backToServices')}
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h2 className="font-semibold text-red-800">
                {t('admin.serviceDetails.loadFailedTitle')}
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error ||
                  t('admin.serviceDetails.notFound')}
              </p>

              <button
                type="button"
                onClick={fetchService}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                {t('admin.serviceDetails.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Status
  ========================= */

  const statusStyles = getStatusStyles(
    service.status
  );

  const StatusIcon = statusStyles.icon;

  const normalizedStatus = service.status
    ?.toLowerCase()
    .replace(/[_-\s]/g, "");

  const canApprove =
    normalizedStatus?.includes("pending");

  const canReject =
    normalizedStatus?.includes("pending");

  const canActivate =
    normalizedStatus?.includes("inactive") ||
    normalizedStatus?.includes("deactiv");

  const canDeactivate =
    normalizedStatus?.includes("approved") ||
    normalizedStatus?.includes("active");

  /* =========================
     Total Prices
  ========================= */

  const totalPriceOptions =
    service.prices?.length || 0;

  /* =========================
     Render
  ========================= */

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin"
              className="transition hover:text-gray-900"
            >
              {t('admin.services.breadcrumb')}
            </Link>

            <ChevronRight size={15} />

            <Link
              href="/admin/services"
              className="transition hover:text-gray-900"
            >
              {t('admin.services.servicePlural')}
            </Link>

            <ChevronRight size={15} />

            <span className="text-gray-900">
              {t('admin.serviceDetails.details')}
            </span>
          </div>

          <Link
            href="/admin/services"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />

            {t('admin.serviceDetails.backToServices')}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              {service.name}
            </h1>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles.wrapper}`}
            >
              <StatusIcon size={14} />

              {getStatusLabel(
                service.status
              )}
            </span>
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            {t('admin.serviceDetails.subtitle')}
          </p>
        </div>

        {/* =========================
            Actions
        ========================= */}

        <div className="flex flex-wrap gap-2">
          {canApprove && (
            <button
              type="button"
              disabled={Boolean(actionLoading)}
              onClick={handleApprove}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ===
              "approve" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Check size={17} />
              )}

              {t('admin.services.approveLabel')}
            </button>
          )}

          {canReject && (
            <button
              type="button"
              disabled={Boolean(actionLoading)}
              onClick={openRejectModal}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />

              {t('admin.services.rejectLabel')}
            </button>
          )}

          {canActivate && (
            <button
              type="button"
              disabled={Boolean(actionLoading)}
              onClick={handleActivate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ===
              "activate" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Power size={17} />
              )}

              {t('admin.services.activateLabel')}
            </button>
          )}

          {canDeactivate && (
            <button
              type="button"
              disabled={Boolean(actionLoading)}
              onClick={handleDeactivate}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ===
              "deactivate" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Power size={17} />
              )}

              {t('admin.services.deactivateLabel')}
            </button>
          )}
        </div>
      </div>

      {/* =========================
          Message
      ========================= */}

      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          {message.text}
        </div>
      )}

      {/* =========================
          Main Grid
      ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* =========================
            Left Column
        ========================= */}

        <div className="space-y-6">
          {/* Service Overview */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-2">
                <Package
                  size={19}
                  className="text-[#c59b6d]"
                />

                <h2 className="font-semibold text-gray-900">
                  {t('admin.serviceDetails.overview')}
                </h2>
              </div>
            </div>

            <div className="space-y-5 p-5 md:p-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.serviceDetails.serviceName')}
                </p>

                <p className="text-base font-medium text-gray-900">
                  {service.name}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.serviceDetails.description')}
                </p>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {service.description ||
                    t('admin.serviceDetails.noDescription')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoBox
                  icon={Tag}
                  label={t('admin.services.category')}
                  value={
                    service.categoryName ||
                    "-"
                  }
                />

                <InfoBox
                  icon={CalendarDays}
                  label={t('admin.services.created')}
                  value={formatDate(service.createdAt, dateLocale)}
                />

                <InfoBox
                  icon={Clock3}
                  label={t('admin.serviceDetails.lastUpdated')}
                  value={formatDateTime(service.updatedAt, dateLocale)}
                />

                <InfoBox
                  icon={Package}
                  label={t('admin.serviceDetails.priceOptions')}
                  value={`${totalPriceOptions}`}
                />
              </div>
            </div>
          </section>

          {/* Images */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={19}
                  className="text-[#c59b6d]"
                />

                <h2 className="font-semibold text-gray-900">
                  {t('admin.serviceDetails.images')}
                </h2>

                <span className="ml-auto text-xs text-gray-400">
                  {service.images?.length || 0} images
                </span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {service.images?.length ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {service.images
                    .sort(
                      (a, b) =>
                        a.displayOrder -
                        b.displayOrder
                    )
                    .map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="group relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100 text-left"
                      >
                        <img
                          src={image.url}
                          alt={`${service.name} image ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent px-3 pb-2 pt-8">
                          <span className="text-xs font-medium text-white">
                            {t('admin.serviceDetails.imageN', { n: index + 1 })}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="flex min-h-45 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <ImageIcon
                    size={28}
                    className="text-gray-300"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    {t('admin.serviceDetails.noImages')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Prices */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-2">
                <Tag
                  size={19}
                  className="text-[#c59b6d]"
                />

                <h2 className="font-semibold text-gray-900">
                  {t('admin.serviceDetails.pricing')}
                </h2>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {service.prices?.length ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {t('admin.serviceDetails.label')}
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {t('admin.services.price')}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {service.prices.map(
                        (price) => (
                          <tr
                            key={price.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-gray-800">
                              {price.label ||
                                t('admin.serviceDetails.standard')}
                            </td>

                            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                              {money(price.price)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    {t('admin.serviceDetails.noPricing')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Rejection Reason */}

          {service.rejectionReason && (
            <section className="rounded-2xl border border-red-200 bg-red-50 shadow-sm">
              <div className="border-b border-red-100 px-5 py-4 md:px-6">
                <div className="flex items-center gap-2">
                  <XCircle
                    size={19}
                    className="text-red-600"
                  />

                  <h2 className="font-semibold text-red-800">
                    {t('admin.services.rejectionReason')}
                  </h2>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <p className="whitespace-pre-line text-sm leading-7 text-red-700">
                  {service.rejectionReason}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* =========================
            Right Column
        ========================= */}

        <div className="space-y-6">
          {/* Vendor */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <User
                  size={19}
                  className="text-[#c59b6d]"
                />

                <h2 className="font-semibold text-gray-900">
                  {t('admin.services.vendor')}
                </h2>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                  {service.vendorBusinessName
                    ?.charAt(0)
                    ?.toUpperCase() || "V"}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {service.vendorBusinessName ||
                      t('admin.serviceDetails.unknownVendor')}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {t('admin.services.vendor')}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.serviceDetails.vendorId')}
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-600">
                  {service.vendorId}
                </p>
              </div>
            </div>
          </section>

          {/* Category */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Tag
                  size={19}
                  className="text-[#c59b6d]"
                />

                <h2 className="font-semibold text-gray-900">
                  {t('admin.services.category')}
                </h2>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm font-semibold text-gray-900">
                {service.categoryName ||
                  t('admin.serviceDetails.uncategorized')}
              </p>

              <p className="mt-2 break-all font-mono text-xs text-gray-400">
                {service.categoryId}
              </p>
            </div>
          </section>

          {/* Status */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                {t('admin.serviceDetails.serviceStatus')}
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 ${statusStyles.wrapper}`}
              >
                <StatusIcon size={22} />

                <div>
                  <p className="text-xs opacity-70">
                    {t('admin.serviceDetails.currentStatus')}
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {getStatusLabel(
                      service.status
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.serviceDetails.createdAt')}
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {formatDateTime(service.createdAt, dateLocale)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.serviceDetails.updatedAt')}
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {formatDateTime(service.updatedAt, dateLocale)}
                </p>
              </div>
            </div>
          </section>

          {/* Service ID */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                {t('admin.serviceDetails.technicalInfo')}
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <TechnicalRow
                label={t('admin.serviceDetails.serviceId')}
                value={service.id}
              />

              <TechnicalRow
                label={t('admin.serviceDetails.vendorId')}
                value={service.vendorId}
              />

              <TechnicalRow
                label={t('admin.serviceDetails.categoryId')}
                value={service.categoryId}
              />
            </div>
          </section>
        </div>
      </div>

      {/* =========================
          Reject Modal
      ========================= */}

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('admin.services.rejectTitle')}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {t('admin.serviceDetails.rejectSubtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRejectModal}
                disabled={
                  actionLoading === "reject"
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {t('admin.services.service')}
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {service.name}
                </p>

                <p className="mt-0.5 text-sm text-gray-500">
                  {service.vendorBusinessName}
                </p>
              </div>

              <div>
                <label
                  htmlFor="rejectionReason"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t('admin.services.rejectionReason')}
                </label>

                <textarea
                  id="rejectionReason"
                  rows={5}
                  value={rejectReason}
                  onChange={(event) =>
                    setRejectReason(
                      event.target.value
                    )
                  }
                  disabled={
                    actionLoading === "reject"
                  }
                  placeholder={t('admin.serviceDetails.rejectPlaceholder')}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#c59b6d] focus:bg-white focus:ring-2 focus:ring-[#c59b6d]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={
                  actionLoading === "reject"
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {t('admin.services.cancel')}
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={
                  actionLoading === "reject" ||
                  !rejectReason.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading === "reject" ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    {t('admin.services.rejecting')}
                  </>
                ) : (
                  <>
                    <X size={16} />

                    {t('admin.services.rejectTitle')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image viewer */}
      {service?.images && service.images.length > 0 && (
        <ImageLightbox
          images={[...service.images]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((image) => ({ id: image.id, url: image.url }))}
          initialIndex={lightboxIndex ?? 0}
          open={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          title={service.name}
        />
      )}
    </div>
  );
}

/* =========================
   Info Box
========================= */

interface InfoBoxProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: InfoBoxProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* =========================
   Technical Row
========================= */

interface TechnicalRowProps {
  label: string;
  value: string;
}

function TechnicalRow({
  label,
  value,
}: TechnicalRowProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-all font-mono text-xs leading-5 text-gray-600">
        {value || "-"}
      </p>
    </div>
  );
}
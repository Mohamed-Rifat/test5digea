"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Eye,
  ImageIcon,
  Loader2,
  RotateCcw,
  Star,
  Store,
  X,
} from "lucide-react";

import Select from "@/components/shared/Select";
import ImageLightbox from "@/components/shared/ImageLightbox";
import { useModerationQueue } from "@/features/moderation/hooks/useModerationQueue";
import { approveServiceImage, rejectServiceImage } from "@/features/services/api";
import { getApiErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { TranslationKey } from "@/locales";
import {
  ModerationEntityType,
  ModerationStatus,
} from "@/types/moderation";
import type {
  GetModerationQueueParams,
  ModerationQueueItem,
} from "@/types/moderation";

const entityMeta: Record<
  ModerationEntityType,
  { labelKey: TranslationKey; icon: typeof Store; className: string }
> = {
  [ModerationEntityType.Vendor]: {
    labelKey: "admin.moderation.entity.vendor",
    icon: Store,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [ModerationEntityType.Service]: {
    labelKey: "admin.moderation.entity.service",
    icon: BriefcaseBusiness,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },
  [ModerationEntityType.Review]: {
    labelKey: "admin.moderation.entity.review",
    icon: Star,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },
  [ModerationEntityType.ServiceImage]: {
    labelKey: "admin.moderation.entity.image",
    icon: ImageIcon,
    className: "bg-[#eaf2ee] text-[#4d8f6b]",
  },
};

const statusStyles: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "bg-amber-50 text-amber-700",
  [ModerationStatus.Approved]: "bg-emerald-50 text-emerald-700",
  [ModerationStatus.Rejected]: "bg-red-50 text-red-600",
};

const statusLabelKeys: Record<ModerationStatus, TranslationKey> = {
  [ModerationStatus.Pending]: "admin.moderation.statuses.pending",
  [ModerationStatus.Approved]: "admin.moderation.statuses.approved",
  [ModerationStatus.Rejected]: "admin.moderation.statuses.rejected",
};

// Where "Review" should send the admin — for entity types without their
// own approve/reject action in this queue, it links out to the page that
// already has the real actions for that entity type. Reviews don't have
// an individual admin page yet, only the list at /admin/reviews. Images
// are handled inline (see the approve/reject buttons below) rather than
// through this link, but it still points at the parent service as a
// fallback / "view in context" option.
function reviewHref(item: ModerationQueueItem): string {
  switch (item.entityType) {
    case ModerationEntityType.Vendor:
      return `/admin/vendors/${item.entityId}`;
    case ModerationEntityType.Service:
      return `/admin/services/${item.entityId}`;
    case ModerationEntityType.ServiceImage:
      return `/admin/services/${item.serviceId ?? item.entityId}`;
    case ModerationEntityType.Review:
    default:
      return "/admin/reviews";
  }
}

export default function AdminModerationPage() {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const entityTypeOptions = [
    { value: "", label: t("admin.moderation.types.all") },
    { value: String(ModerationEntityType.Vendor), label: t("admin.moderation.types.vendors") },
    { value: String(ModerationEntityType.Service), label: t("admin.moderation.types.services") },
    { value: String(ModerationEntityType.Review), label: t("admin.moderation.types.reviews") },
    { value: String(ModerationEntityType.ServiceImage), label: t("admin.moderation.types.images") },
  ];

  const statusOptions = [
    { value: "", label: t("admin.moderation.statuses.all") },
    { value: String(ModerationStatus.Pending), label: t("admin.moderation.statuses.pending") },
    { value: String(ModerationStatus.Approved), label: t("admin.moderation.statuses.approved") },
    { value: String(ModerationStatus.Rejected), label: t("admin.moderation.statuses.rejected") },
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
    dateFrom: dateFrom
      ? new Date(dateFrom).toISOString()
      : undefined,
    dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
  };

  const { items, loading, error, refetch } = useModerationQueue(params);

  // Image approve/reject — the only entity type in this queue with its
  // own dedicated endpoints, so it's actioned inline instead of via
  // reviewHref's "open the parent page" fallback.
  const [imageActionId, setImageActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ModerationQueueItem | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [previewItem, setPreviewItem] = useState<ModerationQueueItem | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
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
        getApiErrorMessage(err, t("admin.moderation.messages.approveFailed"))
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
        getApiErrorMessage(err, t("admin.moderation.messages.rejectFailed"))
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

  return (
    <div className="mx-auto">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
            <ClipboardList size={13} />
            {t("admin.moderation.eyebrow")}
          </p>

          <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            {t("admin.moderation.title")}
          </h1>

          <p className="mt-1 text-sm text-[#958980]">
            {t("admin.moderation.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4]"
        >
          <RotateCcw size={13} />
          {t("admin.moderation.refresh")}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-xl border px-4 py-2.5 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid gap-3 rounded-2xl border border-[#eee7e1] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#9b8f86]">
            {t("admin.moderation.filters.vendorId")}
          </label>
          <input
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder={t("admin.moderation.filters.vendorIdPlaceholder")}
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#a99d94] focus:border-[#30251f]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#9b8f86]">
            {t("admin.moderation.filters.type")}
          </label>
          <Select
            value={entityType}
            onChange={setEntityType}
            options={entityTypeOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#9b8f86]">
            {t("admin.moderation.filters.status")}
          </label>
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#9b8f86]">
            {t("admin.moderation.filters.from")}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#9b8f86]">
            {t("admin.moderation.filters.to")}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mb-4 text-xs font-semibold text-[#a47e43] hover:underline"
        >
          {t("admin.moderation.filters.clear")}
        </button>
      )}

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee9]">
            <ClipboardList size={22} className="text-[#b99a62]" />
          </div>

          <p className="text-sm font-medium text-[#30251f]">
            {t("admin.moderation.empty.title")}
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
            {hasFilters
              ? t("admin.moderation.empty.filtered")
              : t("admin.moderation.empty.none")}
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-2.5">
          {items.map((item) => {
            const meta = entityMeta[item.entityType] ?? {
              labelKey: "admin.moderation.entity.item" as const,
              icon: ClipboardList,
              className: "bg-[#f0e9e0] text-[#a47e43]",
            };

            const Icon = meta.icon;
            const key = `${item.entityType}-${item.entityId}`;

            const isImage =
              item.entityType === ModerationEntityType.ServiceImage;
            const isPendingImage =
              isImage && item.status === ModerationStatus.Pending;
            const isActingOnThisImage = imageActionId === item.entityId;

            const content = (
              <>
                <div className="flex min-w-0 items-center gap-3">
                  {isImage && item.imageUrl ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      title={t("admin.moderation.viewFullSize")}
                      className="group/thumb relative h-10 w-10 shrink-0 overflow-hidden rounded-xl"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover/thumb:bg-black/30">
                        <Eye
                          size={14}
                          className="text-white opacity-0 transition group-hover/thumb:opacity-100"
                        />
                      </span>
                    </button>
                  ) : (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
                    >
                      <Icon size={16} />
                    </span>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#30251f]">
                        {item.title}
                      </p>

                      <span className="shrink-0 rounded-full bg-[#f4eee9] px-2 py-0.5 text-[10px] font-medium text-[#766d67]">
                        {t(meta.labelKey)}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-[#9b8f86]">
                      {item.vendorBusinessName} ·{" "}
                      {formatDate(item.submittedAt, dateLocale)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusStyles[item.status] ??
                      "bg-[#f4eee9] text-[#766d67]"
                    }`}
                  >
                    {statusLabelKeys[item.status] ? t(statusLabelKeys[item.status]) : t("admin.moderation.statuses.unknown")}
                  </span>

                  {isPendingImage ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isActingOnThisImage}
                        onClick={(e) => {
                          e.preventDefault();
                          handleApproveImage(item);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                        title={t("admin.moderation.approveImage")}
                      >
                        {isActingOnThisImage ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isActingOnThisImage}
                        onClick={(e) => {
                          e.preventDefault();
                          openRejectModal(item);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        title={t("admin.moderation.rejectImage")}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <ArrowUpRight size={15} className="text-[#a47e43] rtl:-scale-x-100" />
                  )}
                </div>
              </>
            );

            if (isPendingImage) {
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#eee7e1] bg-white p-4"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={key}
                href={reviewHref(item)}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#eee7e1] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#dccab8] hover:shadow-[0_10px_28px_rgba(48,37,31,0.07)]"
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}

      {/* Reject image modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-[#30251f]">
              {t("admin.moderation.modal.title")}
            </h2>

            <p className="mt-1 text-xs text-[#958980]">
              {t("admin.moderation.modal.text", { title: rejectTarget.title })}
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={imageActionId === rejectTarget.entityId}
              placeholder={t("admin.moderation.modal.placeholder")}
              rows={4}
              className="mt-3 w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#a99d94] focus:border-[#30251f]"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={imageActionId === rejectTarget.entityId}
                className="rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:bg-[#faf7f4] disabled:opacity-60"
              >
                {t("admin.moderation.modal.cancel")}
              </button>

              <button
                type="button"
                onClick={handleRejectImage}
                disabled={
                  imageActionId === rejectTarget.entityId ||
                  !rejectReason.trim()
                }
                className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {imageActionId === rejectTarget.entityId ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                {t("admin.moderation.modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image preview lightbox — view full size before deciding */}
      {previewItem?.imageUrl && (
        <>
          <ImageLightbox
            images={[{ id: previewItem.entityId, url: previewItem.imageUrl }]}
            open={!!previewItem}
            onClose={() => setPreviewItem(null)}
            title={previewItem.title}
          />

          {previewItem.status === ModerationStatus.Pending && (
            <div className="fixed inset-x-0 bottom-0 z-[110] flex justify-center px-4 pb-6 sm:pb-8">
              <div className="flex items-center gap-3 rounded-full bg-white/95 p-2 ps-4 shadow-2xl backdrop-blur">
                <span className="hidden text-xs font-medium text-[#30251f] sm:inline">
                  {previewItem.title}
                </span>

                <button
                  type="button"
                  disabled={imageActionId === previewItem.entityId}
                  onClick={() => handleApproveImage(previewItem)}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {imageActionId === previewItem.entityId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {t("admin.moderation.approve")}
                </button>

                <button
                  type="button"
                  disabled={imageActionId === previewItem.entityId}
                  onClick={() => openRejectModal(previewItem)}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <X size={14} />
                  {t("admin.moderation.reject")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

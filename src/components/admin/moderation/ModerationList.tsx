"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { ModerationEntityType, ModerationStatus } from "@/types/moderation";

import type { ModerationQueueState } from "./useModerationPage";
import {
  entityMeta,
  reviewHref,
  statusLabelKeys,
  statusStyles,
} from "@/components/admin/moderation/moderationConfig";

/** Loading / error / empty states and the queue items. */
export function ModerationList({ queue }: { queue: ModerationQueueState }) {
  const { t } = useLanguage();
  const {
    dateLocale,
    imageActionId,
    setPreviewItem,
    handleApproveImage,
    openRejectModal,
    hasFilters,
    items,
    loading,
    error,
  } = queue;

  return (
    <>
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
                        loading="lazy"
                        decoding="async"
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
                      statusStyles[item.status] ?? "bg-[#f4eee9] text-[#766d67]"
                    }`}
                  >
                    {statusLabelKeys[item.status]
                      ? t(statusLabelKeys[item.status])
                      : t("admin.moderation.statuses.unknown")}
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
                    <ArrowUpRight
                      size={15}
                      className="text-[#a47e43] rtl:-scale-x-100"
                    />
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
    </>
  );
}

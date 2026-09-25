"use client";

import { createElement } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  Store,
  X,
  MessageSquarePlus,
  MessageSquareText,
  HeartHandshake,
  Send,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import type { RoadmapItem } from "@/types/roadmap";
import { useLanguage } from "@/context/LanguageContext";

import type { JourneyHandlers } from "@/components/roadmap/JourneyPath";
import { STATE_STYLES, getCategoryIcon, getStepState } from "@/components/roadmap/roadmapUtils";

export function JourneyCard({
  ref,
  item,
  index,
  total,
  isNext,
  actionLoading,
  onReview,
  onComplete,
  onUncomplete,
  onRemove,
  onRequestExternalComplete,
  onCompletedWithVendor,
  reviewOf,
  onViewReview,
  referralOf,
  onShareExternal,
}: {
  ref?: React.Ref<HTMLElement>;
  item: RoadmapItem;
  index: number;
  total: number;
  isNext: boolean;
} & JourneyHandlers) {
  const { t, isArabic, localize } = useLanguage();
  const state = getStepState(item);
  const styles = STATE_STYLES[state];
  const isCompleted = state === "completed";
  const hasVendor = Boolean(item.selectedVendorId);
  const myReview = reviewOf(item);
  const referral = referralOf(item);
  const completing =
    actionLoading === `complete-${item.categoryId}` ||
    actionLoading === `uncomplete-${item.categoryId}`;
  const removing = actionLoading === `remove-${item.categoryId}`;

  const statusLabel = isCompleted
    ? t("roadmap.card.status.completed")
    : state === "selected"
      ? t("roadmap.card.status.vendorSelected")
      : isNext
        ? t("roadmap.cardExtra.nextUp")
        : t("roadmap.cardExtra.notStarted");

  const handleToggle = async () => {
    if (isCompleted) {
      await onUncomplete(item.categoryId);
      return;
    }
    if (!hasVendor) {
      onRequestExternalComplete(item);
      return;
    }
    const ok = await onComplete(item.categoryId);
    if (ok) onCompletedWithVendor(item);
  };

  return (
    <article
      ref={ref}
      aria-label={`${t("roadmap.cardExtra.stepOf", { number: index + 1, total })}: ${localize(item.categoryName)}`}
      className={`group relative flex h-full flex-col rounded-3xl border p-5 shadow-[0_10px_30px_rgba(65,46,37,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(65,46,37,0.12)] ${styles.card} ${
        isNext
          ? "ring-2 ring-[#d9ab6b] ring-offset-2 ring-offset-[#fbf8f4]"
          : ""
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-end gap-2 md:justify-between">
        <span className="hidden h-7 min-w-7 items-center justify-center rounded-full bg-[#30251f] px-2 text-xs font-bold tabular-nums text-white md:inline-flex">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isNext && state === "todo"
              ? "bg-[#30251f] text-[#ecc98f]"
              : styles.pill
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={13} aria-hidden="true" />
          ) : isNext && state === "todo" ? (
            <Sparkles size={12} aria-hidden="true" />
          ) : (
            <span
              className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
              aria-hidden="true"
            />
          )}
          {statusLabel}
        </span>
      </div>

      {/* body */}
      <div className="mt-4 flex flex-1 items-start gap-3.5">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${styles.tile}`}
        >
          {createElement(getCategoryIcon(item.categoryName, index), {
            size: 22,
            strokeWidth: 1.6,
            "aria-hidden": true,
          })}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-snug text-[#30251f]">
            {localize(item.categoryName)}
          </h3>
          {hasVendor ? (
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-[#8d6d4c]">
              <Store size={14} className="shrink-0" aria-hidden="true" />
              <span className="shrink-0 text-[#a3968d]">
                {t("roadmap.cardExtra.bookedWith")}
              </span>
              <Link
                href={`/vendors/${item.selectedVendorId}`}
                className="truncate font-semibold underline-offset-4 hover:underline"
              >
                {item.selectedVendorName}
              </Link>
            </p>
          ) : isCompleted ? (
            <div className="mt-1 space-y-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-[#8d6d4c]">
                <Store size={14} className="shrink-0" aria-hidden="true" />
                {t("roadmap.external.bookedOutsideDone")}
              </p>
              {referral ? (
                <p className="flex min-w-0 items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2
                    size={13}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {t("roadmap.external.referralSent")}: {referral}
                  </span>
                </p>
              ) : (
                onShareExternal && (
                  <button
                    type="button"
                    onClick={() => onShareExternal(item)}
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#30221d] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#46332a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b17c42]/25"
                  >
                    <Send size={12} className="rtl:-scale-x-100" aria-hidden="true" />
                    {t("roadmap.external.sendDetails")}
                  </button>
                )
              )}
            </div>
          ) : (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#9a8c82]">
              {t("roadmap.card.noVendorHint")}
            </p>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#f1ebe5] pt-4">
        <Link
          href={`/vendors?categoryId=${encodeURIComponent(String(item.categoryId))}`}
          aria-label={
            hasVendor
              ? t("roadmap.cardExtra.changeVendor")
              : t("roadmap.cardExtra.findVendor")
          }
          className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition ${
            hasVendor
              ? "border border-[#e6ddd5] bg-white text-[#5f544d] hover:border-[#c49a64] hover:text-[#8f6330]"
              : "bg-[#30251f] text-white hover:bg-[#46342a]"
          }`}
        >
          {hasVendor
            ? t("roadmap.card.action.change")
            : t("roadmap.cardExtra.findVendor")}
          <ArrowRight
            size={15}
            className={isArabic ? "rotate-180" : ""}
            aria-hidden="true"
          />
        </Link>

        <Tooltip
          title={
            isCompleted
              ? t("roadmap.card.tooltip.reopen")
              : hasVendor
                ? t("roadmap.card.tooltip.markComplete")
                : t("roadmap.card.tooltip.markCompleteExternal")
          }
          arrow
        >
          <button
            type="button"
            disabled={completing}
            onClick={handleToggle}
            aria-pressed={isCompleted}
            className={`inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition disabled:opacity-60 ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                : hasVendor
                  ? "bg-[#30251f] text-white hover:bg-[#46342a]"
                  : "border border-[#e6ddd5] bg-white text-[#5f544d] hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {completing ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : isCompleted ? (
              <CheckCircle2 size={15} aria-hidden="true" />
            ) : (
              <Circle size={15} aria-hidden="true" />
            )}
            {isCompleted
              ? t("roadmap.cardExtra.done")
              : t("roadmap.cardExtra.markDone")}
          </button>
        </Tooltip>

        {isCompleted && hasVendor && item.id && myReview && (
          <Tooltip title={t("reviews.mine.alreadyTooltip")} arrow>
            <button
              type="button"
              onClick={() => onViewReview(myReview)}
              aria-label={t("reviews.mine.alreadyTooltip")}
              className="relative inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#fbf1e3] px-3 text-sm font-semibold text-[#94652d] ring-1 ring-[#ecd6b5] transition hover:bg-[#f6e6cf]"
            >
              <MessageSquareText size={16} aria-hidden="true" />
              {t("reviews.mine.reviewed")}
            </button>
          </Tooltip>
        )}

        {isCompleted && hasVendor && item.id && !myReview && (
          <Tooltip title={t("roadmap.card.tooltip.writeReview")} arrow>
            <button
              type="button"
              onClick={() => onReview(item)}
              aria-label={t("roadmap.card.tooltip.writeReview")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6ddd5] bg-white text-[#81756d] transition hover:border-[#c49a64] hover:text-[#8f6330]"
            >
              <MessageSquarePlus size={16} aria-hidden="true" />
            </button>
          </Tooltip>
        )}

        {hasVendor && !isCompleted && (
          <Tooltip title={t("roadmap.card.tooltip.removeVendor")} arrow>
            <button
              type="button"
              disabled={removing}
              onClick={() => onRemove(item.categoryId)}
              aria-label={t("roadmap.card.tooltip.removeVendor")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfd8] bg-white text-[#a2948b] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
            >
              {removing ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <X size={16} aria-hidden="true" />
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {!hasVendor && !isCompleted && (
        <button
          type="button"
          onClick={() => onRequestExternalComplete(item)}
          className="mt-3 inline-flex items-center justify-center gap-1.5 self-start text-sm font-semibold text-[#a47e43] underline-offset-4 transition hover:text-[#8a6834] hover:underline"
        >
          <HeartHandshake size={15} aria-hidden="true" />
          {t("roadmap.external.bookedOutside")}
        </button>
      )}
    </article>
  );
}

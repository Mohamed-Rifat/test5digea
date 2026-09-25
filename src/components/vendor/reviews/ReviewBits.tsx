"use client";

import { memo } from "react";
import { MessageSquareText, Search, X } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";
import { ReviewStatus } from "@/types/review";

import { getStatusMeta } from "@/components/vendor/reviews/reviewUtils";

export const StatusBadge = memo(function StatusBadge({ status }: { status: ReviewStatus }) {
  const { t } = useLanguage();
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  const statusLabel = t(meta.labelKey);

  return (
    <Tooltip title={t("vendor.reviews.status.tooltip", { status: statusLabel })} arrow>
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] rtl:tracking-normal ${meta.className}`}
      >
        <Icon size={12} strokeWidth={2.3} />
        <span className="hidden xs:inline">{statusLabel}</span>
        <span className="xs:hidden">{statusLabel.charAt(0)}</span>
      </span>
    </Tooltip>
  );
});

StatusBadge.displayName = "StatusBadge";

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  description,
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
        highlight ? "border-[#dfd0bf]" : "border-[#e8dfd8]"
      }`}
    >
      <div className="absolute -end-8 -top-8 h-20 w-20 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125 sm:h-24 sm:w-24" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#8d8077] sm:text-xs">
            {title}
          </p>

          <p className="mt-1.5 text-xl font-semibold tracking-tight text-[#30251f] sm:mt-2 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 truncate text-[10px] text-[#9a8d85] sm:mt-1.5 sm:text-xs">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
            highlight ? "bg-[#f4eadf]" : "bg-[#f5eee9]"
          }`}
        >
          <Icon className="h-4 w-4 text-[#705b4e] sm:h-5 sm:w-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

export const ReviewSkeleton = memo(function ReviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-[#eee7e1] bg-white p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#f1ece8] sm:h-10 sm:w-10" />
            <div className="space-y-1.5 sm:space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-[#f1ece8] sm:w-28" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-[#f5f1ee] sm:w-20" />
            </div>
          </div>
          <div className="mt-3 h-14 animate-pulse rounded-xl bg-[#f8f5f2] sm:mt-5 sm:h-16" />
          <div className="mt-3 space-y-1.5 sm:mt-5 sm:space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-[#f5f1ee]" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-[#f5f1ee]" />
          </div>
        </div>
      ))}
    </div>
  );
});

ReviewSkeleton.displayName = "ReviewSkeleton";

export const EmptyState = memo(function EmptyState({
  filtered,
  onClear,
  icon,
}: {
  filtered: boolean;
  onClear?: () => void;
  icon?: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white px-4 py-10 text-center sm:px-6 sm:py-14">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-14 sm:w-14">
        {icon || (filtered ? <Search size={20} strokeWidth={1.7} /> : <MessageSquareText size={20} strokeWidth={1.7} />)}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#40342e] sm:mt-5">
        {filtered ? t("vendor.reviews.empty.filteredTitle") : t("vendor.reviews.empty.noneTitle")}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b817a] sm:text-sm sm:leading-6">
        {filtered
          ? t("vendor.reviews.empty.filteredText")
          : t("vendor.reviews.empty.noneText")}
      </p>

      {filtered && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-4 sm:py-2.5"
        >
          <X size={14} />
          {t("vendor.reviews.empty.clearFilters")}
        </button>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";

"use client";

import { Suspense, useEffect, useMemo, useState, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  MessageSquareText,
  Search,
  Sparkles,
  Star,
  User,
  X,
  XCircle,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUpDown,
  Menu as MenuIcon,
} from "lucide-react";

import {
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Badge,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
} from "@mui/material";

import RatingStars from "@/components/shared/RatingStars";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { useToast } from "@/components/providers/ToastProvider";
import type { Language, TranslationKey } from "@/locales";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";


/* =========================================================
   Constants
========================================================= */

const STATUS_FILTERS: {
  value: string;
  labelKey: TranslationKey;
  icon: React.ElementType;
}[] = [
  { value: "all", labelKey: "vendor.reviews.filters.statusAll", icon: Filter },
  { value: String(ReviewStatus.Approved), labelKey: "vendor.reviews.status.approved", icon: CheckCircle2 },
  { value: String(ReviewStatus.Pending), labelKey: "vendor.reviews.status.pending", icon: Clock3 },
  { value: String(ReviewStatus.Rejected), labelKey: "vendor.reviews.status.rejected", icon: XCircle },
];

const VISIBILITY_FILTERS: {
  value: string;
  labelKey: TranslationKey;
  icon: React.ElementType;
}[] = [
  { value: "all", labelKey: "vendor.reviews.filters.visAll", icon: Filter },
  { value: "visible", labelKey: "vendor.reviews.filters.visVisible", icon: Eye },
  { value: "hidden", labelKey: "vendor.reviews.filters.visHidden", icon: EyeOff },
];

const SORT_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: "newest", labelKey: "vendor.reviews.filters.sortNewest" },
  { value: "oldest", labelKey: "vendor.reviews.filters.sortOldest" },
  { value: "highest", labelKey: "vendor.reviews.filters.sortHighest" },
  { value: "lowest", labelKey: "vendor.reviews.filters.sortLowest" },
];

type TFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

const PAGE_SIZE = 5;

/* =========================================================
   Helpers
========================================================= */

function getStatusMeta(status: ReviewStatus) {
  const configs = {
    [ReviewStatus.Approved]: {
      labelKey: "vendor.reviews.status.approved" as const,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dotClassName: "bg-emerald-500",
    },
    [ReviewStatus.Rejected]: {
      labelKey: "vendor.reviews.status.rejected" as const,
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-100",
      dotClassName: "bg-red-500",
    },
    [ReviewStatus.Pending]: {
      labelKey: "vendor.reviews.status.pending" as const,
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-100",
      dotClassName: "bg-amber-500",
    },
  };
  return configs[status] || configs[ReviewStatus.Pending];
}

function getRatingLabelKey(rating: number): TranslationKey {
  const keys: Record<number, TranslationKey> = {
    5: "vendor.reviews.rating.excellent",
    4: "vendor.reviews.rating.veryGood",
    3: "vendor.reviews.rating.average",
    2: "vendor.reviews.rating.belowAverage",
    1: "vendor.reviews.rating.poor",
  };

  return keys[rating] ?? "vendor.reviews.rating.notRated";
}

function getTimeAgo(date: string, t: TFn, language: Language): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("vendor.reviews.timeAgo.justNow");
  if (minutes < 60) return t("vendor.reviews.timeAgo.minutes", { count: minutes });
  if (hours < 24) return t("vendor.reviews.timeAgo.hours", { count: hours });
  if (days < 7) return t("vendor.reviews.timeAgo.days", { count: days });

  return formatDate(date, LANGUAGE_DATE_LOCALE[language]);
}

/* =========================================================
   Excel Export
========================================================= */

// Excel sheet names: max 31 chars, must be unique (case-insensitive) and may
// not contain \ / ? * [ ] :  - a service called "Photo/Video" would otherwise
// make the whole export throw.
function makeSheetName(raw: string | null | undefined, used: Set<string>): string {
  const base =
    String(raw ?? "")
      .replace(/[\\/?*[\]:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^'+|'+$/g, "")
      .slice(0, 27) || "Sheet";

  let name = base;
  let counter = 2;

  while (used.has(name.toLowerCase())) {
    const suffix = ` (${counter++})`;
    name = base.slice(0, 31 - suffix.length) + suffix;
  }

  used.add(name.toLowerCase());
  return name;
}

function exportReviewsToCsv(
  reviews: Review[],
  t: TFn,
  language: Language,
  vendorName?: string,
  notify?: (message: string, type?: "success" | "error" | "info") => void
) {
  const x = (key: string, params?: Record<string, string | number>) =>
    t(`vendor.reviews.excel.${key}` as TranslationKey, params);
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  if (reviews.length === 0) {
    notify?.(x("nothingToExport"), "info");
    return;
  }

  const reviewsByService = reviews.reduce<Record<string, { serviceName: string; reviews: Review[] }>>((acc, review) => {
    const key = review.serviceId;
    if (!acc[key]) {
      acc[key] = { serviceName: review.serviceName, reviews: [] };
    }
    acc[key].reviews.push(review);
    return acc;
  }, {});

  const totalApproved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
  const totalPending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
  const totalRejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
  const totalVisible = reviews.filter(r => r.status === ReviewStatus.Approved && r.isDisplayed).length;
  const totalHidden = reviews.filter(r => r.status === ReviewStatus.Approved && !r.isDisplayed).length;
  const avgRating = reviews
    .filter(r => r.status === ReviewStatus.Approved)
    .reduce((acc, r) => acc + r.rating, 0) / (totalApproved || 1);

  const rows: (string | number)[][] = [
    [x("summaryTitle")],
    [],
    [x("vendor"), vendorName || x("na")],
    [x("reportDate"), new Date().toLocaleString(dateLocale, { dateStyle: "full", timeStyle: "medium" })],
    [],
    [x("statistics")],
    [x("metric"), x("value")],
    [x("totalReviews"), reviews.length],
    [x("approvedReviews"), totalApproved],
    [x("pendingReviews"), totalPending],
    [x("rejectedReviews"), totalRejected],
    [x("visibleReviews"), totalVisible],
    [x("hiddenReviews"), totalHidden],
    [x("averageRating"), `${avgRating.toFixed(1)} ⭐`],
    [x("approvalRate"), `${((totalApproved / (reviews.length || 1)) * 100).toFixed(1)}%`],
    [],
    [x("no"), x("customer"), x("service"), x("rating"), x("status"), x("visibility"), x("comment"), x("date")],
  ];

  const visibilityLabel = (review: Review) =>
    review.status === ReviewStatus.Approved
      ? (review.isDisplayed ? x("visible") : x("hidden"))
      : "—";

  reviews.forEach((review, index) => {
    const stars = "⭐".repeat(Math.round(review.rating));
    rows.push([
      index + 1,
      review.userFullName || t("vendor.reviews.card.anonymous"),
      review.serviceName,
      `${review.rating} ${stars}`,
      t(getStatusMeta(review.status).labelKey),
      visibilityLabel(review),
      review.comment || x("noComment"),
      formatDate(review.createdAt, dateLocale),
    ]);
  });

  const escapeCsv = (value: string | number) => {
    const text = String(value);
    return /["\n,]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const csv = rows.map(row => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${x("fileName")}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


/* =========================================================
   Components
========================================================= */

const StatusBadge = memo(function StatusBadge({ status }: { status: ReviewStatus }) {
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

const StatCard = memo(function StatCard({
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

/* =========================================================
   ✅ Review Card - مع border ملون حسب الـ Visibility
========================================================= */

const ReviewCard = memo(function ReviewCard({
  review,
  index,
  onViewDetails,
}: {
  review: Review;
  index: number;
  onViewDetails?: (review: Review) => void;
}) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const ratingLabel = t(getRatingLabelKey(review.rating));
  const timeAgo = getTimeAgo(review.createdAt, t, language);
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = review.comment && review.comment.length > 150;
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.slice(0, 150) + "..."
    : review.comment;

  // ✅ تحديد لون الـ border حسب الحالة
  const getCardBorderClass = () => {
    if (review.status !== ReviewStatus.Approved) {
      return "border-[#eee7e1]"; // محايد للـ Pending و Rejected
    }
    return review.isDisplayed
      ? "border-emerald-300 hover:border-emerald-400" // ✅ أخضر للـ Visible
      : "border-red-300 hover:border-red-400"; // ❌ أحمر للـ Hidden
  };

  return (
    <article
      className={`group relative border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${getCardBorderClass()}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ✅ شريط علوي ملون حسب الحالة */}
      {review.status === ReviewStatus.Approved && (
        <div
          className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${
            review.isDisplayed ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
      )}

      {/* Top Section */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 gap-2 sm:gap-3">
          <div
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
              review.status === ReviewStatus.Approved
                ? review.isDisplayed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
                : "bg-[#f5eee9] text-[#705b4e]"
            }`}
          >
            <User size={15} strokeWidth={1.8} className="sm:h-4.25 sm:w-4.25" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p className="truncate text-xs font-semibold text-[#30251f] sm:text-sm">
                {review.userFullName || t("vendor.reviews.card.anonymous")}
              </p>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">{t("vendor.reviews.card.customer")}</p>
              <span className="hidden h-1 w-1 rounded-full bg-[#d5c8be] sm:inline" />
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">{timeAgo}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* ✅ Visibility Badge واضح */}
          {review.status === ReviewStatus.Approved && (
            <Tooltip
              title={review.isDisplayed ? t("vendor.reviews.card.visibleTooltip") : t("vendor.reviews.card.hiddenTooltip")}
              arrow
            >
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.04em] rtl:tracking-normal sm:gap-1.5 sm:px-2.5 sm:text-[10px] ${
                  review.isDisplayed
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {review.isDisplayed ? (
                  <>
                    <Eye size={11} strokeWidth={2.3} />
                    <span className="hidden xs:inline">{t("vendor.reviews.card.visible")}</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={11} strokeWidth={2.3} />
                    <span className="hidden xs:inline">{t("vendor.reviews.card.hidden")}</span>
                  </>
                )}
              </span>
            </Tooltip>
          )}
          <StatusBadge status={review.status} />
        </div>
      </div>

      {/* Service Info */}
      <div className="mt-3 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-2.5 sm:mt-5 sm:p-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#a39891] sm:mb-1 sm:text-[10px]">
              {t("vendor.reviews.card.service")}
            </p>

            <Link
              href={`/vendor/services/${review.serviceId}`}
              className="block truncate text-xs font-semibold text-[#4a3c34] transition-colors hover:text-[#a47e43] sm:text-sm"
            >
              {review.serviceName}
            </Link>
          </div>

          <div className="shrink-0 rounded-lg bg-white px-2 py-1.5 shadow-sm sm:px-2.5 sm:py-2">
            <RatingStars rating={review.rating} size={11} />
            <p className="mt-0.5 text-center text-[8px] font-medium text-[#a39891] sm:text-[9px]">
              {ratingLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment ? (
        <div className="mt-3 sm:mt-5">
          <p className="whitespace-pre-line text-xs leading-6 text-[#5f544d] sm:text-sm sm:leading-7">
            {displayComment}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 text-[10px] font-semibold text-[#a47e43] hover:text-[#8b6d55] transition-colors sm:mt-2 sm:text-xs"
            >
              {isExpanded ? t("vendor.reviews.card.showLess") : t("vendor.reviews.card.readMore")}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-[#aaa19b] sm:mt-5 sm:text-sm">
          {t("vendor.reviews.card.noComment")}
        </p>
      )}

      {/* Rejection Reason */}
      {review.status === ReviewStatus.Rejected && review.rejectionReason && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50/70 p-2.5 sm:mt-5 sm:p-3.5">
          <div className="flex gap-2 sm:gap-2.5">
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-500 sm:h-3.75 sm:w-3.75" />
            <div>
              <p className="text-[10px] font-semibold text-red-700 sm:text-xs">
                {t("vendor.reviews.card.moderationFeedback")}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-red-600 sm:mt-1 sm:text-xs sm:leading-5">
                {review.rejectionReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1ece8] pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        <p className="text-[10px] text-[#aaa19b] sm:text-[11px]">
          {formatDate(review.createdAt, LANGUAGE_DATE_LOCALE[language])}
        </p>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(review)}
            className="text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
          >
            {t("vendor.reviews.card.view")}
          </button>
        )}
      </div>
    </article>
  );
});

ReviewCard.displayName = "ReviewCard";

const ReviewSkeleton = memo(function ReviewSkeleton({ count = 3 }: { count?: number }) {
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

const EmptyState = memo(function EmptyState({
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

/* =========================================================
   ✅ Mobile Filter Drawer - مع فلتر الـ Visibility
========================================================= */

function MobileFilterDrawer({
  open,
  onClose,
  serviceOptions,
  serviceFilter,
  setServiceFilter,
  statusFilter,
  setStatusFilter,
  visibilityFilter,
  setVisibilityFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearFilters,
}: {
  open: boolean;
  onClose: () => void;
  serviceOptions: { id: string; name: string }[];
  serviceFilter: string;
  setServiceFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  visibilityFilter: string;
  setVisibilityFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: any) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}) {
  const { t } = useLanguage();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          maxHeight: "90vh",
          padding: "20px",
        },
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#30251f]">{t("vendor.reviews.drawer.title")}</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors"
            >
              {t("vendor.reviews.filters.clearAll")}
            </button>
          )}
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </div>
      </div>

      <Divider className="mb-4" />

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">{t("vendor.reviews.drawer.search")}</label>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("vendor.reviews.filters.searchPlaceholder")}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} className="text-[#9b8f86]" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <button onClick={() => setSearchQuery("")} className="text-[#9b8f86] hover:text-[#30251f]">
                      <X size={16} />
                    </button>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fcfaf8",
                fontSize: "13px",
                "& fieldset": { borderColor: "#e3d9d1" },
                "&:hover fieldset": { borderColor: "#d5c8be" },
                "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
              },
            }}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">{t("vendor.reviews.drawer.service")}</label>
          <Autocomplete
            value={serviceOptions.find(s => s.id === serviceFilter) ?? null}
            onChange={(_, newValue) => setServiceFilter(newValue?.id ?? "all")}
            options={serviceOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={t("vendor.reviews.filters.noServices")}
            clearText={t("common.clear")}
            openText={t("common.open")}
            closeText={t("common.close")}
            popupIcon={<ChevronDown size={17} />}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("vendor.reviews.filters.allServices")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fcfaf8",
                    fontSize: "13px",
                    "& fieldset": { borderColor: "#e3d9d1" },
                    "&:hover fieldset": { borderColor: "#d5c8be" },
                    "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                  },
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">{t("vendor.reviews.drawer.status")}</label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
            IconComponent={ChevronDown}
            renderValue={(value) => {
              const current = STATUS_FILTERS.find(item => item.value === value) ?? STATUS_FILTERS[0];
              const Icon = current.icon;
              return (
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[#8d796a]" />
                  <span>{t(current.labelKey)}</span>
                </div>
              );
            }}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#fcfaf8",
              fontSize: "13px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
            }}
          >
            {STATUS_FILTERS.map((option) => {
              const Icon = option.icon;
              return (
                <MenuItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className="text-[#806a5c]" />
                    <span>{t(option.labelKey)}</span>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </div>

        {/* ✅ فلتر الـ Visibility */}
        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">{t("vendor.reviews.drawer.visibility")}</label>
          <Select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            fullWidth
            IconComponent={ChevronDown}
            renderValue={(value) => {
              const current = VISIBILITY_FILTERS.find(item => item.value === value) ?? VISIBILITY_FILTERS[0];
              const Icon = current.icon;
              return (
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[#8d796a]" />
                  <span>{t(current.labelKey)}</span>
                </div>
              );
            }}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#fcfaf8",
              fontSize: "13px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
            }}
          >
            {VISIBILITY_FILTERS.map((option) => {
              const Icon = option.icon;
              return (
                <MenuItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className="text-[#806a5c]" />
                    <span>{t(option.labelKey)}</span>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">{t("vendor.reviews.drawer.sortBy")}</label>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            fullWidth
            IconComponent={ChevronDown}
            renderValue={(value) => {
              const option = SORT_OPTIONS.find(o => o.value === value);
              return <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-[#8d796a]" />
                <span className="text-xs">{option ? t(option.labelKey) : t("vendor.reviews.filters.sortPlaceholder")}</span>
              </div>;
            }}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#fcfaf8",
              fontSize: "12px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </MenuItem>
            ))}
          </Select>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 rounded-xl bg-[#30251f] py-3 text-sm font-semibold text-white transition hover:bg-[#46382f]"
        >
          {t("vendor.reviews.drawer.apply")}
        </button>
      </div>
    </SwipeableDrawer>
  );
}

/* =========================================================
   Main Page
========================================================= */

function VendorReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { vendor } = useVendor();
  const { services } = useVendorServices();
  const { reviews, loading, error, refetch } = useVendorReviews();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // ✅ جديد
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pickedReview, setPickedReview] = useState<Review | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  /* =======================================================
     Review details (opened by the "View" button or by a link
     such as /vendor/reviews?review=<id> from the dashboard)
  ======================================================= */

  const deepLinkId = searchParams.get("review");

  const linkedReview = useMemo(
    () =>
      deepLinkId
        ? reviews.find((review) => review.id === deepLinkId) ?? null
        : null,
    [deepLinkId, reviews]
  );

  const selectedReview = pickedReview ?? linkedReview;

  const closeReview = useCallback(() => {
    setPickedReview(null);

    if (deepLinkId) {
      router.replace("/vendor/reviews", { scroll: false });
    }
  }, [deepLinkId, router]);

  useEffect(() => {
    if (!selectedReview) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeReview();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedReview, closeReview]);

  /* =======================================================
     Stats
  ======================================================= */

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
    const pending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
    const rejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
    const visible = reviews.filter(r => r.status === ReviewStatus.Approved && r.isDisplayed).length;
    const hidden = reviews.filter(r => r.status === ReviewStatus.Approved && !r.isDisplayed).length;
    const averageRating = reviews
      .filter(r => r.status === ReviewStatus.Approved)
      .reduce((acc, r) => acc + r.rating, 0) / (approved || 1);

    return {
      total,
      approved,
      pending,
      rejected,
      visible,
      hidden,
      averageRating: averageRating || 0,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
    };
  }, [reviews]);

  /* =======================================================
     Service Options
  ======================================================= */

  const serviceOptions = useMemo(() => {
    const known = new Map<string, string>();
    services.forEach((service: any) => known.set(service.id, service.name));
    reviews.forEach((review) => {
      if (!known.has(review.serviceId)) known.set(review.serviceId, review.serviceName);
    });
    return Array.from(known.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ id, name }));
  }, [services, reviews]);

  /* =======================================================
     ✅ Filtering - مع فلتر الـ Visibility
  ======================================================= */

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter((review) => {
      const matchesService = serviceFilter === "all" || review.serviceId === serviceFilter;
      const matchesStatus = statusFilter === "all" || String(review.status) === statusFilter;
      const matchesSearch = searchQuery === "" ||
        review.userFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      // ✅ فلتر الـ Visibility
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && review.status === ReviewStatus.Approved && review.isDisplayed) ||
        (visibilityFilter === "hidden" && review.status === ReviewStatus.Approved && !review.isDisplayed);

      return matchesService && matchesStatus && matchesSearch && matchesVisibility;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, serviceFilter, statusFilter, visibilityFilter, searchQuery, sortBy]);

  const displayedReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const hasMore = displayedReviews.length < filteredReviews.length;
  const hasActiveFilters =
    serviceFilter !== "all" ||
    statusFilter !== "all" ||
    visibilityFilter !== "all" ||
    searchQuery !== "";

  const activeFiltersCount = [
    serviceFilter !== "all",
    statusFilter !== "all",
    visibilityFilter !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  /* =======================================================
     Handlers
  ======================================================= */

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setServiceFilter("all");
    setStatusFilter("all");
    setVisibilityFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleExportClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  }, []);

  const handleExportClose = useCallback(() => {
    setExportMenuAnchor(null);
  }, []);

  const vendorDisplayName = vendor?.businessName || t("vendor.header.vendor");

  const handleExportAll = useCallback(() => {
    exportReviewsToCsv(reviews, t, language, vendorDisplayName, toast);
    handleExportClose();
  }, [reviews, vendorDisplayName, handleExportClose, t, language, toast]);

  const handleExportFiltered = useCallback(() => {
    exportReviewsToCsv(filteredReviews, t, language, vendorDisplayName, toast);
    handleExportClose();
  }, [filteredReviews, vendorDisplayName, handleExportClose, t, language, toast]);

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        {/* Header */}
        <header className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>

              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                  {t("vendor.reviews.title")}
                </h1>
              </div>

              <p className="mt-2 max-w-xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                {t("vendor.reviews.subtitle")}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label={t("vendor.reviews.refresh")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin sm:h-5 sm:w-5" : "sm:h-5 sm:w-5"} />
              </button>

              <div>
                <Button
                  onClick={handleExportAll}
                  disabled={reviews.length === 0}
                  startIcon={<FileSpreadsheet size={16} className="sm:h-4.5 sm:w-4.5" />}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#30251f",
                    textTransform: "none",
                    fontSize: isMobile ? "11px" : "14px",
                    fontWeight: 500,
                    padding: isMobile ? "4px 12px" : "8px 18px",
                    minHeight: isMobile ? "32px" : "auto",
                    "&:hover": { backgroundColor: "#46382f" },
                    "&:disabled": { opacity: 0.5 },
                  }}
                >
                  <span className="">{t("vendor.reviews.export")}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section aria-label={t("vendor.reviews.statsAria")} className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          <StatCard
            title={t("vendor.reviews.stats.avgRating")}
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            description={t("vendor.reviews.stats.approvedCount", { count: stats.approved })}
            highlight
          />

          <StatCard
            title={t("vendor.reviews.stats.total")}
            value={stats.total}
            icon={MessageSquareText}
            description={t("vendor.reviews.stats.allReviews")}
          />

          <StatCard
            title={t("vendor.reviews.stats.visible")}
            value={stats.visible}
            icon={Eye}
            description={t("vendor.reviews.stats.shownOnListing")}
          />

          <StatCard
            title={t("vendor.reviews.stats.hidden")}
            value={stats.hidden}
            icon={EyeOff}
            description={t("vendor.reviews.stats.hiddenByAdmin")}
          />

          <StatCard
            title={t("vendor.reviews.stats.pending")}
            value={stats.pending}
            icon={Clock3}
            description={t("vendor.reviews.stats.rejectedCount", { count: stats.rejected })}
          />
        </section>

        {/* Filters */}
        <section className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm sm:mt-6 sm:p-4 lg:mt-8 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                <Filter size={14} className="text-[#a47e43] sm:h-4 sm:w-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">{t("vendor.reviews.filters.title")}</h2>
                <p className="hidden text-[10px] text-[#9b8f86] sm:mt-0.5 sm:block sm:text-[11px]">
                  {t("vendor.reviews.filters.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[10px] text-[#91867f] sm:text-xs">
                <span className="font-medium text-[#5e5149]">{filteredReviews.length}</span>
                <span className="hidden sm:inline">
                  {" "}{filteredReviews.length === 1 ? t("vendor.reviews.filters.resultOne") : t("vendor.reviews.filters.resultMany")}
                </span>
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#665950] transition hover:border-[#cfc1b7] hover:bg-[#faf8f6] md:hidden"
              >
                <MenuIcon size={14} />
                {t("vendor.reviews.filters.button")}
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#a47e43] text-[8px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="hidden text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs md:inline"
                >
                  {t("vendor.reviews.filters.clearAll")}
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters - ✅ 5 columns مع Visibility */}
          <div className="mt-4 hidden grid-cols-1 gap-3 md:grid lg:grid-cols-[1fr_180px_170px_170px_180px]">
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("vendor.reviews.filters.searchPlaceholder")}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} className="text-[#9b8f86]" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <button onClick={() => setSearchQuery("")} className="text-[#9b8f86] hover:text-[#30251f]">
                        <X size={16} />
                      </button>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 42,
                  borderRadius: "12px",
                  backgroundColor: "#fcfaf8",
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#e3d9d1" },
                  "&:hover fieldset": { borderColor: "#d5c8be" },
                  "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                },
              }}
            />

            <Autocomplete
              value={serviceOptions.find(s => s.id === serviceFilter) ?? null}
              onChange={(_, newValue) => setServiceFilter(newValue?.id ?? "all")}
              options={serviceOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText={t("vendor.reviews.filters.noServices")}
              clearText={t("common.clear")}
              openText={t("common.open")}
              closeText={t("common.close")}
              popupIcon={<ChevronDown size={17} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("vendor.reviews.filters.allServices")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "12px",
                      backgroundColor: "#fcfaf8",
                      fontSize: "13px",
                      "& fieldset": { borderColor: "#e3d9d1" },
                      "&:hover fieldset": { borderColor: "#d5c8be" },
                      "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                    },
                  }}
                />
              )}
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              IconComponent={ChevronDown}
              renderValue={(value) => {
                const current = STATUS_FILTERS.find(item => item.value === value) ?? STATUS_FILTERS[0];
                const Icon = current.icon;
                return (
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-[#8d796a]" />
                    <span>{t(current.labelKey)}</span>
                  </div>
                );
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "#fcfaf8",
                fontSize: "13px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
              }}
            >
              {STATUS_FILTERS.map((option) => {
                const Icon = option.icon;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-[#806a5c]" />
                      <span>{t(option.labelKey)}</span>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>

            {/* ✅ فلتر الـ Visibility */}
            <Select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              IconComponent={ChevronDown}
              renderValue={(value) => {
                const current = VISIBILITY_FILTERS.find(item => item.value === value) ?? VISIBILITY_FILTERS[0];
                const Icon = current.icon;
                return (
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-[#8d796a]" />
                    <span>{t(current.labelKey)}</span>
                  </div>
                );
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "#fcfaf8",
                fontSize: "13px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
              }}
            >
              {VISIBILITY_FILTERS.map((option) => {
                const Icon = option.icon;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-[#806a5c]" />
                      <span>{t(option.labelKey)}</span>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              IconComponent={ChevronDown}
              renderValue={(value) => {
                const option = SORT_OPTIONS.find(o => o.value === value);
                return <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-[#8d796a]" />
                  <span className="text-xs">{option ? t(option.labelKey) : t("vendor.reviews.filters.sortPlaceholder")}</span>
                </div>;
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "#fcfaf8",
                fontSize: "12px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1ece8] pt-3 sm:gap-2 sm:pt-4">
              <span className="me-0.5 text-[9px] font-medium text-[#958a83] sm:me-1 sm:text-[11px]">{t("vendor.reviews.filters.active")}</span>

              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "6px",
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    fontSize: "10px",
                    fontWeight: 600,
                    maxWidth: "120px",
                    "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
                  }}
                />
              )}

              {serviceFilter !== "all" && (
                <Chip
                  label={serviceOptions.find(s => s.id === serviceFilter)?.name || t("vendor.reviews.filters.unknown")}
                  onDelete={() => setServiceFilter("all")}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "6px",
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    fontSize: "10px",
                    fontWeight: 600,
                    maxWidth: "120px",
                    "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
                  }}
                />
              )}

              {statusFilter !== "all" && (
                <Chip
                  label={(() => { const f = STATUS_FILTERS.find(s => s.value === statusFilter); return f ? t(f.labelKey) : t("vendor.reviews.filters.unknown"); })()}
                  onDelete={() => setStatusFilter("all")}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "6px",
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    fontSize: "10px",
                    fontWeight: 600,
                    "& .MuiChip-deleteIcon": { width: 13, height: 13, color: "#8b776a" },
                  }}
                />
              )}

              {/* ✅ Chip للـ Visibility */}
              {visibilityFilter !== "all" && (
                <Chip
                  icon={visibilityFilter === "visible" ? <Eye size={12} /> : <EyeOff size={12} />}
                  label={(() => { const f = VISIBILITY_FILTERS.find(s => s.value === visibilityFilter); return f ? t(f.labelKey) : t("vendor.reviews.filters.unknown"); })()}
                  onDelete={() => setVisibilityFilter("all")}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "6px",
                    backgroundColor: visibilityFilter === "visible" ? "#ecfdf5" : "#fef2f2",
                    color: visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    fontSize: "10px",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                    "& .MuiChip-deleteIcon": {
                      width: 13,
                      height: 13,
                      color: visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                  }}
                />
              )}

              <button
                onClick={handleClearFilters}
                className="text-[9px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
              >
                {t("vendor.reviews.filters.clearAll")}
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <section aria-label={t("vendor.reviews.listAria")} className="mt-4 sm:mt-6 lg:mt-8">
          {loading && <ReviewSkeleton count={3} />}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm sm:h-12 sm:w-12">
                <AlertCircle size={18} className="sm:h-5.25 sm:w-5.25" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-red-800 sm:mt-4">{t("vendor.reviews.error.title")}</h3>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-red-600 sm:mt-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors sm:mt-4 sm:px-4 sm:py-2"
              >
                <RefreshCw size={14} />
                {t("vendor.reviews.error.tryAgain")}
              </button>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <EmptyState filtered={false} />
          )}

          {!loading && !error && reviews.length > 0 && filteredReviews.length === 0 && (
            <EmptyState filtered onClear={handleClearFilters} />
          )}

          {!loading && !error && displayedReviews.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <div>
                  <h3 className="text-xs font-semibold text-[#40342e] sm:text-sm">
                    {t("vendor.reviews.feedback")}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-[#9b8f86] sm:text-xs">
                    {t("vendor.reviews.showing", { shown: displayedReviews.length, total: filteredReviews.length })}
                  </p>
                </div>

                {/* ✅ Legend للـ Visibility */}
                <div className="hidden items-center gap-3 sm:flex">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-[#9b8f86]">{t("vendor.reviews.card.visible")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="text-[10px] text-[#9b8f86]">{t("vendor.reviews.card.hidden")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {displayedReviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={index}
                    onViewDetails={setPickedReview}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-4 text-center sm:mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 py-2 text-xs font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {t("vendor.reviews.loadMore")}
                    <ChevronDown size={14} className="sm:h-4 sm:w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          serviceOptions={serviceOptions}
          serviceFilter={serviceFilter}
          setServiceFilter={setServiceFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibilityFilter={visibilityFilter}
          setVisibilityFilter={setVisibilityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hasActiveFilters={hasActiveFilters}
          clearFilters={handleClearFilters}
        />

        {/* Review Detail Modal */}
        {selectedReview && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:items-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeReview}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 sm:max-h-[90vh] sm:p-6 sm:zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-3 sm:gap-4 sm:mb-4">
                <h3 className="text-base font-semibold text-[#30251f] sm:text-lg">{t("vendor.reviews.detail.title")}</h3>
                <button
                  onClick={closeReview}
                  className="rounded-lg p-1 hover:bg-[#f5eee9] transition-colors"
                >
                  <X size={18} className="text-[#8d8077] sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-12 sm:w-12">
                    <User size={16} className="text-[#705b4e] sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {selectedReview.userFullName || t("vendor.reviews.card.anonymous")}
                    </p>
                    <p className="text-[10px] text-[#a39891] sm:text-xs">
                      {formatDate(selectedReview.createdAt, LANGUAGE_DATE_LOCALE[language])}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl bg-[#fcfaf8] p-3 border border-[#f0eae5] sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.service")}</p>
                    <p className="text-sm font-semibold text-[#30251f] sm:text-base">{selectedReview.serviceName}</p>
                  </div>
                  <div className="text-start sm:text-end">
                    <RatingStars rating={selectedReview.rating} size={16} />
                    <p className="mt-0.5 text-[10px] text-[#a39891] sm:text-xs">{t(getRatingLabelKey(selectedReview.rating))}</p>
                  </div>
                </div>

                {selectedReview.comment && (
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] mb-1 sm:text-xs">{t("vendor.reviews.detail.comment")}</p>
                    <p className="whitespace-pre-line text-sm leading-6 text-[#5f544d] bg-[#fcfaf8] p-3 rounded-xl border border-[#f0eae5] sm:p-4 sm:text-sm sm:leading-7">
                      {selectedReview.comment}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-[#f1ece8] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.status")}</p>
                    <StatusBadge status={selectedReview.status} />
                  </div>
                  {selectedReview.status === ReviewStatus.Rejected && selectedReview.rejectionReason && (
                    <div className="text-start sm:text-end">
                      <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.rejectionReason")}</p>
                      <p className="text-sm text-red-600">{selectedReview.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VendorReviewsPage() {
  // useSearchParams() must be inside a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <VendorReviewsContent />
    </Suspense>
  );
}

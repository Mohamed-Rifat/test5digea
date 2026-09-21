"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  MessageSquareText,
  Search,
  Store,
  X,
  AlertCircle,
  Filter,
  ChevronDown,
  Clock3,
  CheckCircle2,
  XCircle,
  Shield,
  Building2,
  User,
  RefreshCw,
} from "lucide-react";

import {
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";

import RatingStars from "@/components/shared/RatingStars";
import { useAdminReviews } from "@/features/reviews/hooks/useAdminReviews";
import { useAdminServices } from "@/features/services/hooks/useAdminServices";
import {
  fetchApprovedReviews,
  toggleReviewDisplay,
} from "@/features/reviews/api";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/review";

/* =========================================================
   Constants
========================================================= */

const VISIBILITY_FILTERS = [
  { value: "all", label: "All visibility", icon: Filter },
  { value: "visible", label: "Visible only", icon: Eye },
  { value: "hidden", label: "Hidden only", icon: EyeOff },
] as const;

/* =========================================================
   Helpers
========================================================= */

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

/* =========================================================
   ✅ SKELETON COMPONENTS
========================================================= */

// ✅ Skeleton للـ StatCard
const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="relative overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        {/* Title */}
        <div className="h-2.5 w-20 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-24" />
        {/* Value */}
        <div className="h-6 w-16 animate-pulse rounded bg-[#e9e1db] sm:h-8 sm:w-20" />
        {/* Description */}
        <div className="h-2 w-24 animate-pulse rounded bg-[#f5f1ee] sm:h-2.5 sm:w-32" />
      </div>
      {/* Icon */}
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-[#f5eee9] sm:h-11 sm:w-11" />
    </div>
  </div>
);

// ✅ Skeleton للـ PendingReviewCard
const PendingReviewCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-2xl border border-[#f5e9d0] bg-linear-to-br from-white to-amber-50/30 p-4 shadow-sm sm:p-5"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Top row */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-[#f5e9d0]" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3.5 w-32 animate-pulse rounded bg-[#e9e1db] sm:w-44" />
          <div className="h-2.5 w-24 animate-pulse rounded bg-[#f0eae5] sm:w-32" />
        </div>
      </div>
      <div className="h-8 w-20 shrink-0 animate-pulse rounded-xl bg-[#f5eee9] sm:w-24" />
    </div>

    {/* Meta */}
    <div className="mt-2 flex items-center gap-2">
      <div className="h-2.5 w-20 animate-pulse rounded bg-[#f5f1ee] sm:w-24" />
      <div className="h-1 w-1 rounded-full bg-[#e8dfd8]" />
      <div className="h-2.5 w-14 animate-pulse rounded bg-[#f5f1ee]" />
    </div>

    {/* Comment box */}
    <div className="mt-3 space-y-2 rounded-xl border border-[#f5e9d0] bg-white/80 p-3">
      <div className="h-3 w-full animate-pulse rounded bg-[#f0eae5]" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-[#f0eae5]" />
    </div>

    {/* Actions */}
    <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#f5e9d0] pt-3">
      <div className="h-9 w-20 animate-pulse rounded-xl bg-[#f5f1ee] sm:h-10 sm:w-24" />
      <div className="h-9 w-20 animate-pulse rounded-xl bg-[#f5f1ee] sm:h-10 sm:w-24" />
    </div>
  </div>
);

// ✅ Skeleton للـ PendingReviews section (Header + Cards)
const PendingReviewsSkeleton = () => (
  <div>
    {/* Header skeleton */}
    <div className="mb-3 flex items-center justify-between">
      <div className="h-3 w-40 animate-pulse rounded bg-[#f0eae5] sm:h-3.5 sm:w-48" />
      <div className="h-6 w-20 animate-pulse rounded-full bg-[#fef3c7]" />
    </div>

    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <PendingReviewCardSkeleton key={i} delay={i * 100} />
      ))}
    </div>
  </div>
);

// ✅ Skeleton للـ Filter Select
const FilterSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div className="space-y-1.5" style={{ animationDelay: `${delay}ms` }}>
    <div className="h-2.5 w-16 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-20" />
    <div className="h-10.5 w-full animate-pulse rounded-xl bg-white" />
  </div>
);

// ✅ Skeleton للـ Review item في Approved Manager
const ReviewItemSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="rounded-xl border-2 border-[#f0eae5] bg-white p-3.5 sm:p-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        {/* Vendor + Service chips */}
        <div className="mb-1.5 space-y-1">
          <div className="h-4 w-32 animate-pulse rounded bg-[#e9e1db] sm:w-40" />
          <div className="h-3 w-24 animate-pulse rounded bg-[#f0eae5] sm:w-32" />
        </div>

        {/* User + Rating + Chip */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-3.5 w-24 animate-pulse rounded bg-[#e9e1db] sm:w-32" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#f0eae5]" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-[#ecfdf5]" />
        </div>

        {/* Comment */}
        <div className="mt-1.5 space-y-1.5">
          <div className="h-2.5 w-full animate-pulse rounded bg-[#f5f1ee]" />
          <div className="h-2.5 w-3/5 animate-pulse rounded bg-[#f5f1ee]" />
        </div>

        {/* Time */}
        <div className="mt-1 h-2 w-16 animate-pulse rounded bg-[#f5f1ee]" />
      </div>

      {/* Toggle button */}
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl border-2 border-[#f0eae5] bg-[#fcfaf8]" />
    </div>
  </div>
);

// ✅ Skeleton للـ Approved Reviews Manager
const ApprovedManagerSkeleton = () => (
  <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
    {/* Header */}
    <div className="border-b border-[#f0eae5] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#f5eee9]" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-48 animate-pulse rounded bg-[#e9e1db] sm:w-56" />
          <div className="h-2.5 w-64 animate-pulse rounded bg-[#f0eae5] sm:w-72" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-lg bg-[#f5f1ee]" />
      </div>
    </div>

    {/* Filters */}
    <div className="border-b border-[#f0eae5] bg-[#fcfaf8] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <FilterSkeleton delay={0} />
        <FilterSkeleton delay={100} />
        <FilterSkeleton delay={200} />
      </div>
      <div className="mt-3">
        <div className="h-10.5 w-full animate-pulse rounded-xl bg-white" />
      </div>
    </div>

    {/* Content */}
    <div className="p-4 sm:p-5">
      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { color: "border-[#e8dfd8] bg-white" },
          { color: "border-emerald-200 bg-emerald-50/50" },
          { color: "border-red-200 bg-red-50/50" },
        ].map((item, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3 ${item.color}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-2.5 w-12 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-16" />
            <div className="mt-1 h-5 w-8 animate-pulse rounded bg-[#e9e1db] sm:h-6 sm:w-12" />
          </div>
        ))}
      </div>

      {/* Reviews count row */}
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2.5 w-32 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-40" />
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-14 animate-pulse rounded bg-[#f5f1ee]" />
          <div className="h-2.5 w-14 animate-pulse rounded bg-[#f5f1ee]" />
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ReviewItemSkeleton key={i} delay={i * 80} />
        ))}
      </div>
    </div>
  </div>
);

/* =========================================================
   Full Page Skeleton
========================================================= */

export function AdminReviewsPageSkeleton() {
  return (
    <div className="mx-auto max-w-full space-y-5 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
      {/* =================================================
          Header Skeleton
      ================================================= */}

      <header>
        {/* Breadcrumb */}
        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2">
          <div className="h-2.5 w-2.5 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-3" />
          <div className="h-2.5 w-24 animate-pulse rounded bg-[#f0eae5] sm:h-3 sm:w-32" />
        </div>

        {/* Title row */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10" />
          <div className="h-6 w-56 animate-pulse rounded bg-[#e9e1db] sm:h-8 sm:w-72 lg:h-9 lg:w-80" />
        </div>

        {/* Description */}
        <div className="mt-2 max-w-2xl space-y-1.5 sm:mt-3">
          <div className="h-2.5 w-full animate-pulse rounded bg-[#f0eae5] sm:h-3" />
          <div className="h-2.5 w-3/4 animate-pulse rounded bg-[#f0eae5] sm:h-3" />
        </div>
      </header>

      {/* =================================================
          Stats Skeleton
      ================================================= */}

      <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCardSkeleton delay={0} />
        <StatCardSkeleton delay={80} />
        <StatCardSkeleton delay={160} />
        <StatCardSkeleton delay={240} />
      </section>

      {/* =================================================
          Pending Approval Section Skeleton
      ================================================= */}

      <section>
        {/* Section Header */}
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-amber-100 sm:h-9 sm:w-9" />
          <div className="space-y-1">
            <div className="h-3.5 w-32 animate-pulse rounded bg-[#e9e1db] sm:h-4 sm:w-40" />
            <div className="h-2.5 w-48 animate-pulse rounded bg-[#f0eae5] sm:w-56" />
          </div>
        </div>

        <PendingReviewsSkeleton />
      </section>

      {/* =================================================
          Manage Visibility Section Skeleton
      ================================================= */}

      <section>
        {/* Section Header */}
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-emerald-100 sm:h-9 sm:w-9" />
          <div className="space-y-1">
            <div className="h-3.5 w-36 animate-pulse rounded bg-[#e9e1db] sm:h-4 sm:w-44" />
            <div className="h-2.5 w-56 animate-pulse rounded bg-[#f0eae5] sm:w-64" />
          </div>
        </div>

        <ApprovedManagerSkeleton />
      </section>

      {/* =================================================
          Footer Tip Skeleton
      ================================================= */}

      <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 sm:p-3.5">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-[#f0eae5] sm:h-4 sm:w-4" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 w-full animate-pulse rounded bg-[#f0eae5] sm:h-3" />
          <div className="h-2.5 w-2/3 animate-pulse rounded bg-[#f0eae5] sm:h-3" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Stat Card
========================================================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "#a47e43",
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  color?: string;
  highlight?: boolean;
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
      highlight ? "border-[#dfd0bf]" : "border-[#e8dfd8]"
    }`}
  >
    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125 sm:h-24 sm:w-24" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-xs">
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
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
      </div>
    </div>
  </div>
);

/* =========================================================
   Pending Review Card
========================================================= */

const PendingReviewCard = ({
  review,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  review: Review;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) => {
  const busy = isApproving || isRejecting;

  return (
    <div className="group rounded-2xl border border-amber-200 bg-linear-to-br from-white to-amber-50/40 p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Clock3 size={16} className="text-amber-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-[#30251f] sm:text-base">
                {review.serviceName}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#756b65]">
                <Store size={11} />
                <span className="truncate">{review.vendorBusinessName}</span>
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#9b8f86]">
            <span className="inline-flex items-center gap-1">
              <User size={11} />
              {review.userFullName || "Anonymous"}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />
            <span>{getTimeAgo(review.createdAt)}</span>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-white px-3 py-2 shadow-sm">
          <RatingStars rating={review.rating} size={14} />
        </div>
      </div>

      {review.comment && (
        <div className="mt-3 rounded-xl border border-amber-100 bg-white/80 p-3">
          <p className="whitespace-pre-line text-sm leading-6 text-[#5f544d]">
            {review.comment}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-amber-100 pt-3">
        <button
          type="button"
          disabled={busy}
          onClick={onReject}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {isRejecting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <X size={14} />
          )}
          Reject
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {isApproving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Approve
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   Pending Reviews
========================================================= */

function PendingReviews() {
  const { reviews, loading, error, actionLoading, approve, reject } =
    useAdminReviews();

  const [rejectTarget, setRejectTarget] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;

    const ok = await reject(rejectTarget.id, { reason: rejectReason.trim() });

    if (ok) {
      setRejectTarget(null);
      setRejectReason("");
    }
  };

  if (loading) {
    return <PendingReviewsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-800">Unable to load reviews</p>
          <p className="mt-0.5 text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-10 text-center sm:px-6 sm:py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14">
          <CheckCircle2 size={24} strokeWidth={1.8} />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-[#30251f] sm:mt-4 sm:text-base">
          All caught up! 🎉
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-[#756b65] sm:mt-2 sm:text-sm">
          No pending reviews waiting for moderation.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[#9b8f86] sm:text-sm">
          <span className="font-semibold text-[#30251f]">{reviews.length}</span>{" "}
          {reviews.length === 1 ? "review" : "reviews"} awaiting moderation
        </p>

        <Chip
          icon={<Clock3 size={12} />}
          label="Pending"
          size="small"
          sx={{
            height: 24,
            fontSize: "10px",
            fontWeight: 600,
            backgroundColor: "#fef3c7",
            color: "#b45309",
            "& .MuiChip-icon": { color: "#b45309" },
          }}
        />
      </div>

      <div className="space-y-3">
        {reviews.map((review) => {
          const isApproving = actionLoading === `approve-${review.id}`;
          const isRejecting = actionLoading === `reject-${review.id}`;

          return (
            <PendingReviewCard
              key={review.id}
              review={review}
              onApprove={() => approve(review.id)}
              onReject={() => {
                setRejectTarget(review);
                setRejectReason("");
              }}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          );
        })}
      </div>

      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in slide-in-from-bottom-10 duration-300 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0eae5] bg-linear-to-br from-red-50 to-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <XCircle size={18} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#30251f] sm:text-lg">
                    Reject Review
                  </h2>
                  <p className="mt-0.5 text-xs text-[#9b8f86] sm:text-sm">
                    Provide a reason for rejecting
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9b8f86] transition hover:bg-white hover:text-[#30251f]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4 sm:px-6 sm:py-5">
              <div className="rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3.5">
                <p className="text-sm font-semibold text-[#30251f]">
                  {rejectTarget.serviceName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#756b65]">
                  <Store size={11} />
                  {rejectTarget.vendorBusinessName}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#40352f]">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition placeholder:text-[#b6a79d] focus:border-[#a47e43] focus:bg-white focus:ring-2 focus:ring-[#a47e43]/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#f0eae5] bg-[#fcfaf8] px-5 py-3.5 sm:gap-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-[#e3d9d1] bg-white px-4 py-2.5 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim() || Boolean(actionLoading)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X size={14} />
                    Reject Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   Approved Reviews Manager
========================================================= */

function ApprovedReviewsManager() {
  const { services } = useAdminServices();

  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApprovedReviews();
      setAllReviews(data);
    } catch (err) {
      setError("Failed to load approved reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const vendors = useMemo(() => {
    const vendorMap = new Map<string, { id: string; name: string; count: number }>();

    allReviews.forEach((r) => {
      const vendorName = r.vendorBusinessName || "Unknown";
      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          id: vendorName,
          name: vendorName,
          count: 0,
        });
      }
      vendorMap.get(vendorName)!.count += 1;
    });

    return Array.from(vendorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [allReviews]);

  const servicesForVendor = useMemo(() => {
    let filtered = allReviews;

    if (vendorFilter !== "all") {
      filtered = filtered.filter((r) => r.vendorBusinessName === vendorFilter);
    }

    const serviceMap = new Map<string, { id: string; name: string; count: number }>();

    filtered.forEach((r) => {
      if (!serviceMap.has(r.serviceId)) {
        serviceMap.set(r.serviceId, {
          id: r.serviceId,
          name: r.serviceName,
          count: 0,
        });
      }
      serviceMap.get(r.serviceId)!.count += 1;
    });

    return Array.from(serviceMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [allReviews, vendorFilter]);

  const filteredReviews = useMemo(() => {
    let result = allReviews;

    if (vendorFilter !== "all") {
      result = result.filter((r) => r.vendorBusinessName === vendorFilter);
    }

    if (serviceFilter !== "all") {
      result = result.filter((r) => r.serviceId === serviceFilter);
    }

    if (visibilityFilter === "visible") {
      result = result.filter((r) => r.isDisplayed);
    } else if (visibilityFilter === "hidden") {
      result = result.filter((r) => !r.isDisplayed);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.userFullName?.toLowerCase().includes(query) ||
          r.comment?.toLowerCase().includes(query) ||
          r.serviceName?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allReviews, vendorFilter, serviceFilter, visibilityFilter, searchQuery]);

  const stats = useMemo(() => {
    let baseReviews = allReviews;
    if (vendorFilter !== "all") {
      baseReviews = baseReviews.filter((r) => r.vendorBusinessName === vendorFilter);
    }
    if (serviceFilter !== "all") {
      baseReviews = baseReviews.filter((r) => r.serviceId === serviceFilter);
    }

    const total = baseReviews.length;
    const visible = baseReviews.filter((r) => r.isDisplayed).length;
    const hidden = total - visible;

    return { total, visible, hidden };
  }, [allReviews, vendorFilter, serviceFilter]);

  const handleToggle = async (review: Review) => {
    try {
      setBusyId(review.id);
      await toggleReviewDisplay(review.id, {
        isDisplayed: !review.isDisplayed,
      });
      setAllReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, isDisplayed: !r.isDisplayed } : r
        )
      );
    } catch (err) {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  const hasActiveFilters =
    vendorFilter !== "all" ||
    serviceFilter !== "all" ||
    visibilityFilter !== "all" ||
    searchQuery !== "";

  const clearAll = () => {
    setVendorFilter("all");
    setServiceFilter("all");
    setVisibilityFilter("all");
    setSearchQuery("");
  };

  const clearReviewFilters = () => {
    setVisibilityFilter("all");
    setSearchQuery("");
  };

  const hasReviewFilters = visibilityFilter !== "all" || searchQuery !== "";

  // ✅ Loading state - نعرض skeleton
  if (loading) {
    return <ApprovedManagerSkeleton />;
  }

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
      <div className="border-b border-[#f0eae5] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5eee9]">
            <Eye size={18} className="text-[#a47e43]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
              Manage Approved Reviews
            </h3>
            <p className="mt-0.5 text-[11px] text-[#9b8f86] sm:text-xs">
              {allReviews.length} approved reviews across {vendors.length} vendors
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadReviews}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#665950] transition hover:bg-[#faf8f6] disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="hidden items-center gap-1.5 rounded-lg border border-[#e3d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#665950] transition hover:bg-[#faf8f6] sm:inline-flex"
              >
                <X size={12} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-[#f0eae5] bg-[#fcfaf8] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#40352f] sm:text-xs">
              <Building2 size={12} className="text-[#a47e43]" />
              Vendor
            </label>
            <Select
              value={vendorFilter}
              onChange={(e) => {
                setVendorFilter(e.target.value);
                setServiceFilter("all");
              }}
              fullWidth
              size="small"
              displayEmpty
              IconComponent={ChevronDown}
              renderValue={(value) => {
                if (value === "all") {
                  return <span className="text-[#9b8f86]">All vendors</span>;
                }
                return <span className="text-[#30251f]">{value}</span>;
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "white",
                fontSize: "13px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a47e43",
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="all">
                <div className="flex w-full items-center gap-2">
                  <Building2 size={14} className="text-[#a47e43]" />
                  <span className="flex-1">All vendors</span>
                  <span className="text-xs text-[#9b8f86]">({vendors.length})</span>
                </div>
              </MenuItem>
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  <div className="flex w-full items-center gap-2">
                    <Store size={14} className="text-[#a47e43]" />
                    <span className="flex-1 truncate">{v.name}</span>
                    <span className="text-xs text-[#9b8f86]">{v.count}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#40352f] sm:text-xs">
              <Store size={12} className="text-[#a47e43]" />
              Service
            </label>
            <Select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              fullWidth
              size="small"
              displayEmpty
              IconComponent={ChevronDown}
              renderValue={(value) => {
                if (value === "all") {
                  return <span className="text-[#9b8f86]">All services</span>;
                }
                const service = servicesForVendor.find((s) => s.id === value);
                return <span className="text-[#30251f]">{service?.name}</span>;
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "white",
                fontSize: "13px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a47e43",
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="all">
                <div className="flex w-full items-center gap-2">
                  <Store size={14} className="text-[#a47e43]" />
                  <span className="flex-1">All services</span>
                  <span className="text-xs text-[#9b8f86]">
                    ({servicesForVendor.length})
                  </span>
                </div>
              </MenuItem>
              {servicesForVendor.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <div className="flex w-full items-center gap-2">
                    <Store size={14} className="text-[#a47e43]" />
                    <span className="flex-1 truncate">{s.name}</span>
                    <span className="text-xs text-[#9b8f86]">{s.count}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#40352f] sm:text-xs">
              <Eye size={12} className="text-[#a47e43]" />
              Visibility
            </label>
            <Select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              fullWidth
              size="small"
              IconComponent={ChevronDown}
              renderValue={(value) => {
                const current =
                  VISIBILITY_FILTERS.find((f) => f.value === value) ||
                  VISIBILITY_FILTERS[0];
                const Icon = current.icon;
                return (
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-[#8d796a]" />
                    <span className="text-[13px]">{current.label}</span>
                  </div>
                );
              }}
              sx={{
                height: 42,
                borderRadius: "12px",
                backgroundColor: "white",
                fontSize: "13px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a47e43",
                  borderWidth: "1px",
                },
              }}
            >
              {VISIBILITY_FILTERS.map((option) => {
                const Icon = option.icon;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-[#806a5c]" />
                      <span>{option.label}</span>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, comment, or service..."
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} className="text-[#9b8f86]" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[#9b8f86] hover:text-[#30251f]"
                    >
                      <X size={15} />
                    </button>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 42,
                borderRadius: "12px",
                backgroundColor: "white",
                fontSize: "13px",
                "& fieldset": { borderColor: "#e3d9d1" },
                "&:hover fieldset": { borderColor: "#d5c8be" },
                "&.Mui-focused fieldset": {
                  borderColor: "#a47e43",
                  borderWidth: "1px",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-5">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="mt-0.5 text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <div className="p-4 sm:p-5">
          <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => setVisibilityFilter("all")}
              className={`rounded-xl border p-3 text-left transition ${
                visibilityFilter === "all"
                  ? "border-[#a47e43] bg-[#fbf6f1] shadow-sm"
                  : "border-[#e8dfd8] bg-white hover:border-[#d5c8be]"
              }`}
            >
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-[10px]">
                Total
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[#30251f] sm:text-xl">
                {stats.total}
              </p>
            </button>

            <button
              onClick={() => setVisibilityFilter("visible")}
              className={`rounded-xl border p-3 text-left transition ${
                visibilityFilter === "visible"
                  ? "border-emerald-400 bg-emerald-50 shadow-sm"
                  : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
              }`}
            >
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-emerald-700 sm:text-[10px]">
                Visible
              </p>
              <p className="mt-0.5 text-lg font-semibold text-emerald-700 sm:text-xl">
                {stats.visible}
              </p>
            </button>

            <button
              onClick={() => setVisibilityFilter("hidden")}
              className={`rounded-xl border p-3 text-left transition ${
                visibilityFilter === "hidden"
                  ? "border-red-400 bg-red-50 shadow-sm"
                  : "border-red-200 bg-red-50/50 hover:border-red-300"
              }`}
            >
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-red-700 sm:text-[10px]">
                Hidden
              </p>
              <p className="mt-0.5 text-lg font-semibold text-red-700 sm:text-xl">
                {stats.hidden}
              </p>
            </button>
          </div>

          {hasReviewFilters && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-[#f1ece8] pb-3">
              <span className="text-[10px] font-medium text-[#958a83]">
                Active:
              </span>

              {visibilityFilter !== "all" && (
                <Chip
                  icon={
                    visibilityFilter === "visible" ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )
                  }
                  label={
                    VISIBILITY_FILTERS.find(
                      (f) => f.value === visibilityFilter
                    )?.label
                  }
                  onDelete={() => setVisibilityFilter("all")}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor:
                      visibilityFilter === "visible" ? "#ecfdf5" : "#fef2f2",
                    color:
                      visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    "& .MuiChip-icon": {
                      color:
                        visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                    "& .MuiChip-deleteIcon": {
                      width: 13,
                      height: 13,
                      color:
                        visibilityFilter === "visible" ? "#047857" : "#b91c1c",
                    },
                  }}
                />
              )}

              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    "& .MuiChip-deleteIcon": {
                      width: 13,
                      height: 13,
                      color: "#8b776a",
                    },
                  }}
                />
              )}

              <button
                onClick={clearReviewFilters}
                className="text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f]"
              >
                Clear
              </button>
            </div>
          )}

          {filteredReviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] px-4 py-8 text-center">
              <Search className="mx-auto h-6 w-6 text-[#a47e43]" />
              <p className="mt-2 text-xs text-[#756b65] sm:text-sm">
                {allReviews.length === 0
                  ? "No approved reviews yet."
                  : "No reviews match your filters."}
              </p>
              {hasReviewFilters && (
                <button
                  onClick={clearReviewFilters}
                  className="mt-2 text-xs font-medium text-[#a47e43] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {filteredReviews.length > 0 && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                  Showing{" "}
                  <span className="font-semibold text-[#30251f]">
                    {filteredReviews.length}
                  </span>{" "}
                  of {allReviews.length} reviews
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-[#9b8f86] sm:text-[10px]">
                      Visible
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-[9px] text-[#9b8f86] sm:text-[10px]">
                      Hidden
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {filteredReviews.map((review) => {
                  const isBusy = busyId === review.id;

                  return (
                    <div
                      key={review.id}
                      className={`group rounded-xl border-2 bg-white p-3.5 transition-all hover:shadow-sm sm:p-4 ${
                        review.isDisplayed
                          ? "border-emerald-200 hover:border-emerald-300"
                          : "border-red-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {/* Vendor first, then service below it */}
                          <div className="mb-1.5 space-y-1">
                            {review.vendorBusinessName && (
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#40352f] sm:text-xs">
                                <Building2
                                  size={11}
                                  className="shrink-0 text-[#a47e43]"
                                />
                                <span className="truncate">
                                  {review.vendorBusinessName}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 text-[10px] text-[#9b8f86] sm:text-[11px]">
                              <Store
                                size={10}
                                className="shrink-0 text-[#a47e43]"
                              />
                              <span className="truncate">
                                {review.serviceName}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[#30251f]">
                              {review.userFullName || "Anonymous"}
                            </p>
                            <RatingStars rating={review.rating} size={12} />
                            <Chip
                              icon={
                                review.isDisplayed ? (
                                  <Eye size={10} />
                                ) : (
                                  <EyeOff size={10} />
                                )
                              }
                              label={review.isDisplayed ? "Visible" : "Hidden"}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "9px",
                                fontWeight: 600,
                                backgroundColor: review.isDisplayed
                                  ? "#ecfdf5"
                                  : "#fef2f2",
                                color: review.isDisplayed ? "#047857" : "#b91c1c",
                                "& .MuiChip-icon": {
                                  color: review.isDisplayed
                                    ? "#047857"
                                    : "#b91c1c",
                                },
                              }}
                            />
                          </div>

                          {review.comment && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#625852] sm:text-sm">
                              {review.comment}
                            </p>
                          )}

                          <p className="mt-1 text-[10px] text-[#9b8f86]">
                            {getTimeAgo(review.createdAt)}
                          </p>
                        </div>

                        <Tooltip
                          title={
                            review.isDisplayed
                              ? "Hide from public"
                              : "Show publicly"
                          }
                          arrow
                        >
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggle(review)}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition disabled:opacity-50 ${
                              review.isDisplayed
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            {isBusy ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : review.isDisplayed ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function AdminReviewsPage() {
  const { reviews: pendingReviews, loading: pendingLoading } = useAdminReviews();
  const { services, loading: servicesLoading } = useAdminServices();

  const isInitialLoading = pendingLoading || servicesLoading;

  // ✅ لو الصفحة بتعمل load مبدئي، اعرض الـ Skeleton
  if (isInitialLoading) {
    return <AdminReviewsPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-full space-y-5 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
      <header>
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
          <Shield size={11} className="sm:h-3.25 sm:w-3.25" />
          Admin Dashboard
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
            <MessageSquareText
              size={16}
              className="text-[#a47e43] sm:h-5 sm:w-5"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
            Reviews Management
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
          Moderate pending reviews and manage visibility across all vendors and
          services.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          title="Pending"
          value={pendingReviews.length}
          icon={Clock3}
          description="Awaiting moderation"
          color="#f59e0b"
          highlight={pendingReviews.length > 0}
        />
        <StatCard
          title="Total Services"
          value={services.length}
          icon={Building2}
          description="Across platform"
          color="#a47e43"
        />
        <StatCard
          title="Your Role"
          value="Admin"
          icon={Shield}
          description="Full moderation access"
          color="#8b5cf6"
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={CheckCircle2}
          description="All systems running"
          color="#10b981"
        />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 sm:h-9 sm:w-9">
            <Clock3 size={14} className="text-amber-700 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
              Pending Approval
            </h2>
            <p className="text-[10px] text-[#9b8f86] sm:text-xs">
              Reviews waiting for your moderation
            </p>
          </div>
        </div>

        <PendingReviews />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 sm:h-9 sm:w-9">
            <Eye size={14} className="text-emerald-700 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
              Manage Visibility
            </h2>
            <p className="text-[10px] text-[#9b8f86] sm:text-xs">
              Show or hide approved reviews on public pages
            </p>
          </div>
        </div>

        <ApprovedReviewsManager />
      </section>

      <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:p-3.5 sm:text-xs">
        <AlertCircle
          size={13}
          className="mt-0.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4"
        />
        <span className="leading-5">
          <span className="font-medium text-[#40352f]">Tip:</span> Filter by
          vendor first, then by service to see all approved reviews — including
          hidden ones. Click the eye icon to toggle visibility instantly.
        </span>
      </div>
    </div>
  );
}
"use client";

import { useMemo, useState, useCallback, memo, useEffect, useRef } from "react";
import Link from "next/link";
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
  Download,
  RefreshCw,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff,
  ArrowUpDown,
  FileSpreadsheet,
  Menu as MenuIcon,
  ChevronLeft,
} from "lucide-react";

import {
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Tooltip,
  Badge,
  CircularProgress,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Drawer,
  Box,
  Typography,
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
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";

// ✅ استيراد xlsx
import * as XLSX from 'xlsx';

/* =========================================================
   Constants & Configuration
========================================================= */

// ✅ استخدام ReviewStatus الصحيح
const STATUS_FILTERS = [
  { value: "all", label: "All statuses", shortLabel: "All", icon: Filter },
  { value: String(ReviewStatus.Approved), label: "Approved", shortLabel: "Approved", icon: CheckCircle2 },
  { value: String(ReviewStatus.Pending), label: "Pending", shortLabel: "Pending", icon: Clock3 },
  { value: String(ReviewStatus.Rejected), label: "Rejected", shortLabel: "Rejected", icon: XCircle },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest rating" },
  { value: "lowest", label: "Lowest rating" },
] as const;

const PAGE_SIZE = 5;

/* =========================================================
   Helpers - ✅ استخدام ReviewStatus الصحيح
========================================================= */

function getStatusMeta(status: ReviewStatus) {
  const configs = {
    [ReviewStatus.Approved]: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dotClassName: "bg-emerald-500",
    },
    [ReviewStatus.Rejected]: {
      label: "Rejected",
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-100",
      dotClassName: "bg-red-500",
    },
    [ReviewStatus.Pending]: {
      label: "Pending",
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-100",
      dotClassName: "bg-amber-500",
    },
  };
  return configs[status] || configs[ReviewStatus.Pending];
}

function getRatingLabel(rating: number): string {
  const labels = {
    5: "Excellent",
    4: "Very Good",
    3: "Average",
    2: "Below Average",
    1: "Poor",
  };
  return labels[rating as keyof typeof labels] || "Not rated";
}

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
   Excel Export Helper - ✅ تم إصلاح أخطاء TypeScript
========================================================= */

function exportReviewsToExcel(reviews: Review[], vendorName?: string) {
  if (reviews.length === 0) {
    alert("No reviews to export!");
    return;
  }

  // ✅ استخدام reduce مع typing صحيح
  const reviewsByService = reviews.reduce<Record<string, { serviceName: string; reviews: Review[] }>>((acc, review) => {
    const key = review.serviceId;
    if (!acc[key]) {
      acc[key] = {
        serviceName: review.serviceName,
        reviews: [],
      };
    }
    acc[key].reviews.push(review);
    return acc;
  }, {});

  const workbook = XLSX.utils.book_new();

  const totalApproved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
  const totalPending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
  const totalRejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
  const avgRating = reviews
    .filter(r => r.status === ReviewStatus.Approved)
    .reduce((acc, r) => acc + r.rating, 0) / (totalApproved || 1);

  // Summary Sheet - ✅ استخدام Object.values مع typing
  const summaryData: any[][] = [
    ['📊 REVIEWS REPORT SUMMARY'],
    [''],
    ['Vendor', vendorName || 'N/A'],
    ['Report Date', new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' })],
    [''],
    ['📈 STATISTICS'],
    ['Metric', 'Value'],
    ['Total Reviews', reviews.length],
    ['Approved Reviews', totalApproved],
    ['Pending Reviews', totalPending],
    ['Rejected Reviews', totalRejected],
    ['Average Rating', String(avgRating.toFixed(1)) + ' ⭐'],
    ['Approval Rate', String(((totalApproved / reviews.length) * 100).toFixed(1)) + '%'],
    [''],
    ['📋 SERVICES OVERVIEW'],
    ['Service Name', 'Reviews Count', 'Avg Rating'],
  ];

  // ✅ إضافة بيانات الخدمات مع typing صحيح
  Object.values(reviewsByService).forEach(({ serviceName, reviews: r }) => {
    const avg = r.filter(rev => rev.status === ReviewStatus.Approved)
      .reduce((acc, rev) => acc + rev.rating, 0) / (r.filter(rev => rev.status === ReviewStatus.Approved).length || 1);
    summaryData.push([
      serviceName,
      r.length,
      String(avg.toFixed(1)) + ' ⭐'
    ]);
  });

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWS['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 20 }];
  summaryWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');

  // Service Sheets - ✅ استخدام forEach مع typing صحيح
  Object.values(reviewsByService).forEach(({ serviceName, reviews: serviceReviews }) => {
    const serviceStats = {
      total: serviceReviews.length,
      approved: serviceReviews.filter(r => r.status === ReviewStatus.Approved).length,
      pending: serviceReviews.filter(r => r.status === ReviewStatus.Pending).length,
      rejected: serviceReviews.filter(r => r.status === ReviewStatus.Rejected).length,
      avgRating: serviceReviews
        .filter(r => r.status === ReviewStatus.Approved)
        .reduce((acc, r) => acc + r.rating, 0) / (serviceReviews.filter(r => r.status === ReviewStatus.Approved).length || 1),
    };

    const rows: any[][] = [
      [`📋 ${serviceName} - Reviews Report`],
      [""],
      [`📊 Total: ${serviceStats.total} | ✅ Approved: ${serviceStats.approved} | ⏳ Pending: ${serviceStats.pending} | ❌ Rejected: ${serviceStats.rejected} | ⭐ Avg: ${serviceStats.avgRating.toFixed(1)}`],
      [""],
      ["#", "Customer", "Rating", "Status", "Comment", "Date"],
    ];

    serviceReviews.forEach((review, index) => {
      const statusLabel = getStatusMeta(review.status).label;
      const ratingLabel = getRatingLabel(review.rating);
      const stars = '⭐'.repeat(Math.round(review.rating));
      rows.push([
        index + 1,
        review.userFullName || 'Anonymous',
        `${review.rating} ${stars} (${ratingLabel})`,
        statusLabel,
        review.comment || '(No comment)',
        formatDate(review.createdAt),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 30 }, { wch: 18 }, { wch: 55 }, { wch: 22 }];
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
    ];

    let sheetName = serviceName.slice(0, 27);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  });

  // All Reviews Sheet
  const allReviewsData: any[][] = [
    ['📋 ALL REVIEWS - Complete List'],
    [''],
    ['#', 'Customer', 'Service', 'Rating', 'Status', 'Comment', 'Date'],
  ];

  reviews.forEach((review, index) => {
    const stars = '⭐'.repeat(Math.round(review.rating));
    allReviewsData.push([
      index + 1,
      review.userFullName || 'Anonymous',
      review.serviceName,
      `${review.rating} ${stars}`,
      getStatusMeta(review.status).label,
      review.comment || '(No comment)',
      formatDate(review.createdAt),
    ]);
  });

  const allWS = XLSX.utils.aoa_to_sheet(allReviewsData);
  allWS['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 35 }, { wch: 25 }, { wch: 18 }, { wch: 55 }, { wch: 22 }];
  allWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
  XLSX.utils.book_append_sheet(workbook, allWS, 'All Reviews');

  const fileName = `reviews_report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/* =========================================================
   Components
========================================================= */

// ✅ Status Badge - استخدام ReviewStatus الصحيح
const StatusBadge = memo(function StatusBadge({ status }: { status: ReviewStatus }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <Tooltip title={`Status: ${meta.label}`} arrow>
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] ${meta.className}`}
      >
        <Icon size={12} strokeWidth={2.3} />
        <span className="hidden xs:inline">{meta.label}</span>
        <span className="xs:hidden">{meta.label.charAt(0)}</span>
      </span>
    </Tooltip>
  );
});

StatusBadge.displayName = "StatusBadge";

// ✅ Stat Card
const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  description,
  highlight = false,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  highlight?: boolean;
  trend?: { value: number; label: string };
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
        highlight ? "border-[#dfd0bf]" : "border-[#e8dfd8]"
      }`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125 sm:h-24 sm:w-24" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-xs">
            {title}
          </p>

          <div className="mt-1.5 flex items-baseline gap-2 sm:mt-2 sm:gap-3">
            <p className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
              {value}
            </p>
            {trend && (
              <span className={`text-[10px] font-medium sm:text-xs ${trend.value >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>

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

// ✅ Review Card - استخدام ReviewStatus الصحيح
const ReviewCard = memo(function ReviewCard({
  review,
  index,
  onViewDetails
}: {
  review: Review;
  index: number;
  onViewDetails?: (review: Review) => void;
}) {
  const ratingLabel = getRatingLabel(review.rating);
  const timeAgo = getTimeAgo(review.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = review.comment && review.comment.length > 150;
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.slice(0, 150) + "..."
    : review.comment;

  return (
    <article
      className="group rounded-2xl border border-[#eee7e1] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e2d8d0] hover:shadow-md sm:p-6"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 gap-2 sm:gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5eee9] text-[#705b4e] sm:h-10 sm:w-10">
            <User size={15} strokeWidth={1.8} className="sm:h-[17px] sm:w-[17px]" />
            {review.status === ReviewStatus.Approved && review.isDisplayed && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white sm:h-3 sm:w-3" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p className="truncate text-xs font-semibold text-[#30251f] sm:text-sm">
                {review.userFullName || "Anonymous"}
              </p>
              {review.status === ReviewStatus.Approved && (
                <Badge
                  color="success"
                  variant="dot"
                  sx={{
                    "& .MuiBadge-dot": {
                      backgroundColor: "#10b981",
                      width: 5,
                      height: 5,
                      sm: { width: 6, height: 6 },
                    }
                  }}
                />
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">Customer</p>
              <span className="hidden h-1 w-1 rounded-full bg-[#d5c8be] sm:inline" />
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">{timeAgo}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {review.status === ReviewStatus.Approved && (
            <Tooltip title={review.isDisplayed ? "Visible" : "Hidden"} arrow>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5eee9] sm:h-7 sm:w-7">
                {review.isDisplayed ? (
                  <Eye size={12} className="text-emerald-600 sm:h-[14px] sm:w-[14px]" />
                ) : (
                  <EyeOff size={12} className="text-amber-600 sm:h-[14px] sm:w-[14px]" />
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
            <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#a39891] sm:mb-1 sm:text-[10px]">
              Service
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
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-[#aaa19b] sm:mt-5 sm:text-sm">
          No written comment was provided.
        </p>
      )}

      {/* Rejection Reason - استخدام ReviewStatus.Rejected */}
      {review.status === ReviewStatus.Rejected && review.rejectionReason && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50/70 p-2.5 sm:mt-5 sm:p-3.5">
          <div className="flex gap-2 sm:gap-2.5">
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-500 sm:h-[15px] sm:w-[15px]" />
            <div>
              <p className="text-[10px] font-semibold text-red-700 sm:text-xs">
                Moderation feedback
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
          {formatDate(review.createdAt)}
        </p>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(review)}
            className="text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
          >
            View →
          </button>
        )}
      </div>
    </article>
  );
});

ReviewCard.displayName = "ReviewCard";

// ✅ Loading Skeleton
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

// ✅ Empty State
const EmptyState = memo(function EmptyState({
  filtered,
  onClear,
  icon,
}: {
  filtered: boolean;
  onClear?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white px-4 py-10 text-center sm:px-6 sm:py-14">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-14 sm:w-14">
        {icon || (filtered ? <Search size={20} strokeWidth={1.7} /> : <MessageSquareText size={20} strokeWidth={1.7} />)}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#40342e] sm:mt-5">
        {filtered ? "No matching reviews" : "No reviews yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b817a] sm:text-sm sm:leading-6">
        {filtered
          ? "Try changing or clearing your filters to see more reviews."
          : "You haven't received any reviews yet. Reviews will appear here once customers review your services."}
      </p>

      {filtered && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-4 sm:py-2.5"
        >
          <X size={14} />
          Clear filters
        </button>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";

/* =========================================================
   Mobile Filter Drawer
========================================================= */

function MobileFilterDrawer({
  open,
  onClose,
  serviceOptions,
  serviceFilter,
  setServiceFilter,
  statusFilter,
  setStatusFilter,
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
  sortBy: string;
  setSortBy: (value: any) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}) {
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
          maxHeight: "85vh",
          padding: "20px",
        },
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#30251f]">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors"
            >
              Clear all
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
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">Search</label>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
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
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">Service</label>
          <Autocomplete
            value={serviceOptions.find(s => s.id === serviceFilter) ?? null}
            onChange={(_, newValue) => setServiceFilter(newValue?.id ?? "all")}
            options={serviceOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="No services found"
            popupIcon={<ChevronDown size={17} />}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="All services"
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
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">Status</label>
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
                  <span>{current.label}</span>
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
                    <span>{option.label}</span>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-[#8d8077] block mb-1.5">Sort by</label>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            fullWidth
            IconComponent={ChevronDown}
            renderValue={(value) => {
              const option = SORT_OPTIONS.find(o => o.value === value);
              return <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-[#8d796a]" />
                <span className="text-xs">{option?.label || "Sort"}</span>
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
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 rounded-xl bg-[#30251f] py-3 text-sm font-semibold text-white transition hover:bg-[#46382f]"
        >
          Apply Filters
        </button>
      </div>
    </SwipeableDrawer>
  );
}

/* =========================================================
   Main Page Component - ✅ استخدام ReviewStatus الصحيح
========================================================= */

export default function VendorReviewsPage() {
  const { vendor } = useVendor();
  const { services } = useVendorServices();
  const { reviews, loading, error, refetch } = useVendorReviews();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  /* =======================================================
     Stats - ✅ استخدام ReviewStatus الصحيح
  ======================================================= */

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
    const pending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
    const rejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
    const averageRating = reviews
      .filter(r => r.status === ReviewStatus.Approved)
      .reduce((acc, r) => acc + r.rating, 0) / (approved || 1);

    return {
      total,
      approved,
      pending,
      rejected,
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
     Filtering & Sorting - ✅ استخدام ReviewStatus الصحيح
  ======================================================= */

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter((review) => {
      const matchesService = serviceFilter === "all" || review.serviceId === serviceFilter;
      const matchesStatus = statusFilter === "all" || String(review.status) === statusFilter;
      const matchesSearch = searchQuery === "" ||
        review.userFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesService && matchesStatus && matchesSearch;
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
  }, [reviews, serviceFilter, statusFilter, searchQuery, sortBy]);

  const displayedReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const hasMore = displayedReviews.length < filteredReviews.length;
  const hasActiveFilters = serviceFilter !== "all" || statusFilter !== "all" || searchQuery !== "";

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

  const vendorDisplayName = vendor?.businessName || "Vendor";

  const handleExportAll = useCallback(() => {
    exportReviewsToExcel(reviews, vendorDisplayName);
    handleExportClose();
  }, [reviews, vendorDisplayName, handleExportClose]);

  const handleExportFiltered = useCallback(() => {
    exportReviewsToExcel(filteredReviews, vendorDisplayName);
    handleExportClose();
  }, [filteredReviews, vendorDisplayName, handleExportClose]);

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
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles size={11} className="sm:h-[13px] sm:w-[13px]" />
                Vendor Dashboard
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <MessageSquareText size={16} className="text-[#a47e43] sm:h-[20px] sm:w-[20px]" strokeWidth={1.8} />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                  Reviews
                </h1>
              </div>

              <p className="mt-2 max-w-xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                Monitor customer feedback, track moderation status, and understand how customers perceive your services.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : "sm:h-[16px] sm:w-[16px]"} />
                <span className="hidden xs:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                <span className="xs:hidden">{isRefreshing ? "..." : "⟳"}</span>
              </button>

              <div>
                <Button
                  onClick={handleExportClick}
                  disabled={reviews.length === 0}
                  startIcon={<FileSpreadsheet size={16} className="sm:h-[18px] sm:w-[18px]" />}
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
                    "&:hover": {
                      backgroundColor: "#46382f",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  <span className="hidden xs:inline">Export</span>
                  <span className="xs:hidden">📊</span>
                </Button>
                <Menu
                  anchorEl={exportMenuAnchor}
                  open={Boolean(exportMenuAnchor)}
                  onClose={handleExportClose}
                  slotProps={{
                    paper: {
                      sx: {
                        borderRadius: "12px",
                        marginTop: "6px",
                        boxShadow: "0 14px 35px rgba(48,37,31,0.12)",
                        border: "1px solid #e8dfd8",
                        minWidth: "200px",
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleExportAll} sx={{ py: 1.5, px: 2 }}>
                    <ListItemIcon>
                      <FileSpreadsheet size={18} className="text-[#a47e43]" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Export All"
                      secondary={`${reviews.length} reviews`}
                      slotProps={{
                        secondary: {
                          sx: { fontSize: "11px", color: "#9b8f86" }
                        }
                      }}
                    />
                  </MenuItem>

                  <MenuItem onClick={handleExportFiltered} sx={{ py: 1.5, px: 2 }}>
                    <ListItemIcon>
                      <FileSpreadsheet size={18} className="text-[#a47e43]" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Export Filtered"
                      secondary={`${filteredReviews.length} reviews`}
                      slotProps={{
                        secondary: {
                          sx: { fontSize: "11px", color: "#9b8f86" }
                        }
                      }}
                    />
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section aria-label="Review statistics" className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            description={`${stats.approved} approved`}
            highlight
          />

          <StatCard
            title="Total"
            value={stats.total}
            icon={MessageSquareText}
            description="All reviews"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock3}
            description="Awaiting moderation"
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            description={`${stats.approvalRate.toFixed(0)}% rate`}
          />
        </section>

        {/* Filters */}
        <section className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm sm:mt-6 sm:p-4 lg:mt-8 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                <Filter size={14} className="text-[#a47e43] sm:h-[16px] sm:w-[16px]" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">Filter reviews</h2>
                <p className="hidden text-[10px] text-[#9b8f86] sm:mt-0.5 sm:block sm:text-[11px]">
                  Refine reviews by service, status, or search
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[10px] text-[#91867f] sm:text-xs">
                <span className="font-medium text-[#5e5149]">{filteredReviews.length}</span>
                <span className="hidden sm:inline">
                  {" "}{filteredReviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#665950] transition hover:border-[#cfc1b7] hover:bg-[#faf8f6] md:hidden"
              >
                <MenuIcon size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#a47e43] text-[8px] font-bold text-white">
                    {[serviceFilter !== "all", statusFilter !== "all", searchQuery !== ""].filter(Boolean).length}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="hidden text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs md:inline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="mt-4 hidden grid-cols-1 gap-3 md:grid lg:grid-cols-[1fr_200px_180px_auto]">
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
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
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-[#9b8f86] hover:text-[#30251f]"
                      >
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
              noOptionsText="No services found"
              popupIcon={<ChevronDown size={17} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="All services"
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
                    <span>{current.label}</span>
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
                      <span>{option.label}</span>
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
                  <span className="text-xs">{option?.label || "Sort"}</span>
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
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Active Filters - ✅ تم إصلاح مشكلة Chip */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1ece8] pt-3 sm:gap-2 sm:pt-4">
              <span className="mr-0.5 text-[9px] font-medium text-[#958a83] sm:mr-1 sm:text-[11px]">Active:</span>

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
                  label={serviceOptions.find(s => s.id === serviceFilter)?.name || "Unknown"}
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
                  label={STATUS_FILTERS.find(s => s.value === statusFilter)?.label || "Unknown"}
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

              <button
                onClick={handleClearFilters}
                className="text-[9px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <section aria-label="Customer reviews" className="mt-4 sm:mt-6 lg:mt-8">
          {loading && <ReviewSkeleton count={3} />}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm sm:h-12 sm:w-12">
                <AlertCircle size={18} className="sm:h-[21px] sm:w-[21px]" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-red-800 sm:mt-4">Unable to load reviews</h3>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-red-600 sm:mt-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors sm:mt-4 sm:px-4 sm:py-2"
              >
                <RefreshCw size={14} />
                Try again
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
                    Customer feedback
                  </h3>
                  <p className="mt-0.5 text-[10px] text-[#9b8f86] sm:text-xs">
                    Showing {displayedReviews.length} of {filteredReviews.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {displayedReviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={index}
                    onViewDetails={setSelectedReview}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-4 text-center sm:mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 py-2 text-xs font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Load more reviews
                    <ChevronDown size={14} className="sm:h-[16px] sm:w-[16px]" />
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
            onClick={() => setSelectedReview(null)}
          >
            <div
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 sm:max-h-[90vh] sm:p-6 sm:zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-3 sm:gap-4 sm:mb-4">
                <h3 className="text-base font-semibold text-[#30251f] sm:text-lg">Review Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="rounded-lg p-1 hover:bg-[#f5eee9] transition-colors"
                >
                  <X size={18} className="text-[#8d8077] sm:h-[20px] sm:w-[20px]" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-12 sm:w-12">
                    <User size={16} className="text-[#705b4e] sm:h-[20px] sm:w-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {selectedReview.userFullName || "Anonymous"}
                    </p>
                    <p className="text-[10px] text-[#a39891] sm:text-xs">
                      {formatDate(selectedReview.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl bg-[#fcfaf8] p-3 border border-[#f0eae5] sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">Service</p>
                    <p className="text-sm font-semibold text-[#30251f] sm:text-base">{selectedReview.serviceName}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <RatingStars rating={selectedReview.rating} size={16} />
                    <p className="mt-0.5 text-[10px] text-[#a39891] sm:text-xs">{getRatingLabel(selectedReview.rating)}</p>
                  </div>
                </div>

                {selectedReview.comment && (
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] mb-1 sm:text-xs">Comment</p>
                    <p className="whitespace-pre-line text-sm leading-6 text-[#5f544d] bg-[#fcfaf8] p-3 rounded-xl border border-[#f0eae5] sm:p-4 sm:text-sm sm:leading-7">
                      {selectedReview.comment}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-[#f1ece8] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">Status</p>
                    <StatusBadge status={selectedReview.status} />
                  </div>
                  {selectedReview.status === ReviewStatus.Rejected && selectedReview.rejectionReason && (
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">Rejection Reason</p>
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
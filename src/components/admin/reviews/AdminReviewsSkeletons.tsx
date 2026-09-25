"use client";

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
export const PendingReviewsSkeleton = () => (
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
export const ApprovedManagerSkeleton = () => (
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
